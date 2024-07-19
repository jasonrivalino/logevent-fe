// app/isi-pemesanan/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Navbar } from '@/app/page';
import { useAuth } from '@/app/hooks/useAuth';
import { ContactBoxShort } from '@/app/signin/page';
import { readUserProfile } from '@/app/utils/authApi';

export default function ReservationFill() {
  useAuth();

  const router = useRouter();
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [address, setAddress] = useState<string>('');
  const [errors, setErrors] = useState<{ address?: string; startDate?: string; endDate?: string }>({});

  const handleBackClick = () => {
    router.push('/info-detail');
  };

  const isDateBooked = (date: Date) => {
    const bookedDates = [
      new Date(2024, 6, 20),
      new Date(2024, 6, 21),
      new Date(2024, 6, 22),
    ];
    return bookedDates.some(bookedDate => bookedDate.toDateString() === date.toDateString());
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let formValid = true;
    const newErrors: { address?: string; startDate?: string; endDate?: string } = {};

    if (!address) {
      formValid = false;
      newErrors.address = 'Alamat tidak boleh kosong';
    }

    if (!startDate) {
      formValid = false;
      newErrors.startDate = 'Tanggal mulai tidak boleh kosong';
    }

    if (!endDate) {
      formValid = false;
      newErrors.endDate = 'Tanggal akhir tidak boleh kosong';
    }

    if (formValid) {
      // Handle form submission logic
      router.push('/reset-password');
    } else {
      setErrors(newErrors);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const user = await readUserProfile(token);
          setName(user.name);
          setEmail(user.email);
          setPhone(user.phone);
        } catch (error: any) {
          console.error('Failed to fetch user data:', error.message);
          localStorage.removeItem('token');
        }
      }
    };

    fetchUserProfile();
  }, []);

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

  const isMediumScreen = typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches;
  console.log('isMediumScreen', isMediumScreen);

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      <Navbar />
      <div className="flex-grow flex flex-col justify-center items-center font-sofia mt-[4rem] overflow-auto">
        <button 
          onClick={handleBackClick} 
          className="absolute top-20 left-4 p-2 rounded-full bg-white text-black shadow-lg flex items-center justify-center w-10 h-10 md:w-12 md:h-12 hover:bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6 text-gray-700"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex-grow flex flex-col justify-center items-center p-4 md:p-8 font-sofia w-full max-w-xs md:max-w-2xl">
          <form className="flex flex-col w-full p-6 shadow-lg rounded-lg bg-white" onSubmit={handleSubmit}>
            <h2 className="mb-6 text-2xl md:text-3xl text-center text-gray-800">Isi Data Pemesanan</h2>
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-4">
                <div className="flex flex-1 flex-col">
                  <label htmlFor="name" className="mb-1 text-sm md:text-base text-gray-800">Nama:</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="input-placeholder border bg-gray-200 border-gray-300 rounded-md p-[0.4rem] text-gray-500 text-xs md:text-sm w-40 mr-[0.95rem]"
                    value={name || ''}
                    disabled
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <label htmlFor="email" className="mb-1 text-sm md:text-base text-gray-800">Email:</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="input-placeholder border bg-gray-200 border-gray-300 rounded-md p-[0.4rem] text-gray-500 text-xs md:text-sm w-40 mr-[0.95rem]"
                    value={email || ''}
                    disabled
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <label htmlFor="phone" className="mb-1 text-sm md:text-base text-gray-800">No. Telepon:</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="input-placeholder border bg-gray-200 border-gray-300 rounded-md p-[0.4rem] text-gray-500 text-xs md:text-sm w-40"
                    value={phone || ''}
                    disabled
                  />
                </div>
              </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="address" className="mb-2 text-sm md:text-base text-gray-800">Masukkan Alamat:</label>
              <textarea
                id="address"
                name="address"
                className="input-placeholder border border-gray-300 rounded-md p-2 md:p-3 text-black text-xs md:text-sm"
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your address"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>
            <div className="flex flex-row gap-4 md:gap-6 mb-4">
              <div className="flex-1 mr-9">
                <label htmlFor="startDate" className="text-sm md:text-base text-gray-800 mr-3">Mulai Acara:</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date: Date | null) => setStartDate(date)}
                  className="input-placeholder border border-gray-300 rounded-md p-1 md:p-[0.4rem] text-black mt-1 text-xs md:text-sm w-36"
                  placeholderText="Select start date"
                  excludeDates={[new Date(2024, 6, 20), new Date(2024, 6, 21), new Date(2024, 6, 22)]}
                />
                {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
              </div>
              <div className="flex-1">
                <label htmlFor="endDate" className="mb-4 text-sm md:text-base text-gray-800 mr-3">Selesai Acara:</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date: Date | null) => setEndDate(date)}
                  className="input-placeholder border border-gray-300 rounded-md p-1 md:p-[0.4rem] text-black mt-1 text-xs md:text-sm w-36"
                  placeholderText="Select end date"
                  excludeDates={[new Date(2024, 6, 20), new Date(2024, 6, 21), new Date(2024, 6, 22)]}
                />
                {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
              </div>
            </div>
            <button type="submit" className="mt-2 p-2 md:p-3 rounded bg-pink-800 hover:bg-pink-900 text-white">Submit</button>
          </form>
        </div>
      </div>
      <ContactBoxShort />
    </div>
  );
}