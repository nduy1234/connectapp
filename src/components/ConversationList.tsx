import React from 'react';
import sarahChenAvatar from '@/assets/sarah-chen-avatar.jpg';
import emilyWatsonAvatar from '@/assets/emily-watson-avatar.jpg';
import jessicaLeeAvatar from '@/assets/jessica-lee-avatar.jpg';

interface Conversation {
  id: number;
  name: string;
  startupName: string;
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
  // Sample conversation data
  const conversations: Conversation[] = [
    {
      id: 1,
      name: 'Sarah Chen',
      startupName: 'TechFlow AI',
      lastMessage: 'Looking forward to our collaboration!',
      time: '2m ago',
      avatar: 'SC',
    },
    {
      id: 2,
      name: 'Michael Rodriguez',
      startupName: 'FinWave',
      lastMessage: "Thanks for the intro, let's connect",
      time: '15m ago',
      avatar: 'MR',
    },
    {
      id: 3,
      name: 'Emily Watson',
      startupName: 'GreenTech Solutions',
      lastMessage: 'I love your approach to sustainability',
      time: '1h ago',
      avatar: 'EW',
    },
    {
      id: 4,
      name: 'David Kim',
      startupName: 'HealthHub',
      lastMessage: 'Would love to discuss potential partnership',
      time: '3h ago',
      avatar: 'DK',
    },
    {
      id: 5,
      name: 'Jessica Lee',
      startupName: 'EduConnect',
      lastMessage: 'Great meeting you at the conference!',
      time: '1d ago',
      avatar: 'JL',
    },
  ];

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(
    (conv) =>
      searchQuery === '' ||
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-3">
      {filteredConversations.length > 0 ? (
        filteredConversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => onSelectConversation(conv.id.toString(), conv.name)}
            className="flex items-center space-x-4 p-4 glass-effect rounded-xl hover:bg-accent cursor-pointer transition-all duration-200 card-hover"
          >
            {/* Avatar */}
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow flex-shrink-0 overflow-hidden">
              {conv.id === 1 ? (
                <img src={sarahChenAvatar} alt={conv.name} className="w-full h-full object-cover" />
              ) : conv.id === 3 ? (
                <img src={emilyWatsonAvatar} alt={conv.name} className="w-full h-full object-cover" />
              ) : conv.id === 5 ? (
                <img src={jessicaLeeAvatar} alt={conv.name} className="w-full h-full object-cover" />
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
              <p className="text-sm text-foreground-secondary truncate mb-1">
                {conv.startupName}
              </p>
              <p className="text-sm text-foreground-muted truncate">{conv.lastMessage}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12">
          <p className="text-foreground-secondary">No conversations found</p>
        </div>
      )}
    </div>
  );
};
