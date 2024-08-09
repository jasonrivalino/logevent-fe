// app/isi-pemesanan/page.tsx
'use client';

// dependency modules
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// self-defined modules
import { Navbar } from '@/app/page';
import { ContactBoxShort } from '@/app/signin/page';
import { readUserProfile } from '@/app/utils/authApi';
import { readActiveProductCartByUserId, updateCart } from '@/app/utils/cartApi';
import { areDatesOverlapping, getExcludedDates } from '@/app/utils/helpers';
import { readOrderAvailabilityByCartId, createOrder } from '@/app/utils/orderApi';

export default function ReservationFill() {
  const router = useRouter();
  const [cartId, setCartId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ name?: string, phone?: string; address?: string, startDate?: string; endDate?: string }>({});

  const handleBackClick = () => {
    router.push('/wishlist');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: { name?: string, phone?: string, address?: string, startDate?: string, endDate?: string } = {};

    if (!name) {
      newErrors.name = 'Nama tidak boleh kosong';
    }
    if (!phone) {
      newErrors.phone = 'Nomor telepon tidak boleh kosong';
    }
    if (!address) {
      newErrors.address = 'Alamat tidak boleh kosong';
    }
    if (!startDate) {
      newErrors.startDate = 'Tanggal mulai tidak boleh kosong';
    }
    if (!endDate) {
      newErrors.endDate = 'Tanggal akhir tidak boleh kosong';
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.endDate = 'Tanggal akhir harus setelah tanggal mulai';
    }

    const bookedDateObjects = bookedDates.map(dateStr => new Date(dateStr));
    if (startDate && endDate && areDatesOverlapping(startDate, endDate, bookedDateObjects)) {
      newErrors.startDate = 'Tanggal yang dipilih termasuk dalam tanggal yang sudah dipesan';
      newErrors.endDate = 'Tanggal yang dipilih termasuk dalam tanggal yang sudah dipesan';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (!cartId) {
        throw new Error('User ID is missing');
      }
      if (!name) {
        throw new Error('Name is missing');
      }
      if (!phone) {
        throw new Error('Phone number is missing');
      }
      if (!address) {
        throw new Error('Address is missing');
      }
      if (!startDate) {
        throw new Error('Start date is missing');
      }
      if (!endDate) {
        throw new Error('End date is missing');
      }

      const orderData = {
        cartId,
        name,
        phone,
        address,
        notes: notes || null,
        startDate,
        endDate
      };
      const cartData = {
        cartStatus: 'Checked Out'
      };

      await createOrder(orderData);
      await updateCart(cartId, cartData);
      router.push('/isi-pemesanan/complete');
    } catch (error: any) {
      console.error('Failed to create order:', error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/signin');
          return;
        }

        const user = await readUserProfile(token);
        const cart = await readActiveProductCartByUserId(user.id);
        if (!cart) {
          router.push('/wishlist');
          return;
        }

        const bookedDates = await readOrderAvailabilityByCartId(cart.id);
        setCartId(cart.id);
        setBookedDates(bookedDates);
      } catch (error: any) {
        console.error('Failed to fetch user data:', error.message);
        localStorage.removeItem('token');
        Cookies.remove('token');
      }
    }

    fetchData();
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
            <h2 className="mb-4 md:mb-8 text-2xl md:text-3xl text-center text-gray-800">Isi Data Pemesanan</h2>
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-3 md:mb-4">
                <div className="flex flex-1 flex-row -mb-2 md:mb-0">
                  <div className="flex flex-col">
                    <label htmlFor="name" className="mt-1 text-sm md:text-base text-gray-800 mr-[4.42rem] md:mr-2">Nama:</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className="input-placeholder border border-gray-300 rounded-md p-1 md:p-[0.4rem] text-black text-xs md:text-sm md:mr-[3rem] w-[8.1rem] md:w-auto"
                      placeholder="Isi nama pemesan"
                      value={name || ''}
                      onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.name}</p>}
                  </div>    
                </div>
                <div className="flex flex-1 flex-row">
                  <div className="flex flex-col">
                    <label htmlFor="phone" className="mt-1 text-sm md:text-base text-gray-800 mr-9 md:mr-5">No. Telepon:</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="input-placeholder border border-gray-300 rounded-md p-1 md:p-[0.4rem] text-black text-xs md:text-sm w-[8.1rem] md:w-[8.8rem]"
                      placeholder="Isi nomor telepon"
                      value={phone || ''}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    {errors.phone && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>
            <div className="flex flex-col mb-1 md:mb-4">
              <label htmlFor="address" className="mb-1 md:mb-2 text-sm md:text-base text-gray-800">Masukkan Alamat:</label>
              <textarea
                id="address"
                name="address"
                className="input-placeholder border border-gray-300 rounded-md p-2 md:p-3 text-black text-xs md:text-sm"
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your address"
              />
              {errors.address && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.address}</p>}
            </div>
            <div className="flex flex-row gap-4 md:gap-6 mb-4">
              <div className="flex-1 md:mr-9">
                <label htmlFor="startDate" className="text-sm md:text-base text-gray-800 mb-1 md:mb-2 mr-3">Mulai Acara:</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date: Date | null) => setStartDate(date)}
                  className="input-placeholder border border-gray-300 rounded-md p-1 md:p-[0.4rem] text-black mt-1 text-xs md:text-sm w-28 md:w-36"
                  placeholderText="Select start date"
                  excludeDates={getExcludedDates(bookedDates)}
                />
                {errors.startDate && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.startDate}</p>}
              </div>
              <div className="flex-1">
                <label htmlFor="endDate" className="mb-4 text-sm md:text-base text-gray-800 mr-3">Selesai Acara:</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date: Date | null) => setEndDate(date)}
                  className="input-placeholder border border-gray-300 rounded-md p-1 md:p-[0.4rem] text-black mt-1 text-xs md:text-sm w-28 md:w-36"
                  placeholderText="Select end date"
                  excludeDates={getExcludedDates(bookedDates)}
                />
                {errors.endDate && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.endDate}</p>}
              </div>
            </div>
            <div className="flex flex-col mb-1 md:mb-4">
              <label htmlFor="notes" className="mb-1 md:mb-2 text-sm md:text-base text-gray-800">Catatan untuk Vendor:</label>
              <textarea
                id="notes"
                name="notes"
                className="input-placeholder border border-gray-300 rounded-md p-2 md:p-3 text-black text-xs md:text-sm"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter your notes"
              />
            </div>
            <button type="submit" className="mt-2 p-2 md:p-2 rounded bg-pink-800 hover:bg-pink-900 text-white">Submit</button>
          </form>
        </div>
      </div>
      <ContactBoxShort />
    </div>
  );
}