// app/routes/api/shorten.ts
import { createClient } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SECRET_KEY || '',
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const originalUrl = body.originalUrl;

  if (!originalUrl) {
    return new NextResponse(JSON.stringify({ error: 'originalUrl is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const shortCode = nanoid(6);

  const { data, error } = await supabase
    .from('ShortenedLinks')
    .insert([{ short_code: shortCode, original_url: originalUrl }])
    .select('short_code')
    .single();

  if (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new NextResponse(JSON.stringify({ shortCode: data.short_code }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
