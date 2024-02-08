import { createClient } from '@supabase/supabase-js';
import { isPast } from 'date-fns';
import { type NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SECRET_KEY || '',
);

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const { data, error } = await supabase
    .from('links')
    .select('original_url, id, expires_at')
    .eq('short_code', params.slug)
    .single();

  if (error) {
    const statusCode = error.code === 'PGRST116' ? 'notFound' : 'error';

    return NextResponse.redirect(`http://localhost:3000/status?code=${statusCode}`, {
      status: 302,
    });
  }

  await supabase.from('link_stats').insert({ shortened_link_id: data.id });

  const urlToRedirect = isPast(data.expires_at)
    ? 'http://localhost:3000/status?code=expired'
    : data.original_url;

  return NextResponse.redirect(urlToRedirect, {
    status: 302,
  });
}
