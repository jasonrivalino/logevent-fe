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
import { readEventItemsByCartId, readProductItemsByCartId } from '@/app/utils/itemApi';
import { readOrdersByUserId } from '@/app/utils/orderApi';
import { EventItem, ProductItem, Order } from '@/app/utils/types';

export default function HomePage() {
  const [activeOption, setActiveOption] = useState('Logistik Vendor');
  const [eventOrders, setEventOrders] = useState<Order[]>([]);
  const [productOrders, setProductOrders] = useState<Order[]>([]);
  const [eventItems, setEventItems] = useState<EventItem[][]>([]);
  const [productItems, setProductItems] = useState<ProductItem[][]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const user = await readUserProfile(token);
          const orders = await readOrdersByUserId(user.id);
          const carts = await readCartsByUserId(user.id);

          const eventOrders = orders.filter((order: { cartType: string; }) => order.cartType === 'Event');
          eventOrders.sort((a: Order, b: Order) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

          const productOrders = orders.filter((order: { cartType: string; }) => order.cartType === 'Product');
          productOrders.sort((a: Order, b: Order) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

          const eventCarts = carts.filter((cart: { type: string; }) => cart.type === 'Event');
          eventCarts.sort((a: { id: number; }, b: { id: number; }) => {
            const aIndex = eventOrders.findIndex((order: Order) => order.cartId === a.id);
            const bIndex = eventOrders.findIndex((order: Order) => order.cartId === b.id);
            return aIndex - bIndex;
          });

          const productCarts = carts.filter((cart: { type: string; }) => cart.type === 'Product');
          productCarts.sort((a: { id: number; }, b: { id: number; }) => {
            const aIndex = productOrders.findIndex((order: Order) => order.cartId === a.id);
            const bIndex = productOrders.findIndex((order: Order) => order.cartId === b.id);
            return aIndex - bIndex;
          });

          const eventItems: EventItem[][] = [];
          for (const cart of eventCarts) {
            const item = await readEventItemsByCartId(cart.id);
            eventItems.push(item);
          }

          const productItems: ProductItem[][] = [];
          for (const cart of productCarts) {
            const item = await readProductItemsByCartId(cart.id);
            productItems.push(item);
          }

          setEventOrders(eventOrders);
          setProductOrders(productOrders);
          setEventItems(eventItems);
          setProductItems(productItems);
        } catch (error: any) {
          console.error('Failed to fetch data:', error.message);
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
            <HistoriPaketEvent eventOrders={eventOrders} eventItems={eventItems} />
          ) : (
            <HistoriLogistikVendor productOrders={productOrders} productItems={productItems} />
          )}
        </div>
      </div>
      <ContactBox />
    </div>
  );
}

const HistoriPaketEvent = ({ eventOrders, eventItems }: { eventOrders: Order[]; eventItems: EventItem[][] }) => {
  const [expandedEventId, setExpandedEventId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 5;

  const toggleExpand = (id: number | null) => {
    setExpandedEventId(expandedEventId === id ? null : id);
  };

  const handleDetailClick = (id: number) => {
    toggleExpand(id);
  };

  const handlePageChange = (page: SetStateAction<number>) => {
    setCurrentPage(page);
  };

  const paginatedOrders = eventOrders.slice((currentPage - 1) * eventsPerPage, currentPage * eventsPerPage);
  const totalPages = Math.ceil(eventOrders.length / eventsPerPage);

  return (
    <div className="flex flex-col gap-4">
      {paginatedOrders.map((order, index) => (
        <div key={order.id} className="bg-white shadow-lg rounded-xl p-4 md:p-8">
          <h2 className="text-lg md:text-xl font-bold text-pink-900">{order.orderDate}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eventItems[index]
              .filter((item) => item.cartId === order.cartId)
              .map((item) => (
                <div key={item.id} className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col justify-between">
                  <Image
                    src={item.eventImage || '/Image/planetarium.jpg'}
                    alt={`${item.eventName} Image`}
                    width={400}
                    height={200}
                    className="object-cover"
                  />
                  <div className="p-3 md:p-3 font-sofia flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-sm md:text-base text-pink-900 font-bold mb-2">{item.eventName}</h3>
                      <p className="text-xs md:text-sm text-gray-500 flex flex-row">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 md:h-4 w-3 md:w-4 text-yellow-500 mr-[0.3rem] mt-[0.075rem] md:mt-[0.05rem]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.14 3.51a1 1 0 00.95.69h3.7c.967 0 1.372 1.24.588 1.81l-2.992 2.179a1 1 0 00-.364 1.118l1.14 3.51c.3.921-.755 1.688-1.54 1.118l-2.992-2.178a1 1 0 00-1.175 0l-2.992 2.178c-.785.57-1.84-.197-1.54-1.118l1.14-3.51a1 1 0 00-.364-1.118L2.93 8.937c-.784-.57-.38-1.81.588-1.81h3.7a1 1 0 00.95-.69l1.14-3.51z" />
                        </svg>
                        {item.eventRating && item.eventRating.toFixed(2) !== "0.00" ? item.eventRating.toFixed(2) : "N/A"}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500">{item.eventDescription}</p>
                      <p className="text-xs md:text-sm text-pink-500 font-bold mt-2">Rp {item.eventPrice.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="flex justify-center items-center mt-2">
                      <div className="flex flex-col">
                        <p className="text-xs md:text-sm text-gray-700 font-sofia">Rincian Paket:</p>
                        <p className={`text-xs md:text-sm text-gray-700 mb-14 md:mb-0 ${expandedEventId === item.id ? 'w-full' : 'w-[35rem]'}`}>
                          {item.eventBundles}
                        </p>
                      </div>
                      <button
                        className="bg-pink-600 hover:bg-pink-800 px-2 py-1 rounded-lg text-white self-start text-xs md:text-base font-bold mt-4"
                        onClick={() => handleDetailClick(item.id)}
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
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};

function HistoriLogistikVendor({ productOrders, productItems }: { productOrders: Order[]; productItems: ProductItem[][] }) {
  const router = useRouter();
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedOrders = productOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(productOrders.length / itemsPerPage);

  const handlePageChange = (page: SetStateAction<number>) => {
    setCurrentPage(page);
  };

  return (
    <div className="relative py-4">
      {paginatedOrders.map((order, index) => (
        <div key={order.id} className="bg-white shadow-lg rounded-xl p-4 md:p-8 mb-4">
          <h2 className="text-lg md:text-xl font-bold text-pink-900">{new Date(order.orderDate).toLocaleDateString()}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {productItems[index]
              .filter((item) => item.cartId === order.cartId)
              .map((item) => (
                <div key={item.id} className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col justify-between">
                  <Image
                    src={item.productImage || '/Image/planetarium.jpg'}
                    alt={`${item.productName} Image`}
                    width={400}
                    height={200}
                    className="object-cover"
                  />
                  <div className="p-3 md:p-3 font-sofia flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-sm md:text-base text-pink-900 font-bold mb-2">{item.productName}</h3>
                      <p className="text-xs md:text-sm text-gray-500">{item.productSpecification}</p>
                      <p className="text-xs md:text-sm text-pink-500 font-bold mt-2">Rp {item.productPrice.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="flex justify-center items-center mt-2">
                      <button
                        className="bg-pink-600 hover:bg-pink-800 px-2 py-1 rounded-lg text-white self-start text-xs md:text-base font-bold mt-4"
                        onClick={() => router.push('/')}
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
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
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