// app/signup/page.tsx
'use client';

// dependency modules
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
// self-defined modules
import { ContactBoxShort } from '@/app/signin/page';
import { readUserProfile, signUp, updateUser } from '@/app/utils/authApi';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
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

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = new URLSearchParams(window.location.search).get('token');
      if (token) {
        try {
          const user = await readUserProfile(token);
          setFullName(user.name);
          setEmail(user.email);
        } catch (error: any) {
          setError(error.message);
        }
      }
    };

    fetchUserProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = new URLSearchParams(window.location.search).get('token');
      if (token) {
        await updateUser(token, { password, phone: phoneNumber, isVerified: true });
        localStorage.setItem('token', token);
        router.push('/');
      } else {
        await signUp(email, password, fullName, phoneNumber);
        router.push('/signin');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleBackClick = () => {
    router.push('/signin');
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Back button with SVG arrow */}
      <button 
        onClick={handleBackClick} 
        className="absolute top-4 left-4 p-2 rounded-full bg-white text-black shadow-lg flex items-center justify-center w-10 h-10 md:w-12 md:h-12 hover:bg-gray-100"
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

      <div className="flex-grow flex flex-col justify-center items-center p-8 font-sofia">
        <form 
          onSubmit={handleSubmit} 
          className="flex flex-col w-full max-w-full md:max-w-xl p-6 md:p-8 shadow-lg rounded-lg bg-white"
        >
          <h2 className="mb-6 md:mb-8 text-2xl md:text-3xl text-center text-gray-800">Sign Up Menu</h2>
          {error && <p className="mb-4 text-red-500 text-center">{error}</p>}
          
          {/* Email and Password */}
          <div className="flex flex-col md:flex-row gap-2 md:gap-6 mb-2 md:mb-4">
            <div className="flex-1">
              <label htmlFor="email" className="mb-1 md:mb-2 text-sm md:text-base text-gray-800">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-1 md:mt-2 px-1 md:p-2 rounded border border-gray-300 text-black input-placeholder placeholder:text-xs text-sm md:text-base"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="password" className="mb-1 md:mb-2 text-sm md:text-base text-gray-800">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full mt-1 md:mt-2 px-1 md:p-2 rounded border border-gray-300 text-black input-placeholder placeholder:text-xs text-sm md:text-base"
              />
            </div>
          </div>          

          {/* Full Name and Phone Number */}
          <div className="flex flex-col md:flex-row gap-2 md:gap-6 mb-2 md:mb-4">
            <div className="flex-1">
              <label htmlFor="fullName" className="mb-1 md:mb-2 text-sm md:text-base text-gray-800">Nama Lengkap</label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                placeholder="Nama Lengkap"
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full mt-1 md:mt-2 px-1 md:p-2 rounded border border-gray-300 text-black input-placeholder placeholder:text-xs text-sm md:text-base"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="phoneNumber" className="mb-1 md:mb-2 text-sm md:text-base text-gray-800">Nomor Telepon</label>
              <input
                type="text"
                id="phoneNumber"
                value={phoneNumber}
                placeholder="Nomor Telepon"
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="w-full mt-1 md:mt-2 px-1 md:p-2 rounded border border-gray-300 text-black input-placeholder placeholder:text-xs text-sm md:text-base"
              />
            </div>
          </div>

          {/* Sign Up Button */}
          <button type="submit" className="mt-6 md:mt-4 mb-4 md:mb-6 p-1 md:p-2 rounded bg-pink-800 hover:bg-pink-900 text-white">Sign Up</button>
        </form>
      </div>
      <ContactBoxShort/>
    </div>
  );
}