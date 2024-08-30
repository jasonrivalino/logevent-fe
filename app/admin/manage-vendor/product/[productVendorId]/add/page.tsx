// app/admin/manage-vendor/product/[productVendorId]/add/page.tsx
'use client';

// dependency modules
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
// self-defined modules
import { Navbar } from '@/app/page';
import { CommandLeft } from '@/app/admin/commandLeft';
import { createProduct } from '@/app/utils/productApi';
import { createAlbum } from '@/app/utils/albumApi';
import { readProductCategories, createCategory } from '@/app/utils/categoryApi';
import { readVendorById } from '@/app/utils/vendorApi';
import { Category, Vendor } from '@/app/utils/types';

export default function AdminAddVendor() {
  const router = useRouter();
  const [vendor, setVendor] = useState<Vendor | null>(null);

  useEffect(() => {
    const { pathname } = window.location;
    const segments = pathname.split('/');
    const id = segments[segments.length - 2];
    
    const fetchVendor = async () => {
      try {
        const vendor = await readVendorById(parseInt(id));
        setVendor(vendor);
      } catch (error) {
        console.error('Failed to fetch vendor:', error);
      }
    };
    
    fetchVendor();
  }, [router]);

  const handleBackClick = () => {
      if (vendor) {
          router.push(`/admin/manage-vendor/product/${vendor.id}`);
      }
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
                    {vendor && <AddVendorProduct vendor={vendor} />}
                </div>
            </div>
        </div>
      </div>
    );
}

function AddVendorProduct({ vendor }: { vendor: Vendor }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [specification, setSpecification] = useState('');
  const [selectedRate, setSelectedRate] = useState<string | null>(null);
  const [price, setPrice] = useState('');
  const [capacity, setCapacity] = useState('');
  const [description, setDescription] = useState('');
  const [productImages, setProductImages] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newFee, setNewFee] = useState('');

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
    if (event.target.value === 'add-new') {
      setShowPopup(true);
    } else {
      setSelectedCategoryId(parseInt(event.target.value));
    }
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

  const handleAddCategory = async () => {
    const newCategoryValue = newCategory.trim();
    if (newCategoryValue !== '') {
      const categoryData = {
        name: newCategoryValue,
        fee: parseFloat(newFee),
        type: 'Product'
      };
  
      const newCategory = await createCategory(categoryData);
      setCategories([...categories, newCategory]);
      setSelectedCategoryId(newCategory.id);
      setNewCategory('');
      setNewFee('');
      setShowPopup(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Check for required fields
    if (!selectedCategoryId || selectedCategoryId === 0) {
      alert('Please select a category.');
      return;
    }
  
    if (!name) {
      alert('Please enter the product name.');
      return;
    }
  
    if (!specification) {
      alert('Please enter the product specification.');
      return;
    }
  
    if (!selectedRate) {
      alert('Please select a rate.');
      return;
    }
  
    if (!price) {
      alert('Please enter the product price.');
      return;
    }
  
    if (productImages.length === 0) {
      alert('Please upload at least one product image.');
      return;
    }
  
    const productData = {
      vendorId: vendor.id,
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
          await createAlbum(image, null, productId);
        }
      }
  
      // Navigate to the next page only if product creation is successful
      router.push(`/admin/manage-vendor/product/${vendor.id}`);
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };
  
  return (
    <div className="px-6 pt-4 pb-6 bg-white rounded-xl shadow-md">
      {/* Text in center */}
      <h1 className="text-2xl md:text-3xl font-bold md:mb-3 text-pink-900 font-sofia text-center mt-5 md:mt-0">Tambah Produk Vendor {vendor.name}</h1>
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
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 font-sofia text-black mt-6 md:mt-0">
      <div className="flex flex-col md:flex-row md:space-x-6">
        <div className="w-full md:w-2/5 mb-3 md:mb-0">
          <label className="block text-gray-700 font-sofia text-sm md:text-base">Nama Produk *</label>
            <p className="text-gray-500 text-xs md:text-sm font-sofia mb-1 md:mb-2">Nama maksimal 40 karakter dengan memasukkan nama barang</p>
            <input
              className="w-full px-3 md:px-4 py-1 md:py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
              type="text"
              placeholder="Contoh: Gedung Sabuga ITB"
              maxLength={40}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="w-full md:w-[30%] mb-3 md:mb-0">
            <label className="block text-gray-700 font-sofia text-sm md:text-base">Spesifikasi Produk *</label>
            <p className="text-gray-500 text-xs md:text-sm font-sofia mb-1 md:mb-2">Spesifikasi produk yang dijual oleh vendor</p>
            <input
              className="w-full px-3 md:px-4 py-1 md:py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
              type="text"
              placeholder="Contoh: Multifunction Hall"
              value={specification}
              onChange={(e) => setSpecification(e.target.value)}
              required
            />
          </div>
          <div className="w-full md:w-[30%]">
            <label className="block text-gray-700 font-sofia text-sm md:text-base">Kapasitas Produk</label>
            <p className="text-gray-500 text-xs md:text-sm font-sofia mb-1 md:mb-2">Kosongkan jika produk tidak memiliki kapasitas</p>
            <input
              className="w-full px-3 md:px-4 py-1 md:py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 no-spinners"
              type="number"
              placeholder="Masukkan Kapasitas"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />
          </div>
        </div>
        <div className="md:flex space-x-6">
          <div className="w-full -mt-1 md:mt-4">
            <label className="block text-gray-700 font-sofia text-sm md:text-base">Deskripsi Produk *</label>
            <p className="text-gray-500 text-xs md:text-sm font-sofia mb-1 md:mb-2">Pastikan deskripsi produk memuat penjelasan detail terkait produk agar pembeli mudah mengerti dan menemukan produk</p>
            <textarea
              rows={3}
              className="w-full px-2 md:px-4 py-1 md:py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
              placeholder="Contoh: Gedung Sabuga ITB adalah gedung Sasana Budaya Ganesha"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:space-x-6">
          <div className="flex flex-col md:flex-row -mt-2 md:mt-0">
          <div className="w-full mb-2 md:mb-0">
              <label className="block text-gray-700 font-sofia mb-1 md:mb-2 text-sm md:text-base">
                Kategori Produk *
              </label>
              <select
                onFocus={(e) => e.target.size = 3}
                onBlur={(e) => e.target.size = 1}
                onChange={(e) => {
                  e.target.size = 1;
                  e.target.blur();
                  handleCategoryChange(e);
                }}
                className="w-full md:w-11/12 px-2 md:px-4 py-1 md:py-[0.65rem] border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 bg-white text-sm md:text-base overflow-auto max-h-48"
                value={selectedCategoryId ?? 0}
                required
              >
                <option value={0}>Pilih Kategori</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
                
                <option value="add-new">+ Tambah Kategori</option>
              </select>
            </div>
            <div className="w-full md:w-[21rem]">
              <label className="block text-gray-700 font-sofia mb-1 md:mb-2 text-sm md:text-base">Harga Produk *</label>
              <div className="flex">
                <span className="flex items-center px-3 text-gray-500 border border-r-0 rounded-l-lg border-gray-300">Rp</span>
                <input
                className="w-full px-4 py-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-pink-600 no-spinners"
                type="number"
                placeholder="Masukkan Harga"
                value={price}
                onChange={(e) => setPrice(e.target.value )}
                required
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
          </div>
          <div className="w-full md:w-1/2">
            <div className="flex flex-row mt-4">
              <div className="flex flex-col w-1/2">
                <label className="block text-gray-700 font-sofia text-sm md:text-base -mt-2 md:mt-0">Foto Produk (masukkan 5 foto) *</label>
              </div>
              <label className="border bg-pink-600 px-2 md:py-1 -mt-1 mb-3 rounded-lg cursor-pointer flex justify-center items-center ml-auto">
                <span className="text-white text-sm md:text-base">Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                  required
                />
              </label>
            </div>
            <div className="border border-dashed border-gray-400 rounded-lg flex justify-center items-center flex-wrap min-h-[50px] mt-2 md:mt-0">
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
          <button type="submit" className="w-full py-1 md:py-2 mt-2 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-600" onClick={() => router.push(`/admin/manage-vendor/product/${vendor.id}`)}>
            Tambah Produk
          </button>
        </div>
      </form>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 font-sofia text-black">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Tambah Kategori Produk</h2>
            <p className="text-sm text-gray-600 mb-1">Nama kategori:</p>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 mb-2"
              placeholder="Masukkan kategori"
            />
            <p className="text-sm text-gray-600 mb-1">Biaya Layanan:</p>
            <input
              type="number"
              value={newFee}
              onChange={(e) => setNewFee(e.target.value)}
              className="w-full px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 mb-6 no-spinners"
              placeholder="Masukkan biaya layanan"
            />
            <div className="flex justify-end space-x-4">
              <button onClick={() => setShowPopup(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg">Batal</button>
              <button onClick={handleAddCategory} className="px-4 py-2 bg-pink-600 text-white rounded-lg">Tambah</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}