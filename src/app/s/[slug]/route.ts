import { createClient } from '@supabase/supabase-js';
import { isPast } from 'date-fns';
import { type NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SECRET_KEY || '',
);

const { NEXT_PUBLIC_APP_URL = '' } = process.env;

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const { data, error } = await supabase
    .from('links')
    .select('original_url, id, expires_at')
    .eq('short_code', params.slug)
    .single();

  if (error) {
    const statusCode = error.code === 'PGRST116' ? 'notFound' : 'error';

    return NextResponse.redirect(`${NEXT_PUBLIC_APP_URL}/status?code=${statusCode}`, {
      status: 302,
    });
  }

  await supabase.from('link_stats').insert({ shortened_link_id: data.id });

  const urlToRedirect = isPast(data.expires_at)
    ? `${NEXT_PUBLIC_APP_URL}/status?code=expired`
    : data.original_url;

  return NextResponse.redirect(urlToRedirect, {
    status: 302,
  });
}
