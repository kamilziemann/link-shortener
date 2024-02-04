import SignInForm from '@/app/auth/signin/components/SignInForm';
import { Metadata, NextPage } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in',
};

const SignInPage: NextPage = () => {
  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and password below to sign in your account
        </p>
      </div>
      <SignInForm />
      <p className="px-8 text-center text-sm text-muted-foreground">
        By clicking continue, you agree to our{' '}
        <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </Link>
      </p>
    </>
  );
};

export default SignInPage;
