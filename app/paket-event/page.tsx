'use client';

import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar, ContactBox } from '../page';
import { useRouter } from 'next/navigation'; // Import useRouter from Next.js for routing

interface Vendor {
  id: number;
  name: string;
  image: string;
  price: number;
  description: string;
  listPackage: string[]; // Add listPackage property
}

export default function PaketEvent() {
  const [minPrice, setMinPrice] = useState<number | string>('');
  const [maxPrice, setMaxPrice] = useState<number | string>('');
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>(dummyVendors);

  const handleFilter = () => {
    setFilteredVendors(
      dummyVendors.filter(
        (vendor) =>
          (minPrice === '' || vendor.price >= Number(minPrice)) &&
          (maxPrice === '' || vendor.price <= Number(maxPrice))
      )
    );
  };

  const handleReset = () => {
    setMinPrice('');
    setMaxPrice('');
    setFilteredVendors(dummyVendors);
  };

  return (
    <div>
      <div className="p-4 -mb-12">
        <Head>
          <title>Paket Event</title>
        </Head>
        <Navbar />
        <div className="flex flex-col md:flex-row py-14 md:py-20">
          <Filter handleFilter={handleFilter} handleReset={handleReset} setMinPrice={setMinPrice} setMaxPrice={setMaxPrice} />
          <VendorList vendors={filteredVendors} />
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
          <option value="" className="font-sofia">Pilih kategori event</option>
          <option value="Multifunctional Hall" className="font-sofia">Multifunctional Hall</option>
        </select>
      </div>
      <div className="flex md:flex-col flex-row">
        <div className="mb-2 md:mb-4 mr-4 md:mr-0">
          <label htmlFor="location" className="block mb-1 md:mb-2 text-gray-700 font-sofia text-sm md:text-base">Lokasi Event</label>
          <select id="location" className="w-32 md:w-full p-[0.35rem] md:p-2 text-xs md:text-base border rounded bg-white text-black font-sofia">
            <option value="" className="font-sofia">Pilih lokasi event</option>
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
            <option value="Jakarta" className="font-sofia">{`> 25.000.000`}</option>
            <option value="Jawa Barat" className="font-sofia">15.000.000 - 25.000.000</option>
            <option value="Jawa Tengah" className="font-sofia">5.000.000 - 15.000.000</option>
            <option value="Jawa Timur" className="font-sofia">{`< 5.000.000`}</option>
          </select>
        </div>
      </div>
      <div className="flex flex-row md:flex-col items-center">
        <button
          className="w-52 md:w-full text-sm md:text-base bg-pink-600 text-white font-sofia font-bold hover:bg-pink-700 p-[0.3rem] md:p-2 rounded mb-3 mr-5 md:mr-0"
          onClick={handleFilter}
        > 
          Apply Filter
        </button>
        <button
          className="w-52 md:w-full text-sm md:text-base bg-white text-pink-600 border-2 border-pink-600 font-sofia font-bold hover:bg-pink-100 hover:text-pink-600 hover:border-pink-600 p-[0.2rem] md:p-2 rounded mb-3 md:mb-2"
          onClick={handleReset}
        >
          Reset Filter
        </button>
      </div>
    </div>
  );
}

export function VendorList({ vendors }: { vendors: Vendor[] }) {
  const router = useRouter(); // Initialize useRouter for navigation
  const itemsPerPage = 5; // Set the number of items per page to 5
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const paginatedVendors = vendors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(vendors.length / itemsPerPage);

  return (
    <div className="w-full md:w-3/4 p-5 md:p-6 mr-4 bg-white rounded-2xl">
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
            placeholder="Cari kebutuhan vendormu"
            className="w-full text-sm md:text-base p-1 md:p-2 pl-9 md:pl-12 border rounded bg-white text-black font-sofia"
          />
        </div>
      </div>
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-pink-900 font-sofia">Semua Paket</h2>
      <div className="flex flex-col gap-4">
        {paginatedVendors.map((vendor) => (
          <div key={vendor.id} className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col md:flex-row justify-between relative">
            <Image
              src={vendor.image}
              alt={`${vendor.name} Image`}
              width={400}
              height={200}
              className="object-cover w-40 md:w-80"
            />
            <div className="p-3 md:p-4 flex-grow font-sofia">
              <h3 className="text-lg md:text-xl text-pink-900 font-bold mb-2">{vendor.name}</h3>
              <p className="text-sm md:text-base text-gray-700 font-sofia">{vendor.description}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-lg md:text-xl font-bold text-pink-600">Rp{vendor.price.toLocaleString('id-ID')}</span>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <div className="flex flex-col gap-2">
                  <p className="text-sm md:text-base text-gray-700 font-sofia">Rincian Paket:</p>
                  <ul className="list-disc pl-5 text-gray-700 text-sm md:text-base">
                    {vendor.listPackage.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <Link legacyBehavior href={`/paket-event/${vendor.id}`}>
                  <a className="absolute bottom-4 right-4 text-sm md:text-base bg-pink-600 text-white font-semibold px-3 py-2 rounded">Lihat Detail</a>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
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

// Sample data
const dummyVendors: Vendor[] = [
  {
    id: 1,
    name: 'Ballroom A',
    image: '/Image/partyevent.jpg',
    price: 10000000,
    description: 'Paket ulang tahun yang cocok untuk kantong pelajar, murah dan berkelas untuk membuat ulang tahunmu semakin berkesan.',
    listPackage: ['Gedung Sabuga ITB', 'Set sound system - Raka Sound', 'Dekorasi Tema lautan', 'Catering - Sari Rasa']
  },
  {
    id: 2,
    name: 'Hall B',
    image: '/Image/partyevent.jpg',
    price: 15000000,
    description: 'Sweet Seventeen Anda hanya sekali seumur hidup, jangan lewatkan memori indah yang akan Anda ingat selamanya. Paket ini menawarkan perencanaan ulang tahun mewah dan elegan bernuansa pantai Bali.',
    listPackage: ['Gedung Sabuga ITB', 'Set sound system - Raka Sound', 'Dekorasi Tema lautan']
  },
  {
    id: 3,
    name: 'Event Space C',
    image: '/Image/partyevent.jpg',
    price: 20000000,
    description: 'Perfect event space for corporate events.',
    listPackage: ['Gedung Sabuga ITB', 'Set sound system - Raka Sound', 'Dekorasi Tema lautan']
  },
  {
    id: 4,
    name: 'Venue D',
    image: '/Image/partyevent.jpg',
    price: 25000000,
    description: 'Luxury venue for special occasions.',
    listPackage: ['Gedung Sabuga ITB', 'Set sound system - Raka Sound', 'Dekorasi Tema lautan']
  },
  {
    id: 5,
    name: 'Conference Room E',
    image: '/Image/partyevent.jpg',
    price: 5000000,
    description: 'Ideal for conferences and seminars.',
    listPackage: ['Gedung Sabuga ITB', 'Set sound system - Raka Sound', 'Dekorasi Tema lautan']
  },
  {
    id: 6,
    name: 'Outdoor Venue F',
    image: '/Image/partyevent.jpg',
    price: 7500000,
    description: 'Beautiful outdoor space for any event.',
    listPackage: ['Gedung Sabuga ITB', 'Set sound system - Raka Sound', 'Dekorasi Tema lautan']
  },
  {
    id: 7,
    name: 'Banquet Hall G',
    image: '/Image/partyevent.jpg',
    price: 12500000,
    description: 'Elegant banquet hall for weddings and receptions.',
    listPackage: ['Gedung Sabuga ITB', 'Set sound system - Raka Sound', 'Dekorasi Tema lautan']
  },
];