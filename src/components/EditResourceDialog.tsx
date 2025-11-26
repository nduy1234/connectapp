import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EditResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResourceUpdated?: () => void;
  resource: {
    id: string;
    title: string;
    category: string;
    description: string;
    contact: string;
  } | null;
}

export function EditResourceDialog({ open, onOpenChange, onResourceUpdated, resource }: EditResourceDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    contact: ''
  });

  useEffect(() => {
    if (resource) {
      setFormData({
        title: resource.title,
        category: resource.category,
        description: resource.description || '',
        contact: resource.contact || ''
      });
    }
  }, [resource]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!resource) return;
    
    if (!formData.title || !formData.category) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in title and category',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error: updateError } = await supabase
        .from('resources')
        .update({
          title: formData.title,
          category: formData.category,
          description: formData.description,
          contact: formData.contact
        })
        .eq('id', resource.id);

      if (updateError) throw updateError;
      
      toast({
        title: 'Success',
        description: 'Resource updated successfully'
      });

      onOpenChange(false);
      
      if (onResourceUpdated) {
        onResourceUpdated();
      }
    } catch (error) {
      console.error('Error updating resource:', error);
      toast({
        title: 'Error',
        description: 'Failed to update resource',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Resource</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter resource title"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              placeholder="Enter category"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter resource description"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="contact">Contact</Label>
            <Input
              id="contact"
              value={formData.contact}
              onChange={(e) => handleInputChange('contact', e.target.value)}
              placeholder="Enter contact information"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              'Update'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
