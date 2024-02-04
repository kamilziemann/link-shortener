'use client';
import { FC } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Props {}

const SwitchAuth: FC<Props> = () => {
  const pathname = usePathname();

  const isSignInPage = pathname.includes('signin');

  return (
    <>
      <Link
        href={`/auth/sign${isSignInPage ? 'up' : 'in'}`}
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 md:right-8 md:top-8',
        )}
      >
        {isSignInPage ? 'Sign up' : 'Sign in'}
      </Link>
    </>
  );
};

export default SwitchAuth;
