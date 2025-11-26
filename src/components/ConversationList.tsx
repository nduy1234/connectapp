import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import sarahChenAvatar from '@/assets/sarah-chen-avatar.jpg';
import michaelRodriguezAvatar from '@/assets/michael-rodriguez-avatar.jpg';
import emilyWatsonAvatar from '@/assets/emily-watson-avatar.jpg';
import davidKimAvatar from '@/assets/david-kim-avatar.jpg';
import jessicaLeeAvatar from '@/assets/jessica-lee-avatar.jpg';

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

      // Get all messages for this user
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
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

      // Get unique partner IDs
      const partnerIds = Array.from(conversationMap.keys());

      // Filter out invalid UUIDs (old test data)
      const validPartnerIds = partnerIds.filter((id) => {
        // UUID regex pattern
        const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidPattern.test(id);
      });

      if (validPartnerIds.length === 0) {
        setConversations([]);
        return;
      }

      // Fetch startup info for all valid partners
      const { data: startups, error: startupsError } = await supabase
        .from('startups')
        .select('id, founder_name, startup_name, image_url')
        .in('id', validPartnerIds);

      if (startupsError) throw startupsError;

      // Create a map of startup data by ID
      const startupMap = new Map(
        startups?.map((s) => [s.id, s]) || []
      );

      // Convert to conversation format (only include valid conversations with startup data)
      const conversationList: Conversation[] = Array.from(conversationMap.values())
        .filter((message) => startupMap.has(message.partner_id))
        .map((message) => {
          const startup = startupMap.get(message.partner_id);
          const founderName = startup?.founder_name || 'Unknown';
          const startupName = startup?.startup_name || '';
          const displayName = startupName ? `${founderName} - ${startupName}` : founderName;
          
          // Map founder names to avatars (same logic as Startups screen)
          const getAvatarForFounder = (name: string, imageUrl: string | null) => {
            const lowerName = name.toLowerCase();
            if (lowerName.includes('sarah chen')) return sarahChenAvatar;
            if (lowerName.includes('michael rodriguez')) return michaelRodriguezAvatar;
            if (lowerName.includes('emily watson')) return emilyWatsonAvatar;
            if (lowerName.includes('david kim')) return davidKimAvatar;
            if (lowerName.includes('jessica lee')) return jessicaLeeAvatar;
            return imageUrl;
          };

          const avatarUrl = getAvatarForFounder(founderName, startup?.image_url || null);
          
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
            avatar: avatarUrl || initials,
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
        (payload) => {
          console.log('Message change detected:', payload);
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
