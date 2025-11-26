-- Add missing INSERT policy for profile-images storage bucket
-- This will allow authenticated users to upload their own images

CREATE POLICY "Users can upload their own profile images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);