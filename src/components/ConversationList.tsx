import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
}

interface ConversationListProps {
  searchQuery: string;
  onSelectConversation: (userId: string, userName: string) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  searchQuery,
  onSelectConversation,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load conversations from database
  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get all messages for this user with startup info
      const { data: messages, error } = await supabase
        .from('messages')
        .select(`
          *,
          startups:partner_id (
            founder_name,
            startup_name,
            image_url
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages by partner_id and get the latest message for each
      const conversationMap = new Map<string, any>();
      
      messages?.forEach((message) => {
        if (!conversationMap.has(message.partner_id)) {
          conversationMap.set(message.partner_id, message);
        }
      });

      // Convert to conversation format
      const conversationList: Conversation[] = Array.from(conversationMap.values()).map((message) => {
        const startup = message.startups;
        const founderName = startup?.founder_name || 'Unknown';
        const startupName = startup?.startup_name || '';
        const displayName = startupName ? `${founderName} - ${startupName}` : founderName;
        
        const initials = founderName
          .split(' ')
          .map((word: string) => word[0])
          .join('')
          .toUpperCase()
          .substring(0, 2);

        return {
          id: message.partner_id,
          name: displayName,
          lastMessage: message.text,
          time: formatDistanceToNow(new Date(message.created_at), { addSuffix: true }),
          avatar: startup?.image_url || initials,
        };
      });

      setConversations(conversationList);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();

    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
        },
        () => {
          loadConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(
    (conv) =>
      searchQuery === '' ||
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-3">
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-foreground-secondary">Loading conversations...</p>
        </div>
      ) : filteredConversations.length > 0 ? (
        filteredConversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => onSelectConversation(conv.id, conv.name)}
            className="flex items-center space-x-4 p-4 glass-effect rounded-xl hover:bg-accent cursor-pointer transition-all duration-200 card-hover"
          >
            {/* Avatar */}
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow flex-shrink-0 overflow-hidden">
              {conv.avatar.startsWith('http') ? (
                <img src={conv.avatar} alt={conv.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-bold text-sm">{conv.avatar}</span>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-foreground truncate">{conv.name}</h3>
                <span className="text-xs text-foreground-muted flex-shrink-0 ml-2">
                  {conv.time}
                </span>
              </div>
              <p className="text-sm text-foreground-muted truncate">{conv.lastMessage}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12">
          <p className="text-foreground-secondary">No conversations yet</p>
          <p className="text-sm text-foreground-muted mt-2">Start a conversation to see it here</p>
        </div>
      )}
    </div>
  );
};
