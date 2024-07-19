// app/email-verification/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { verifyEmail } from '@/app/utils/authApi';

export default function EmailVerificationPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const verifyEmailToken = async () => {
      const token = new URLSearchParams(window.location.search).get('token');
      if (!token) {
        setError('Invalid Token');
        return;
      }

      try {
        await verifyEmail(token);
        router.push('/signin');
      } catch (err: any) {
        setError(err.message);
      }
    };

    verifyEmailToken();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {error && <p className="mb-4 text-red-500 text-center">{error}</p>}
      {!error && (
        <div className="flex flex-col items-center space-y-4">
          <svg
            className="animate-spin h-8 w-8 text-pink-900"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4zm2 5.292A7.973 7.973 0 014 12h8v5.292A7.973 7.973 0 016 17.292z"
            ></path>
          </svg>
          <p className="text-gray-700 font-medium">Loading...</p>
        </div>
      )}
    </div>
  );
}