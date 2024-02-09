import type { Metadata } from 'next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { UserIcon } from 'lucide-react';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const supabaseServer = async () => {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });

  return supabase;
};

export const metadata: Metadata = {
  title: 'Link app',
  description: 'Link app',
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase.auth.getSession();

  if (!data.session) {
    redirect('/auth/signin');
  }

  return (
    <>
      <nav className="border-b flex h-16 items-center px-4 justify-between">
        <p>link shortener</p>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="rounded-full bg-gray-600 p-0.5">
              <UserIcon />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              <span className="text-xs">{data.session?.user.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem> */}
            <Link href="/auth/signout">
              <DropdownMenuItem> Sign out</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
      <main>{children}</main>
    </>
  );
}
