import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import sarahChenAvatar from '@/assets/sarah-chen-avatar.jpg';
import michaelRodriguezAvatar from '@/assets/michael-rodriguez-avatar.jpg';
import emilyWatsonAvatar from '@/assets/emily-watson-avatar.jpg';
import davidKimAvatar from '@/assets/david-kim-avatar.jpg';
import jessicaLeeAvatar from '@/assets/jessica-lee-avatar.jpg';

interface ComposeMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectContact: (contactId: string, contactName: string, avatar: string | null) => void;
}

interface Contact {
  id: string;
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
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load startups from database
  useEffect(() => {
    if (open) {
      loadContacts();
    }
  }, [open]);

  const loadContacts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('startups')
        .select('id, founder_name, startup_name, image_url')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedContacts: Contact[] = data.map((startup) => {
          const initials = startup.founder_name
            .split(' ')
            .map((word: string) => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);

          const getAvatarForFounder = (name: string, imageUrl: string | null) => {
            const lowerName = name.toLowerCase();
            if (lowerName.includes('sarah chen')) return sarahChenAvatar;
            if (lowerName.includes('michael rodriguez')) return michaelRodriguezAvatar;
            if (lowerName.includes('emily watson')) return emilyWatsonAvatar;
            if (lowerName.includes('david kim')) return davidKimAvatar;
            if (lowerName.includes('jessica lee')) return jessicaLeeAvatar;
            return imageUrl;
          };

          const avatarUrl = getAvatarForFounder(startup.founder_name, startup.image_url || null);

          return {
            id: startup.id,
            name: startup.founder_name,
            startupName: startup.startup_name,
            avatar: avatarUrl || initials,
          };
        });
        setContacts(formattedContacts);
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      searchQuery === '' ||
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.startupName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectContact = (contact: Contact) => {
    const displayName = `${contact.name} - ${contact.startupName}`;
    onSelectContact(contact.id, displayName, contact.avatar);
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
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-foreground-secondary">Loading contacts...</p>
              </div>
            ) : filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => handleSelectContact(contact)}
                  className="flex items-center space-x-3 p-3 glass-effect rounded-xl hover:bg-accent cursor-pointer transition-all duration-200"
                >
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow flex-shrink-0 overflow-hidden">
                    {contact.avatar.startsWith('http') ? (
                      <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
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
                <p className="text-foreground-secondary">
                  {contacts.length === 0 ? 'No startups available yet' : 'No contacts found'}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
