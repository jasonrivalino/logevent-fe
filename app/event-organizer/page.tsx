// app/event-organizer/page.tsx
'use client';

// dependency modules
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// self-defined modules
import { Navbar, ContactBox } from '@/app/page';
import { readUserProfile } from '@/app/utils/authApi';
import { readAlbumsByProductId } from '@/app/utils/albumApi';
import { readActiveEventOrganizerCartByUserId, createCart, updateCart } from '@/app/utils/cartApi';
import { areDatesOverlapping, convertDate, generateWhatsAppUrl, getExcludedDates, getStars } from '@/app/utils/helpers';
import { createItem, deleteItemsByCartId } from '@/app/utils/itemApi';
import { readOrderAvailabilityByCartId, createOrder, updateOrder } from '@/app/utils/orderApi';
import { readProductById } from '@/app/utils/productApi';
import { readReviewsByProductId } from '@/app/utils/reviewApi';
import { Album, Product, Review } from '@/app/utils/types';

export default function EventOrganizer() {
  const descriptionRef = useRef(null);
  const reviewsRef = useRef(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = '1';
        const product = await readProductById(parseInt(id));
        const albums = await readAlbumsByProductId(parseInt(id));
        const reviews = await readReviewsByProductId(parseInt(id));

        reviews.sort((a: Review, b: Review) => new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime());
        reviews.splice(3);

        setProduct(product);
        setAlbums(albums);
        setReviews(reviews);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      }
    };
  
    fetchData();
  }, []);

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

  return (
    <div className="font-sofia">
      <Navbar />
      <div className="container mx-auto mt-24 md:px-20 -mb-6 md:mb-0">
        {product && <ProductImage product={product} albums={albums} />}
        <Tabs scrollToSection={scrollToSection} refs={{ descriptionRef, reviewsRef }} />
        {product && <div ref={descriptionRef}><Description product={product} /></div>}
        {product && <div ref={reviewsRef}><Reviews product={product} reviews={reviews} /></div>}
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

const ProductImage = ({ product, albums }: { product: Product; albums: Album[]; }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showOrderPopup, setShowOrderPopup] = useState(false); // State for order popup
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState('');
  const timeoutRef = useRef<null | NodeJS.Timeout>(null);
  const windowWidth = useWindowWidth();
  const productUrl = typeof window !== 'undefined' ? window.location.href : '';
  const [copied, setCopied] = useState(false);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [amount, setAmount] = useState<{ [key: number]: number }>({});
  const [cartId, setCartId] = useState<number | null>(null);
  const router = useRouter();

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
    const messageTemplate = `Hai Admin LOGEVENT, saya tertarik dengan layanan Event Organizer. Bisa berikan informasi lebih lanjut?`;
    
    const whatsappUrl = generateWhatsAppUrl(adminNumber || "", messageTemplate);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const closeOrderPopup = () => {
    setShowOrderPopup(false);
  };

  const increaseAmount = (id: number) => {
    setAmount((prev) => ({
      ...prev,
      [id]: (prev[id] || 1) + 1,
    }));
  };

  const decreaseAmount = (id: number) => {
    setAmount((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) - 1),
    }));
  };

  const handleOrderClick = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
      return;
    }

    const user = await readUserProfile(token);
    let cart = await readActiveEventOrganizerCartByUserId(user.id);
    if (!cart) {
      cart = await createCart(user.id, 'Event Organizer');
    }

    await deleteItemsByCartId(cart.id);
    const itemData = {
      cartId: cart.id,
      eventId: null,
      productId: product.id,
      duration: null,
      quantity: null,
    };
    await createItem(itemData);
    
    const bookedDates = await readOrderAvailabilityByCartId(cart.id);
    setCartId(cart.id);
    setBookedDates(bookedDates);
    setShowOrderPopup(true); // Show the order popup
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: { name?: string, phone?: string, address?: string, startDate?: string, endDate?: string } = {};

    if (!name) {
      newErrors.name = 'Nama tidak boleh kosong';
    }
    if (!phone) {
      newErrors.phone = 'Nomor telepon tidak boleh kosong';
    }
    if (!address) {
      newErrors.address = 'Alamat tidak boleh kosong';
    }
    if (!startDate) {
      newErrors.startDate = 'Tanggal mulai tidak boleh kosong';
    }
    if (!endDate) {
      newErrors.endDate = 'Tanggal akhir tidak boleh kosong';
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.endDate = 'Tanggal akhir harus setelah tanggal mulai';
    }

    const bookedDateObjects = bookedDates.map(dateStr => new Date(dateStr));
    if (startDate && endDate && areDatesOverlapping(startDate, endDate, bookedDateObjects)) {
      newErrors.startDate = 'Tanggal yang dipilih termasuk dalam tanggal yang sudah dipesan';
      newErrors.endDate = 'Tanggal yang dipilih termasuk dalam tanggal yang sudah dipesan';
    }
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      if (!cartId) {
        throw new Error('User ID is missing');
      }
      if (!name) {
        throw new Error('Name is missing');
      }
      if (!phone) {
        throw new Error('Phone number is missing');
      }
      if (!address) {
        throw new Error('Address is missing');
      }
      if (!startDate) {
        throw new Error('Start date is missing');
      }
      if (!endDate) {
        throw new Error('End date is missing');
      }
      
      const orderData = {
        cartId,
        name,
        phone,
        address,
        notes: notes || null,
        startDateString: startDate.toISOString(),
        endDateString: endDate.toISOString()
      };
      const order = await createOrder(orderData);
  
      const cartData = {
        cartStatus: 'Checked Out'
      };
      await updateCart(cartId, cartData);

      const newOrderData = {
        orderStatus: 'Unconfirmed'
      }
      await updateOrder(order.id, newOrderData);
  
      router.push('/isi-pemesanan/complete');
    } catch (error: any) {
      console.error('Failed to create order:', error.message);
    }
  };

  return (
    <div className="px-8 pt-4 md:pb-16">
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
              <p className="text-base md:text-lg text-gray-800 font-extrabold">Diskusikan Biaya EO dengan Admin Sebelum Memesan</p>
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
            <div className="flex space-x-4 w-full md:w-1/2 md:justify-end items-center mt-3 md:mt-0">
              <button
                className="bg-pink-500 text-white rounded-lg px-3 md:px-4 py-2 -ml-4 md:ml-0 mr-[6.5rem] md:mr-0 text-sm md:text-base"
                onClick={handleOrderClick} // Show popup on click
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
            <div className="w-full flex flex-row md:flex-col md:items-center">
              <div className="w-full md:w-1/2">
                <h1 className="text-2xl md:text-3xl text-pink-900 font-bold mt-4">{product.name}</h1>
                <p className="text-sm md:text-lg text-gray-800 font-extrabold mb-2 md:mb-0">Diskusikan biaya EO lebih lanjut dengan Admin sebelum memesan</p>
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
              <div className="flex flex-row space-x-4 mt-5">
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
            <div className="w-full flex justify-center mt-3 md:mt-0">
              <button
                className="bg-pink-500 text-white rounded-lg px-3 md:px-4 py-2 text-sm md:text-base"
                onClick={() => setShowOrderPopup(true)} // Show popup on click
              >
                Pesan Langsung
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Popup */}
      {showOrderPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-black font-sofia">
          <div className="relative bg-white rounded-lg mx-auto max-w-xs md:max-w-lg mt-16 p-4">
            <button
              onClick={() => closeOrderPopup()}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex justify-center items-center"
            >
              &times;
            </button>
            <form
              className="flex flex-col w-full p-6 shadow-lg rounded-lg bg-white"
              onSubmit={handleSubmit}
            >
              <h2 className="mb-4 md:mb-8 text-2xl md:text-3xl text-center text-gray-800">
                Isi Data Pemesanan
              </h2>
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-3 md:mb-4">
                <div className="flex flex-1 flex-row -mb-2 md:mb-0">
                  <div className="flex flex-col w-full">
                    <label
                      htmlFor="name"
                      className="mt-1 text-sm md:text-base text-gray-800 md:mr-2"
                    >
                      Nama *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className="input-placeholder border border-gray-300 rounded-md p-1 md:p-[0.4rem] mt-1 text-black text-xs md:text-sm w-full"
                      placeholder="Isi nama pemesan"
                      value={name || ""}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-1 flex-row">
                  <div className="flex flex-col w-full">
                    <label
                      htmlFor="phone"
                      className="mt-1 text-sm md:text-base text-gray-800 mr-9 md:mr-5"
                    >
                      No. Telepon *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="input-placeholder border border-gray-300 rounded-md p-1 md:p-[0.4rem] mt-1 text-black text-xs md:text-sm w-full"
                      placeholder="Isi nomor telepon"
                      value={phone || ""}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col mb-1 md:mb-4">
                <label
                  htmlFor="address"
                  className="mb-1 md:mb-2 text-sm md:text-base text-gray-800"
                >
                  Alamat *
                </label>
                <textarea
                  id="address"
                  name="address"
                  className="input-placeholder border border-gray-300 rounded-md p-2 md:p-3 text-black text-xs md:text-sm mb-2 md:mb-0"
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address"
                  required
                />
              </div>
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-4">
                <div className="flex flex-1 flex-col md:flex-row gap-4">
                  <div className="flex flex-3 flex-row">
                    <div className="flex flex-col w-full">
                      <label
                          htmlFor="startDate"
                          className="text-sm md:text-base text-gray-800 mr-3"
                        >
                          Mulai Acara *
                        </label>
                        <DatePicker
                          selected={startDate}
                          onChange={(date: Date | null) => setStartDate(date)}
                          className="input-placeholder border border-gray-300 rounded-md p-1 md:p-[0.4rem] text-black mt-1 text-xs md:text-sm w-full"
                          placeholderText="Select start date"
                          excludeDates={getExcludedDates(bookedDates)}
                          required
                          calendarClassName="z-50 shadow-lg"
                        />
                    </div>
                  </div>
                  <div className="flex flex-3 flex-row">
                    <div className="flex flex-col w-full">
                      <label
                        htmlFor="endDate"
                        className="text-sm md:text-base text-gray-800"
                      >
                        Selesai Acara *
                      </label>
                      <DatePicker
                        selected={endDate}
                        onChange={(date: Date | null) => setEndDate(date)}
                        className="input-placeholder border border-gray-300 rounded-md p-1 md:p-[0.4rem] mt-1 text-black text-xs md:text-sm w-full"
                        placeholderText="Select end date"
                        excludeDates={getExcludedDates(bookedDates)}
                        required
                        calendarClassName="z-50 shadow-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col mb-1 md:mb-4">
                <label
                  htmlFor="notes"
                  className="mb-1 md:mb-2 text-sm md:text-base text-gray-800"
                >
                  Catatan untuk Vendor:
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  className="input-placeholder border border-gray-300 rounded-md p-2 md:p-3 text-black text-xs md:text-sm"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter your notes"
                />
              </div>
              <button
                type="submit"
                className="mt-5 md:mt-2 p-1 md:p-2 rounded bg-pink-800 hover:bg-pink-900 text-white"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

function Tabs({ scrollToSection, refs }: { scrollToSection: (ref: React.RefObject<any>) => void; refs: { descriptionRef: React.RefObject<any>; reviewsRef: React.RefObject<any> } }) {
  return (
    <nav className="flex justify-center space-x-8 mt-2 md:mt-0 py-2 border-b">
      <button onClick={() => scrollToSection(refs.descriptionRef)} className="text-gray-600 hover:text-pink-500">Description</button>
      <button onClick={() => scrollToSection(refs.reviewsRef)} className="text-gray-600 hover:text-pink-500">Reviews</button>
    </nav>
  );
}

function Description({ product }: { product: Product }) {
  return (
    <div className="px-8 pb-8 md:py-14 border-b">
      <h2 className="text-2xl md:text-3xl font-bold text-pink-900 pt-10">Description</h2>
      <p className="text-gray-600 mt-4 text-sm md:text-base">
        {product.description}
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
    <div className="mt-4 px-8 pb-8 md:py-14">
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

function setAmount(arg0: (prev: any) => any) {
  throw new Error('Function not implemented.');
}
