// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://adhvjruhhklgmvobjbfw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkaHZqcnVoaGtsZ212b2JqYmZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxMjk1NTUsImV4cCI6MjEwMzcwNTU1NX0.1pIy282aS47MGJP1q_6jw3q-gCsT035-QOy4ltxsWN4';

export const supabase = createClient(supabaseUrl, supabaseKey);
