import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import sarahChenAvatar from '@/assets/sarah-chen-avatar.jpg';
import michaelRodriguezAvatar from '@/assets/michael-rodriguez-avatar.jpg';
import emilyWatsonAvatar from '@/assets/emily-watson-avatar.jpg';
import davidKimAvatar from '@/assets/david-kim-avatar.jpg';
import jessicaLeeAvatar from '@/assets/jessica-lee-avatar.jpg';

interface ComposeMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectContact: (contactId: number, contactName: string) => void;
}

interface Contact {
  id: number;
  name: string;
  startupName: string;
  avatar: string;
}

export const ComposeMessageDialog: React.FC<ComposeMessageDialogProps> = ({
  open,
  onOpenChange,
  onSelectContact,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const contacts: Contact[] = [
    { id: 6, name: 'Sarah Chen', startupName: 'TechFlow AI', avatar: 'SC' },
    { id: 7, name: 'Michael Rodriguez', startupName: 'FinWave', avatar: 'MR' },
    { id: 8, name: 'Emily Watson', startupName: 'GreenTech Solutions', avatar: 'EW' },
    { id: 9, name: 'David Kim', startupName: 'HealthHub', avatar: 'DK' },
    { id: 10, name: 'Jessica Lee', startupName: 'EduConnect', avatar: 'JL' },
  ];

  const filteredContacts = contacts.filter(
    (contact) =>
      searchQuery === '' ||
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.startupName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectContact = (contact: Contact) => {
    onSelectContact(contact.id, contact.name);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted w-5 h-5" />
            <Input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>

          {/* Contacts List */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => handleSelectContact(contact)}
                  className="flex items-center space-x-3 p-3 glass-effect rounded-xl hover:bg-accent cursor-pointer transition-all duration-200"
                >
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow flex-shrink-0 overflow-hidden">
                    {contact.id === 6 ? (
                      <img src={sarahChenAvatar} alt={contact.name} className="w-full h-full object-cover" />
                    ) : contact.id === 7 ? (
                      <img src={michaelRodriguezAvatar} alt={contact.name} className="w-full h-full object-cover" />
                    ) : contact.id === 8 ? (
                      <img src={emilyWatsonAvatar} alt={contact.name} className="w-full h-full object-cover" />
                    ) : contact.id === 9 ? (
                      <img src={davidKimAvatar} alt={contact.name} className="w-full h-full object-cover" />
                    ) : contact.id === 10 ? (
                      <img src={jessicaLeeAvatar} alt={contact.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-bold text-sm">{contact.avatar}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{contact.name}</h3>
                    <p className="text-sm text-foreground-secondary truncate">
                      {contact.startupName}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-foreground-secondary">No contacts found</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
