import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import sarahChenAvatar from '@/assets/sarah-chen-avatar.jpg';

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Hey! Thanks for connecting',
      sentByMe: false,
      timestamp: '10:30 AM',
    },
    {
      id: 2,
      text: "Hi! I'm excited to learn more about your startup",
      sentByMe: true,
      timestamp: '10:32 AM',
    },
    {
      id: 3,
      text: 'Would love to set up a call sometime this week',
      sentByMe: false,
      timestamp: '10:35 AM',
    },
    {
      id: 4,
      text: "That sounds great! I'm free on Thursday afternoon",
      sentByMe: true,
      timestamp: '10:37 AM',
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message: Message = {
        id: messages.length + 1,
        text: newMessage,
        sentByMe: true,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        }),
      };
      setMessages([...messages, message]);
      setNewMessage('');
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
        {messages.map((message) => (
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
        ))}
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
