import { createClient } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SECRET_KEY || '',
);

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const { data, error } = await supabase
    .from('ShortenedLinks')
    .select('original_url')
    .eq('short_code', params.slug);

  if (error) {
    console.log('ERRR');
    return NextResponse.redirect('/', {
      status: 302,
    });
  }

  // TODO ADD analytics

  return NextResponse.redirect(data[0].original_url, {
    status: 302,
  });
}
