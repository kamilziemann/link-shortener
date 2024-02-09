import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const supabaseServer = async () => {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });

  return supabase;
};
