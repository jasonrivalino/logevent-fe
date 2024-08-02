// app/admin/manage-vendor/product/[id]/add/page.tsx
'use client';

// dependency modules
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
// self-defined modules
import { Navbar } from '@/app/page';
import { CommandLeft } from '@/app/admin/commandLeft';
import { createProduct } from '@/app/utils/productApi';
import { createAlbum } from '@/app/utils/albumApi';
import { readProductCategories } from '@/app/utils/categoryApi';
import { readVendorById } from '@/app/utils/vendorApi';
import { Category, Product } from '@/app/utils/types';

export default function AdminEventPackage() {
    return (
      <div className="overflow-hidden">
        <div className="min-h-screen flex flex-col px-10 pt-10 mt-16">
            <Navbar />
            <div className="flex flex-col md:flex-row flex-grow">
                <CommandLeft />
                <div className="flex-grow ml-0 md:ml-7 pt-[0.15rem]">
                    <AddVendorProduct />
                </div>
            </div>
        </div>
      </div>
    );
}

function AddVendorProduct() {
    const router = useRouter();
    const [vendorId, setVendorId] = useState<number | null>(null);
    const [vendorName, setVendorName] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [name, setName] = useState('');
    const [specification, setSpecification] = useState('');
    const [selectedRate, setSelectedRate] = useState<string | null>(null);
    const [price, setPrice] = useState('');
    const [capacity, setCapacity] = useState('');
    const [description, setDescription] = useState('');
    const [productImages, setProductImages] = useState<string[]>([]);

    useEffect(() => {
      const { pathname } = window.location;
      const segments = pathname.split('/');
      const id = segments[segments.length - 2];
      
      const fetchVendor = async () => {
        try {
          const vendor = await readVendorById(parseInt(id));
          setVendorName(vendor.name);
        } catch (error) {
          console.error('Failed to fetch vendor:', error);
        }
      };
      
      setVendorId(parseInt(id));
      fetchVendor();
    }, [router]);

    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const categories = await readProductCategories();
          setCategories(categories);
        } catch (error) {
          console.error('Failed to fetch product categories:', error);
        }
      };
  
      fetchCategories();
    }, []);
  
    const handleCategoryChange = (event: { target: { value: any; }; }) => {
      setSelectedCategoryId(parseInt(event.target.value));
    };
  
    const handleRateChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
      setSelectedRate(event.target.value as string);
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files ? Array.from(event.target.files) : [];
      if (files.length > 0) {
        if (productImages.length + files.length > 5) {
          alert("You can only upload a maximum of 5 photos.");
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          setProductImages([...productImages, reader.result as string]);
        };

        reader.readAsDataURL(files[0]);
      }
    };

    const handleRemoveImage = (index: number) => {
      const newImages = productImages.filter((_, i) => i !== index);
      setProductImages(newImages);
    };

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();

      if (!vendorId) {
        throw new Error('Vendor ID is not set');
      }

      if (!selectedCategoryId) {
        throw new Error('Category ID is not set');
      }

      if (!name) {
        throw new Error('Name is not set');
      }

      if (!specification) {
        throw new Error('Specification is not set');
      }

      if (!selectedRate) {
        throw new Error('Rate is not set');
      }

      if (!price) {
        throw new Error('Price is not set');
      }

      const productData = {
        vendorId,
        categoryId: selectedCategoryId,
        name,
        specification,
        rate: selectedRate,
        price: parseInt(price),
        capacity: capacity ? parseInt(capacity) : null,
        description: description || null,
        productImage: productImages.length > 0 ? productImages[0] : null
      };

      const albumImages = productImages.slice(1);    
      try {
        const product = await createProduct(productData);
        if (albumImages.length > 0) {
          const productId = product.id;
          for (const image of albumImages) {
            await createAlbum(productId, image);
          }
        }

        router.push(`/admin/manage-vendor/product/${vendorId}`);
      } catch (error) {
        console.error('Failed to create product:', error);
      }
    };
  
    return (
      <div className="px-6 pt-4 pb-6 bg-white rounded-xl shadow-md">
        {/* Text in center */}
        <h1 className="text-3xl font-bold mb-3 text-pink-900 font-sofia text-center">Tambah Produk Vendor {vendorName}</h1>
        {/* Breadcrumb Navigation */}
        <div className="hidden md:flex items-center mb-4">
          <div className="flex items-center">
            <a onClick={() => router.push('/admin/manage-vendor')} className="text-pink-600 font-semibold font-sofia cursor-pointer">Kelola Vendor</a>
            <span className="mx-2 text-gray-600 font-sofia font-semibold"> {'>'} </span>
            <a onClick={() => router.push('/admin/manage-vendor')} className="text-pink-600 font-semibold font-sofia cursor-pointer">Kelola Produk</a>
            <span className="mx-2 text-gray-600 font-sofia font-semibold"> {'>'} </span>
            <p className="text-gray-600 font-sofia font-semibold">Tambah Produk</p>
          </div>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 font-sofia text-black">
          <div className="flex space-x-6">
            <div className="w-2/5">
              <label className="block text-gray-700 font-sofia">Nama Produk *</label>
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
              <label className="block text-gray-700 font-sofia">Spesifikasi Produk *</label>
              <p className="text-gray-500 text-sm font-sofia mb-2">Spesifikasi produk yang dijual oleh vendor</p>
              <input
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                type="text"
                placeholder="Contoh: Multifunction Hall"
                value={specification}
                onChange={(e) => setSpecification(e.target.value)}
              />
            </div>
            <div className="w-[30%]">
              <label className="block text-gray-700 font-sofia">Kapasitas Produk</label>
              <p className="text-gray-500 text-sm font-sofia mb-2">Kosongkan jika produk tidak memiliki kapasitas</p>
              <input
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                type="number"
                placeholder="Masukkan Kapasitas"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>
          </div>
          <div className="flex space-x-6">
            <div className="w-full">
              <label className="block text-gray-700 font-sofia">Deskripsi Produk *</label>
              <p className="text-gray-500 text-sm font-sofia mb-2">Pastikan deskripsi produk memuat penjelasan detail terkait produkmu agar pembeli mudah mengerti dan menemukan produkmu</p>
              <textarea
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                placeholder="Contoh: Gedung Sabuga ITB adalah gedung Sasana Budaya Ganesha"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className="flex space-x-6">
            <div className="w-1/5">
              <label className="block text-gray-700 font-sofia mb-2">Kategori Produk *</label>
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
            <div className="w-[30%]">
              <label className="block text-gray-700 font-sofia mb-2">Harga Produk *</label>
              <div className="flex">
                <span className="flex items-center px-3 text-gray-500 border border-r-0 rounded-l-lg border-gray-300">Rp</span>
                <input
                  className="w-full px-4 py-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                  type="number"
                  placeholder="Masukkan Harga"
                  value={price}
                  onChange={(e) => setPrice(e.target.value )}
                />
              </div>
              <div className="flex mt-1 space-x-4">
                <label className="flex items-center text-gray-700 font-sofia">
                  <input
                    type="radio"
                    name="harga"
                    value="Hourly"
                    className="mr-2"
                    checked={selectedRate === 'Hourly'}
                    onChange={handleRateChange}
                  />
                  / Jam
                </label>
                <label className="flex items-center text-gray-700 font-sofia">
                  <input
                    type="radio"
                    name="harga"
                    value="Daily"
                    className="mr-2"
                    checked={selectedRate === 'Daily'}
                    onChange={handleRateChange}
                  />
                  / Hari
                </label>
                <label className="flex items-center text-gray-700 font-sofia">
                  <input
                    type="radio"
                    name="harga"
                    value="Quantity"
                    className="mr-2"
                    checked={selectedRate === 'Quantity'}
                    onChange={handleRateChange}
                  />
                  / Pcs
                </label>
              </div>
            </div>
            <div className="w-1/2">
                <div className="flex flex-row">
                    <div className="flex flex-col w-1/2">
                        <label className="block text-gray-700 font-sofia">Foto Produk *</label>
                        <p className="text-gray-500 text-sm font-sofia mb-2">Masukkan 5 foto produk</p>
                    </div>
                    <label className="border bg-pink-600 px-2 py-1 mb-3 rounded-lg cursor-pointer flex justify-center items-center ml-auto">
                        <span className="text-white">Upload Image</span>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageUpload}
                        />
                    </label>
                </div>
                <div className="border border-dashed border-gray-400 rounded-lg flex justify-center items-center flex-wrap min-h-[50px]">
                    {productImages.length === 0 ? (
                        <span className="text-gray-500">Upload a photo</span>
                    ) : (
                        productImages.map((image, index) => (
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
                    Tambah Produk
                </button>
            </div>
        </form>
      </div>
    );
}