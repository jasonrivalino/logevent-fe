// app\list-penilaian\logistik-vendor\[id]\page.tsx
'use client';

// dependency modules
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
// self-defined modules
import { Navbar } from '@/app/page';
import { convertDate } from '@/app/utils/helpers';
import { readProductById } from '@/app/utils/productApi';
import { readReviewsByProductId } from '@/app/utils/reviewApi';
import { Product, Review } from '@/app/utils/types';

export default function ReviewPage() {
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const reviewsPerPage = 10;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = pathname.split('/').pop();
        if (id) {
          const product = await readProductById(parseInt(id));
          const reviews = await readReviewsByProductId(parseInt(id));

          reviews.sort((a: Review, b: Review) => new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime());

          setProduct(product);
          setReviews(reviews);
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    };
    
    fetchData();
  }, [pathname]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  if (!product) {
    return null;
  }

  return (
    <div className="max-w-8xl mx-auto px-6 py-12 md:p-16">
      <Navbar />
      <div className='text-black font-sofia bg-white rounded-lg mt-14 p-6 md:p-8'>
        <h1 className="text-2xl md:text-3xl font-bold text-pink-900 mb-5 text-center md:text-left">Penilaian & Ulasan</h1>
        <div className="mb-12">
          <h2 className="text-lg md:text-xl font-semibold">{product.name}</h2>
          <p className="text-sm md:text-base">{product.vendorName}</p>
          <p className="text-sm md:text-base">{product.vendorAddress}</p>
          <div className="flex flex-col md:flex-row md:w-auto mt-2">
            <div className="flex items-center border-2 border-pink-600 p-1 md:p-2 mt-2 md:mt-4 w-1/3 md:w-auto">
              <span className="text-2xl md:text-4xl font-bold">
                {product.rating && product.rating.toFixed(2) !== "0.00" ? product.rating.toFixed(2) : "N/A"}
              </span>
              <span className="text-base md:text-xl">/5.0</span>
            </div>
            <span className="ml-0 md:ml-5 mt-2 md:mt-8 text-sm md:text-base">{product.reviewCount} rating diberikan</span>
          </div>
        </div>
        {currentReviews.map((review, index) => (
          <div key={index} className="flex items-start mb-10 max-w-8xl">
            <img src={review.userPicture || "https://via.placeholder.com/50"} alt="User profile" className="w-8 md:w-12 h-8 md:h-12 bg-gray-200 rounded-full mr-4" />
            <div className="flex-1">
              <h3 className="font-bold">{review.userName}</h3>
              <p className="text-xs md:text-sm text-gray-600">{review.tag}</p>
              <p className="text-xs md:text-sm text-gray-600">{convertDate(review.reviewDate)}</p>
              <div className="flex items-center mb-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 fill-current ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-6.16 3.25 1.18-6.89-5-4.87 6.9-1 3.08-6.24 3.08 6.24 6.9 1-5 4.87 1.18 6.89z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm mt-4">{review.comment}</p>
            </div>
          </div>
        ))}
        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        )}
      </div>
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (page: number) => void }) {
  const getPages = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex justify-center mt-8">
      <button
        className="px-1 md:px-2 py-1 md:py-2 mx-1 bg-black text-gray-300 rounded-full"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      {getPages().map((page, index) =>
        typeof page === 'number' ? (
          <button
            key={index}
            className={`px-2 md:px-4 py-1 md:py-2 mx-1 ${page === currentPage ? 'bg-pink-600 text-white' : 'bg-white text-black'} rounded-full`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="px-4 py-2 mx-1 text-black">
            {page}
          </span>
        )
      )}
      <button
        className="px-1 md:px-2 py-1 md:py-2 mx-1 bg-black text-gray-300 rounded-full"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}