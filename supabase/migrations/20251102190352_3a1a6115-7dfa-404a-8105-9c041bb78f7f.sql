-- Create startups table
CREATE TABLE public.startups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  founder_name TEXT NOT NULL,
  startup_name TEXT NOT NULL,
  location TEXT NOT NULL,
  industry TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.startups ENABLE ROW LEVEL SECURITY;

-- Create policies - everyone can view all startups
CREATE POLICY "Anyone can view startups"
ON public.startups
FOR SELECT
USING (true);

-- Users can insert their own startups
CREATE POLICY "Users can insert their own startups"
ON public.startups
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own startups
CREATE POLICY "Users can update their own startups"
ON public.startups
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own startups
CREATE POLICY "Users can delete their own startups"
ON public.startups
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_startups_updated_at
BEFORE UPDATE ON public.startups
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();