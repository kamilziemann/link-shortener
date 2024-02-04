'use client';
import { InputField } from '@/components/InputField';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { emailValidation } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useMutation } from '@tanstack/react-query';
import { Loader2Icon, MailIcon } from 'lucide-react';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface Props {}

const signWithSSOFormSchema = z.object({
  email: emailValidation,
});

type SignWithSSOFormValues = z.infer<typeof signWithSSOFormSchema>;

const defaultValues: Partial<SignWithSSOFormValues> = {
  email: '',
};

const AuthProviders: FC<Props> = () => {
  const supabase = createClientComponentClient();

  const methods = useForm<SignWithSSOFormValues>({
    resolver: zodResolver(signWithSSOFormSchema),
    defaultValues,
  });

  const mutation = useMutation({
    mutationFn: async ({ email }: SignWithSSOFormValues) => {
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: 'localhost:3000/auth/callback',
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onError: (error) => toast(error.message),
  });

  const onSubmit = (formData: SignWithSSOFormValues) => mutation.mutateAsync(formData);

  const isLoading = mutation.isPending;
  return (
    <>
      {/* <Button variant="outline" type="button" disabled={isLoading} className="w-full">
        {isLoading ? (
          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <MailIcon className="mr-2 h-4 w-4" />
        )}
        SSO
      </Button> */}
      <Dialog
        onOpenChange={() => {
          methods.reset();
          mutation.reset();
        }}
      >
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <MailIcon className="mr-2 h-4 w-4" />
            SSO
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sign In</DialogTitle>
            <DialogDescription>
              {mutation.isSuccess ? (
                <div className="grid place-items-center">
                  <MailIcon className="w-32 h-32" />
                  Check email
                </div>
              ) : (
                <>Make changes to your profile here. Click save when youre done</>
              )}
            </DialogDescription>
          </DialogHeader>
          {!mutation.isSuccess ? (
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
                <DialogFooter>
                  <Button type="submit" disabled={isLoading} className="mt-4">
                    {isLoading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>
                </DialogFooter>
              </form>
            </FormProvider>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AuthProviders;
