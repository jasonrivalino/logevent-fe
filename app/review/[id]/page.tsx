// app/review/[id]/page.tsx
'use client';

// dependency modules
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
// self-defined modules
import { ContactBoxShort } from '@/app/signin/page';
import { readUserProfile } from '@/app/utils/authApi';
import { readCartsByUserId } from '@/app/utils/cartApi';
import { readItemById } from '@/app/utils/itemApi';
import { readReviewByItemId, createReview } from '@/app/utils/reviewApi';
import { Cart } from '@/app/utils/types';

export default function Review() {
  const router = useRouter();
  const pathname = usePathname();
  const [itemId, setItemId] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [tag, setTag] = useState('');

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = pathname.split('/').pop();
        const token = localStorage.getItem('token');

        if (!id) {
          throw new Error('Item ID not found');
        }

        if (!token) {
          throw new Error('User token not found');
        }

        const item = await readItemById(parseInt(id));
        const review = await readReviewByItemId(parseInt(id));
        const user = await readUserProfile(token);
        const carts = await readCartsByUserId(user.id);

        if (!item) {
          throw new Error('Item not found');
        }

        if (review) {
          throw new Error('Review already exists');
        }

        if (!carts) {
          throw new Error('Cart not found');
        }

        const cart = carts.find((cart: Cart) => cart.cartStatus === 'Checked Out');
        if (!cart) {
          throw new Error('Checkout cart not found');
        }
        
        setItemId(item.id);
      } catch (error) {
        console.error('Failed to fetch item:', error);
        router.push('/histori-pemesanan');
      }
    };
  
    fetchData();
  }, [pathname]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      if (!itemId) {
        throw new Error('Item ID not found');
      }

      if (!rating) {
        throw new Error('Rating is required');
      }

      const reviewData = {
        itemId,
        rating,
        comment: comment || null,
        tag: tag || null
      };

      await createReview(reviewData);
      router.push('/histori-pemesanan');
    } catch (error) {
      console.error('Failed to create review:', error);
    }
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
            <h2 className="text-2xl md:text-3xl font-semibold text-pink-900 mb-2">Review</h2>
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
                  className={`w-6 md:w-8 h-6 md:h-8 cursor-pointer ${
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
            <label htmlFor="topic" className="block font-medium text-black text-sm md:text-base">Topik Ulasan</label>
            <select
              id="topic"
              className="mt-1 block w-full pl-3 pr-10 py-1 md:py-2 text-xs md:text-base bg-white text-black border-gray-300 border-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={tag}
              onChange={e => setTag(e.target.value)}
            >
              <option value="">Pilih topik</option>
              <option value="Pelayanan">Pelayanan</option>
              <option value="Kualitas Produk">Kualitas Produk</option>
              <option value="Harga">Harga</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          <div className="mb-6">
            <label htmlFor="review" className="block font-medium text-black text-sm md:text-base">Ceritakan ulasanmu disini</label>
            <textarea
              id="review"
              rows={4}
              className="mt-1 block w-full shadow-sm text-xs md:text-base border-gray-300 border-2 rounded-md p-2 text-black"
              placeholder="Ceritakan ulasanmu disini"
              value={comment}
              onChange={e => setComment(e.target.value)}
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-pink-800 text-white py-1 md:py-2 rounded-md hover:bg-pink-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            Submit
          </button>
        </form>
      </div>
      <ContactBoxShort />
    </div>
  );
}