'use client';
import React, { useState } from 'react';
import { ContactBox, Navbar } from '../../../../page';
import { useRouter, usePathname } from 'next/navigation';
import { CommandLeft } from '../../../commandLeft';

export default function AdminEventPackage() {
  const router = useRouter();
  const handleBackClick = () => {
      router.push('/admin/manage-vendor/product');
  }

  return (
    <div>
      <Navbar />
          <div className="min-h-screen flex flex-col px-6 mt-24 mb-14">
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
                <div className="flex-grow ml-0 md:ml-7 pt-[0.15rem]">
                    <AddVendorProduct />
                </div>
            </div>
        </div>
      </div>
    );
}

function AddVendorProduct() {
    const router = useRouter(); // Initialize useRouter for navigation
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedPriceUnit, setSelectedPriceUnit] = useState('');
  
    const handleCategoryChange = (event: { target: { value: any; }; }) => {
      const category = event.target.value;
      setSelectedCategory(category);
  
      // Automatically select /pcs for "katering"
      if (category === 'katering') {
        setSelectedPriceUnit('/pcs');
      } else {
        setSelectedPriceUnit('');
      }
    };
  
    const handlePriceUnitChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
      setSelectedPriceUnit(event.target.value);
    };

    const [photos, setPhotos] = useState<File[]>([]);

    const handlePhotoUpload: React.ChangeEventHandler<HTMLInputElement> = (event) => {
      const files = event.target.files ? Array.from(event.target.files) : [];
      if (photos.length + files.length <= 5) {
        setPhotos([...photos, ...files]);
      } else {
        alert("You can only upload a maximum of 5 photos.");
      }
    };
  
    const handleRemovePhoto = (index: number) => {
      const newPhotos = photos.filter((_, i) => i !== index);
      setPhotos(newPhotos);
    };
  
    return (
      <div className="px-6 pt-4 pb-6 bg-white rounded-xl shadow-md">
        {/* Text in center */}
        <h1 className="text-2xl md:text-3xl font-bold md:mb-3 text-pink-900 font-sofia text-center mt-5 md:mt-0">Tambah Produk Vendor B</h1>
        {/* Breadcrumb Navigation */}
        <div className="hidden md:flex items-center mb-4">
          <div className="flex items-center">
            <a onClick={() => router.push('/admin/manage-vendor')} className="text-pink-600 font-semibold font-sofia cursor-pointer">Kelola Vendor</a>
            <span className="mx-2 text-gray-600 font-sofia font-semibold"> {'>'} </span>
            <a onClick={() => router.push('/admin/manage-vendor/product')} className="text-pink-600 font-semibold font-sofia cursor-pointer">Kelola Produk</a>
            <span className="mx-2 text-gray-600 font-sofia font-semibold"> {'>'} </span>
            <p className="text-gray-600 font-sofia font-semibold">Tambah Produk</p>
          </div>
        </div>
        {/* Form */}
        <form className="grid grid-cols-1 gap-4 font-sofia text-black mt-6 md:mt-0">
          <div className="flex flex-col md:flex-row md:space-x-6">
            <div className="w-full md:w-2/5 mb-3 md:mb-0">
              <label className="block text-gray-700 font-sofia text-sm md:text-base">Nama Produk *</label>
              <p className="text-gray-500 text-xs md:text-sm font-sofia mb-1 md:mb-2">Nama maksimal 40 karakter dengan memasukkan nama barang</p>
              <input className="w-full px-3 md:px-4 py-1 md:py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600" type="text" placeholder="Contoh: Gedung Sabuga ITB" maxLength={40} />
            </div>
            <div className="w-full md:w-[30%] mb-3 md:mb-0">
              <label className="block text-gray-700 font-sofia text-sm md:text-base">Spesifikasi Produk *</label>
              <p className="text-gray-500 text-xs md:text-sm font-sofia mb-1 md:mb-2">Spesifikasi produk yang dijual oleh vendor</p>
              <input className="w-full px-3 md:px-4 py-1 md:py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600" type="text" placeholder="Multifunction Hall" />
            </div>
            <div className="w-full md:w-[30%]">
              <label className="block text-gray-700 font-sofia text-sm md:text-base">Kapasitas Produk</label>
              <p className="text-gray-500 text-xs md:text-sm font-sofia mb-1 md:mb-2">Kosongkan jika produk tidak memiliki kapasitas</p>
              <input className="w-full px-3 md:px-4 py-1 md:py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600" type="text" placeholder="Masukkan Kapasitas" />
            </div>
          </div>
          <div className="md:flex space-x-6">
            <div className="w-full -mt-1 md:mt-4">
              <label className="block text-gray-700 font-sofia text-sm md:text-base">Deskripsi Paket *</label>
              <p className="text-gray-500 text-xs md:text-sm font-sofia mb-1 md:mb-2">Pastikan deskripsi paket memuat penjelasan detail terkait paketmu agar pembeli mudah mengerti dan menemukan paketmu</p>
              <textarea rows={3} className="w-full px-2 md:px-4 py-1 md:py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600" placeholder="Gedung Sabuga ITB adalah gedung Sasana Budaya Ganesha"></textarea>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-6">
            <div className="flex flex-col md:flex-row -mt-2 md:mt-0">
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
              Tambah Produk
            </button>
          </div>
        </form>
      </div>
    );
}