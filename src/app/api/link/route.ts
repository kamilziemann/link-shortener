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
  const { expiresAt, originalUrl } = body ?? {};

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
    .from('links')
    .insert([{ short_code: shortCode, original_url: originalUrl, expires_at: expiresAt }])
    .select('short_code, expires_at')
    .single();

  console.log(expiresAt);
  if (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new NextResponse(
    JSON.stringify({ shortCode: data.short_code, expiresAt: data.expires_at }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}
