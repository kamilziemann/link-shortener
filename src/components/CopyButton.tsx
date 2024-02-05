'use client';

import React, { useState, useEffect, FC, HTMLAttributes } from 'react';
import { CheckIcon, CopyIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CopyCheckIcon } from 'lucide-react';

interface CopyButtonProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
}

const copyToClipboardWithMeta = async (value: string) => await navigator.clipboard.writeText(value);

const CopyButton: FC<CopyButtonProps> = ({ value, className, ...props }) => {
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasCopied(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [hasCopied]);

  return (
    <Button
      size="icon"
      variant="ghost"
      className={cn(
        'relative z-10 h-6 w-6 text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50',
        className,
      )}
      onClick={() => {
        copyToClipboardWithMeta(value);
        setHasCopied(true);
      }}
      {...props}
    >
      <span className="sr-only">Copy</span>
      {hasCopied ? <CopyCheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
    </Button>
  );
};

export default CopyButton;
