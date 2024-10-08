// app/reset-password/page.tsx
'use client';

// dependency modules
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
// self-defined modules
import { ContactBoxShort } from '@/app/signin/page';
import { updateUser } from '@/app/utils/authApi';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPopup, setShowPopup] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setShowPopup(true);
    } else {
      try {
        const token = new URLSearchParams(window.location.search).get('token');
        if (!token) {
          throw new Error('Invalid Token');
        }
        await updateUser(token, { password });
        router.push('/signin');
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="flex-grow flex flex-col justify-center items-center p-8 font-sofia">
        <form 
          onSubmit={handleSubmit} 
          className="flex flex-col w-full max-w-full md:max-w-sm p-6 md:p-8 shadow-lg rounded-lg bg-white"
        >
          <h2 className="mb-6 md:mb-8 text-2xl md:text-3xl text-center text-gray-800">Reset your Password</h2>
          {error && <p className="mb-4 text-red-500 text-center">{error}</p>}
          <div className="flex flex-col md:flex-row gap-2 md:gap-6 mb-2 md:mb-4">
            <div className="flex-1">
              <label htmlFor="password" className="mb-1 md:mb-2 text-sm md:text-base text-gray-800">Enter your new Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full mt-1 md:mt-2 px-1 md:p-2 rounded border border-gray-300 text-black input-placeholder placeholder:text-xs"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-2 md:gap-6 mb-2 md:mb-4">
            <div className="flex-1">
              <label htmlFor="confirmPassword" className="mb-1 md:mb-2 text-sm md:text-base text-gray-800">Confirm your new Password:</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                placeholder="Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full mt-1 md:mt-2 px-1 md:p-2 rounded border border-gray-300 text-black input-placeholder placeholder:text-xs"
              />
            </div>
          </div>
          <button type="submit" className="mt-6 md:mt-4 mb-4 md:mb-6 p-1 md:p-2 rounded bg-pink-800 hover:bg-pink-900 text-white">Reset</button>
        </form>
      </div>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-3 md:p-6 rounded shadow-lg text-center">
            <h3 className="text-lg font-bold mb-4 text-black">Error</h3>
            <p className="mb-4 text-black text-sm md:text-base">Passwords do not match. Please try again.</p>
            <button
              onClick={closePopup}
              className="px-4 py-1 md:py-2 bg-pink-800 hover:bg-pink-900 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <ContactBoxShort />
    </div>
  );
}