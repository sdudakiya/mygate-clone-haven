// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hzrxkciifgludarjtiab.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6cnhrY2lpZmdsdWRhcmp0aWFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzMTQ5NjYsImV4cCI6MjA1MTg5MDk2Nn0.tQVmzdJvBkvD3IU-Vzuc9toiPs7LEJcs60IxXzgKYyg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);