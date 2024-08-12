// app/admin/manage-event-package/detail/[detailEventId]/page.tsx
'use client';

// dependency modules
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
// self-defined modules
import { Navbar, ContactBox } from '@/app/page';
import { CommandLeft } from '@/app/admin/commandLeft';
import { readAlbumsByEventId } from '@/app/utils/albumApi';
import { readBundlesByEventId } from '@/app/utils/bundleApi';
import { readEventById } from '@/app/utils/eventApi';
import { convertDate, getStars } from '@/app/utils/helpers';
import { readProductById } from '@/app/utils/productApi';
import { readReviewsByEventId } from '@/app/utils/reviewApi';
import { Album, Event, Product, Review } from '@/app/utils/types';

export default function ProductDetail() {
  const descriptionRef = useRef(null);
  const vendorListRef = useRef(null);
  const reviewsRef = useRef(null);
  const pathname = usePathname();
  const [event, setEvent] = useState<Event | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

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
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      }
    };
  
    fetchData();
  }, [pathname]);

  const scrollToSection = (ref: { current: { offsetTop: number; }; }) => {
    var offset = 20;
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      offset = 45;
    }

    window.scrollTo({
      top: ref.current.offsetTop - offset,
      behavior: 'smooth',
    });
  };

  const router = useRouter();
  const handleBackClick = () => {
      router.push('/admin/manage-event-package');
  };

  return (
    <div>
        <Navbar />
            <div className="min-h-screen flex flex-col px-6 mt-24">
                <div className="flex flex-col md:flex-row flex-grow">
                  <div className="md:hidden flex justify-center items-center">
                        {/* Back button with SVG arrow */}
                        <button 
                            onClick={handleBackClick} 
                            className="absolute top-20 left-4 p-2 rounded-full bg-white text-black shadow-lg flex items-center justify-center w-10 h-10 md:w-12 md:h-12 hover:bg-gray-100"
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
                    </div>
                <div className="hidden md:block">
                    <CommandLeft />
                </div>
                <div className="flex-grow ml-0 md:ml-7 mt-1 font-sofia bg-white rounded-xl p-5">
                    {/* Breadcrumb Navigation */}
                    <div className="hidden md:flex items-center mb-4">
                      <div className="flex items-center">
                        <a onClick={() => router.push('/admin/manage-event-package')} className="text-pink-600 font-semibold font-sofia cursor-pointer">Kelola Paket</a>
                        <span className="mx-2 text-gray-600 font-sofia font-semibold"> {'>'} </span>
                        <p className="text-gray-600 font-sofia font-semibold">Info Detail Paket</p>
                      </div>
                    </div>
                    {event && <EventImage event={event} albums={albums} />}
                    <Tabs scrollToSection={scrollToSection} refs={{ descriptionRef, vendorListRef, reviewsRef }} />
                    {event && <div ref={descriptionRef}><Description event={event} /></div>}
                    {event && <div ref={vendorListRef}><ProductList products={products} /></div>}
                    {event && <div ref={reviewsRef}><Reviews event={event} reviews={reviews} /></div>}
                </div>
            </div>
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
  
const EventImage = ({ event, albums }: { event: Event; albums: Album[]; }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const timeoutRef = useRef<null | NodeJS.Timeout>(null);
  const windowWidth = useWindowWidth();

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const images = [{ albumImage: event.eventImage }, ...albums];
  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setCurrentImageIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        ),
      2000
    );

    return () => {
      resetTimeout();
    };
  }, [currentImageIndex, images.length]);

  return (
    <div className="mt-2 md:-mt-4">
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
          </div>
        </div>
      ) : (
        <div className="md:px-8 pb-4">
          <div className="flex md:space-x-4">
            <img
              src={images[currentImageIndex].albumImage || "/Image/planetarium.jpg"}
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
          </div>
        </div>
      )}
    </div>
  );
};
  
  function Tabs({ scrollToSection, refs }: { scrollToSection: (ref: React.RefObject<any>) => void; refs: { descriptionRef: React.RefObject<any>; vendorListRef: React.RefObject<any>; reviewsRef: React.RefObject<any>; }; }) {
    return (
      <nav className="flex justify-center space-x-4 md:space-x-8 mt-2 md:mt-0 py-2 md:pb-5 border-b text-sm md:text-base">
        <button onClick={() => scrollToSection(refs.descriptionRef)} className="text-gray-600 hover:text-pink-500">Description</button>
        <button onClick={() => scrollToSection(refs.vendorListRef)} className="text-gray-600 hover:text-pink-500">Bundle Logistik</button>
        <button onClick={() => scrollToSection(refs.reviewsRef)} className="text-gray-600 hover:text-pink-500">Reviews</button>
      </nav>
    );
  }
  
  function Description({ event }: { event: Event; }) {
    return (
      <div className="px-0 md:px-2 pb-8 md:py-14 border-b">
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
    <section className="px-0 md:px-2 py-12 md:pb-16 border-b">
      <h2 className="text-2xl md:text-3xl font-bold text-pink-900 md:pt-5 mb-6">Bundle Logistik</h2>
      {windowWidth >= 768 ? (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {products.map((product, index) => (
            <div key={index} className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col justify-between">
              <Image
                src={product.productImage || "/Image/planetarium.jpg"}
                alt={`${product.name} Image`}
                width={400}
                height={200}
                className="object-cover h-20 md:h-28"
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
    <div className="mt-4 px-0 md:px-2 pb-8 md:py-14">
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