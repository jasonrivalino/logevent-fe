'use client';
import React, { useState } from 'react';
import { ContactBox, Navbar } from '../../../page';
import { useRouter, usePathname } from 'next/navigation';
import { CommandLeft } from '../../commandLeft';
import Image from 'next/image';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

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
    },
    {
      id: 12,
      name: 'Museum Konferensi Asia Afrika',
      type: 'Multifunctional Hall',
      location: 'Dago, Bandung',
      price: 25000000,
      rate: 4.5,
      image: '/Image/planetarium.jpg',
    },
    {
      id: 13,
      name: 'Museum Konferensi Asia Afrika',
      type: 'Multifunctional Hall',
      location: 'Dago, Bandung',
      price: 25000000,
      rate: 4.5,
      image: '/Image/planetarium.jpg',
    }
  ];

export default function AdminEventPackage() {
    return (
      <div>
        <div className="min-h-screen flex flex-col p-10 mt-16">
            <Navbar />
            <div className="flex flex-col md:flex-row flex-grow">
                <CommandLeft />
                <div className="flex-grow ml-0 md:ml-7 py-[0.15rem]">
                    <ManageVendorProduct vendors={dummyVendors} />
                </div>
            </div>
        </div>
        <ContactBox />
      </div>
    );
}

function ManageVendorProduct({ vendors }: { vendors: Vendor[] }) {
  const router = useRouter();
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [vendorList, setVendorList] = useState(vendors); // Add state to manage vendors list

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowPopup(true);
  };

  const handleDelete = () => {
    if (selectedVendor) {
      console.log(`Delete vendor ${selectedVendor.id}`);
      setVendorList(vendorList.filter(vendor => vendor.id !== selectedVendor.id)); // Update the vendor list
    }
    setShowPopup(false);
    setSelectedVendor(null);
  };

  const paginatedVendors = vendorList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(vendorList.length / itemsPerPage);

  return (
    <div className="px-8 pt-6 pb-10 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-pink-900 font-sofia">Welcome Admin LogEvent!</h1>
      {/* Breadcrumb Navigation */}
      <div className="hidden md:flex items-center mb-6">
        <div className="flex items-center">
          <a onClick={() => router.push('/admin/manage-vendor')} className="text-pink-600 font-semibold font-sofia cursor-pointer">Kelola Vendor</a>
          <span className="mx-2 text-gray-600 font-sofia font-semibold"> {'>'} </span>
          <span className="text-gray-600 font-sofia font-semibold">Kelola Produk</span>
        </div>
        {/* Search Bar */}
        <div className="flex items-center ml-auto">
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
      </div>
      <div className="flex items-center justify-between bg-white rounded-xl p-3 mb-6 shadow-md border-pink-600 border-2 font-sofia">
        <div className="flex items-center ml-5">
          <span className="text-lg md:text-xl text-pink-900 font-bold mr-4">Vendor B</span>
        </div>
        <div className="flex items-center">
          <span className="text-sm md:text-base text-gray-700 px-5">Jumlah Produk: 17</span>
          <button className="bg-pink-500 text-white px-3 py-1 rounded-full font-bold text-xs md:text-base mr-4" onClick={() => router.push('/admin/manage-vendor/product/add')}>
            + Tambah Produk
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {paginatedVendors.map((vendor) => (
          <div key={vendor.id} className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col justify-between">
            <Image
              src={vendor.image}
              alt={`${vendor.name} Image`}
              width={245}
              height={50}
              className="object-cover"
            />
            <div className="p-3 md:p-3 font-sofia flex flex-col justify-between flex-grow">
              <div>
                <h3 className="text-sm md:text-base text-pink-900 font-bold mb-2">{vendor.name}</h3>
                <p className="text-xs md:text-sm text-gray-700">{vendor.type}</p>
                <p className="text-xs md:text-sm text-gray-500 flex flex-row">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 md:h-4 w-3 md:w-4 text-yellow-500 mr-[0.3rem] mt-[0.075rem] md:mt-[0.05rem]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.14 3.51a1 1 0 00.95.69h3.7c.967 0 1.372 1.24.588 1.81l-2.992 2.179a1 1 0 00-.364 1.118l1.14 3.51c.3.921-.755 1.688-1.54 1.118l-2.992-2.178a1 1 0 00-1.175 0l-2.992 2.178c-.785.57-1.84-.197-1.54-1.118l1.14-3.51a1 1 0 00-.364-1.118L2.93 8.937c-.784-.57-.38-1.81.588-1.81h3.7a1 1 0 00.95-.69l1.14-3.51z" />
                  </svg> {vendor.rate}
                </p>
                <p className="text-xs md:text-sm text-gray-500">{vendor.location}</p>
                <p className="text-xs md:text-sm text-pink-500 font-bold mt-2">Rp {vendor.price.toLocaleString('id-ID')}</p>
              </div>
              <div className="flex justify-between items-center mt-4">
                <button
                  className="text-xs md:text-base text-pink-500 hover:text-pink-700 font-bold"
                  onClick={() => router.push(`/logistik-vendor/info-detail`)}
                >
                  Lihat Detail
                </button>
                <div className="flex space-x-2">
                  <FaEdit
                    className="text-pink-500 cursor-pointer hover:text-pink-700"
                    onClick={() => router.push('/admin/manage-vendor/product/edit')}
                  />
                  <FaTrashAlt
                    className="text-pink-500 cursor-pointer hover:text-pink-700"
                    onClick={() => handleDeleteClick(vendor)}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-500 text-white p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 8v4m0 4h.01m0-4h-.01m-.01 0h.01M11 8v4m0 4h.01m0-4h-.01m-.01 0h.01" />
                </svg>
              </div>
            </div>
            <p className="mb-4 text-black font-sofia">Apakah Anda yakin ingin menghapus produk ini?</p>
            <p className="mb-6 text-black font-sofia">Dengan menekan tombol ya maka produk yang dipilih akan terhapus dan pengunjung tidak akan dapat melihatnya lagi </p>
            <div className="flex justify-center space-x-4 font-sofia">
              <button className="bg-gray-500 text-white px-4 py-2 rounded-md" onClick={() => setShowPopup(false)}>Tidak</button>
              <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={handleDelete}>Ya</button>
            </div>
          </div>
        </div>
      )}
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