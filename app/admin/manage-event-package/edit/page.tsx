'use client';
import React, { useState, useEffect } from 'react';
import { ContactBox, Navbar } from '../../../page';
import { useRouter, usePathname } from 'next/navigation';
import { CommandLeft } from '../../commandLeft';
import Image from 'next/image';

interface Vendor {
    id: number;
    name: string;
    type: string;
    location: string;
    price: number;
    rate: number;
    image: string;
    owner: string;
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
      owner: 'Universitas Indonesia',
    },
    {
      id: 2,
      name: 'Institut Francais Indonesia',
      type: 'Multifunctional Hall',
      location: 'Dago, Bandung',
      price: 25000000,
      rate: 4.5,
      image: '/Image/planetarium.jpg',
      owner: 'Universitas Indonesia',
    },
    {
      id: 3,
      name: 'Balai Sartika',
      type: 'Multifunctional Hall',
      location: 'Dago, Bandung',
      price: 25000000,
      rate: 4.5,
      image: '/Image/planetarium.jpg',
      owner: 'Universitas Indonesia',
    },
    {
      id: 4,
      name: 'Gedung Merdeka',
      type: 'Multifunctional Hall',
      location: 'Dago, Bandung',
      price: 25000000,
      rate: 4.5,
      image: '/Image/planetarium.jpg',
      owner: 'Universitas Indonesia',
    },
    {
      id: 5,
      name: 'Gedung Sate',
      type: 'Multifunctional Hall',
      location: 'Dago, Bandung',
      price: 25000000,
      rate: 4.5,
      image: '/Image/planetarium.jpg',
      owner: 'Universitas Indonesia',
    },
    {
      id: 6,
      name: 'Gedung Merah Putih',
      type: 'Multifunctional Hall',
      location: 'Dago, Bandung',
      price: 25000000,
      rate: 4.5,
      image: '/Image/planetarium.jpg',
      owner: 'Universitas Indonesia',
    },
    {
      id: 7,
      name: 'Gedung Indonesia Menggugat',
      type: 'Multifunctional Hall',
      location: 'Dago, Bandung',
      price: 25000000,
      rate: 4.5,
      image: '/Image/planetarium.jpg',
      owner: 'Universitas Indonesia',
    },
    {
      id: 8,
      name: 'Asia Africa Museum',
      type: 'Multifunctional Hall',
      location: 'Dago, Bandung',
      price: 25000000,
      rate: 4.5,
      image: '/Image/planetarium.jpg',
      owner: 'Universitas Indonesia',
    },
    {
      id: 9,
      name: 'Geology Museum',
      type: 'Multifunctional Hall',
      location: 'Dago, Bandung',
      price: 25000000,
      rate: 4.5,
      image: '/Image/planetarium.jpg',
      owner: 'Universitas Indonesia',
    },
    {
      id: 10,
      name: 'Museum Konferensi Asia Afrika',
      type: 'Multifunctional Hall',
      location: 'Dago, Bandung',
      price: 25000000,
      rate: 4.5,
      image: '/Image/planetarium.jpg',
      owner: 'Universitas Indonesia',
    },
    {
      id: 11,
      name: 'Museum Konferensi Asia Afrika',
      type: 'Multifunctional Hall',
      location: 'Dago, Bandung',
      price: 25000000,
      rate: 4.5,
      image: '/Image/planetarium.jpg',
      owner: 'Universitas Indonesia',
    },
    {
      id: 12,
      name: 'Museum Konferensi Asia Afrika',
      type: 'Multifunctional Hall',
      location: 'Dago, Bandung',
      price: 25000000,
      rate: 4.5,
      image: '/Image/planetarium.jpg',
      owner: 'Universitas Indonesia',
    },
    {
      id: 13,
      name: 'Museum Konferensi Asia Afrika',
      type: 'Multifunctional Hall',
      location: 'Dago, Bandung',
      price: 25000000,
      rate: 4.5,
      image: '/Image/planetarium.jpg',
      owner: 'Universitas Indonesia',
    }
  ];

export default function AdminEventPackage() {
    const router = useRouter();

    const handleBackClick = () => {
      router.push('/admin/manage-event-package');
    };

    return (
      <div className="overflow-hidden">
        <Navbar />
          <div className="min-h-screen flex flex-col px-6 md:p-10 mt-16">
                <div className="flex flex-col md:flex-row flex-grow">
                    <div className="md:hidden flex justify-center items-center">
                        {/* Back button with SVG arrow */}
                        <button 
                          onClick={handleBackClick} 
                          className="absolute top-20 left-4 p-2 rounded-full bg-white text-black shadow-lg flex items-center justify-center w-10 h-10 md:w-12 md:h-12 hover:bg-gray-100"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-6 h-6 text-gray-700"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                    </div>
                    <div className="hidden md:block">
                        <CommandLeft />
                    </div>
                <div className="flex-grow ml-0 md:ml-7 pt-10 md:pt-[0.15rem] pb-10 md:pb-0">
                    <EditPackageProduct />
                </div>
            </div>
        </div>
      </div>
    );
}

function EditPackageProduct() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedPriceUnit, setSelectedPriceUnit] = useState('');
    const [photos, setPhotos] = useState<File[]>([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [paginatedVendors, setPaginatedVendors] = useState(dummyVendors);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedVendors, setSelectedVendors] = useState<number[]>([1, 2, 3]);  
    const itemsPerPage = 10;

    const handleSearch = (event: { target: { value: string; }; }) => {
      const query = event.target.value.toLowerCase();
      setSearchQuery(query);
      const filteredVendors = dummyVendors.filter((vendor) =>
        vendor.name.toLowerCase().includes(query) ||
        vendor.type.toLowerCase().includes(query) ||
        vendor.location.toLowerCase().includes(query)
      );
      setPaginatedVendors(filteredVendors);
      setCurrentPage(1);
    };

    useEffect(() => {
      if (isPopupOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
      return () => {
        document.body.style.overflow = 'auto';
      };
    }, [isPopupOpen]);

    const handleCategoryChange = (event: { target: { value: any; }; }) => {
      const category = event.target.value;
      setSelectedCategory(category);
    };

    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files ? Array.from(event.target.files) : [];
      if (photos.length + files.length <= 5) {
        setPhotos([...photos, ...files as File[]]);
      } else {
        alert("You can only upload a maximum of 5 photos.");
      }
    };

    const handleRemovePhoto = (index: number) => {
      const newPhotos = photos.filter((_, i) => i !== index);
      setPhotos(newPhotos);
    };

    const togglePopup = () => {
      setIsPopupOpen(!isPopupOpen);
    };

    const handlePageChange = (newPage: React.SetStateAction<number>) => {
      setCurrentPage(newPage);
    };

    const handleVendorSelection = (vendorId: any) => {
      if (selectedVendors.includes(vendorId)) {
        setSelectedVendors(selectedVendors.filter(id => id !== vendorId));
      } else {
        setSelectedVendors([...selectedVendors, vendorId]);
      }
    };

    const totalPages = Math.ceil(paginatedVendors.length / itemsPerPage);
    const displayedVendors = paginatedVendors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const selectedVendorDetails = dummyVendors.filter(vendor => selectedVendors.includes(vendor.id));

    return (
      <div className="px-5 md:px-6 pt-4 pb-6 bg-white rounded-xl shadow-md">
        {/* Text in center */}
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-3 text-pink-900 font-sofia text-center">Tambah Paket</h1>
        {/* Breadcrumb Navigation */}
        <div className="hidden md:flex items-center mb-4">
          <div className="flex items-center">
            <a onClick={() => router.push('/admin/manage-event-package')} className="text-pink-600 font-semibold font-sofia cursor-pointer">Kelola Paket</a>
            <span className="mx-2 text-gray-600 font-sofia font-semibold"> {'>'} </span>
            <p className="text-gray-600 font-sofia font-semibold">Tambah Paket</p>
          </div>
        </div>
        {/* Form */}
        <form className="grid grid-cols-1 gap-4 font-sofia text-black">
          <div className='flex flex-col md:flex-row'>
            <div className="w-full">
              <div className="flex flex-col md:flex-row md:space-x-6">
                <div className="w-full md:w-[66%]">
                  <label className="block text-gray-700 font-sofia text-sm md:text-base">Nama Paket *</label>
                  <p className="text-gray-500 text-xs md:text-sm font-sofia mb-2">Nama maksimal 40 karakter dengan memasukkan nama barang</p>
                  <input className="w-full px-2 md:px-4 py-1 md:py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 md:mb-0 mb-3" type="text" placeholder="Contoh: Gedung Sabuga ITB" maxLength={40} />
                </div>
                <div className="w-full md:w-[30%]">
                  <label className="block text-gray-700 font-sofia text-sm md:text-base">Kapasitas Paket</label>
                  <p className="text-gray-500 text-xs md:text-sm font-sofia mb-2">Kosongkan jika paket tidak memiliki kapasitas</p>
                  <input className="w-full px-2 md:px-4 py-1 md:py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600" type="text" placeholder="Kapasitas" />
                </div>  
              </div>
              <div className="md:flex space-x-6">
                <div className="w-full mt-3 md:mt-4">
                  <label className="block text-gray-700 font-sofia text-sm md:text-base">Deskripsi Paket *</label>
                  <p className="text-gray-500 text-xs md:text-sm font-sofia mb-2">Pastikan deskripsi paket memuat penjelasan detail terkait paketmu agar pembeli mudah mengerti dan menemukan paketmu</p>
                  <textarea rows={3} className="w-full px-2 md:px-4 py-1 md:py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600" placeholder="Gedung Sabuga ITB adalah gedung Sasana Budaya Ganesha"></textarea>
                </div>
              </div>
            </div>
            <div className="w-full mt-3 md:mt-0">
              <div className='flex flex-row md:ml-5'>
                <div className="flex flex-col">
                  <label className="block text-gray-700 font-sofia text-sm md:text-base">Bundle Logistik *</label>
                  <p className="text-gray-500 font-sofia mb-2 text-xs md:text-sm w-3/4 md:w-full">Pilih Bundle untuk dimasukkan dalam paket</p>
                </div>
                <label onClick={togglePopup} className="border bg-pink-600 px-1 md:px-2 py-1 md:-mt-1 mb-3 rounded-lg cursor-pointer flex justify-center items-center text-sm md:text-base ml-auto w-32 md:w-auto">
                  <span className="text-white">Select Bundle</span>
                </label>
              </div>
              <div className="w-full md:pl-5">
              <div className="border border-dashed border-gray-400 rounded-lg flex justify-start items-center overflow-x-auto whitespace-nowrap min-h-[10rem] md:min-h-[238px] w-full md:w-[33rem] px-5">
                {selectedVendorDetails.length === 0 ? (
                  <span className="text-gray-500">Select A Bundle</span>
                ) : (
                  selectedVendorDetails.map((vendor) => (
                    <div key={vendor.id} className="m-2 p-2 border rounded-lg flex flex-col items-center">
                      <Image
                        src={vendor.image}
                        alt={`${vendor.name} Image`}
                        width={120}
                        height={50}
                        className="object-cover rounded mb-4"
                      />
                      <p className="text-xs text-gray-700">{vendor.name}</p>
                      <p className="text-xs text-gray-500">{vendor.owner}</p>
                      <p className="text-xs text-gray-500">{vendor.type}</p>
                      <p className="text-xs text-gray-500">{vendor.location}</p>
                      <p className="text-xs text-pink-500 font-bold">Rp {vendor.price.toLocaleString('id-ID')}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-6">
            <div className="flex flex-col md:flex-row">
              <div className="w-full mb-2 md:mb-0">
                <label className="block text-gray-700 font-sofia mb-1 md:mb-2 text-sm md:text-base">Kategori Paket *</label>
                <select
                  className="w-full md:w-11/12 px-2 md:px-4 py-1 md:py-[0.65rem] border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 bg-white text-sm md:text-base"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="">Pilih Kategori</option>
                  <option value="katering">Katering</option>
                  <option value="sound_system">Sound System</option>
                  <option value="gedung">Gedung</option>
                  <option value="tambah_kategori">+ Tambah Kategori</option>
                </select>
              </div>
              <div className="w-full md:w-[21rem]">
                <label className="block text-gray-700 font-sofia mb-1 md:mb-2 text-sm md:text-base">Harga Paket *</label>
                <div className="flex">
                  <span className="flex items-center px-3 text-gray-500 border border-r-0 rounded-l-lg border-gray-300">Rp</span>
                  <input className="w-full px-4 py-1 md:py-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-pink-600 text-sm md:text-base" type="text" placeholder="Masukkan Harga" />
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <div className="flex flex-row mt-4">
                <div className="flex flex-col w-1/2">
                  <label className="block text-gray-700 font-sofia text-sm md:text-base -mt-2 md:mt-0">Foto Paket (masukkan 5 foto) *</label>
                </div>
                <label className="border bg-pink-600 px-2 md:py-1 -mt-1 mb-3 rounded-lg cursor-pointer flex justify-center items-center ml-auto">
                  <span className="text-white text-sm md:text-base">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handlePhotoUpload(event)}
                  />
                </label>
              </div>
              <div className="border border-dashed border-gray-400 rounded-lg flex justify-center items-center flex-wrap min-h-[50px] mt-2 md:mt-0">
                {photos.length === 0 ? (
                  <span className="text-gray-500">Upload a photo</span>
                ) : (
                  photos.map((photo, index) => (
                    <div key={index} className="relative m-2">
                      <img src={URL.createObjectURL(photo)} alt={`upload-${index}`} className="w-10 h-10 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex justify-center items-center"
                      >
                        &times;
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="w-full">
            <button type="submit" className="w-full py-1 md:py-2 mt-2 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-600" onClick={() => router.push('/admin/manage-event-package')}>
              Tambah Paket
            </button>
          </div>
        </form>
        {isPopupOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 relative mt-12 overflow-hidden md:w-4/5 h-4/5 w-11/12">              
              <button onClick={() => setIsPopupOpen(false)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex justify-center items-center">
                &times;
              </button>
              <div className="w-full h-full flex flex-col">
                <div className="flex-none">
                  <h2 className="text-lg md:text-2xl font-bold text-pink-900 font-sofia mb-2 ml-1">Pilih Logistik</h2>
                  <div className='flex flex-col md:flex-row mb-4'>
                    <div className="flex items-center ml-1">
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <svg className="w-3 md:w-4 h-3 md:h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l4.287 4.287a1 1 0 01-1.414 1.414l-4.287-4.287zM8 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <input
                          type="text"
                          placeholder="Cari kebutuhan vendormu"
                          className="w-[18.25rem] md:w-[55rem] mr-0 md:mr-4 text-sm md:text-base p-1 md:p-2 pl-9 md:pl-12 border rounded bg-white text-black font-sofia"
                          value={searchQuery}
                          onChange={handleSearch}
                        />
                      </div>
                    </div>
                    <div className="flex flex-row items-center ml-1 md:ml-0 mt-2 md:mt-0">
                      <div className="flex items-center md:ml-auto">
                        <div className="relative">
                          <select className="w-[13rem] md:w-48 text-sm md:text-base p-1 md:p-[0.67rem] pl-3 md:pl-4 border rounded bg-white text-black font-sofia">
                            <option value="sort">Select Vendors</option>
                            <option value="price">Vendor A</option>
                            <option value="rating">Vendor B</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center ml-2">
                        <button className="bg-pink-600 text-white px-4 py-1 md:py-2 rounded-lg font-sofia text-sm md:text-base" onClick={togglePopup}>
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-grow overflow-y-auto">
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-2 md:gap-6 md:mt-6 mb-5">
                    {displayedVendors.map((vendor) => (
                      <div
                        key={vendor.id}
                        className={`bg-white shadow-lg rounded-xl overflow-hidden flex flex-col justify-between ${selectedVendors.includes(vendor.id) ? 'border-dashed border-blue-600' : 'border-gray-200'}`}
                        onClick={() => handleVendorSelection(vendor.id)}
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            className={`absolute w-5 h-5 top-2 left-2 z-10 ${selectedVendors.includes(vendor.id) ? 'text-blue-600' : ''}`}
                            checked={selectedVendors.includes(vendor.id)}
                            onChange={() => handleVendorSelection(vendor.id)}
                          />
                          <Image
                            src={vendor.image}
                            alt={`${vendor.name} Image`}
                            width={245}
                            height={50}
                            className="object-cover"
                          />
                        </div>
                        <div className="p-3 md:p-3 font-sofia flex flex-col justify-between flex-grow">
                          <div>
                            <h3 className="text-sm md:text-base text-pink-900 font-bold">{vendor.name}</h3>
                            <p className="text-xs md:text-sm text-gray-500 mb-2">{vendor.owner}</p>
                            <p className="text-xs md:text-sm text-gray-700">{vendor.type}</p>
                            <p className="text-xs md:text-sm text-gray-500 flex flex-row">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 md:h-4 w-3 md:w-4 text-yellow-500 mr-[0.3rem] mt-[0.075rem] md:mt-[0.05rem]" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.14 3.51a1 1 0 00.95.69h3.7c.967 0 1.372 1.24.588 1.81l-2.992 2.179a1 1 0 00-.364 1.118l1.14 3.51c.3.921-.755 1.688-1.54 1.118l-2.992-2.178a1 1 0 00-1.175 0l-2.992 2.178c-.785.57-1.84-.197-1.54-1.118l1.14-3.51a1 1 0 00-.364-1.118L2.93 8.937c-.784-.57-.38-1.81.588-1.81h3.7a1 1 0 00.95-.69l1.14-3.51z" />
                              </svg>
                              {vendor.rate}
                            </p>
                            <p className="text-xs md:text-sm text-gray-500">{vendor.location}</p>
                            <p className="text-xs md:text-sm text-pink-500 font-bold mt-2">Rp {vendor.price.toLocaleString('id-ID')}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
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