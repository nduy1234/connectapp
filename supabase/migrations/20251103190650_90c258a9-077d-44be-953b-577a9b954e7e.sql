-- Create messages table for chat functionality
CREATE TABLE public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_id text NOT NULL,
  text text NOT NULL,
  sent_by_me boolean NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policies for messages
CREATE POLICY "Users can view their own messages"
ON public.messages
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own messages"
ON public.messages
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages"
ON public.messages
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_messages_user_partner ON public.messages(user_id, partner_id, created_at);