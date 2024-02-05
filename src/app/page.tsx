'use client';
import CopyButton from '@/components/CopyButton';
import { InputField } from '@/components/InputField';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useMutation } from '@tanstack/react-query';
import { ChevronDownIcon, ChevronUpIcon, CopyIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const shortLinkFormSchema = z.object({
  originalUrl: z.string().url({ message: 'Please enter a valid URL.' }),
});

type ShortLinkFormValues = z.infer<typeof shortLinkFormSchema>;

const defaultValues: Partial<ShortLinkFormValues> = {
  originalUrl: '',
};

export default function Home() {
  const supabase = createClientComponentClient();
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);

  const methods = useForm<ShortLinkFormValues>({
    resolver: zodResolver(shortLinkFormSchema),
    defaultValues,
  });

  const mutation = useMutation({
    mutationFn: async ({ originalUrl }: ShortLinkFormValues) => {
      const response = await fetch('/api/link', {
        method: 'POST',
        body: JSON.stringify({ originalUrl }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('response bad');
      }

      return await response.json();
    },
    onError: (error) => toast(error.message),
  });

  const onSubmit = (formData: ShortLinkFormValues) => mutation.mutateAsync(formData);

  const shortedUrl = `http://localhost:3000/s/${mutation.data?.shortCode}`;

  const ExpandIcon = isSettingsExpanded ? ChevronUpIcon : ChevronDownIcon;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="max-w-3xl w-full">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex items-end gap-4">
              <InputField
                name="originalUrl"
                label="Your url"
                className="w-full h-16"
                inputProps={{
                  placeholder: 'https://domain.com?test=1234',
                }}
              />
              <div className="flex gap-1 items-end justify-center">
                <Button>
                  Short!
                  {/* <CheckIcon className="mr-2 h-4 w-4" /> Mark all as read */}
                </Button>
                <Button type="button" size="icon" onClick={() => setIsSettingsExpanded((p) => !p)}>
                  <ExpandIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {isSettingsExpanded ? (
              <Card className="w-full border-b">
                <CardHeader>
                  <CardTitle>Advanced settings</CardTitle>
                  {/* <CardDescription>Card Description</CardDescription> */}
                </CardHeader>
                <CardContent>
                  <p>Card Content</p>
                </CardContent>
              </Card>
            ) : null}
          </form>
        </FormProvider>
        {mutation.data?.shortCode ? (
          <pre className="mb-4 mt-4 overflow-x-auto rounded-lg border bg-zinc-950 py-2 px-1 flex gap-3">
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm w-full">
              <Link
                href={shortedUrl}
                className="w-full hover:underline"
                rel="noreferrer noopener"
                target="_blank"
              >
                {shortedUrl}
              </Link>
            </code>
            <CopyButton value={shortedUrl} />
          </pre>
        ) : null}
      </div>
      <Link href="/auth/signin" className="button">
        DASHBOARD
      </Link>
    </main>
  );
}
