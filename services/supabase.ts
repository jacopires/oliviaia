import { createClient } from '@supabase/supabase-js';

// Fallback Hardcoded (Segurança para evitar Tela Preta)
const ENV_URL = import.meta.env.VITE_SUPABASE_URL;
const ENV_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase Config:', {
  URL_LOADED: !!ENV_URL,
  KEY_LOADED: !!ENV_KEY,
  MODE: import.meta.env.MODE
});

const supabaseUrl = ENV_URL || 'https://kcerrbzfxutquhqbnybo.supabase.co';
const supabaseAnonKey = ENV_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjZXJyYnpmeHV0cXVocWJueWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNjI5NzMsImV4cCI6MjA4MTczODk3M30.Fsp5X1Lz_ZIzs2ds_dKnw5LDqhsSEl18FjOCVo7MrTE';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('CRITICAL: Supabase Variables Missing entirely.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});
