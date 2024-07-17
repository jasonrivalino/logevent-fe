'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Navbar, ContactBox } from '@/app/page';
import { usePathname } from 'next/navigation';
import { readAlbumByProductId } from '@/app/utils/albumApi';
import { readProductById } from '@/app/utils/productApi';
import { readReviewByProductId } from '@/app/utils/itemApi';
import { convertDate, getStars } from '@/app/utils/helpers';
import type { Album, Product, Review } from '@/app/utils/types';

export default function Product() {
  const homeRef = useRef(null);
  const albumRef = useRef(null);
  const reviewsRef = useRef(null);
  const pathname = usePathname();
  const [product, setProduct] = useState<Product | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const scrollToSection = (ref: { current: { offsetTop: number; }; }) => {
    const offset = 20; // Adjust this value for the desired offset

    window.scrollTo({
      top: ref.current.offsetTop - offset,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = pathname.split('/').pop();
        if (id) {
          const product = await readProductById(parseInt(id));
          const albums = await readAlbumByProductId(parseInt(id));
          const reviews = await readReviewByProductId(parseInt(id));
          setProduct(product);
          setAlbums(albums);
          setReviews(reviews);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      }
    };

    fetchData();
  }, [pathname]);

  return (
    <div className="font-sofia">
      <Navbar />
      <div className="container mx-auto mt-24 px-20">
        {product && <ProductImage product={product} />}
        <Tabs scrollToSection={scrollToSection} refs={{ homeRef, albumRef, reviewsRef }} />
        {product && <div ref={homeRef}><Home product={product} /></div>}
        {product && <div ref={albumRef}><ImageGallery albums={albums} /></div>}
        {product && <div ref={reviewsRef}><Reviews reviews={reviews} /></div>}
      </div>
      <ContactBox />
    </div>
  );
}

function ProductImage({ product }: { product: Product }) {
  const productUrl = typeof window !== 'undefined' ? window.location.href : '';
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: productUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(productUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy the text to clipboard:', error);
      }
    }
  };

  const handleChat = () => {
    const adminNumber = process.env.NEXT_PUBLIC_ADMIN_NUMBER;
    const whatsappUrl = `https://wa.me/${adminNumber}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="px-8 py-4">
      <div className="flex space-x-4">
        <img src={product.productImage || "/Image/planetarium.jpg"} alt="Main Hall" className="w-1/2 h-auto rounded-md" />
        {/* TODO: MAKE PRODUCT IMAGE SINGULAR */}
        {/* <div className="grid grid-cols-2 gap-4 w-1/2">
          <img src="/Image/planetarium.jpg" alt="Hall Image" className="w-full h-auto rounded-md" />
          <img src="/Image/planetarium.jpg" alt="Hall Image" className="w-full h-auto rounded-md" />
          <img src="/Image/planetarium.jpg" alt="Hall Image" className="w-full h-auto rounded-md" />
          <img src="/Image/planetarium.jpg" alt="Hall Image" className="w-full h-auto rounded-md" />
        </div> */}
      </div>
      <div className="flex space-x-4">
        <div className="w-1/2">
          <h1 className="text-3xl text-pink-900 font-bold mt-4">{product.name}</h1>
          <p className="text-base text-gray-600">{product.specification}</p>
          {/* TODO: INTEGRATE CAPACITY */}
          {/* <p className="text-base text-gray-600">Kapasitas: 1000 Orang</p> */}
          <p className="text-base text-gray-600">Rp {product.price} / hari</p>
          <div className="flex items-center space-x-2 text-gray-600">
            <span>{product.vendorAddress}</span>
            <span>|</span>
            <div className="flex items-center">
              {getStars(product.rating)}
              <span> ({product.rating && product.rating.toFixed(2) !== "0.00" ? product.rating.toFixed(2) : "N/A"})</span>
            </div>
            <span>|</span>
            <span>{product.reviewCount} reviews</span>
          </div>
        </div>
        <div className="flex space-x-4 w-1/2 justify-end items-center">
          <button onClick={handleChat} className="bg-pink-500 text-white rounded-lg px-4 py-2">Chat Admin</button>
          <button onClick={handleShare} className="text-pink-500 flex flex-col items-center">
            <svg className="w-6 h-6 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 8a3 3 0 00-2.24-2.93 5 5 0 10-5.52 0A3 3 0 005 8v1h10V8zM5 11h10v1a4 4 0 01-4 4H9a4 4 0 01-4-4v-1zm5-9a4 4 0 014 4v1H6V6a4 4 0 014-4z" />
            </svg>
            {copied ? 'Link Copied!' : 'Share'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Tabs({ scrollToSection, refs }: { scrollToSection: (ref: React.RefObject<any>) => void; refs: { homeRef: React.RefObject<any>; albumRef: React.RefObject<any>; reviewsRef: React.RefObject<any> } }) {
  return (
    <nav className="flex justify-center space-x-8 py-4 border-b">
      <button onClick={() => scrollToSection(refs.homeRef)} className="text-gray-600 hover:text-pink-500">Home</button>
      <button onClick={() => scrollToSection(refs.albumRef)} className="text-gray-600 hover:text-pink-500">Album</button>
      <button onClick={() => scrollToSection(refs.reviewsRef)} className="text-gray-600 hover:text-pink-500">Reviews</button>
    </nav>
  );
}

function Home({ product }: { product: Product }) {
  return (
    <div className="px-8 py-14 border-b">
      <h2 className="text-3xl font-bold text-pink-900 pt-10">Home</h2>
      <p className="text-gray-600 mt-4">
        {product.description || 'Product Description'}
      </p>
    </div>
  );
}

function ImageGallery({ albums }: { albums: Album[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  const totalItems = albums.length;
  if (totalItems < itemsPerPage) {
    setItemsPerPage(totalItems);
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1);
      } else {
        setItemsPerPage(4);
      }
    };

    window.addEventListener('resize', handleResize);

    // Set the initial value
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleNext = () => {
    if (totalItems > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + itemsPerPage) % totalItems);
    }
  };

  const handlePrev = () => {
    if (totalItems > 0) {
      setCurrentIndex((prevIndex) => (prevIndex - itemsPerPage + totalItems) % totalItems);
    }
  };

  const displayedImages = () => {
    const display = [];
    for (let i = 0; i < itemsPerPage; i++) {
      const index = (currentIndex + i) % totalItems;
      display.push(albums[index]);
    }
    return display;
  };

  if (totalItems === 0) {
    return (
      <section className="px-8 py-14 border-b">
        <h2 className="text-3xl font-bold text-pink-900 pt-10">Album</h2>
        <p className="text-gray-700 mt-6">No images available</p>
      </section>
    );
  }

  return (
    <section className="px-8 py-14 border-b">
      <h2 className="text-3xl font-bold text-pink-900 pt-10">Album</h2>
      <div className="relative flex items-center justify-center mt-6 mb-2">
        <div className="flex flex-wrap gap-10 justify-center mx-4">
          {displayedImages().map((album, index) => (
            <div key={index} className="w-[16.75rem] md:w-[17.5rem] bg-white shadow-lg rounded-3xl overflow-hidden relative">
              <Image
                src={album.albumImage || "https://via.placeholder.com/400x200"}
                alt={`Image`}
                width={400}
                height={200}
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <button 
          className="absolute left-0 px-1 md:px-3 py-1 md:py-2 bg-pink-600 text-white rounded-full shadow-lg hover:shadow-2xl focus:outline-none"
          onClick={handlePrev}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          className="absolute right-0 px-1 md:px-3 py-1 md:py-2 bg-pink-600 text-white rounded-full shadow-lg hover:shadow-2xl focus:outline-none"
          onClick={handleNext}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}

function Reviews({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <div className="px-8 py-14 border-b">
        <h2 className="text-3xl font-bold text-pink-900 pt-10">Reviews</h2>
        <p className="text-gray-700 mt-6">No reviews available</p>
      </div>
    );
  }

  return (
    <div className="mt-4 px-8 py-14">
      <h2 className="text-3xl font-bold text-pink-900 pt-10">Reviews</h2>
      <div className="flex items-center space-x-8 mt-6">
        {reviews.map((review, index) => (
          <div key={index} className="border border-gray-400 rounded-lg p-4 w-1/3">
            <div className="flex items-center space-x-4">
              <img src={review.userPicture || "https://via.placeholder.com/50"} alt="User profile" className="w-12 h-12 rounded-full" />
              <div>
                <h3 className="text-xl text-gray-600 font-bold">{review.userName}</h3>
                <div className="flex items-center">
                  {getStars(review.reviewRating)}
                  <span> ({review.reviewRating})</span>
                </div>
                <p className="text-gray-600">{convertDate(review.reviewDate)}</p>
              </div>
            </div>
            <p className="text-gray-600 mt-2">
              {review.reviewComment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}