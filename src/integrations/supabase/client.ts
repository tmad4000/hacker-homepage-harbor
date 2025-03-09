
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ndhwubqidvclpvegybsa.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kaHd1YnFpZHZjbHB2ZWd5YnNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NTE3MTEsImV4cCI6MjA1NzEyNzcxMX0.8zGZf-egkcXmA31LSKUbRBoZyYrTThJ369ua04hnOzQ";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
