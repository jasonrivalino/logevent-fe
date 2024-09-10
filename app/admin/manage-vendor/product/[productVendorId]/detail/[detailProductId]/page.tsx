// app/admin/manage-vendor/product/[productVendorId]/detail/[detailProductId]/page.tsx
'use client';

// dependency modules
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
// self-defined modules
import { Navbar, ContactBox } from '@/app/page';
import { CommandLeft } from '@/app/admin/commandLeft';
import { readAlbumsByProductId } from '@/app/utils/albumApi';
import { convertDate, getRateText, getStars } from '@/app/utils/helpers';
import { readReviewsByProductId } from '@/app/utils/reviewApi';
import { readProductById } from '@/app/utils/productApi';
import { Album, Product, Review } from '@/app/utils/types';

export default function ProductDetail() {
  const descriptionRef = useRef(null);
  const reviewsRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const [product, setProduct] = useState<Product | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = pathname.split('/').pop();
        if (id) {
          const product = await readProductById(parseInt(id));
          const albums = await readAlbumsByProductId(parseInt(id));
          const reviews = await readReviewsByProductId(parseInt(id));

          reviews.sort((a: Review, b: Review) => new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime());
          reviews.splice(3);

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

  const handleBackClick = () => {
    router.push(`/admin/manage-vendor/product/${product?.vendorId}`);
  }

  return (
    <div>
        <Navbar />
            <div className="min-h-screen flex flex-col px-6 mt-24">
                <div className="flex flex-col md:flex-row flex-grow">
                <div className="hidden md:block">
                    <CommandLeft />
                </div>
                <div className="flex-grow ml-0 md:ml-7 mt-1 font-sofia bg-white rounded-xl p-5">
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
                  {/* Breadcrumb Navigation */}
                  <div className="hidden md:flex items-center mb-4">
                    <div className="flex items-center">
                      <a onClick={() => router.push('/admin/manage-vendor')} className="text-pink-600 font-semibold font-sofia cursor-pointer">Kelola Vendor</a>
                      <span className="mx-2 text-gray-600 font-sofia font-semibold"> {'>'} </span>
                      <a onClick={() => router.push('/admin/manage-vendor/product')} className="text-pink-600 font-semibold font-sofia cursor-pointer">Kelola Produk</a>
                      <span className="mx-2 text-gray-600 font-sofia font-semibold"> {'>'} </span>
                      <p className="text-gray-600 font-sofia font-semibold">Info Detail Produk</p>
                    </div>
                  </div>
                  {product && <ProductImage product={product} albums={albums} />}
                  <Tabs scrollToSection={scrollToSection} refs={{ descriptionRef, reviewsRef }} />
                  {product && <div ref={descriptionRef}><Description product={product} /></div>}
                  {product && <div ref={reviewsRef}><Reviews product={product} reviews={reviews} /></div>}
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

const ProductImage = ({ product, albums }: { product: Product; albums: Album[] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const timeoutRef = useRef<null | NodeJS.Timeout>(null);
  const windowWidth = useWindowWidth();

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const images = [{ albumImage: product.productImage }, ...albums];
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
    <div className="mr-2 md:mr-0 mt-2 md:-mt-4">
      {windowWidth >= 768 ? (
        <div className="py-4">
          <div className="flex md:space-x-4">
            <img src={product.productImage || "/Image/planetarium.jpg"} alt="Main Hall" className="w-full md:w-1/2 h-auto md:h-[21rem] rounded-md" />
            <div className="grid grid-cols-2 gap-4 w-0 md:w-1/2">
              {albums.map((album, index) => (
                <img key={index} src={album.albumImage || "/Image/planetarium.jpg"} alt={`Hall Image ${index + 1}`} className="w-0 md:w-full h-auto md:h-40 rounded-md" />
              ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row space-x-4">
            <div className="w-full md:w-1/2">
              <h1 className="text-2xl md:text-3xl text-pink-900 font-bold mt-4">{product.name}</h1>
              <p className="text-sm md:text-base text-gray-600">{product.specification}</p>
              <p className="text-sm md:text-base text-gray-600">
                {product.capacity ? 'Kapasitas: ' + product.capacity + ' Orang' : "Paket Event ini tidak memiliki kapasitas"}
              </p>
              <p className="text-base md:text-lg text-gray-800 font-extrabold">Rp{product.price.toLocaleString('id-ID')} {getRateText(product.rate)}</p>
              <div className="text-sm md:text-base flex items-center space-x-2 text-gray-600">
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
          </div>
        </div>
      ) : (
        <div className="pl-2 pb-4">
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
              <h1 className="text-2xl md:text-3xl text-pink-900 font-bold mt-4">{product.name}</h1>
              <p className="text-sm md:text-base text-gray-600">{product.specification}</p>
              {product.capacity && (
                <p className="text-sm md:text-base text-gray-600">
                  Kapasitas: {product.capacity} Orang
                </p>
              )}
              <p className="text-base md:text-lg text-gray-800 font-extrabold">Rp{product.price.toLocaleString('id-ID')} {getRateText(product.rate)}</p>
              <div className="text-sm md:text-base flex flex-col md:flex-row text-gray-600">
                <span>{product.vendorAddress}</span>
                <div className="flex flex-row items-center space-x-2">
                  <div className="flex items-center">
                    {getStars(product.rating)}
                    <span> ({product.rating && product.rating.toFixed(2) !== "0.00" ? product.rating.toFixed(2) : "N/A"})</span>
                  </div>
                  <span>|</span>
                  <span>{product.reviewCount} reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function Tabs({ scrollToSection, refs }: { scrollToSection: (ref: React.RefObject<any>) => void; refs: { descriptionRef: React.RefObject<any>; reviewsRef: React.RefObject<any> } }) {
  return (
    <nav className="flex justify-center space-x-8 mt-2 md:mt-0 py-2 md:pb-5 border-b">
      <button onClick={() => scrollToSection(refs.descriptionRef)} className="text-gray-600 hover:text-pink-500">Description</button>
      <button onClick={() => scrollToSection(refs.reviewsRef)} className="text-gray-600 hover:text-pink-500">Reviews</button>
    </nav>
  );
}

function Description({ product }: { product: Product }) {
  return (
    <div className="px-2 md:pr-2 pb-8 md:py-14 border-b">
      <h2 className="text-2xl md:text-3xl font-bold text-pink-900 pt-10">Description</h2>
      <p className="text-gray-600 mt-4 text-sm md:text-base">
        {product.description || 'Product Description'}
      </p>
    </div>
  );
}

function Reviews({ product, reviews }: { product: Product; reviews: Review[] }) {
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
    <div className="mt-4 px-2 pb-8 md:py-14">
      <div className="flex items-center justify-between space-x-4">
        <h2 className="text-2xl md:text-3xl font-bold text-pink-900 pt-10">Reviews</h2>
        <button
          className="text-sm md:text-base bg-pink-600 text-white px-2 md:px-4 py-1 md:py-2 rounded-lg -mb-10 md:-mb-8"
          onClick={() => router.push(`/list-penilaian/logistik-vendor/${product.id}`)}
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