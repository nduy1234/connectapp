import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ktwgptvbgyongxaanxdt.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0d2dwdHZiZ3lvbmd4YWFueGR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1ODM4NzQsImV4cCI6MjA3NDE1OTg3NH0.h4qPLsrgLrU07LBnKLoUfN_DaHQvG5pUqDxGZWzzsQA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
