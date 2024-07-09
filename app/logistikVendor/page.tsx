'use client';

import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Navbar, ContactBox } from '../page';
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
    name: 'Gedung Indonesia Menggugat',
    type: 'Multifunctional Hall',
    location: 'Dago, Bandung',
    price: 25000000,
    rate: 4.5,
    image: '/Image/planetarium.jpg',
  },
  {
    id: 9,
    name: 'Gedung Indonesia Menggugat',
    type: 'Multifunctional Hall',
    location: 'Dago, Bandung',
    price: 25000000,
    rate: 4.5,
    image: '/Image/planetarium.jpg',
  },
  {
    id: 10,
    name: 'Gedung Indonesia Menggugat',
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
          <title>Vendor Logistik</title>
        </Head>
        <Navbar />
        <div className="flex flex-col md:flex-row py-24">
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
    <div className="w-full md:w-1/4 pl-4 pr-8 py-4 border-r border-gray-200 mb-4 md:mb-0">
      <h2 className="text-2xl font-semibold font-sofia text-black mb-4">Filter by</h2>
      <div className="mb-4">
        <label htmlFor="category" className="block mb-2 text-gray-700 font-sofia">Kategori Vendor</label>
        <select id="category" className="w-full p-2 border rounded bg-white text-black font-sofia">
          <option value="" className="font-sofia">Pilih kategori vendor</option>
          <option value="Multifunctional Hall" className="font-sofia">Multifunctional Hall</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="location" className="block mb-2 text-gray-700 font-sofia">Lokasi Vendor</label>
        <select id="location" className="w-full p-2 border rounded bg-white text-black font-sofia">
          <option value="" className="font-sofia">Pilih lokasi vendor</option>
          <option value="Jakarta" className="font-sofia">Jakarta</option>
          <option value="Jawa Barat" className="font-sofia">Jawa Barat</option>
          <option value="Jawa Tengah" className="font-sofia">Jawa Tengah</option>
          <option value="Jawa Timur" className="font-sofia">Jawa Timur</option>
        </select>
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

export function VendorList({ vendors }: { vendors: Vendor[] }) {
  const router = useRouter(); // Initialize useRouter for navigation

  return (
    <div className="w-full md:w-3/4 p-8 mr-4 bg-white rounded-2xl">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center mb-4">
        <a onClick={() => router.push('/')} className="text-pink-600 font-semibold font-sofia cursor-pointer">Home</a>
        <span className="mx-2 text-gray-600 font-sofia font-semibold"> {'>'} </span>
        <span className="text-gray-600 font-sofia font-semibold">Logistik Vendor</span>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l4.287 4.287a1 1 0 01-1.414 1.414l-4.287-4.287zM8 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Cari kebutuhan vendormu"
            className="w-full p-2 pl-12 border rounded bg-white text-black font-sofia"
          />
        </div>
      </div>
      <h2 className="text-2xl font-semibold mb-4 text-pink-900 font-sofia">Semua Venue</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {vendors.map((vendor) => (
          <div key={vendor.id} className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col justify-between">
            <Image
              src={vendor.image}
              alt={`${vendor.name} Image`}
              width={400}
              height={200}
              className="object-cover"
            />
            <div className="p-4 font-sofia flex flex-col justify-between flex-grow">
              <div>
                <h3 className="text-xl text-pink-900 font-bold mb-2">{vendor.name}</h3>
                <p className="text-gray-700">{vendor.type}</p>
                <p className="text-gray-500">Rating: {vendor.rate}</p>
                <p className="text-gray-500">{vendor.location}</p>
              </div>
              <button className="self-start text-pink-500 hover:text-pink-700 font-bold mt-4">
                Lihat Detail
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}