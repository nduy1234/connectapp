import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import sarahChenAvatar from '@/assets/sarah-chen-avatar.jpg';
import michaelRodriguezAvatar from '@/assets/michael-rodriguez-avatar.jpg';
import emilyWatsonAvatar from '@/assets/emily-watson-avatar.jpg';
import davidKimAvatar from '@/assets/david-kim-avatar.jpg';
import jessicaLeeAvatar from '@/assets/jessica-lee-avatar.jpg';

interface Message {
  id: number;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages from database
  useEffect(() => {
    loadMessages();
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
        if (!user) return;

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

        // Update local state
        const message: Message = {
          id: messages.length + 1,
          text: newMessage,
          sentByMe: true,
          timestamp,
        };
        setMessages([...messages, message]);
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  // Get initials from partner name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

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
            {partnerId === '1' ? (
              <img src={sarahChenAvatar} alt={partnerName} className="w-full h-full object-cover" />
            ) : partnerId === '2' ? (
              <img src={michaelRodriguezAvatar} alt={partnerName} className="w-full h-full object-cover" />
            ) : partnerId === '3' ? (
              <img src={emilyWatsonAvatar} alt={partnerName} className="w-full h-full object-cover" />
            ) : partnerId === '4' ? (
              <img src={davidKimAvatar} alt={partnerName} className="w-full h-full object-cover" />
            ) : partnerId === '5' ? (
              <img src={jessicaLeeAvatar} alt={partnerName} className="w-full h-full object-cover" />
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
            className={`flex ${message.sentByMe ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                message.sentByMe
                  ? 'bg-gradient-primary text-white shadow-glow'
                  : 'glass-effect text-foreground'
              }`}
            >
              <p className="text-sm break-words">{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.sentByMe ? 'text-white/70' : 'text-foreground-muted'
                }`}
              >
                {message.timestamp}
              </p>
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
