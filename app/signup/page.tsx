'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from '../utils/api';

export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await signUp(fullName, email, password);
      console.log('Sign-up successful:', response);
      router.push('/signin');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleBackClick = () => {
    router.push('/signin');
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <button 
        onClick={handleBackClick} 
        className="absolute top-4 left-4 p-2 rounded bg-gray-200 hover:bg-gray-300 text-black"
      >
        Back
      </button>

      <div className="flex-grow flex flex-col justify-center items-center p-8 font-sofia">
        <form 
          onSubmit={handleSubmit} 
          className="flex flex-col w-full max-w-full md:max-w-xl p-6 md:p-8 shadow-lg rounded-lg bg-white"
        >
          <h2 className="mb-6 md:mb-8 text-2xl md:text-3xl text-center text-gray-800">Sign Up Menu</h2>
          {error && <p className="mb-4 text-red-500 text-center">{error}</p>}
          
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-2 md:mb-4">
            <div className="flex-1">
              <label htmlFor="fullName" className="mb-1 md:mb-2 text-gray-800">Nama Lengkap</label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                placeholder="Nama Lengkap"
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full mt-2 p-1 md:p-2 rounded border border-gray-300 text-black"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="phoneNumber" className="mb-1 md:mb-2 text-gray-800">Nomor Telepon</label>
              <input
                type="text"
                id="phoneNumber"
                value={phoneNumber}
                placeholder="Nomor Telepon"
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="w-full mt-2 p-1 md:p-2 rounded border border-gray-300 text-black"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-2 md:mb-4">
            <div className="flex-1">
              <label htmlFor="email" className="mb-1 md:mb-2 text-gray-800">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-2 p-1 md:p-2 rounded border border-gray-300 text-black"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="password" className="mb-1 md:mb-2 text-gray-800">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full mt-2 p-1 md:p-2 rounded border border-gray-300 text-black"
              />
            </div>
          </div>

          <div className="mb-2 md:mb-4">
            <label htmlFor="address" className="mb-1 md:mb-2 text-gray-800">Alamat</label>
            <input
              type="text"
              id="address"
              value={address}
              placeholder="Alamat"
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full mt-2 p-1 md:p-2 rounded border border-gray-300 text-black"
            />
          </div>

          <button type="submit" className="mt-4 mb-4 md:mb-6 p-1 md:p-2 rounded bg-blue-500 text-white">Sign Up</button>
        </form>
      </div>
      <ContactBoxSignIn />
    </div>
  );
}

function ContactBoxSignIn() {
    return (
      <footer className="w-full bg-pink-900 text-white py-4">
        <div className="container mx-auto flex flex-col items-center text-center">
          <Image src="/Image/logo.png" alt="Logevent Logo" width={60} height={60} className='cursor-pointer'/>
          <p className="mt-6 md:mt-2 font-sofia">Jangan khawatir pusing nyari vendor, Logevent solusinya</p>
        </div>
      </footer>
    );
}