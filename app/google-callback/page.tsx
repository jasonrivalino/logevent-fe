// app/google-callback/page.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GoogleCallback() {
  const router = useRouter();

  useEffect(() => {
    const fetchToken = async () => {
      const token = new URLSearchParams(window.location.search).get('token');
      if (token) {
        localStorage.setItem('token', token);
        router.push('/dashboard'); // Redirect to dashboard after successful authentication
      } else {
        console.error('No token found in URL');
      }
    };

    fetchToken();
  }, [router]);

  return <div>Loading...</div>;
}
