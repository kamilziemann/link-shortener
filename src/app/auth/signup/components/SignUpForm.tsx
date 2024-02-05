'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { FC, useState } from 'react';
import { Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { FormProvider, useForm } from 'react-hook-form';
import { InputField, InputPasswordField } from '@/components/InputField';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { emailValidation, passwordValidation } from '@/lib/validations';

interface SignInStatus {
  status: 'loading' | 'success' | 'error' | null;
  data: any | null;
}

const signUpFormSchema = z
  .object({
    email: emailValidation,
    password: passwordValidation,
    confirmPassword: passwordValidation,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignUpFormValues = z.infer<typeof signUpFormSchema>;

const defaultValues: Partial<SignUpFormValues> = {
  email: '',
  password: '',
};

const SignUpForm: FC = () => {
  const supabase = createClientComponentClient();

  const methods = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues,
  });

  const mutation = useMutation({
    mutationFn: async ({ email, password }: SignUpFormValues) => {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: { emailRedirectTo: 'localhost:3000/auth/callback' },
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onError: (error) => toast(error.message),
  });

  const onSubmit = (formData: SignUpFormValues) => mutation.mutateAsync(formData);

  const isLoading = mutation.isPending;

  return (
    <div className="grid gap-2">
      <div className="">
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
                autoComplete: 'new-password',
                autoCorrect: 'off',
              }}
            />
            <InputPasswordField
              name="confirmPassword"
              label="Password"
              inputProps={{
                placeholder: '••••••••',
                autoCapitalize: 'none',
                autoComplete: 'new-password',
                autoCorrect: 'off',
              }}
            />
            <Button disabled={isLoading} className="mt-4">
              {isLoading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
              Sign In with Email
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default SignUpForm;
