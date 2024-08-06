// app/wishlist/page.tsx
'use client';

// dependency module
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { SetStateAction, useEffect, useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
// self-defined modules
import { ContactBox, Navbar } from '@/app/page';
import { readUserProfile } from '@/app/utils/authApi';
import { readEventWishlistsByUserId, readProductWishlistsByUserId, deleteWishlist } from '@/app/utils/wishlistApi';
import { EventWishlist, ProductWishlist } from '@/app/utils/types';

export default function HomePage() {
  const router = useRouter();
  const [activeOption, setActiveOption] = useState('Logistik Vendor');
  const [eventWishlists, setEventWishlists] = useState<EventWishlist[]>([]);
  const [productWishlists, setProductWishlists] = useState<ProductWishlist[]>([]);

  const handleToggle = (option: string) => {
    setActiveOption(option);
    // Dummy function for toggling action
    console.log(`Switched to ${option}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('User token not found');
        }

        const user = await readUserProfile(token);
        const eventWishlists = await readEventWishlistsByUserId(user.id);
        const productWishlists = await readProductWishlistsByUserId(user.id);

        setEventWishlists(eventWishlists);
        setProductWishlists(productWishlists);
      } catch (error: any) {
        console.error(error.message);
        router.push('/signin');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto font-sofia">
      <Navbar />
      <div className="flex flex-col gap-4 px-14 py-24">
        <div className="flex flex-col gap-4 bg-white shadow-lg rounded-xl p-4 md:p-8 mt-6">
          <div className='flex justify-between'>
            <div className='flex flex-row'>
              <FaShoppingCart className="text-4xl text-pink-900 mr-5 -mt-[0.15rem]" />
              <h1 className="text-3xl font-bold text-pink-900 font-sofia mb-5">
                {activeOption === 'Paket Event' ? 'Wishlist Paket Event' : 'Wishlist Logistik Vendor'}
              </h1>
            </div>
            <div className="flex flex-row rounded-full border border-white transition-all duration-300">
            <button
                className={`px-2 py-1 rounded-l-full transition-all duration-300 ${activeOption === 'Logistik Vendor' ? 'bg-pink-600 text-white' : 'bg-white text-pink-600 border border-pink-600'}`}
                onClick={() => handleToggle('Logistik Vendor')}
            >
                Logistik Vendor
            </button>
            <button
                className={`px-3 py-1 rounded-r-full transition-all duration-300 ${activeOption === 'Paket Event' ? 'bg-pink-600 text-white' : 'bg-white text-pink-600 border border-pink-600'}`}
                onClick={() => handleToggle('Paket Event')}
            >
                Paket Event
            </button>
            </div>
          </div>
          {activeOption === 'Paket Event' ? (
            <KeranjangPaketEvent eventWishlists={eventWishlists} />
          ) : (
            <KeranjangLogistikVendor productWishlists={productWishlists} />
          )}
        </div>
      </div>
      <ContactBox />
    </div>
  );
}

const KeranjangPaketEvent = ({ eventWishlists }: { eventWishlists: EventWishlist[] }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 5;

  const handleDetailClick = (id: string | number) => {
    router.push(`/paket-event/info-detail/${id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedEvents = eventWishlists.slice((currentPage - 1) * eventsPerPage, currentPage * eventsPerPage);
  const totalPages = Math.ceil(eventWishlists.length / eventsPerPage);

  return (
    <div className="flex flex-col gap-4">
      {paginatedEvents.map((event) => (
        <div
          key={event.id}
          className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col md:flex-row justify-between relative"
        >
          <Image
            src={event.eventImage || '/images/placeholder-image.jpg'}
            alt={`${event.eventName} Image`}
            width={400}
            height={200}
            className="object-cover w-80 h-28 md:h-auto"
          />
          <div className="p-3 md:p-4 md:ml-3 flex-grow font-sofia">
            <h3 className="text-base md:text-xl text-pink-900 font-bold">{event.eventName}</h3>
            <p className="text-xs md:text-sm text-gray-700 flex flex-row">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 md:h-4 w-3 md:w-4 text-yellow-500 mr-[0.3rem] mt-[0.075rem] md:mt-[0.05rem]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.14 3.51a1 1 0 00.95.69h3.7c.967 0 1.372 1.24.588 1.81l-2.992 2.179a1 1 0 00-.364 1.118l1.14 3.51c.3.921-.755 1.688-1.54 1.118l-2.992-2.178a1 1 0 00-1.175 0l-2.992 2.178c-.785.57-1.84-.197-1.54-1.118l1.14-3.51a1 1 0 00-.364-1.118L2.93 8.937c-.784-.57-.38-1.81.588-1.81h3.7a1 1 0 00.95-.69l1.14-3.51z" />
              </svg> {event.eventRating && event.eventRating.toFixed(2) !== "0.00" ? event.eventRating.toFixed(2) : "N/A"}
            </p>
            <p className="line-clamp-3 text-xs md:text-sm text-gray-700 font-sofia">{event.eventDescription}</p>
            <div className="mt-1 mb-2 flex justify-between items-center">
              <span className="text-base md:text-lg font-bold text-pink-600">Rp{event.eventPrice.toLocaleString('id-ID')}</span>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <div className="flex flex-col">
                <p className="text-xs md:text-sm text-gray-700 font-sofia">Rincian Paket:</p>
                <p className="text-xs md:text-sm text-gray-700 w-full md:w-[36rem] mb-14 md:mb-0">
                  {event.eventBundles}
                </p>
              </div>
              <div className="flex flex-col absolute bottom-4 right-4">
              <button
                className="text-sm md:text-sm bg-pink-400 hover:bg-pink-700 text-white font-semibold px-1 md:py-1 rounded mb-2"
                onClick={() => handleDetailClick(event.eventId)}
              >
                Lihat Detail
              </button>
              <button
                className="text-sm md:text-sm bg-pink-600 hover:bg-pink-800 text-white font-semibold px-3 md:py-3 rounded"
                onClick={() => router.push(`/isi-pemesanan`)}
              >
                Lanjut Pemesanan
              </button>
            </div>
            </div>
          </div>
        </div>
      ))}
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
    </div>
  );
};

function KeranjangLogistikVendor({ productWishlists }: { productWishlists: ProductWishlist[] }) {
  const router = useRouter();
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProductWishlist, setSelectedProductWishlist] = useState<ProductWishlist | null>(null);
  const [selectedItems, setSelectedItems] = useState<ProductWishlist[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const totalPages = Math.ceil(productWishlists.length / itemsPerPage);

  const handlePageChange = (page: SetStateAction<number>) => {
    setCurrentPage(page);
  };

  const currentItems = productWishlists.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCheckboxChange = (productWishlist: ProductWishlist) => {
    const isSelected = selectedItems.includes(productWishlist);
    let updatedItems = [];
    let updatedPrice = totalPrice;

    if (isSelected) {
      updatedItems = selectedItems.filter((item) => item.id !== productWishlist.id);
      updatedPrice -= productWishlist.productPrice;
    } else {
      updatedItems = [...selectedItems, productWishlist];
      updatedPrice += productWishlist.productPrice;
    }

    setSelectedItems(updatedItems);
    setTotalPrice(updatedPrice);
  };

  const handleSubmit = () => {
    // Handle submit logic here
    console.log('Selected Items:', selectedItems);
  };

  return (
    <div className="relative py-4">
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {currentItems.map((item) => (
          <div key={item.id} className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col justify-between">
            <div className="relative">
              <input
                type="checkbox"
                className="absolute w-5 h-5 top-2 left-2 z-10 cursor-pointer"
                onChange={() => handleCheckboxChange(item)}
              />
            </div>
            <Image
              src={item.productImage || '/images/placeholder-image.jpg'}
              alt={`${item.productName} Image`}
              width={400}
              height={200}
              className="object-cover"
            />
            <div className="p-3 md:p-3 font-sofia flex flex-col justify-between flex-grow">
              <div>
                <h3 className="text-sm md:text-base text-pink-900 font-bold mb-2">{item.productName}</h3>
                <p className="text-xs md:text-sm text-gray-700">{item.productSpecification}</p>
                <p className="text-xs md:text-sm text-gray-500 flex flex-row">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 md:h-4 w-3 md:w-4 text-yellow-500 mr-[0.3rem] mt-[0.075rem] md:mt-[0.05rem]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.14 3.51a1 1 0 00.95.69h3.7c.967 0 1.372 1.24.588 1.81l-2.992 2.179a1 1 0 00-.364 1.118l1.14 3.51c.3.921-.755 1.688-1.54 1.118l-2.992-2.178a1 1 0 00-1.175 0l-2.992 2.178c-.785.57-1.84-.197-1.54-1.118l1.14-3.51a1 1 0 00-.364-1.118L2.93 8.937c-.784-.57-.38-1.81.588-1.81h3.7a1 1 0 00.95-.69l1.14-3.51z" />
                  </svg> {item.productRating && item.productRating.toFixed(2) !== "0.00" ? item.productRating.toFixed(2) : "N/A"}
                </p>
                <p className="text-xs md:text-sm text-gray-500">{item.vendorAddress}</p>
                <p className="text-xs md:text-sm text-pink-500 font-bold mt-2">Rp {item.productPrice.toLocaleString('id-ID')}</p>
              </div>
              <div className="flex justify-between items-center">
                <button className="self-start text-xs md:text-base text-pink-500 hover:text-pink-700 font-bold mt-4"
                  onClick={() => router.push(`/logistik-vendor/info-detail/${item.productId}`)}
                >
                  Lihat Detail
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-100 shadow-md p-4 z-50">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-black font-sofia">Total Items: {selectedItems.length}</p>
            <p className="text-black font-sofia">Total Price: Rp {totalPrice.toLocaleString('id-ID')}</p>
          </div>
          <button className="bg-pink-500 text-white px-4 py-2 rounded-md font-sofia" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </footer>
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }: any) {
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