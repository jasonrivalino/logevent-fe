// app/login/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, googleLogin } from '../utils/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await signIn(email, password);
      if (response.token) {
        localStorage.setItem('token', response.token);
        router.push('/dashboard');
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

  const handleGoogleLogin = () => {
    googleLogin();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex flex-col justify-center items-center p-4 md:p-6 font-sofia">
        <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-3xl md:max-w-md p-8 shadow-lg rounded-lg bg-white">
          <h2 className="mb-6 text-2xl md:text-3xl text-center text-gray-800">Sign In Menu</h2>
          <p className="mb-2 text-gray-800">Email</p>
          <input
            type="email"
            id="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mb-2 md:mb-4 p-1 md:p-2 rounded border border-gray-300 text-black"
          />
          <label htmlFor="password" className="mb-1 md:mb-2 text-gray-800">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mb-8 p-1 md:p-2 rounded border border-gray-300 text-black"
          />
          <button type="submit" className="mb-4 md:mb-6 p-1 md:p-2 rounded bg-blue-500 text-white">Login</button>
          <p className="text-center text-gray-800 mb-2">or login with</p>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="p-2 rounded-full bg-red-600 text-white flex items-center justify-center"
            >
              <svg width="20" height="20" viewBox="0 0 48 48" className="fill-current">
                <path d="M44.5 20H24v8.5h11.8c-1.6 4.3-5.5 7.5-11.8 7.5-7.4 0-13.5-6.1-13.5-13.5S16.6 8 24 8c3.1 0 5.9 1.1 8.1 3L38.4 5C34.7 1.8 29.7 0 24 0 10.8 0 0 10.8 0 24s10.8 24 24 24c12.9 0 23.6-9.4 23.6-24 0-1.5-.1-3-.3-4.5z" />
              </svg>
            </button>
          </div>
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
        <div className="text-4xl font-bold">logevent</div>
        <p className="mt-6 md:mt-2 font-sofia">Jangan khawatir pusing nyari vendor, Logevent solusinya</p>
      </div>
    </footer>
  );
}
