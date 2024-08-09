// app/paket-event/info-detail/[id]/page.tsx
'use client';

// dependency modules
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
// self-defined modules
import { Navbar, ContactBox } from '@/app/page';
import { readAlbumsByEventId } from '@/app/utils/albumApi';
import { readUserProfile } from '@/app/utils/authApi';
import { readBundlesByEventId } from '@/app/utils/bundleApi';
import { readEventById } from '@/app/utils/eventApi';
import { convertDate, generateWhatsAppUrl, getStars } from '@/app/utils/helpers';
import { readProductById } from '@/app/utils/productApi';
import { readReviewsByEventId } from '@/app/utils/reviewApi';
import { readEventWishlistsByUserId, createWishlist, deleteWishlist } from '@/app/utils/wishlistApi';
import type { Album, Event, Product, Review } from '@/app/utils/types';

export default function Event() {
  const descriptionRef = useRef(null);
  const vendorListRef = useRef(null);
  const reviewsRef = useRef(null);
  const pathname = usePathname();
  const [event, setEvent] = useState<Event | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isWishlist, setIsWishlist] = useState(false);

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
          const event = await readEventById(parseInt(id));
          const albums = await readAlbumsByEventId(parseInt(id));
          const bundles = await readBundlesByEventId(parseInt(id));
          const reviews = await readReviewsByEventId(parseInt(id));

          reviews.sort((a: Review, b: Review) => new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime());
          reviews.splice(3);
          
          setEvent(event);
          setAlbums(albums);
          setReviews(reviews);

          const products: Product[] = [];
          for (const bundle of bundles) {
            const product = await readProductById(bundle.productId);
            products.push(product);
          }
          setProducts(products);

          const token = localStorage.getItem('token');
          if (!token) {
            return;
          }

          const user = await readUserProfile(token);
          const userId = user.id;
          const wishlists = await readEventWishlistsByUserId(userId);
          const isWishlist = wishlists.some((wishlist: { eventId: number; }) => wishlist.eventId === event.id);

          setIsWishlist(isWishlist);
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
      <div className="container mx-auto mt-24 md:px-20 -mb-6 md:mb-0">
        {event && <EventImage event={event} albums={albums} isWishlist={isWishlist} setIsWishlist={setIsWishlist} />}
        <Tabs scrollToSection={scrollToSection} refs={{ descriptionRef, vendorListRef, reviewsRef }} />
        {event && <div ref={descriptionRef}><Description event={event} /></div>}
        {event && <div ref={vendorListRef}><ProductList products={products} /></div>}
        {event && <div ref={reviewsRef}><Reviews event={event} reviews={reviews} /></div>}
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

const EventImage = ({ event, albums, isWishlist, setIsWishlist }: { event: Event, albums: Album[], isWishlist: boolean, setIsWishlist: (isWishlist: boolean) => void }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const timeoutRef = useRef<null | NodeJS.Timeout>(null);
  const windowWidth = useWindowWidth();
  const eventUrl = typeof window !== 'undefined' ? window.location.href : '';
  const [copied, setCopied] = useState(false);
  const router = useRouter();

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
          url: eventUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(eventUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy the text to clipboard:', error);
      }
    }
  };

  const handleChat = () => {
    const adminNumber = process.env.NEXT_PUBLIC_ADMIN_NUMBER;
    window.open(generateWhatsAppUrl(adminNumber || ""), '_blank', 'noopener,noreferrer');
  };

  const handleClickWishlist = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/signin');
        return;
      }

      const user = await readUserProfile(token);
      const userId = user.id;
      const wishlists = await readEventWishlistsByUserId(userId);
      const wishlist = wishlists.find((wishlist: { eventId: number; }) => wishlist.eventId === event.id);

      if (isWishlist) {
        await deleteWishlist(wishlist.id);
      } else if (!isWishlist) {
        await createWishlist(userId, event.id, null);
      }

      setIsWishlist(!isWishlist);
    } catch (error) {
      console.error('Failed to edit wishlist:', error);
    }
  };

  return (
    <div className="px-8 py-4">
      {windowWidth >= 768 ? (
        <div className="py-4">
          <div className="flex md:space-x-4">
            <img src={event.eventImage || "/Image/planetarium.jpg"} alt="Main Hall" className="w-full md:w-1/2 h-auto md:h-[21rem] rounded-md" />
            <div className="grid grid-cols-2 gap-4 w-0 md:w-1/2">
              {albums.map((album, index) => (
                <img key={index} src={album.albumImage || "/Image/planetarium.jpg"} alt={`Hall Image ${index + 1}`} className="w-0 md:w-full h-auto md:h-40 rounded-md" />
              ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row space-x-4">
            <div className="w-full md:w-1/2">
              <h1 className="text-2xl md:text-3xl text-pink-900 font-bold mt-4">{event.name}</h1>
              <p className="text-sm md:text-base text-gray-600">
                {event.capacity ? 'Kapasitas: ' + event.capacity + ' Orang' : "Paket Event ini tidak memiliki kapasitas"}
              </p>
              <p className="text-base md:text-lg text-gray-800 font-extrabold">Rp{event.price.toLocaleString('id-ID')}</p>
              <div className="text-sm md:text-base flex items-center space-x-2 text-gray-600">
                <div className="flex items-center">
                  {getStars(event.rating)}
                  <span> ({event.rating && event.rating.toFixed(2) !== "0.00" ? event.rating.toFixed(2) : "N/A"})</span>
                </div>
                <span>|</span>
                <span>{event.reviewCount} reviews</span>
              </div>
            </div>
            <div className="flex space-x-4 w-full md:w-1/2 md:justify-end items-center mt-3 md:mt-0">
              <button
                className="bg-white hover:bg-pink-100 text-pink-500 border-pink-500 border-2 rounded-lg px-3 md:px-4 py-2 -ml-4 md:ml-0 mr-[6.5rem] md:mr-0 text-sm md:text-base"
                onClick={handleClickWishlist}
              >
                {isWishlist ? "Hapus dari Wishlist" : "Tambah ke Wishlist"}
              </button>
              {/* TODO: Order Popup */}
              <button
                className="bg-pink-500 hover:bg-pink-600 text-white rounded-lg px-3 md:px-4 py-2 -ml-4 md:ml-0 mr-[6.5rem] md:mr-0 text-sm md:text-base"
                onClick={() => router.push('/isi-pemesanan')}
              >
                Pesan Langsung
              </button>
              <button onClick={handleChat} className="text-pink-500 flex flex-col items-center text-sm md:text-base">
                <img src="/Image/IconButton/chat_button.png" alt="Whatsapp" className="w-5 md:w-6 h-5 md:h-6" />
                Chat
              </button>
              <button onClick={handleShare} className="text-pink-500 flex flex-col items-center text-sm md:text-base">
                <img src="/Image/IconButton/share_button.png" alt="Whatsapp" className="w-5 md:w-6 h-5 md:h-6" />
                {copied ? 'Link Copied!' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="md:px-8 pb-4">
          <div className="flex md:space-x-4">
            {albums.length > 0 ? (
              <img
                src={albums[currentImageIndex].albumImage || "/Image/planetarium.jpg"}
                alt="Main Hall"
                className="w-full md:w-1/2 h-44 rounded-md"
              />
            ) : (
              <img
                src={event.eventImage || "/Image/planetarium.jpg"}
                alt="Main Hall"
                className="w-full md:w-1/2 h-44 rounded-md"
              />
            )}
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
              <h1 className="text-2xl md:text-3xl text-pink-900 font-bold mt-4">{event.name}</h1>
              <p className="text-sm md:text-base text-gray-600">
                {event.capacity ? 'Kapasitas: ' + event.capacity + ' Orang' : "Paket Event ini tidak memiliki kapasitas"}
              </p>
              <p className="text-base md:text-lg text-gray-800 font-extrabold">Rp{event.price.toLocaleString('id-ID')}</p>
              <div className="text-sm md:text-base flex items-center space-x-2 text-gray-600">
                <div className="flex items-center">
                  {getStars(event.rating)}
                  <span> ({event.rating && event.rating.toFixed(2) !== "0.00" ? event.rating.toFixed(2) : "N/A"})</span>
                </div>
                <span>|</span>
                <span>{event.reviewCount} reviews</span>
              </div>
            </div>
            <div className="flex space-x-4 w-full md:w-1/2 md:justify-end items-center mt-1 md:mt-0">
              <div className="flex flex-col md:flex-row md:space-x-0 md:space-y-4 md:items-center mr-[5.5rem]">
                {/* TODO: Order Popup */}
                <button
                  className="bg-pink-500 text-white rounded-lg px-2 md:px-4 py-[0.35rem] md:py-2 mt-2 text-sm md:text-base -ml-4"
                  onClick={() => router.push('/isi-pemesanan')}
                >
                  Pesan Langsung
                </button>
                <button 
                  className="bg-white text-pink-500 border-pink-500 border-2 rounded-lg md:px-4 py-1 md:py-2 -ml-4 md:ml-0 md:mr-0 text-sm md:text-base mt-2"
                  onClick={handleClickWishlist}
                >
                  {isWishlist ? "Hapus dari Wishlist" : "Tambah ke Wishlist"}
                </button>
              </div>
              <div className="flex flex-row space-x-4 mt-3">
                <button onClick={handleChat} className="text-pink-500 flex flex-col items-center text-sm md:text-base">
                  <img src="/Image/IconButton/chat_button.png" alt="Whatsapp" className="w-5 md:w-6 h-5 md:h-6" />
                  Chat
                </button>
                <button onClick={handleShare} className="text-pink-500 flex flex-col items-center text-sm md:text-base">
                  <img src="/Image/IconButton/share_button.png" alt="Whatsapp" className="w-5 md:w-6 h-5 md:h-6" />
                  {copied ? 'Link Copied!' : 'Share'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function Tabs({ scrollToSection, refs }: { scrollToSection: (ref: React.RefObject<any>) => void; refs: { descriptionRef: React.RefObject<any>; vendorListRef: React.RefObject<any>; reviewsRef: React.RefObject<any>; }; }) {
  return (
    <nav className="flex justify-center space-x-4 md:space-x-8 mt-2 md:mt-0 py-2 border-b text-sm md:text-base">
      <button onClick={() => scrollToSection(refs.descriptionRef)} className="text-gray-600 hover:text-pink-500">Description</button>
      <button onClick={() => scrollToSection(refs.vendorListRef)} className="text-gray-600 hover:text-pink-500">Bundle Logistik</button>
      <button onClick={() => scrollToSection(refs.reviewsRef)} className="text-gray-600 hover:text-pink-500">Reviews</button>
    </nav>
  );
}

function Description({ event }: { event: Event; }) {
  return (
    <div className="px-8 pb-8 md:py-14 border-b">
      <h2 className="text-2xl md:text-3xl font-bold text-pink-900 pt-10">Description</h2>
      <p className="text-gray-600 mt-4 text-sm md:text-base">
        {event.description || 'Product Description'}
      </p>
    </div>
  );
}

function ProductList({ products }: { products: Product[]; }) {
  const router = useRouter();
  const windowWidth = useWindowWidth();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(2);

  const totalItems = products.length;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(4);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + itemsPerPage) % totalItems);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - itemsPerPage + totalItems) % totalItems);
  };

  const displayedProducts = () => {
    const display = [];
    for (let i = 0; i < itemsPerPage; i++) {
      const index = (currentIndex + i) % totalItems;
      display.push(products[index]);
    }
    return display;
  };

  return (
    <section className="px-8 py-12 md:pb-16 border-b">
      <h2 className="text-2xl md:text-3xl font-bold text-pink-900 md:pt-5 mb-6">Bundle Logistik</h2>
      {windowWidth >= 768 ? (
        <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
          {products.map((product, index) => (
            <div key={index} className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col justify-between">
              <Image
                src={product.productImage || "/Image/planetarium.jpg"}
                alt={`${product.name} Image`}
                width={400}
                height={200}
                className="object-cover"
              />
              <div className="p-3 md:p-3 font-sofia flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-sm md:text-base text-pink-900 font-bold mb-2">{product.name}</h3>
                  <p className="text-xs md:text-sm text-gray-700">{product.specification}</p>
                  <p className="text-xs md:text-sm text-gray-500 flex flex-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 md:h-4 w-3 md:w-4 text-yellow-500 mr-[0.3rem] mt-[0.075rem] md:mt-[0.05rem]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.14 3.51a1 1 0 00.95.69h3.7c.967 0 1.372 1.24.588 1.81l-2.992 2.179a1 1 0 00-.364 1.118l1.14 3.51c.3.921-.755 1.688-1.54 1.118l-2.992-2.178a1 1 0 00-1.175 0l-2.992 2.178c-.785.57-1.84-.197-1.54-1.118l1.14-3.51a1 1 0 00-.364-1.118L2.93 8.937c-.784-.57-.38-1.81.588-1.81h3.7a1 1 0 00.95-.69l1.14-3.51z" />
                    </svg> {product.rating && product.rating.toFixed(2) !== "0.00" ? product.rating.toFixed(2) : "N/A"}
                  </p>
                  <p className="text-xs md:text-sm text-gray-500">{product.vendorAddress}</p>
                </div>
                <button className="self-start text-xs md:text-base text-pink-500 hover:text-pink-700 font-bold mt-4"
                  onClick={() => router.push(`/logistik-vendor/info-detail/${product.id}`)}
                >
                  Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative">
          <div className="grid grid-cols-2 gap-4 px-4">
            {displayedProducts().map((product, index) => (
              <div key={index} className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col justify-between">
                <Image
                  src={product.productImage || "/Image/planetarium.jpg"}
                  alt={`${product.name} Image`}
                  width={400}
                  height={200}
                  className="object-cover"
                />
                <div className="p-3 md:p-3 font-sofia flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-sm md:text-base text-pink-900 font-bold md:mb-2">{product.name}</h3>
                    <p className="text-xs md:text-sm text-gray-700">{product.specification}</p>
                    <p className="text-xs md:text-sm text-gray-500 flex flex-row">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 md:h-4 w-3 md:w-4 text-yellow-500 mr-[0.3rem] mt-[0.075rem] md:mt-[0.05rem]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.14 3.51a1 1 0 00.95.69h3.7c.967 0 1.372 1.24.588 1.81l-2.992 2.179a1 1 0 00-.364 1.118l1.14 3.51c.3.921-.755 1.688-1.54 1.118l-2.992-2.178a1 1 0 00-1.175 0l-2.992 2.178c-.785.57-1.84-.197-1.54-1.118l1.14-3.51a1 1 0 00-.364-1.118L2.93 8.937c-.784-.57-.38-1.81.588-1.81h3.7a1 1 0 00.95-.69l1.14-3.51z" />
                      </svg> {product.rating && product.rating.toFixed(2) !== "0.00" ? product.rating.toFixed(2) : "N/A"}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500">{product.vendorAddress}</p>
                  </div>
                  <button className="self-start text-xs md:text-base text-pink-500 hover:text-pink-700 font-bold mt-4"
                    onClick={() => router.push(`/logistik-vendor/info-detail/${product.id}`)}
                  >
                    Lihat Detail
                  </button>
                </div>
              </div>
            ))}
          <button 
            className="absolute left-0 top-12 px-1 md:px-3 py-1 md:py-2 bg-pink-600 text-white rounded-full shadow-lg hover:shadow-2xl focus:outline-none"
            onClick={handlePrev}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            className="absolute right-0 top-12 px-1 md:px-3 py-1 md:py-2 bg-pink-600 text-white rounded-full shadow-lg hover:shadow-2xl focus:outline-none"
            onClick={handleNext}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          </div>
        </div>
      )}
    </section>
  );
}

function Reviews({ event, reviews }: { event: Event, reviews: Review[] }) {
  const router = useRouter();

  if (reviews.length === 0) {
    return (
      <div className="px-8 py-14 border-b">
        <h2 className="text-3xl font-bold text-pink-900 pt-10">Reviews</h2>
        <p className="text-gray-700 mt-6">Tidak ada review yang tersedia</p>
      </div>
    );
  }

  return (
    <div className="mt-4 px-8 pb-8 md:py-14">
      <div className="flex items-center justify-between space-x-4">
        <h2 className="text-2xl md:text-3xl font-bold text-pink-900 pt-10">Reviews</h2>
        <button
          className="text-sm md:text-base bg-pink-600 text-white px-2 md:px-4 py-1 md:py-2 rounded-lg -mb-10 md:-mb-8"
          onClick={() => router.push(`/list-penilaian/paket-event/${event.id}`)}
        >
          Lihat Review lengkap
        </button>
      </div>
      <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8 mt-6">
        {reviews.map((review, index) => (
          <div key={index} className="border border-gray-400 rounded-lg p-4 w-full md:w-1/3">
            <div className="flex items-center space-x-4">
              <img src={review.userPicture || "https://via.placeholder.com/50"} alt="User profile" className="w-12 h-12 rounded-full" />
              <div>
                <h3 className="text-lg md:text-xl text-gray-600 font-bold">{review.userName}</h3>
                <p className="text-gray-600 text-sm md:text-base">{review.tag}</p>
                <p className="text-gray-600 text-sm md:text-base">{convertDate(review.reviewDate)}</p>
                <div className="flex items-center">
                  {getStars(review.rating)}
                  <span> ({review.rating})</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 mt-2 text-xs md:text-base">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}