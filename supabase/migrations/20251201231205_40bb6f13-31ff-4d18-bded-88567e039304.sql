-- Fix: Require authentication for viewing startups (prevents anonymous access)
DROP POLICY IF EXISTS "Anyone can view startups" ON public.startups;

CREATE POLICY "Authenticated users can view startups" ON public.startups
FOR SELECT USING (auth.uid() IS NOT NULL);