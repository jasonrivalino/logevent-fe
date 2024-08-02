// app/histori-pemesanan/page.tsx
'use client'

// dependency modules
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { SetStateAction, useEffect, useState } from 'react';
import { FaHistory } from 'react-icons/fa';
// self-defined modules
import { ContactBox, Navbar } from '@/app/page';
import { readUserProfile } from '@/app/utils/authApi';
import { readCartsByUserId } from '@/app/utils/cartApi';
import { readEventById } from '@/app/utils/eventApi';
import { readItemsByCartId } from '@/app/utils/itemApi';
import { readOrdersByUserId } from '@/app/utils/orderApi';
import { readProductById } from '@/app/utils/productApi';
import { Cart, Event, Item, Order, Product } from '@/app/utils/types';

export default function HomePage() {
  const [activeOption, setActiveOption] = useState('Logistik Vendor');
  const [orders, setOrders] = useState<Order[]>([]);
  const [carts, setCarts] = useState<Cart[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const user = await readUserProfile(token);
          const orders = await readOrdersByUserId(user.id);
          const carts = await readCartsByUserId(user.id);
          const items = await Promise.all(carts.map((cart: { id: number; }) => readItemsByCartId(cart.id)));
          const eventIds = items.filter(item => item.eventId !== null);
          const productIds = items.filter(item => item.productId !== null);
          const events = await Promise.all(eventIds.map((item: { eventId: number; }) => readEventById(item.eventId)));
          const products = await Promise.all(productIds.map((item: { productId: number; }) => readProductById(item.productId)));
          setOrders(orders);
          setCarts(carts);
          setItems(items);
          setEvents(events);
          setProducts(products);

          console.log('User data fetched successfully:', user);
          console.log('Orders data fetched successfully:', orders);
          console.log('Carts data fetched successfully:', carts);
          console.log('Items data fetched successfully:', items);
          console.log('Events data fetched successfully:', events);
          console.log('Products data fetched successfully:', products);
        } catch (error: any) {
          console.error('Failed to fetch user data:', error.message);
          localStorage.removeItem('token');
          Cookies.remove('token');
        }
      }
    };

    fetchData();
  }, []);
    
  const handleToggle = (option: string) => {
    setActiveOption(option);
    console.log(`Switched to ${option}`);
  };

  return (
    <div className="container mx-auto font-sofia">
      <Navbar />
      <div className="flex flex-col gap-4 px-14 py-24">
        <div className="flex flex-col gap-4 bg-white shadow-lg rounded-xl p-4 md:p-8 mt-6">
          <div className='flex justify-between'>
            <div className='flex flex-row'>
              <FaHistory className="text-4xl text-pink-900 mr-5 -mt-[0.15rem]" />
              <h1 className="text-3xl font-bold text-pink-900 font-sofia mb-5">
                {activeOption === 'Paket Event' ? 'Histori Paket Event' : 'Histori Logistik Vendor'}
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
            <HistoriPaketEvent events={events} />
          ) : (
            <HistoriLogistikVendor products={products} />
          )}
        </div>
      </div>
      <ContactBox />
    </div>
  );
}

const HistoriPaketEvent = ({ events }: { events: Event[] }) => {
  events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const [expandedProducts, setExpandedProducts] = useState<{ [key: number]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 5;

  const handleDetailClick = (id: number) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handlePageChange = (page: SetStateAction<number>) => {
    setCurrentPage(page);
  };

  const paginatedEvents = events.slice((currentPage - 1) * eventsPerPage, currentPage * eventsPerPage);
  const totalPages = Math.ceil(events.length / eventsPerPage);

  return (
    <div className="flex flex-col gap-4">
      {paginatedEvents.map((event) => (
        <div
          key={event.id}
          className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col md:flex-row justify-between relative"
        >
          <Image
            src={event.eventImage || '/Image/planetarium.jpg'}
            alt={`${event.name} Image`}
            width={400}
            height={200}
            className="object-cover w-80 h-28 md:h-auto"
          />
          <div className="p-3 md:p-4 md:ml-3 flex-grow font-sofia">
            <h3 className="text-base md:text-xl text-pink-900 font-bold">{event.name}</h3>
            <p className="text-xs md:text-sm text-gray-700">{event.categoryName}</p>
            <p className="text-xs md:text-sm text-gray-700 flex flex-row">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 md:h-4 w-3 md:w-4 text-yellow-500 mr-[0.3rem] mt-[0.075rem] md:mt-[0.05rem]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.14 3.51a1 1 0 00.95.69h3.7c.967 0 1.372 1.24.588 1.81l-2.992 2.179a1 1 0 00-.364 1.118l1.14 3.51c.3.921-.755 1.688-1.54 1.118l-2.992-2.178a1 1 0 00-1.175 0l-2.992 2.178c-.785.57-1.84-.197-1.54-1.118l1.14-3.51a1 1 0 00-.364-1.118L2.93 8.937c-.784-.57-.38-1.81.588-1.81h3.7a1 1 0 00.95-.69l1.14-3.51z" />
              </svg>
              {event.rate}
            </p>
            <p className="line-clamp-3 text-xs md:text-sm text-gray-700 font-sofia">{event.description}</p>
            <div className="mt-1 mb-2 flex justify-between items-center">
              <span className="text-base md:text-lg font-bold text-pink-600">Rp{event.price.toLocaleString('id-ID')}</span>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <div className="flex flex-col">
                <p className="text-xs md:text-sm text-gray-700 font-sofia">Rincian Paket:</p>
                <p className="text-xs md:text-sm text-gray-700 w-full md:w-[36rem] mb-14 md:mb-0">
                  {event.bundles}
                </p>
              </div>
              <div className="flex flex-col absolute bottom-4 right-4">
                <p className="text-xs md:text-sm text-gray-700 font-sofia mb-2">Ulas layanan kami yuk !</p>
                <button
                  className="text-sm md:text-sm bg-pink-600 hover:bg-pink-800 text-white font-semibold px-3 md:py-2 rounded"
                  onClick={() => handleDetailClick(event.id)}
                >
                  Review
                </button>
              </div>
            </div>
            <p className="text-xs md:text-sm text-pink-700 font-sofia mt-4">Tanggal Pesan: {event.date}</p>
          </div>
        </div>
      ))}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};
  
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

const itemsPerPage = 5;

function HistoriLogistikVendor({ products }: { products: Product[] }) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const uniqueDates = [...new Set(products.map(product => product.date))].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const totalPages = Math.ceil(uniqueDates.length / itemsPerPage);

  const handlePageChange = (page: SetStateAction<number>) => {
    setCurrentPage(page);
  };

  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = currentPage * itemsPerPage;
  const currentDates = uniqueDates.slice(startIdx, endIdx);

  const groupedProducts = currentDates.reduce((groups, date) => {
    groups[date] = products.filter(product => product.date === date);
    return groups;
  }, {});

  return (
    <div className="relative py-4">
      {Object.entries(groupedProducts).map(([date, products]) => (
        <div key={date} className="mb-8 font-sofia">
          <h2 className="text-lg md:text-xl font-bold mb-4 text-pink-800">{date}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {products.map((product: Product) => (
              <div key={product.id} className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col justify-between">
                <Image
                  src={product.productImage || '/Image/planetarium.jpg'}
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
                        className= "h-3 md:h-4 w-3 md:w-4 text-yellow-500 mr-[0.3rem] mt-[0.075rem] md:mt-[0.05rem]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.14 3.51a1 1 0 00.95.69h3.7c.967 0 1.372 1.24.588 1.81l-2.992 2.179a1 1 0 00-.364 1.118l1.14 3.51c.3.921-.755 1.688-1.54 1.118l-2.992-2.178a1 1 0 00-1.175 0l-2.992 2.178c-.785.57-1.84-.197-1.54-1.118l1.14-3.51a1 1 0 00-.364-1.118L2.93 8.937c-.784-.57-.38-1.81.588-1.81h3.7a1 1 0 00.95-.69l1.14-3.51z" />
                      </svg> {product.rating && product.rating.toFixed(2) !== "0.00" ? product.rating.toFixed(2) : "N/A"}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500">{product.vendorAddress}</p>
                    <p className="text-xs md:text-sm text-pink-500 font-bold mt-2">Rp {product.price.toLocaleString('id-ID')}</p>
                  </div>
                  <div className="flex justify-center items-center mt-2">
                    <button className="bg-pink-600 hover:bg-pink-800 px-2 py-1 rounded-lg text-white self-start text-xs md:text-base font-bold mt-4"
                      onClick={() => router.push(`/logistik-vendor/info-detail`)}
                    >
                      Review
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />  
    </div>
  );
}