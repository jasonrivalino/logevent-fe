// app/signin/page.tsx
'use client';

// dependency modules
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
// self-defined modules
import { ContactBoxShort } from '../signin/page';

export default function Review() {
  const router = useRouter();
  const [rating, setRating] = useState(0);

  // Effect to adjust placeholder size based on screen width
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
    // Handle form submission logic here
  };

  const handleBackClick = () => {
    router.push('/histori-pemesanan');
  };

  const handleStarClick = (index: number) => {
    setRating(index + 1);
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
          className="flex flex-col w-full max-w-3xl md:max-w-md p-6 md:p-8 shadow-lg rounded-lg bg-white"
        >
          <div className="text-center mb-4">
            <h2 className="text-3xl font-semibold text-pink-900 mb-2">Review</h2>
            <p className="text-sm text-gray-500">Feedback yang kamu berikan sangat berarti bagi kami😊</p>
          </div>
          <div className="flex justify-center mb-4">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`w-8 h-8 cursor-pointer ${
                    index < rating ? 'text-pink-600' : 'text-gray-200'
                  }`}
                  onClick={() => handleStarClick(index)}
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="topic" className="block text-base font-medium text-black">Topik Ulasan</label>
            <select
              id="topic"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white text-black border-gray-300 border-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option>Pilih topik</option>
              <option>Pelayanan</option>
              <option>Kualitas Produk</option>
              <option>Harga</option>
              <option>Lainnya</option>
            </select>
          </div>
          <div className="mb-6">
            <label htmlFor="review" className="block text-base font-medium text-black">Ceritakan ulasanmu disini</label>
            <textarea
              id="review"
              rows={4}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 border-2 rounded-md p-2 text-black"
              placeholder="Ceritakan ulasanmu disini"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-pink-800 text-white py-2 rounded-md hover:bg-pink-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            Submit
          </button>
        </form>
      </div>
      <ContactBoxShort />
    </div>
  );
}