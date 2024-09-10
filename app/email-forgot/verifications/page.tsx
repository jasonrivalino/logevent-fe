// app/email-forgot/verifications/page.tsx
'use client';

// dependency modules
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
// self-defined modules
import { ContactBoxShort } from '@/app/signin/page';

export default function EmailRequest() {
  const router = useRouter();

  useEffect(() => {
    const updatePlaceholderSize = () => {
      const inputs = document.querySelectorAll('.input-placeholder');
      const isMediumScreen = window.matchMedia('(min-width: 768px)').matches;

      inputs.forEach(input => {
        if (isMediumScreen) {
          input.classList.remove('placeholder:text-xs');
          input.classList.add('placeholder:text-sm');
        } else {
          input.classList.remove('placeholder:text-sm');
          input.classList.add('placeholder:text-xs');
        }
      });
    };

    updatePlaceholderSize();
    window.addEventListener('resize', updatePlaceholderSize);

    return () => {
      window.removeEventListener('resize', updatePlaceholderSize);
    };
  }, []);

  const handleBackClick = () => {
    router.push('/signin');
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="flex-grow flex flex-col justify-center items-center p-8 font-sofia">
        <div className="flex flex-col items-center bg-white p-6 md:p-10 w-max max-w-72 md:max-w-sm">
          <Image src="/Image/IconButton/check_circle.png" width={100} height={100} alt="Email" />
          <p className="text-center text-black mt-5">Terimakasih telah mengaktivasi kembali akun Anda, Cek email Anda untuk langkah selanjutnya.</p>
          <button className="text-center text-pink-600 hover:text-pink-800 underline mt-5" onClick={handleBackClick}>Kembali ke halaman login</button>
        </div>
      </div>
      <ContactBoxShort />
    </div>
  );
}