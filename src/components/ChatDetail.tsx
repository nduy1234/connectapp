import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Edit, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import sarahChenAvatar from '@/assets/sarah-chen-avatar.jpg';
import michaelRodriguezAvatar from '@/assets/michael-rodriguez-avatar.jpg';
import emilyWatsonAvatar from '@/assets/emily-watson-avatar.jpg';
import davidKimAvatar from '@/assets/david-kim-avatar.jpg';
import jessicaLeeAvatar from '@/assets/jessica-lee-avatar.jpg';

interface Message {
  id: number;
  uuid: string;
  text: string;
  sentByMe: boolean;
  timestamp: string;
}

interface ChatDetailProps {
  partnerId: string;
  partnerName: string;
  onBack: () => void;
}

export const ChatDetail: React.FC<ChatDetailProps> = ({
  partnerId,
  partnerName,
  onBack,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [partnerImage, setPartnerImage] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get the avatar for the current partner - prioritize known founders
  const getPartnerAvatar = () => {
    const nameLower = partnerName.toLowerCase();
    
    // Check for known founders first
    if (nameLower.includes('sarah chen')) return sarahChenAvatar;
    if (nameLower.includes('michael rodriguez')) return michaelRodriguezAvatar;
    if (nameLower.includes('emily watson')) return emilyWatsonAvatar;
    if (nameLower.includes('david kim')) return davidKimAvatar;
    if (nameLower.includes('jessica lee')) return jessicaLeeAvatar;
    
    // Fall back to partnerImage from state
    return partnerImage;
  };

  // Load partner info from database
  useEffect(() => {
    loadPartnerInfo();
  }, [partnerId]);

  const loadPartnerInfo = async () => {
    try {
      // First check if it's a known founder by name
      const nameLower = partnerName.toLowerCase();
      if (nameLower.includes('sarah chen') || 
          nameLower.includes('michael rodriguez') ||
          nameLower.includes('emily watson') ||
          nameLower.includes('david kim') ||
          nameLower.includes('jessica lee')) {
        // Avatar will be set by getPartnerAvatar(), no need to load from DB
        return;
      }

      // If we don't match by name, and the ID looks like a UUID, try loading from the startups table
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidPattern.test(partnerId)) {
        return;
      }

      const { data, error } = await supabase
        .from('startups')
        .select('image_url')
        .eq('id', partnerId)
        .maybeSingle();

      if (error) throw error;
      if (data?.image_url) {
        setPartnerImage(data.image_url);
      }
    } catch (error) {
      console.error('Error loading partner info:', error);
    }
  };

  // Load messages from database
  useEffect(() => {
    loadMessages();

    // Set up real-time subscription for new messages
    const channel = supabase
      .channel(`messages-${partnerId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `partner_id=eq.${partnerId}`,
        },
        (payload) => {
          console.log('New message received:', payload);
          loadMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [partnerId]);

  const loadMessages = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', user.id)
        .eq('partner_id', partnerId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data) {
        const formattedMessages = data.map((msg) => ({
          id: parseInt(msg.id.split('-')[0], 16),
          uuid: msg.id,
          text: msg.text,
          sentByMe: msg.sent_by_me,
          timestamp: new Date(msg.created_at).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          }),
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.error('User not authenticated');
          return;
        }

        const timestamp = new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        });

        // Save to database
        const { error } = await supabase
          .from('messages')
          .insert({
            user_id: user.id,
            partner_id: partnerId,
            text: newMessage,
            sent_by_me: true,
          });

        if (error) throw error;

        // Reload messages to get the latest data
        await loadMessages();
        setNewMessage('');
      } catch (error: any) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleDeleteMessage = async (messageUuid: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const { error } = await supabase
          .from('messages')
          .delete()
          .eq('id', messageUuid);

        if (error) throw error;

        await loadMessages();
        toast({
          title: 'Message deleted',
          description: 'Your message has been deleted successfully.',
        });
      } catch (error: any) {
        console.error('Error deleting message:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete message. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleEditMessage = (message: Message) => {
    setEditingMessageId(message.uuid);
    setEditedText(message.text);
  };

  const handleSaveEdit = async (messageUuid: string) => {
    if (!editedText.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ text: editedText })
        .eq('id', messageUuid);

      if (error) throw error;

      await loadMessages();
      setEditingMessageId(null);
      setEditedText('');
      toast({
        title: 'Message updated',
        description: 'Your message has been updated successfully.',
      });
    } catch (error: any) {
      console.error('Error updating message:', error);
      toast({
        title: 'Error',
        description: 'Failed to update message. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditedText('');
  };

  // Get initials from partner name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const avatarSrc = getPartnerAvatar();

  return (
    <div className="flex flex-col h-screen bg-gradient-background">
      {/* Header */}
      <div className="glass-effect border-b border-border px-6 py-4 shadow-glass">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-accent transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow flex-shrink-0 overflow-hidden">
            {avatarSrc ? (
              <img src={avatarSrc} alt={partnerName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-bold text-sm">{getInitials(partnerName)}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-foreground truncate">{partnerName}</h2>
            <p className="text-sm text-foreground-muted">Active now</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-foreground-muted">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-foreground-muted">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sentByMe ? 'justify-end' : 'justify-start'} group`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 relative ${
                message.sentByMe
                  ? 'bg-gradient-primary text-white shadow-glow'
                  : 'glass-effect text-foreground'
              }`}
            >
              {editingMessageId === message.uuid ? (
                <div className="space-y-2">
                  <Input
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="bg-background/50 border-border"
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleSaveEdit(message.uuid)}
                      className="bg-gradient-primary text-white hover:shadow-glow"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelEdit}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm break-words">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sentByMe ? 'text-white/70' : 'text-foreground-muted'
                    }`}
                  >
                    {message.timestamp}
                  </p>
                  {message.sentByMe && (
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                      <button
                        onClick={() => handleDeleteMessage(message.uuid)}
                        className="w-8 h-8 bg-background border border-border rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-foreground" />
                      </button>
                      <button
                        onClick={() => handleEditMessage(message)}
                        className="w-8 h-8 bg-background border border-border rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
                      >
                        <Edit className="w-4 h-4 text-foreground" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="glass-effect border-t border-border px-6 py-4 shadow-glass">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-background/50 border-border rounded-xl"
          />
          <Button
            type="submit"
            disabled={!newMessage.trim()}
            className="w-10 h-10 p-0 bg-gradient-primary hover:shadow-glow transition-all duration-200"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};
