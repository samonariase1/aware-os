import { createBrowserClient } from '@supabase/ssr';

// ---------------------------------------------------------------------
// TYPE DEFINITIONS (Normally generated via Supabase CLI)
// ---------------------------------------------------------------------
// Run: npx supabase gen types typescript --project-id "your-project-id" > src/types/supabase.ts
// Then import { Database } from '@/types/supabase'

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string | null;
        };
      };
      // Add other tables here (analysis_logs, micro_routines) as needed
    };
  };
};

// ---------------------------------------------------------------------
// CLIENT CREATION
// ---------------------------------------------------------------------

/**
 * Creates a Supabase client for use in Client Components.
 * This replaces the older 'createClientComponentClient' from auth-helpers.
 */
export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Supabase Environment Variables are missing. Please check your .env.local file.'
    );
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
};