'use client';

import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '../page';
import { useRouter } from 'next/navigation'; // Import useRouter from Next.js for routing

interface Vendor {
  id: number;
  name: string;
  type: string;
  location: string;
  price: number;
  rate: number;
  image: string;
}

const dummyVendors: Vendor[] = [
  {
    id: 1,
    name: 'Gedung Sabuga ITB',
    type: 'Multifunctional Hall',
    location: 'Dago, Bandung',
    price: 25000000,
    rate: 5.0,
    image: '/Image/planetarium.jpg',
  },
  {
    id: 2,
    name: 'Institut Francais Indonesia',
    type: 'Multifunctional Hall',
    location: 'Dago, Bandung',
    price: 25000000,
    rate: 4.5,
    image: '/Image/planetarium.jpg',
  },
  {
    id: 3,
    name: 'Balai Sartika',
    type: 'Multifunctional Hall',
    location: 'Dago, Bandung',
    price: 25000000,
    rate: 4.5,
    image: '/Image/planetarium.jpg',
  },
  {
    id: 4,
    name: 'Gedung Merdeka',
    type: 'Multifunctional Hall',
    location: 'Dago, Bandung',
    price: 25000000,
    rate: 4.5,
    image: '/Image/planetarium.jpg',
  },
  {
    id: 5,
    name: 'Gedung Sate',
    type: 'Multifunctional Hall',
    location: 'Dago, Bandung',
    price: 25000000,
    rate: 4.5,
    image: '/Image/planetarium.jpg',
  },
  {
    id: 6,
    name: 'Gedung Merah Putih',
    type: 'Multifunctional Hall',
    location: 'Dago, Bandung',
    price: 25000000,
    rate: 4.5,
    image: '/Image/planetarium.jpg',
  },
  {
    id: 7,
    name: 'Gedung Indonesia Menggugat',
    type: 'Multifunctional Hall',
    location: 'Dago, Bandung',
    price: 25000000,
    rate: 4.5,
    image: '/Image/planetarium.jpg',
  },
  {
    id: 8,
    name: 'Asia Africa Museum',
    type: 'Multifunctional Hall',
    location: 'Dago, Bandung',
    price: 25000000,
    rate: 4.5,
    image: '/Image/planetarium.jpg',
  },
  {
    id: 9,
    name: 'Geology Museum',
    type: 'Multifunctional Hall',
    location: 'Dago, Bandung',
    price: 25000000,
    rate: 4.5,
    image: '/Image/planetarium.jpg',
  },
  {
    id: 10,
    name: 'Museum Konferensi Asia Afrika',
    type: 'Multifunctional Hall',
    location: 'Dago, Bandung',
    price: 25000000,
    rate: 4.5,
    image: '/Image/planetarium.jpg',
  },
  {
    id: 11,
    name: 'Museum Konferensi Asia Afrika',
    type: 'Multifunctional Hall',
    location: 'Dago, Bandung',
    price: 25000000,
    rate: 4.5,
    image: '/Image/planetarium.jpg',
  }
];

export default function LogistikVendor() {
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
      <div className="p-4">
        <Head>
          <title>Logistik Vendor</title>
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
        <label htmlFor="category" className="block mb-1 md:mb-2 text-gray-700 font-sofia text-sm md:text-base">Kategori Vendor</label>
        <select id="category" className="w-full p-[0.35rem] md:p-2 text-xs md:text-base border rounded bg-white text-black font-sofia">
          <option value="" className="font-sofia">Pilih kategori vendor</option>
          <option value="Multifunctional Hall" className="font-sofia">Multifunctional Hall</option>
        </select>
      </div>
      <div className="flex md:flex-col flex-row">
        <div className="mb-2 md:mb-4 mr-4 md:mr-0">
          <label htmlFor="location" className="block mb-1 md:mb-2 text-gray-700 font-sofia text-sm md:text-base">Lokasi Vendor</label>
          <select id="location" className="w-32 md:w-full p-[0.35rem] md:p-2 text-xs md:text-base border rounded bg-white text-black font-sofia">
            <option value="" className="font-sofia">Pilih lokasi vendor</option>
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
  const itemsPerPage = 10;
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
        <span className="text-gray-600 font-sofia font-semibold">Logistik Vendor</span>
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
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-pink-900 font-sofia">Semua Venue</h2>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {paginatedVendors.map((vendor) => (
          <div key={vendor.id} className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col justify-between">
            <Image
              src={vendor.image}
              alt={`${vendor.name} Image`}
              width={400}
              height={200}
              className="object-cover"
            />
            <div className="p-3 md:p-3 font-sofia flex flex-col justify-between flex-grow">
              <div>
                <h3 className="text-sm md:text-base text-pink-900 font-bold mb-2">{vendor.name}</h3>
                <p className="text-xs md:text-sm text-gray-700">{vendor.type}</p>
                <p className="text-xs md:text-sm text-gray-500 flex flex-row">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className= "h-3 md:h-4 w-3 md:w-4 text-yellow-500 mr-[0.3rem] mt-[0.075rem] md:mt-[0.05rem]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.14 3.51a1 1 0 00.95.69h3.7c.967 0 1.372 1.24.588 1.81l-2.992 2.179a1 1 0 00-.364 1.118l1.14 3.51c.3.921-.755 1.688-1.54 1.118l-2.992-2.178a1 1 0 00-1.175 0l-2.992 2.178c-.785.57-1.84-.197-1.54-1.118l1.14-3.51a1 1 0 00-.364-1.118L2.93 8.937c-.784-.57-.38-1.81.588-1.81h3.7a1 1 0 00.95-.69l1.14-3.51z" />
                  </svg> {vendor.rate}
                </p>
                <p className="text-xs md:text-sm text-gray-500">{vendor.location}</p>
              </div>
              <button className="self-start text-xs md:text-base text-pink-500 hover:text-pink-700 font-bold mt-4">
                Lihat Detail
              </button>
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

export function ContactBox() {
  return (
    <footer className="w-full bg-pink-900 text-white py-8 -mt-12">
      <div className="container mx-auto flex flex-col items-center">
        {/* Logo and Text */}
        <div className="text-center mb-6">
          <div className="flex flex-col items-center">
            <Image src="/Image/logo.png" alt="Logevent Logo" width={60} height={60} className='mb-2 cursor-pointer'/>
            <p className="mt-2 mb-4 font-sofia">Jangan khawatir pusing nyari vendor, Logevent solusinya</p>
          </div>
        </div>
        
        {/* Social Media Links */}
        <div className="flex space-x-6">
          <Link href="https://www.instagram.com" aria-label="Instagram" className="hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-8 w-8" viewBox="0 0 24 24">
              <path d="M12 2.2c3.2 0 3.6.012 4.847.07 1.211.057 1.995.243 2.452.51.52.297.896.68 1.192 1.192.268.457.453 1.241.51 2.452.058 1.247.07 1.647.07 4.847s-.012 3.6-.07 4.847c-.057 1.211-.243 1.995-.51 2.452-.297.52-.68.896-1.192 1.192-.457.268-1.241.453-2.452.51-1.247.058-1.647.07-4.847.07s-3.6-.012-4.847-.07c-1.211-.057-1.995-.243-2.452-.51-.52-.297-.896-.68-1.192-1.192-.268-.457-.453-1.241-.51-2.452-.058-1.247-.07-1.647-.07-4.847s.012-3.6.07-4.847c.057-1.211.243-1.995.51-2.452.297-.52.68-.896 1.192-1.192.457-.268 1.241-.453 2.452-.51 1.247-.058 1.647-.07 4.847-.07zm0-2.2c-3.274 0-3.685.015-4.973.072-1.331.059-2.24.273-3.034.63-.827.374-1.528.875-2.274 1.621-.746.746-1.247 1.447-1.621 2.274-.357.794-.571 1.703-.63 3.034-.057 1.288-.072 1.699-.072 4.973s.015 3.685.072 4.973c.059 1.331.273 2.24.63 3.034.374.827.875 1.528 1.621 2.274.746.746 1.447 1.247 2.274 1.621.794.357 1.703.571 3.034.63 1.288.057 1.699.072 4.973.072s3.685-.015 4.973-.072c1.331-.059 2.24-.273 3.034-.63.827-.374 1.528-.875 2.274-1.621.746-.746 1.247-1.447 1.621-2.274.357-.794.571-1.703.63-3.034.057-1.288.072-1.699.072-4.973s-.015-3.685-.072-4.973c-.059-1.331-.273-2.24-.63-3.034-.374-.827-.875-1.528-1.621-2.274-.746-.746-1.447-1.247-2.274-1.621-.794-.357-1.703-.571-3.034-.63-1.288-.057-1.699-.072-4.973-.072zm0 5.76a6.24 6.24 0 100 12.48 6.24 6.24 0 000-12.48zm0 10.34a4.1 4.1 0 110-8.2 4.1 4.1 0 010 8.2zm7.2-10.88a1.44 1.44 0 110-2.88 1.44 1.44 0 010 2.88z"/>
            </svg>
          </Link>
          <Link href="https://www.facebook.com" aria-label="Facebook" className="hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-8 w-8" viewBox="0 0 24 24">
              <path d="M22.675 0h-21.35c-.731 0-1.325.594-1.325 1.325v21.351c0 .731.594 1.325 1.325 1.325h11.495v-9.283h-3.12v-3.622h3.12v-2.671c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.463.099 2.796.143v3.24l-1.918.001c-1.505 0-1.797.715-1.797 1.764v2.311h3.587l-.467 3.622h-3.12v9.283h6.116c.731 0 1.325-.594 1.325-1.325v-21.351c0-.731-.594-1.325-1.325-1.325z"/>
            </svg>
          </Link>
          <Link href="mailto:support@Logevent.com" aria-label="Email" className="hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-8 w-8" viewBox="0 0 24 24">
              <path d="M22 4h-20c-1.104 0-2 .896-2 2v12c0 1.104.896 2 2 2h20c1.104 0 2-.896 2-2v-12c0-1.104-.896-2-2-2zm-1.4 2l-8.6 5.7-8.6-5.7h17.2zm-18.6 12v-10.6l7.6 5.04c.227.15.491.226.764.226.273 0 .537-.075.764-.226l7.608-5.04v10.6h-16.736z"/>
            </svg>
          </Link>
          <Link href="https://www.twitter.com" aria-label="Twitter" className="hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-8 w-8" viewBox="0 0 24 24">
              <path d="M24 4.557a9.9 9.9 0 01-2.828.775 4.927 4.927 0 002.165-2.724 9.865 9.865 0 01-3.127 1.195 4.916 4.916 0 00-8.389 4.482 13.953 13.953 0 01-10.141-5.144 4.92 4.92 0 001.523 6.574 4.89 4.89 0 01-2.228-.615c-.053 2.281 1.584 4.415 3.946 4.89a4.935 4.935 0 01-2.224.084c.627 1.955 2.445 3.376 4.604 3.416a9.874 9.874 0 01-6.102 2.102c-.397 0-.788-.023-1.175-.069a13.951 13.951 0 007.548 2.212c9.058 0 14.01-7.504 14.01-14.009 0-.214-.005-.428-.014-.641a10.014 10.014 0 002.457-2.548z"/>
            </svg>
          </Link>
        </div>
      </div>
    </footer>
  );
}