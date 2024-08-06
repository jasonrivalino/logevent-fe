// app/isi-pemesanan/complete/page.tsx
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

  const handleOrderClick = () => {
    {/* TODO: Go To Wishlist */}
    router.push('/keranjang')
  }

  const handleMenuClick = () => {
    router.push('/');
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="flex-grow flex flex-col justify-center items-center p-8 font-sofia">
        <div className="flex flex-col items-center bg-white p-6 md:p-10 w-max max-w-72 md:max-w-sm">
          <Image src="/Image/IconButton/check_reservation.png" width={100} height={100} alt="Email" />
          <p className="text-center text-black mt-5">Terimakasih sudah  melakukan pemesanan, Silakan cek email Anda untuk melanjutkan pembayaran!</p>
          <button className="text-center text-pink-600 hover:text-pink-800 underline mt-5" onClick={handleOrderClick}>Lanjut Pemesanan Kembali</button>
          <button className="text-center text-pink-600 hover:text-pink-800 underline mt-2" onClick={handleMenuClick}>Kembali ke menu utama</button>
        </div>
      </div>
      <ContactBoxShort />
    </div>
  );
}