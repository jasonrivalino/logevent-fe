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
  const descriptionRef = useRef(null);
  const albumRef = useRef(null);
  const reviewsRef = useRef(null);
  const pathname = usePathname();
  const [product, setProduct] = useState<Product | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const scrollToSection = (ref: { current: { offsetTop: number; }; }) => {
    var offset = 20; // Adjust this value for the desired offset
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      offset = 45;
    }

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
        {product && <ProductImage product={product} albums={albums} />}
        <Tabs scrollToSection={scrollToSection} refs={{ descriptionRef, albumRef, reviewsRef }} />
        {product && <div ref={descriptionRef}><Description product={product} /></div>}
        {product && <div ref={albumRef}><ImageGallery albums={albums} /></div>}
        {product && <div ref={reviewsRef}><Reviews reviews={reviews} /></div>}
      </div>
      <ContactBox />
    </div>
  );
}

const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowWidth;
};

function ProductImage({ product, albums }: { product: Product, albums: Album[] }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const timeoutRef = useRef<null | NodeJS.Timeout>(null);
  const windowWidth = useWindowWidth();
  const productUrl = typeof window !== 'undefined' ? window.location.href : '';
  const [copied, setCopied] = useState(false);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setCurrentImageIndex((prevIndex) =>
          prevIndex === albums.length - 1 ? 0 : prevIndex + 1
        ),
      2000
    );

    return () => {
      resetTimeout();
    };
  }, [currentImageIndex]);

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
      {windowWidth >= 768 ? (
        <div className="py-4">
          <div className="flex space-x-4">
            <img src={product.productImage || "/Image/planetarium.jpg"} alt="Main Hall" className="w-full md:w-1/2 h-auto md:h-[21rem] rounded-md" />
            {/* TODO: INTEGRATE ALBUM */}
            <div className="grid grid-cols-2 gap-4 w-0 md:w-1/2">
              {albums.slice(1).map((album, index) => (
                <img key={index} src={album.albumImage || "/Image/planetarium.jpg"} alt={`Hall Image ${index + 1}`} className="w-0 md:w-full h-auto md:h-40 rounded-md" />
              ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row space-x-4">
            <div className="w-full md:w-1/2">
              <h1 className="text-2xl md:text-3xl text-pink-900 font-bold mt-4">{product.name}</h1>
              <p className="text-sm md:text-base text-gray-600">{product.specification}</p>
              {/* TODO: INTEGRATE CAPACITY */}
              <p className="text-sm md:text-base text-gray-600">Kapasitas: 1000 Orang</p>
              <p className="text-sm md:text-base text-gray-600">Rp {product.price} / hari</p>
              <div className="text-sm md:text-base flex items-center space-x-2 text-gray-600">
                <span>{product.vendorAddress}</span>
                <div className="flex items-center">
                  {getStars(product.rating)}
                  <span> ({product.rating && product.rating.toFixed(2) !== "0.00" ? product.rating.toFixed(2) : "N/A"})</span>
                </div>
                <span>|</span>
                <span>{product.reviewCount} reviews</span>
              </div>
            </div>
            <div className="flex space-x-4 w-full md:w-1/2 md:justify-end items-center mt-3 md:mt-0">
              <button className="bg-pink-500 text-white rounded-lg px-3 md:px-4 py-2 -ml-4 md:ml-0 mr-[6.5rem] md:mr-0 text-sm md:text-base">Tambahkan Vendor</button>
              <button onClick={handleChat} className="text-pink-500 flex flex-col items-center text-sm md:text-base">
                {/* SVG icon for chat button */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m-2 9a9 9 0 110-18 9 9 0 010 18z"/>
                </svg>
                Chat
              </button>
              <button onClick={handleShare} className="text-pink-500 flex flex-col items-center text-sm md:text-base">
                <svg className="w-5 md:w-6 h-5 md:h-6 md:mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 8a3 3 0 00-2.24-2.93 5 5 0 10-5.52 0A3 3 0 005 8v1h10V8zM5 11h10v1a4 4 0 01-4 4H9a4 4 0 01-4-4v-1zm5-9a4 4 0 014 4v1H6V6a4 4 0 014-4z" />
                </svg>
                Share
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="md:px-8 py-4">
          <div className="flex md:space-x-4">
            <img
              src={albums[currentImageIndex].albumImage || "/Image/planetarium.jpg"}
              alt="Main Hall"
              className="w-full md:w-1/2 h-44 rounded-md"
            />
            <div className="grid grid-cols-2 gap-4 w-0 md:w-1/2">
              {albums.map((album, index) => (
                <img
                  key={index}
                  src={album.albumImage || "/Image/planetarium.jpg"}
                  alt={`Hall Image ${index + 1}`}
                  className="w-0 md:w-full h-auto rounded-md"
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row space-x-4">
            <div className="w-full md:w-1/2">
              <h1 className="text-2xl md:text-3xl text-pink-900 font-bold mt-4">Gedung Sabuga ITB</h1>
              <p className="text-sm md:text-base text-gray-600">Multifunctional Hall</p>
              <p className="text-sm md:text-base text-gray-600">Kapasitas: 1000 Orang</p>
              <p className="text-sm md:text-base text-gray-600">Rp 5.000.000 / hari</p>
              <div className="text-sm md:text-base flex items-center space-x-2 text-gray-600">
                <span>Dago, Bandung</span>
                <span>|</span>
                <span>⭐ 4.2 (190 reviews)</span>
              </div>
            </div>
            <div className="flex space-x-4 w-full md:w-1/2 md:justify-end items-center mt-3 md:mt-0">
              <button className="bg-pink-500 text-white rounded-lg px-3 md:px-4 py-2 -ml-4 md:ml-0 mr-[6.5rem] md:mr-0 text-sm md:text-base">Chat vendor</button>
              <button className="text-pink-500 flex flex-col items-center text-sm md:text-base">
                <svg className="w-5 md:w-6 h-5 md:h-6 md:mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 8a3 3 0 00-2.24-2.93 5 5 0 10-5.52 0A3 3 0 005 8v1h10V8zM5 11h10v1a4 4 0 01-4 4H9a4 4 0 01-4-4v-1zm5-9a4 4 0 014 4v1H6V6a4 4 0 014-4z" />
                </svg>
                {copied ? 'Link Copied!' : 'Share'}
              </button>
              <button className="text-pink-500 flex flex-col items-center text-sm md:text-base">
                <svg className="w-5 md:w-6 h-5 md:h-6 md:mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.343l-6.828-6.828a4 4 0 010-5.656z" />
                </svg>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function Tabs({ scrollToSection, refs }: { scrollToSection: (ref: React.RefObject<any>) => void; refs: { descriptionRef: React.RefObject<any>; albumRef: React.RefObject<any>; reviewsRef: React.RefObject<any> } }) {
  return (
    <nav className="flex justify-center space-x-8 mt-2 md:mt-0 py-2 border-b">
      <button onClick={() => scrollToSection(refs.descriptionRef)} className="text-gray-600 hover:text-pink-500">Description</button>
      <button onClick={() => scrollToSection(refs.albumRef)} className="text-gray-600 hover:text-pink-500">Album</button>
      <button onClick={() => scrollToSection(refs.reviewsRef)} className="text-gray-600 hover:text-pink-500">Reviews</button>
    </nav>
  );
}

function Description({ product }: { product: Product }) {
  return (
    <div className="px-8 pb-8 md:py-14 border-b">
      <h2 className="text-2xl md:text-3xl font-bold text-pink-900 pt-10">Description</h2>
      <p className="text-gray-600 mt-4 text-sm md:text-base">
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
    <section className="px-8 pb-8 md:py-14 border-b">
      <h2 className="text-2xl md:text-3xl font-bold text-pink-900 pt-10">Album</h2>
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
    <div className="mt-4 px-8 pb-8 md:py-14">
      <div className="flex items-center justify-between space-x-4">
        <h2 className="text-2xl md:text-3xl font-bold text-pink-900 pt-10">Reviews</h2>
        <button className="bg-pink-600 text-white px-4 py-2 rounded-lg -mb-8">Lihat Review lengkap</button>
      </div>
      <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8 mt-6">
        {reviews.map((review, index) => (
          <div key={index} className="border border-gray-400 rounded-lg p-4 w-full md:w-1/3">
            <div className="flex items-center space-x-4">
              <img src={review.userPicture || "https://via.placeholder.com/50"} alt="User profile" className="w-12 h-12 rounded-full" />
              <div>
                <h3 className="text-lg md:text-xl text-gray-600 font-bold">{review.userName}</h3>
                <div className="flex items-center">
                  {getStars(review.reviewRating)}
                  <span> ({review.reviewRating})</span>
                </div>
                <p className="text-gray-600 text-sm md:text-base">{convertDate(review.reviewDate)}</p>
              </div>
            </div>
            <p className="text-gray-600 mt-2 text-xs md:text-base">
              {review.reviewComment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}