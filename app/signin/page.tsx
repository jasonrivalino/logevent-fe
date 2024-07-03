'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from Next.js for routing

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // Initialize useRouter for navigation

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Username:', username);
    console.log('Password:', password);
  };

  const handleGoogleLogin = () => {
    // Handle Google login logic
    console.log('Login with Google');
  };

  const handleFacebookLogin = () => {
    // Handle Facebook login logic
    console.log('Login with Facebook');
  };

  const handleBackClick = () => {
    router.push('/'); // Navigate to home page
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Back button in the top right corner */}
      <button 
        onClick={handleBackClick} 
        className="absolute top-4 left-4 p-2 rounded bg-gray-200 hover:bg-gray-300 text-black"
      >
        Back
      </button>

      <div className="flex-grow flex flex-col justify-center items-center p-8 font-sofia">
        <form 
          onSubmit={handleSubmit} 
          className="flex flex-col w-full max-w-3xl md:max-w-md p-6 md:p-8 shadow-lg rounded-lg bg-white"
        >
          <h2 className="mb-5 md:mb-6 text-2xl md:text-3xl text-center text-gray-800">Sign In Menu</h2>
          <p className="mb-1 md:mb-2 text-gray-800">Username</p>
          <input
            type="text"
            id="username"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
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
            className="mb-4 p-1 md:p-2 rounded border border-gray-300 text-black"
          />
          <p className="text-gray-800 text-sm mb-4">
            Not have an account yet? <a onClick={() => router.push('/signup')} className="text-blue-500 cursor-pointer">Sign Up</a> first
          </p>
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
            <button 
              type="button" 
              onClick={handleFacebookLogin} 
              className="p-2 rounded-full bg-blue-600 text-white flex items-center justify-center"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" className="fill-current">
                <path d="M22.675 0h-21.35C.599 0 0 .599 0 1.325v21.351C0 23.401.599 24 1.325 24H12.82v-9.294H9.692V11.41h3.127V8.789c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.462.099 2.793.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.764v2.314h3.587l-.467 3.296H16.56V24h6.115c.725 0 1.325-.599 1.325-1.324V1.325C24 .599 23.401 0 22.675 0z" />
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
        <Image src="/Image/logo.png" alt="Logevent Logo" width={60} height={60} className='cursor-pointer'/>
        <p className="mt-6 md:mt-2 font-sofia">Jangan khawatir pusing nyari vendor, Logevent solusinya</p>
      </div>
    </footer>
  );
}