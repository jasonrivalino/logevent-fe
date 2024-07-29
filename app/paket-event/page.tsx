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
  description: string;
  type: string;
  image: string;
  rate: number;
  location: string;
  price: number;
  listPackage: string[]; // Add listPackage property
}

interface VendorListProps {
  vendors: Vendor[];
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

export function VendorList({ vendors }: VendorListProps) {
  const router = useRouter();
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedPackages, setExpandedPackages] = useState<{ [key: number]: boolean }>({});

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDetailClick = (id: number) => {
    router.push(`/paket-event/info-detail`);
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
              className="object-cover w-80 h-28 md:h-auto"
            />
            <div className="p-3 md:p-4 md:ml-3 flex-grow font-sofia">
              <h3 className="text-base md:text-xl text-pink-900 font-bold">{vendor.name}</h3>
              {/* <p className="text-xs md:text-sm text-gray-700">{vendor.type}</p> */}
              <p className="text-xs md:text-sm text-gray-700 flex flex-row">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 md:h-4 w-3 md:w-4 text-yellow-500 mr-[0.3rem] mt-[0.075rem] md:mt-[0.05rem]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.14 3.51a1 1 0 00.95.69h3.7c.967 0 1.372 1.24.588 1.81l-2.992 2.179a1 1 0 00-.364 1.118l1.14 3.51c.3.921-.755 1.688-1.54 1.118l-2.992-2.178a1 1 0 00-1.175 0l-2.992 2.178c-.785.57-1.84-.197-1.54-1.118l1.14-3.51a1 1 0 00-.364-1.118L2.93 8.937c-.784-.57-.38-1.81.588-1.81h3.7a1 1 0 00.95-.69l1.14-3.51z" />
                </svg> {vendor.rate}
              </p>
              <p className="text-xs md:text-sm text-gray-700 mb-3">{vendor.location}</p>
              <p className="line-clamp-3 text-xs md:text-sm text-gray-700 font-sofia">{vendor.description}</p>
              <div className="mt-1 mb-2 flex justify-between items-center">
                <span className="text-base md:text-lg font-bold text-pink-600">Rp{vendor.price.toLocaleString('id-ID')}</span>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <div className="flex flex-col">
                  <p className="text-xs md:text-sm text-gray-700 font-sofia">Rincian Paket:</p>
                  <p className="text-xs md:text-sm text-gray-700 w-full md:w-[36rem] mb-14 md:mb-0">
                    {expandedPackages[vendor.id]
                      ? vendor.listPackage.join(', ')
                      : vendor.listPackage.join(', ')}
                  </p>
                </div>
                <button
                  className="absolute bottom-4 right-4 text-sm md:text-base bg-pink-600 hover:bg-pink-800 text-white font-semibold px-3 py-1 md:py-2 rounded"
                  onClick={() => handleDetailClick(vendor.id)}
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

const dummyVendors: Vendor[] = [
  {
    id: 1,
    name: 'Ballroom A',
    description: 'Paket ulang tahun yang cocok untuk kantong pelajar, murah dan berkelas untuk membuat ulang tahunmu semakin berkesan. Dapatkan harga spesial untuk ulang tahunmu di Ballroom A. Tersedia berbagai pilihan paket yang bisa disesuaikan dengan kebutuhanmu. Jangan lewatkan kesempatan ini, segera pesan sekarang!',
    type: 'Ballroom',
    image: '/Image/partyevent.jpg',
    rate: 4.5,
    location: 'Lebak Bulus, Jakarta',
    price: 10000000,
    listPackage: ['Gedung Sabuga ITB', 'Set sound system - Raka Sound', 'Dekorasi Tema lautan', 'Catering - Sari Rasa', 'Marina Catering', 'Photobooth - Snapy' ]
  },
  {
    id: 2,
    name: 'Hall B',
    description: 'Sweet Seventeen Anda hanya sekali seumur hidup, jangan lewatkan memori indah yang akan Anda ingat selamanya. Paket ini menawarkan perencanaan ulang tahun mewah dan elegan bernuansa pantai Bali.',
    type: 'Hall',
    image: '/Image/partyevent.jpg',
    rate: 4.7,
    location: 'Cihampelas, Bandung',
    price: 15000000,
    listPackage: ['Gedung Sabuga ITB', 'Set sound system - Raka Sound', 'Dekorasi Tema lautan']
  },
  {
    id: 3,
    name: 'Event Space C',
    description: 'Perfect event space for corporate events.',
    type: 'Event Space',
    image: '/Image/partyevent.jpg',
    rate: 4.3,
    location: 'Pakuwon, Surabaya',
    price: 20000000,
    listPackage: ['Gedung Sabuga ITB', 'Set sound system - Raka Sound', 'Dekorasi Tema lautan']
  },
  {
    id: 4,
    name: 'Venue D',
    description: 'Luxury venue for special occasions.',
    type: 'Venue',
    image: '/Image/partyevent.jpg',
    rate: 4.8,
    location: 'Denpasar, Bali',
    price: 25000000,
    listPackage: ['Gedung Sabuga ITB', 'Set sound system - Raka Sound', 'Dekorasi Tema lautan']
  },
  {
    id: 5,
    name: 'Conference Room E',
    description: 'Ideal for conferences and seminars.',
    type: 'Conference Room',
    image: '/Image/partyevent.jpg',
    rate: 4.2,
    location: 'Malioboro, Yogyakarta',
    price: 5000000,
    listPackage: ['Gedung Sabuga ITB', 'Set sound system - Raka Sound', 'Dekorasi Tema lautan']
  },
  {
    id: 6,
    name: 'Outdoor Venue F',
    description: 'Beautiful outdoor space for any event.',
    type: 'Outdoor Venue',
    image: '/Image/partyevent.jpg',
    rate: 4.6,
    location: 'Lombok, NTT',
    price: 7500000,
    listPackage: ['Gedung Sabuga ITB', 'Set sound system - Raka Sound', 'Dekorasi Tema lautan']
  },
  {
    id: 7,
    name: 'Banquet Hall G',
    description: 'Elegant banquet hall for weddings and receptions.',
    type: 'Banquet Hall',
    image: '/Image/partyevent.jpg',
    rate: 4.9,
    location: 'Medan, Sumatera Utara',
    price: 12500000,
    listPackage: ['Gedung Sabuga ITB', 'Set sound system - Raka Sound', 'Dekorasi Tema lautan']
  }
];