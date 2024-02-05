import type { Metadata } from 'next';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
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
import { MenuIcon, UserIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Link app',
  description: 'Link app',
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerComponentClient({ cookies });

  const { data, error } = await supabase.auth.getSession();

  if (!data.session) {
    redirect('/auth/signin');
  }

  console.log('SESSION', { data }, { error });
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
