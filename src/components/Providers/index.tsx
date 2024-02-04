'use client';

import { Analytics } from '@vercel/analytics/react';
import ReactQueryClientProvider from '@/components/Providers/ReactQueryClientProvider';
import { FC, ReactNode } from 'react';
import { Toaster } from 'sonner';

const Providers: FC<{ children: ReactNode }> = ({ children }) => (
  <>
    <ReactQueryClientProvider>
      {children}
      <Toaster />
      <Analytics />
    </ReactQueryClientProvider>
  </>
);

export default Providers;
