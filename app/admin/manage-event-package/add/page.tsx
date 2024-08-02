// app/admin/manage-event-package/add/page.tsx
'use client';

// dependency modules
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
// self-defined modules
import { Navbar } from '@/app/page';
import { CommandLeft } from '@/app/admin/commandLeft';
import { createBundle } from '@/app/utils/bundleApi';
import { readEventCategories } from '@/app/utils/categoryApi';
import { createEvent } from '@/app/utils/eventApi';
import { readAllProducts } from '@/app/utils/productApi';
import { Category, Product } from '@/app/utils/types';

export default function AdminEventPackage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categories = await readEventCategories();
        const products = await readAllProducts();
        setCategories(categories);
        setProducts(products);
      } catch (error: any) {
        console.error(error.message);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="overflow-hidden">
      <div className="min-h-screen flex flex-col px-10 pt-10 mt-16">
          <Navbar />
          <div className="flex flex-col md:flex-row flex-grow">
              <CommandLeft />
              <div className="flex-grow ml-0 md:ml-7 pt-[0.15rem]">
                  <AddPackageProduct categories={categories} products={products} />
              </div>
          </div>
      </div>
    </div>
  );
}

function AddPackageProduct({ categories, products }: { categories: Category[], products: Product[] }) {
  const router = useRouter();
  
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [selectedRate, setSelectedRate] = useState<string | null>(null);
  const [price, setPrice] = useState('');
  const [capacity, setCapacity] = useState('');
  const [description, setDescription] = useState('');
  const [eventImages, setEventImages] = useState<string[]>([]);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [paginatedProducts, setPaginatedProducts] = useState<Product[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setPaginatedProducts(products);
  }, [products]);

  const handleSearch = (event: { target: { value: string; }; }) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(query) ||
      product.specification.toLowerCase().includes(query) ||
      product.vendorAddress.toLowerCase().includes(query)
    );
    setPaginatedProducts(filteredProducts);
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
    setSelectedCategoryId(parseInt(event.target.value));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (files.length > 0) {
      if (eventImages.length + files.length > 5) {
        alert("You can only upload a maximum of 5 photos.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setEventImages([...eventImages, reader.result as string]);
      };

      reader.readAsDataURL(files[0]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = eventImages.filter((_, i) => i !== index);
    setEventImages(newImages);
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handlePageChange = (newPage: React.SetStateAction<number>) => {
    setCurrentPage(newPage);
  };

  const handleProductSelection = (productId: any) => {
    if (selectedProductIds.includes(productId)) {
      setSelectedProductIds(selectedProductIds.filter(id => id !== productId));
    } else {
      setSelectedProductIds([...selectedProductIds, productId]);
    }
  };

  const totalPages = Math.ceil(paginatedProducts.length / itemsPerPage);
  const displayedProducts = paginatedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const selectedProductDetails = products.filter(product => selectedProductIds.includes(product.id));

  const handleSubmit = async (event: { preventDefault: () => void; }) => {

  };

  return (
    <div className="px-6 pt-4 pb-6 bg-white rounded-xl shadow-md">
      {/* Text in center */}
      <h1 className="text-3xl font-bold mb-3 text-pink-900 font-sofia text-center">Tambah Paket</h1>
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
        <div className='flex flex-row'>
          <div className="w-full">
            <div className="flex space-x-6">
              <div className="w-[66%]">
                <label className="block text-gray-700 font-sofia">Nama Paket *</label>
                <p className="text-gray-500 text-sm font-sofia mb-2">Nama maksimal 40 karakter dengan memasukkan nama barang</p>
                <input
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                  type="text"
                  placeholder="Contoh: Gedung Sabuga ITB"
                  maxLength={40}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="w-[30%]">
                <label className="block text-gray-700 font-sofia">Kapasitas Paket</label>
                <p className="text-gray-500 text-sm font-sofia mb-2">Kosongkan jika paket tidak memiliki kapasitas</p>
                <input
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                  type="text"
                  placeholder="Kapasitas"
                  value={capacity || ''}
                  onChange={(e) => setCapacity(e.target.value ? e.target.value : '')}
                />
              </div>  
            </div>
            <div className="flex space-x-6">
              <div className="w-full mt-4">
                <label className="block text-gray-700 font-sofia">Deskripsi Paket *</label>
                <p className="text-gray-500 text-sm font-sofia mb-2">Pastikan deskripsi paket memuat penjelasan detail terkait paketmu agar pembeli mudah mengerti dan menemukan paketmu</p>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                  placeholder="Gedung Sabuga ITB adalah gedung Sasana Budaya Ganesha"
                  value={description || ''}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className='flex flex-row ml-5'>
              <div className="flex flex-col">
                <label className="block text-gray-700 font-sofia">Bundle Logistik</label>
                <p className="text-gray-500 text-sm font-sofia mb-2">Pilih Bundle untuk dimasukkan dalam paket</p>
              </div>
              <label onClick={togglePopup} className="border bg-pink-600 px-2 py-1 -mt-1 mb-3 rounded-lg cursor-pointer flex justify-center items-center ml-auto">
                <span className="text-white">Select Bundle</span>
              </label>
            </div>
            <div className="w-full pl-5">
              <div className="border border-dashed border-gray-400 rounded-lg flex justify-start items-center overflow-x-auto whitespace-nowrap min-h-[238px] w-[33rem] px-5">
                {selectedProductDetails.length === 0 ? (
                  <span className="text-gray-500">Select A Bundle</span>
                ) : (
                  selectedProductDetails.map((product) => (
                    <div key={product.id} className="m-2 p-2 border rounded-lg flex flex-col items-center">
                      <Image
                        src={product.productImage || '/images/placeholder-image.png'}
                        alt={`${product.name} Image`}
                        width={120}
                        height={50}
                        className="object-cover rounded mb-4"
                      />
                      <p className="text-xs text-gray-700">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.vendorName}</p>
                      <p className="text-xs text-gray-500">{product.specification}</p>
                      <p className="text-xs text-gray-500">{product.vendorAddress}</p>
                      <p className="text-xs text-pink-500 font-bold">Rp {product.price.toLocaleString('id-ID')}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-6">
          <div className="w-1/5">
            <label className="block text-gray-700 font-sofia mb-2">Kategori Paket *</label>
            <select
              className="w-full px-4 py-[0.65rem] border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 bg-white"
              value={selectedCategoryId ?? 0}
              onChange={handleCategoryChange}
            >
              <option value={0}>Pilih Kategori</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
              <option value="add-new">+ Tambah Kategori</option>
            </select>
          </div>
          <div className="w-[29%]">
            <label className="block text-gray-700 font-sofia mb-2">Harga Paket *</label>
            <div className="flex">
              <span className="flex items-center px-3 text-gray-500 border border-r-0 rounded-l-lg border-gray-300">Rp</span>
              <input
                className="w-full px-4 py-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                type="text"
                placeholder="Masukkan Harga"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>
          <div className="w-1/2">
            <div className="flex flex-row">
              <div className="flex flex-col w-1/2">
                <label className="block text-gray-700 font-sofia">Foto Paket (masukkan 5 foto) *</label>
              </div>
              <label className="border bg-pink-600 px-2 py-1 -mt-1 mb-3 rounded-lg cursor-pointer flex justify-center items-center ml-auto">
                <span className="text-white">Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleImageUpload(event)}
                />
              </label>
            </div>
            <div className="border border-dashed border-gray-400 rounded-lg flex justify-center items-center flex-wrap min-h-[50px]">
              {eventImages.length === 0 ? (
                <span className="text-gray-500">Upload a photo</span>
              ) : (
                eventImages.map((image, index) => (
                  <div key={index} className="relative m-2">
                    <img src={image} alt={`upload-${index}`} className="w-10 h-10 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
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
          <button type="submit" className="w-full py-2 mt-2 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-600" onClick={handleSubmit}>
            Tambah Paket
          </button>
        </div>
      </form>
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 relative mt-12 overflow-hidden" style={{ width: '80%', height: '80%' }}>
            <button onClick={() => setIsPopupOpen(false)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex justify-center items-center">
              &times;
            </button>
            <div className="h-full flex flex-col">
              <div className="flex-none">
                <h2 className="text-2xl font-bold text-pink-900 font-sofia mb-2 ml-1">Pilih Logistik</h2>
                <div className='flex flex-row mb-4'>
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
                        className="w-[55rem] text-sm md:text-base p-1 md:p-2 pl-9 md:pl-12 border rounded bg-white text-black font-sofia"
                        value={searchQuery}
                        onChange={handleSearch}
                      />
                    </div>
                  </div>
                  <div className="flex items-center ml-auto">
                    <div className="relative">
                      <select className="w-48 text-sm md:text-base p-1 md:p-[0.67rem] pl-3 md:pl-4 border rounded bg-white text-black font-sofia">
                        <option value="sort">Select Vendors</option>
                        <option value="price">Vendor A</option>
                        <option value="rating">Vendor B</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center ml-2">
                    <button className="bg-pink-600 text-white px-4 py-2 rounded-lg font-sofia text-sm md:text-base" onClick={togglePopup}>
                      Submit
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex-grow overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6 mb-5">
                  {displayedProducts.map((product) => (
                    <div
                      key={product.id}
                      className={`bg-white shadow-lg rounded-xl overflow-hidden flex flex-col justify-between ${selectedProductIds.includes(product.id) ? 'border-dashed border-blue-600' : 'border-gray-200'}`}
                      onClick={() => handleProductSelection(product.id)}
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          className={`absolute w-5 h-5 top-2 left-2 z-10 ${selectedProductIds.includes(product.id) ? 'text-blue-600' : ''}`}
                          checked={selectedProductIds.includes(product.id)}
                          onChange={() => handleProductSelection(product.id)}
                        />
                        <Image
                          src={product.productImage || '/images/placeholder-image.png'}
                          alt={`${product.name} Image`}
                          width={245}
                          height={50}
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3 md:p-3 font-sofia flex flex-col justify-between flex-grow">
                        <div>
                          <h3 className="text-sm md:text-base text-pink-900 font-bold">{product.name}</h3>
                          <p className="text-xs md:text-sm text-gray-500 mb-2">{product.vendorName}</p>
                          <p className="text-xs md:text-sm text-gray-700">{product.specification}</p>
                          <p className="text-xs md:text-sm text-gray-500 flex flex-row">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className= "h-3 md:h-4 w-3 md:w-4 text-yellow-500 mr-[0.3rem] mt-[0.075rem] md:mt-[0.05rem]"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.14 3.51a1 1 0 00.95.69h3.7c.967 0 1.372 1.24.588 1.81l-2.992 2.179a1 1 0 00-.364 1.118l1.14 3.51c.3.921-.755 1.688-1.54 1.118l-2.992-2.178a1 1 0 00-1.175 0l-2.992 2.178c-.785.57-1.84-.197-1.54-1.118l1.14-3.51a1 1 0 00-.364-1.118L2.93 8.937c-.784-.57-.38-1.81.588-1.81h3.7a1 1 0 00.95-.69l1.14-3.51z" />
                            </svg> {product.rating && product.rating.toFixed(2) !== "0.00" ? product.rating.toFixed(2) : "N/A"}
                          </p>
                          <p className="text-xs md:text-sm text-gray-500">{product.vendorAddress}</p>
                          <p className="text-xs md:text-sm text-pink-500 font-bold mt-2">Rp {product.price.toLocaleString('id-ID')}</p>
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