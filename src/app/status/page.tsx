'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const formatStatusCode = (statusCode: string) =>
  statusCode?.replace(/([A-Z])/g, ' $1').toLowerCase();

const statusCode = {
  expired: 'The link you are trying to access has expired.',
  notFound: 'The link you are trying to access could not be found. Please verify the link.',
  error: 'An error occurred while processing your request. Please try again later.',
};

const StatusPage = () => {
  const searchParams = useSearchParams();

  const code = searchParams.get('code') as keyof typeof statusCode;

  return (
    <main className="flex min-h-screen flex-col items-center px-4 pt-[10vh]">
      <Card className="w-full border-b max-w-xs">
        <CardHeader>
          <CardTitle className="first-letter:uppercase text-center">
            {formatStatusCode(code) ?? 'error'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{statusCode?.[code] ?? statusCode.error}</p>
        </CardContent>
      </Card>
    </main>
  );
};

export default StatusPage;
