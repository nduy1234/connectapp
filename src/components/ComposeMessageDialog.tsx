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

interface ComposeMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const contacts: Contact[] = [
    { id: 6, name: 'Alex Turner', startupName: 'CloudScale', avatar: 'AT' },
    { id: 7, name: 'Maria Garcia', startupName: 'DataFlow', avatar: 'MG' },
    { id: 8, name: 'James Wilson', startupName: 'SecureNet', avatar: 'JW' },
    { id: 9, name: 'Lisa Anderson', startupName: 'MobileFirst', avatar: 'LA' },
    { id: 10, name: 'Robert Taylor', startupName: 'AI Dynamics', avatar: 'RT' },
  ];

  const filteredContacts = contacts.filter(
    (contact) =>
      searchQuery === '' ||
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.startupName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectContact = (contact: Contact) => {
    // In a real app, this would navigate to the chat with this contact
    console.log('Selected contact:', contact);
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
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow flex-shrink-0">
                    <span className="text-white font-bold text-sm">{contact.avatar}</span>
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
