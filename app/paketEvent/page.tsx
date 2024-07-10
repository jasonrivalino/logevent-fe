'use client';

import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Navbar, ContactBox } from '../page';
import { useRouter } from 'next/navigation'; // Import useRouter from Next.js for routing

interface Event {
  id: number;
  name: string;
  type: string;
  location: string;
  price: number;
  rate: number;
  image: string;
}

const dummyevents: Event[] = [
  {
    id: 1,
    name: 'Tech Conference 2024',
    type: 'Conference',
    location: 'Dago, Bandung',
    price: 25000000,
    rate: 5.0,
    image: '/Image/partyevent.jpg',
  },
  {
    id: 2,
    name: 'Annual Gala Night',
    type: 'Gala',
    location: 'Dago, Bandung',
    price: 20000000,
    rate: 4.5,
    image: '/Image/partyevent.jpg',
  },
  {
    id: 3,
    name: 'Wedding Reception',
    type: 'Wedding',
    location: 'Dago, Bandung',
    price: 30000000,
    rate: 4.5,
    image: '/Image/partyevent.jpg',
  },
  {
    id: 4,
    name: 'Corporate Meeting',
    type: 'Meeting',
    location: 'Dago, Bandung',
    price: 15000000,
    rate: 4.5,
    image: '/Image/partyevent.jpg',
  },
  {
    id: 5,
    name: 'Product Launch',
    type: 'Launch Event',
    location: 'Dago, Bandung',
    price: 25000000,
    rate: 4.5,
    image: '/Image/partyevent.jpg',
  },
  {
    id: 6,
    name: 'Music Concert',
    type: 'Concert',
    location: 'Dago, Bandung',
    price: 40000000,
    rate: 4.5,
    image: '/Image/partyevent.jpg',
  },
  {
    id: 7,
    name: 'Art Exhibition',
    type: 'Exhibition',
    location: 'Dago, Bandung',
    price: 10000000,
    rate: 4.5,
    image: '/Image/partyevent.jpg',
  },
  {
    id: 8,
    name: 'Charity Auction',
    type: 'Auction',
    location: 'Dago, Bandung',
    price: 20000000,
    rate: 4.5,
    image: '/Image/partyevent.jpg',
  },
  {
    id: 9,
    name: 'Fashion Show',
    type: 'Show',
    location: 'Dago, Bandung',
    price: 25000000,
    rate: 4.5,
    image: '/Image/partyevent.jpg',
  },
  {
    id: 10,
    name: 'Startup Pitch',
    type: 'Pitch Event',
    location: 'Dago, Bandung',
    price: 15000000,
    rate: 4.5,
    image: '/Image/partyevent.jpg',
  }
];

export default function PaketEvent() {
  const [minPrice, setMinPrice] = useState<number | string>('');
  const [maxPrice, setMaxPrice] = useState<number | string>('');
  const [filteredevents, setFilteredevents] = useState<Event[]>(dummyevents);

  const handleFilter = () => {
    setFilteredevents(
      dummyevents.filter(
        (event) =>
          (minPrice === '' || event.price >= Number(minPrice)) &&
          (maxPrice === '' || event.price <= Number(maxPrice))
      )
    );
  };

  const handleReset = () => {
    setMinPrice('');
    setMaxPrice('');
    setFilteredevents(dummyevents);
  };

  return (
    <div>
      <div className="p-4">
        <Head>
          <title>Paket Event</title>
        </Head>
        <Navbar />
        <div className="flex flex-col md:flex-row py-14 md:py-24">
          <Filter handleFilter={handleFilter} handleReset={handleReset} setMinPrice={setMinPrice} setMaxPrice={setMaxPrice} />
          <EventList events={filteredevents} />
        </div>
      </div>
      <ContactBox />
    </div>
  );
}

export function Filter({ handleFilter, handleReset, setMinPrice, setMaxPrice }: any) {
  return (
    <div className="w-full md:w-1/4 md:pl-4 md:pr-8 py-4 -mb-2 md:mb-0">
      <h2 className="text-xl md:text-2xl font-semibold font-sofia text-black mb-4">Filter by</h2>
        <div className="mb-2 md:mb-4">
          <label htmlFor="category" className="block mb-1 md:mb-2 text-gray-700 font-sofia text-sm md:text-base">Kategori Event</label>
          <select id="category" className="w-full p-[0.35rem] md:p-2 text-xs md:text-base border rounded bg-white text-black font-sofia">
            <option value="" className="font-sofia">Pilih kategori Event</option>
            <option value="Multifunctional Hall" className="font-sofia">Multifunctional Hall</option>
          </select>
        </div>
        <div className="flex md:flex-col flex-row">
          <div className="mb-2 md:mb-4 mr-4 md:mr-0">
            <label htmlFor="location" className="block mb-1 md:mb-2 text-gray-700 font-sofia text-sm md:text-base">Lokasi Event</label>
            <select id="location" className="w-32 md:w-full p-[0.35rem] md:p-2 text-xs md:text-base border rounded bg-white text-black font-sofia">
              <option value="" className="font-sofia">Pilih lokasi Event</option>
              <option value="Jakarta" className="font-sofia">Jakarta</option>
              <option value="Jawa Barat" className="font-sofia">Jawa Barat</option>
              <option value="Jawa Tengah" className="font-sofia">Jawa Tengah</option>
              <option value="Jawa Timur" className="font-sofia">Jawa Timur</option>
            </select>
          </div>
          <div className="mb-4 md:mb-8">
            <label htmlFor="location" className="block mb-1 md:mb-2 text-gray-700 font-sofia text-sm md:text-base">Harga</label>
            <select id="location" className="w-[11.5rem] md:w-full p-[0.35rem] md:p-2 text-xs md:text-base border rounded bg-white text-black font-sofia">
              <option value="" className="font-sofia">Pilih range harga</option>
              <option value="Jakarta" className="font-sofia"> {`> 25.000.000`} </option>
              <option value="Jawa Barat" className="font-sofia"> 15.000.000 - 25.000.000 </option>
              <option value="Jawa Tengah" className="font-sofia"> 5.000.000 - 15.000.000 </option>
              <option value="Jawa Timur" className="font-sofia"> { `< 5.000.000`} </option>
            </select>
          </div>
        </div>
      <button
        className="w-full text-sm md:text-base bg-white text-pink-600 border-2 border-pink-600 font-sofia font-bold hover:bg-pink-100 hover:text-pink-600 hover:border-pink-600 p-[0.2rem] md:p-2 rounded mb-3 md:mb-2"
        onClick={handleReset}
      >
        Reset Filter
      </button>
    </div>
  );
}

export function EventList({ events }: { events: Event[] }) {
  const router = useRouter(); // Initialize useRouter for navigation

  return (
    <div className="w-full md:w-3/4 p-5 md:p-8 mr-4 bg-white rounded-2xl">
      {/* Breadcrumb Navigation */}
      <div className="hidden md:flex items-center mb-4">
        <a onClick={() => router.push('/')} className="text-pink-600 font-semibold font-sofia cursor-pointer">Home</a>
        <span className="mx-2 text-gray-600 font-sofia font-semibold"> {'>'} </span>
        <span className="text-gray-600 font-sofia font-semibold">Paket Event</span>
      </div>

      {/* Search Bar */}
      <div className="mb-4 md:mb-6">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="w-3 md:w-4 h-3 md:h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l4.287 4.287a1 1 0 01-1.414 1.414l-4.287-4.287zM8 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Cari kebutuhan eventmu"
            className="w-full text-sm md:text-base p-1 md:p-2 pl-9 md:pl-12 border rounded bg-white text-black font-sofia"
          />
        </div>
      </div>
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-pink-900 font-sofia">Semua Event</h2>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {events.map((event) => (
          <div key={event.id} className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col justify-between">
            <Image
              src={event.image}
              alt={`${event.name} Image`}
              width={400}
              height={200}
              className="object-cover"
            />
            <div className="p-3 md:p-4 font-sofia flex flex-col justify-between flex-grow">
              <div>
                <h3 className="text-sm md:text-lg text-pink-900 font-bold mb-2">{event.name}</h3>
                <p className="text-xs md:text-base text-gray-700">{event.type}</p>
                <p className="text-xs md:text-base text-gray-500">Rating: {event.rate}</p>
                <p className="text-xs md:text-base text-gray-500">{event.location}</p>
              </div>
              <button className="self-start text-xs md:text-base text-pink-500 hover:text-pink-700 font-bold mt-4">
                Lihat Detail
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}