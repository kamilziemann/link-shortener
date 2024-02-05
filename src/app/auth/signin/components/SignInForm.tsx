'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { FC } from 'react';
import { Loader2Icon, MailIcon } from 'lucide-react';
import { toast } from 'sonner';
import { FormProvider, useForm } from 'react-hook-form';
import { InputField, InputPasswordField } from '@/components/InputField';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import TextDivider from '@/components/TextDivider';
import { useMutation } from '@tanstack/react-query';
import { emailValidation, passwordValidation } from '@/lib/validations';
import AuthProviders from '@/app/auth/components/AuthProviders';
import { redirect } from 'next/navigation';

interface SignInStatus {
  status: 'loading' | 'success' | 'error' | null;
  data: any | null;
}

const signInFormSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
});

type SignInFormValues = z.infer<typeof signInFormSchema>;

const defaultValues: Partial<SignInFormValues> = {
  email: '',
  password: '',
};

const SignInForm: FC = () => {
  const supabase = createClientComponentClient();

  const methods = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues,
  });

  const mutation = useMutation({
    mutationFn: async ({ email, password }: SignInFormValues) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        throw new Error(`${error.message}`);
      }

      return data;
    },
    onError: (error) => toast(error.message),
  });

  const onSubmit = (formData: SignInFormValues) => mutation.mutateAsync(formData);

  const isLoading = mutation.isPending;

  if (mutation?.data?.session) {
    redirect('/dashboard');
  }

  return (
    <div className="grid gap-2">
      <div className="grid gap-6">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="grid gap-4">
            <InputField
              name="email"
              label="Email"
              inputProps={{
                placeholder: 'name@example.com',
                type: 'email',
                autoCapitalize: 'none',
                autoComplete: 'email',
                autoCorrect: 'off',
              }}
            />
            <InputPasswordField
              name="password"
              label="Password"
              inputProps={{
                placeholder: '••••••••',
                autoCapitalize: 'none',
                autoComplete: 'password',
                autoCorrect: 'off',
              }}
            />
            <Button disabled={isLoading} className="mt-2">
              {isLoading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
        </FormProvider>
        <TextDivider text="Or continue with" />
        {/* <Button variant="outline" type="button" disabled={isLoading} className="w-full">
          {isLoading ? (
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <MailIcon className="mr-2 h-4 w-4" />
          )}
          SSO
        </Button> */}
        <AuthProviders />
      </div>
    </div>
  );
};

export default SignInForm;
