'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle signup logic here
    console.log('Full Name:', fullName);
    console.log('Phone Number:', phoneNumber);
    console.log('Email:', email);
    console.log('Address:', address);
    console.log('Password:', password);

    // You might want to make an API call here to register the user
    // For example:
    // const response = await fetch('/api/signup', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ fullName, phoneNumber, email, address, password }),
    // });

    // if (response.ok) {
    //   router.push('/login'); // Navigate to login page after successful signup
    // }
  };

  const handleBackClick = () => {
    router.push('/'); // Navigate to home page
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Back button in the top left corner */}
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
          
          {/* Full Name and Phone Number in the same line */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-2 md:mb-4">
            <div className="flex-1">
              <label htmlFor="fullName" className="mb-3 md:mb-2 text-gray-800">Nama Lengkap</label>
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
              <label htmlFor="phoneNumber" className="mb-3 md:mb-2 text-gray-800">Nomor Telepon</label>
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

          {/* Email and Password in the same line */}
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

          {/* Address as a longer single line */}
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
      <ContactBoxLogin />
    </div>
  );
}

function ContactBoxLogin() {
    return (
      <footer className="w-full bg-pink-900 text-white py-4">
        <div className="container mx-auto flex flex-col items-center text-center">
          <Image src="/Image/logo.png" alt="Logevent Logo" width={60} height={60} className='cursor-pointer'/>
          <p className="mt-6 md:mt-2 font-sofia">Jangan khawatir pusing nyari vendor, Logevent solusinya</p>
        </div>
      </footer>
    );
}