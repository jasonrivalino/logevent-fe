// app/paket-event/page.tsx
'use client';

import { SetStateAction, useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; 
// self-defined modules
import { Navbar, ContactBox } from '@/app/page';
import { readAllEvents } from '@/app/utils/eventApi';
import { Event } from '@/app/utils/types';
import { set } from 'react-datepicker/dist/date_utils';

export default function PaketEvent() {
  const [minPrice, setMinPrice] = useState<number | string>('');
  const [maxPrice, setMaxPrice] = useState<number | string>('');
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const events = await readAllEvents();
        setEvents(events);
        setFilteredEvents(events);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleFilter = () => {
    setFilteredEvents(
      events.filter(
        (Event) =>
          (minPrice === '' || Event.price >= Number(minPrice)) &&
          (maxPrice === '' || Event.price <= Number(maxPrice))
      )
    );
  };

  const handleReset = () => {
    setMinPrice('');
    setMaxPrice('');
    setFilteredEvents(events);
  };

  return (
    <div>
      <div className="p-4">
        <Head>
          <title>Paket Event</title>
        </Head>
        <Navbar />
        <div className="flex flex-col md:flex-row py-14 md:py-20">
          <EventList events={filteredEvents} />
        </div>
      </div>
      <ContactBox />
    </div>
  );
}

function Filter({ handleFilter, handleReset, setCategory, setLocation, setPriceRange }: any) {
  return (
    <div className="w-full md:w-96 md:pl-4 md:pr-8 py-4 -mb-2 md:mb-0">
      <h2 className="text-xl md:text-2xl font-semibold font-sofia text-black mb-4">Filter by</h2>
      <div className="mb-2 md:mb-4">
        <label htmlFor="category" className="block mb-1 md:mb-2 text-gray-700 font-sofia text-sm md:text-base">Kategori Event</label>
        <select id="category" className="w-full p-[0.35rem] md:p-2 text-xs md:text-base border rounded bg-white text-black font-sofia" onChange={(e) => setCategory(e.target.value)}>
          <option value="" className="font-sofia">Pilih kategori event</option>
          <option value="Multifunctional Hall" className="font-sofia">Multifunctional Hall</option>
        </select>
      </div>
      <div className="flex md:flex-col flex-row">
        <div className="mb-2 md:mb-4 mr-4 md:mr-0">
          <label htmlFor="location" className="block mb-1 md:mb-2 text-gray-700 font-sofia text-sm md:text-base">Lokasi Event</label>
          <select id="location" className="w-32 md:w-full p-[0.35rem] md:p-2 text-xs md:text-base border rounded bg-white text-black font-sofia" onChange={(e) => setLocation(e.target.value)}>
            <option value="" className="font-sofia">Pilih lokasi event</option>
            <option value="Jakarta" className="font-sofia">Jakarta</option>
            <option value="Jawa Barat" className="font-sofia">Jawa Barat</option>
            <option value="Jawa Tengah" className="font-sofia">Jawa Tengah</option>
            <option value="Jawa Timur" className="font-sofia">Jawa Timur</option>
          </select>
        </div>
        <div className="mb-4 md:mb-8">
          <label htmlFor="priceRange" className="block mb-1 md:mb-2 text-gray-700 font-sofia text-sm md:text-base">Harga</label>
          <select id="priceRange" className="w-[11.5rem] md:w-full p-[0.35rem] md:p-2 text-xs md:text-base border rounded bg-white text-black font-sofia" onChange={(e) => setPriceRange(e.target.value)}>
            <option value="" className="font-sofia">Pilih range harga</option>
            <option value="> 25.000.000" className="font-sofia">{`> 25.000.000`}</option>
            <option value="15.000.000 - 25.000.000" className="font-sofia">15.000.000 - 25.000.000</option>
            <option value="5.000.000 - 15.000.000" className="font-sofia">5.000.000 - 15.000.000</option>
            <option value="< 5.000.000" className="font-sofia">{`< 5.000.000`}</option>
          </select>
        </div>
      </div>
      <div className="mb-8">
        <label htmlFor="location" className="block mb-2 text-gray-700 font-sofia">Harga</label>
        <select id="location" className="w-full p-2 border rounded bg-white text-black font-sofia">
          <option value="" className="font-sofia">Pilih range harga</option>
          <option value="Jakarta" className="font-sofia"> {`> 25.000.000`} </option>
          <option value="Jawa Barat" className="font-sofia"> 15.000.000 - 25.000.000 </option>
          <option value="Jawa Tengah" className="font-sofia"> 5.000.000 - 15.000.000 </option>
          <option value="Jawa Timur" className="font-sofia"> { `< 5.000.000`} </option>
        </select>
      </div>
      <button
        className="w-full bg-white text-pink-600 border-2 border-pink-600 font-sofia font-bold hover:bg-pink-100 hover:text-pink-600 hover:border-pink-600 p-2 rounded mb-2"
        onClick={handleReset}
      >
        Reset Filter
      </button>
    </div>
  );
}

export function EventList({ events }: { events: Event[] }) {
  const router = useRouter();
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedPackages, setExpandedPackages] = useState<{ [key: number]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events);

  const [tempCategory, setTempCategory] = useState('');
  const [tempLocation, setTempLocation] = useState('');
  const [tempPriceRange, setTempPriceRange] = useState('');

  useEffect(() => {
    let result = events;
    
    if (searchQuery) {
      result = result.filter((event) =>
        event.name.toLowerCase().includes(searchQuery)
      );
    }
  
    setFilteredEvents(result);
  }, [searchQuery, events]);

  const handlePageChange = (page: SetStateAction<number>) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (event: { target: { value: string; }; }) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilter = () => {
    let result = events;
    
    if (searchQuery) {
      result = result.filter((event) =>
        event.name.toLowerCase().includes(searchQuery)
      );
    }
    
    if (tempCategory) {
      result = result.filter(event => event.categoryName === tempCategory);
    }
  
    // if (tempLocation) {
    //   result = result.filter(vendor => vendor.location === tempLocation);
    // }
  
    if (tempPriceRange) {
      result = result.filter(event => {
        switch (tempPriceRange) {
          case '> 25.000.000':
            return event.price > 25000000;
          case '15.000.000 - 25.000.000':
            return event.price >= 15000000 && event.price <= 25000000;
          case '5.000.000 - 15.000.000':
            return event.price >= 5000000 && event.price <= 15000000;
          case '< 5.000.000':
            return event.price < 5000000;
          default:
            return true;
        }
      });
    }
  
    setFilteredEvents(result);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setTempCategory('');
    setTempLocation('');
    setTempPriceRange('');
    setFilteredEvents(events);
    setCurrentPage(1);
  };

  const handleDetailClick = (id: number) => {
    router.push(`/paket-event/info-detail/${id}`);
  };

  const paginatedItems = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  return (
    <div className="flex flex-col md:flex-row">
      <Filter
        handleFilter={handleFilter}
        handleReset={handleReset}
        setCategory={setTempCategory}
        setLocation={setTempLocation}
        setPriceRange={setTempPriceRange}
      />
      <div className="w-full md:w-[69rem] p-5 md:p-6 mr-4 bg-white rounded-2xl">
        {/* Breadcrumb Navigation */}
        <div className="hidden md:flex items-center mb-4">
          <a onClick={() => router.push('/')} className="text-pink-600 font-semibold font-sofia cursor-pointer">Home</a>
          <span className="mx-2 text-gray-600 font-sofia font-semibold"> {'>'} </span>
          <span className="text-gray-600 font-sofia font-semibold">Paket Event</span>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="w-3 md:w-4 h-3 md:h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l4.287 4.287a1 1 0 01-1.414 1.414l-4.287-4.287zM8 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Cari kebutuhan paketmu"
              className="w-full text-sm md:text-base p-1 md:p-2 pl-9 md:pl-12 border rounded bg-white text-black font-sofia"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-pink-900 font-sofia">Semua Paket</h2>
        <div className="flex flex-col gap-4">
          {paginatedItems.map((event) => (
            <div key={event.id} className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col md:flex-row justify-between relative">
              <Image
                src={event.eventImage || '/images/placeholder.png'}
                alt={`${event.name} image`}
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
                  </svg> {event.rating}
                </p>
                {/* <p className="text-xs md:text-sm text-gray-700 mb-3">{vendor.location}</p> */}
                <p className="line-clamp-3 text-xs md:text-sm text-gray-700 font-sofia">{event.description}</p>
                <div className="mt-1 mb-2 flex justify-between items-center">
                  <span className="text-base md:text-lg font-bold text-pink-600">Rp{event.price.toLocaleString('id-ID')}</span>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <div className="flex flex-col">
                    <p className="text-xs md:text-sm text-gray-700 font-sofia">Rincian Paket:</p>
                    <p className="text-xs md:text-sm text-gray-700 w-full md:w-[36rem] mb-14 md:mb-0">
                      {expandedPackages[event.id]
                        ? event.bundles
                        : event.bundles?.split(',').slice(0, 3).join(', ')}
                    </p>
                  </div>
                  <button
                    className="absolute bottom-4 right-4 text-sm md:text-base bg-pink-600 hover:bg-pink-800 text-white font-semibold px-3 py-1 md:py-2 rounded"
                    onClick={() => handleDetailClick(event.id)}
                  >
                    Lihat Detail
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
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