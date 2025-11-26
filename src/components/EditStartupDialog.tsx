import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EditStartupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartupUpdated?: () => void;
  startup: {
    id: string;
    founder_name: string;
    startup_name: string;
    location: string;
    industry: string;
    description: string;
    image_url?: string;
  } | null;
}

export function EditStartupDialog({ open, onOpenChange, onStartupUpdated, startup }: EditStartupDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    founder: '',
    startup: '',
    location: '',
    industry: '',
    description: ''
  });

  useEffect(() => {
    if (startup) {
      setFormData({
        founder: startup.founder_name,
        startup: startup.startup_name,
        location: startup.location,
        industry: startup.industry,
        description: startup.description
      });
      setImagePreview(startup.image_url || '');
    }
  }, [startup]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!startup) return;
    
    if (!formData.founder || !formData.startup || !formData.location || !formData.industry || !formData.description) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      let imageUrl = startup.image_url || '';

      // Upload new image if selected
      if (selectedImage) {
        const fileExt = selectedImage.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('profile-images')
          .upload(fileName, selectedImage);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('profile-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      // Update startup data
      const { error: updateError } = await supabase
        .from('startups')
        .update({
          founder_name: formData.founder,
          startup_name: formData.startup,
          location: formData.location,
          industry: formData.industry,
          description: formData.description,
          image_url: imageUrl
        })
        .eq('id', startup.id);

      if (updateError) throw updateError;
      
      toast({
        title: 'Success',
        description: 'Startup updated successfully'
      });

      setSelectedImage(null);
      onOpenChange(false);
      
      if (onStartupUpdated) {
        onStartupUpdated();
      }
    } catch (error) {
      console.error('Error updating startup:', error);
      toast({
        title: 'Error',
        description: 'Failed to update startup',
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
          <DialogTitle>Edit Startup</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="founder">Founder</Label>
            <Input
              id="founder"
              value={formData.founder}
              onChange={(e) => handleInputChange('founder', e.target.value)}
              placeholder="Enter founder name"
            />
          </div>

          <div>
            <Label htmlFor="startup">Startup</Label>
            <Input
              id="startup"
              value={formData.startup}
              onChange={(e) => handleInputChange('startup', e.target.value)}
              placeholder="Enter startup name"
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Enter location"
            />
          </div>

          <div>
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              placeholder="Enter industry"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter startup description"
              rows={4}
            />
          </div>

          <div>
            <Label>Profile Image</Label>
            <div className="mt-2">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => imageInputRef.current?.click()}
                    className="mt-2"
                  >
                    Change Image
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => imageInputRef.current?.click()}
                  className="w-full gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload Image
                </Button>
              )}
            </div>
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
