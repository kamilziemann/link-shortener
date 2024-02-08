'use client';
import CopyButton from '@/components/CopyButton';
import { DateTimePicker, DateTimePickerField } from '@/components/DateTimePicker';
import { InputField } from '@/components/InputField';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { appURL, getUserLocale } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useMutation } from '@tanstack/react-query';
import { formatDuration, intervalToDuration } from 'date-fns';
import { ChevronDownIcon, ChevronUpIcon, CopyIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface Props {}

const shortLinkFormSchema = z.object({
  originalUrl: z.string().url({ message: 'Please enter a valid URL.' }),
  expiresAt: z
    .date()
    .optional()
    .refine((expiresAt) => (expiresAt ? expiresAt > new Date() : undefined), {
      message: 'Start date must be in the future',
    }),
});

type ShortLinkFormValues = z.infer<typeof shortLinkFormSchema>;

const defaultValues: Partial<ShortLinkFormValues> = {
  originalUrl: '',
  expiresAt: undefined,
};

const LinkShortenerForm: FC<Props> = () => {
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);

  const methods = useForm<ShortLinkFormValues>({
    resolver: zodResolver(shortLinkFormSchema),
    defaultValues,
  });

  const mutation = useMutation({
    mutationFn: async ({ originalUrl, expiresAt }: ShortLinkFormValues) => {
      const response = await fetch('/api/link', {
        method: 'POST',
        body: JSON.stringify({ originalUrl, expiresAt }),
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

  const shortedUrl = `${appURL}/s/${mutation.data?.shortCode}`;

  const ExpandIcon = isSettingsExpanded ? ChevronUpIcon : ChevronDownIcon;

  const linkExpiresAt = methods.watch('expiresAt');

  return (
    <div className="max-w-3xl w-full">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex items-end gap-4 mb-4">
            <InputField
              name="originalUrl"
              label="Your url"
              className="w-full h-16"
              inputProps={{
                placeholder: 'https://domain.com?test=1234',
                autoComplete: 'off',
              }}
            />
            <div className="flex gap-1 items-end justify-center">
              <Button>Short!</Button>
              <Button
                className="relative"
                type="button"
                size="icon"
                onClick={() => setIsSettingsExpanded((p) => !p)}
              >
                <ExpandIcon className="h-4 w-4" />
                {linkExpiresAt ? (
                  <div className="absolute -top-1 -right-1 z-20 rounded-full bg-red-500 h-3 w-3"></div>
                ) : null}
              </Button>
            </div>
          </div>
          {isSettingsExpanded ? (
            <Card className="w-full border-b">
              <CardHeader>
                <CardTitle className="flex flex-row justify-between flex-wrap gap-2 items-center">
                  Advanced settings
                  <Button
                    size="sm"
                    type="button"
                    onClick={() =>
                      methods.reset({
                        ...defaultValues,
                        originalUrl: methods.getValues('originalUrl'),
                      })
                    }
                  >
                    Reset
                  </Button>
                </CardTitle>
                {/* <CardDescription>Card Description</CardDescription> */}
              </CardHeader>
              <CardContent>
                <DateTimePickerField name="expiresAt" label="Link expires at" />
              </CardContent>
            </Card>
          ) : null}
        </form>
      </FormProvider>
      {mutation.data ? (
        <pre className="mb-4 mt-4 overflow-x-auto rounded-lg border bg-zinc-950 py-2 px-1 ">
          <div className="flex gap-3">
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
          </div>
          Link wygaśnie za:{' '}
          {formatDuration(intervalToDuration({ start: new Date(), end: mutation.data.expiresAt }), {
            locale: getUserLocale(),
          })}
        </pre>
      ) : null}
    </div>
  );
};

export default LinkShortenerForm;
