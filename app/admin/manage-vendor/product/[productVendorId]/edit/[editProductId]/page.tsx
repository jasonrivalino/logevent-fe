// app/admin/manage-vendor/product/[productVendorId]/edit/[editProductId]/page.tsx
'use client';

// dependency modules
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
// self-defined modules
import { Navbar } from '@/app/page';
import { CommandLeft } from '@/app/admin/commandLeft';
import { readAlbumsByProductId, createAlbum, updateAlbum, deleteAlbum } from '@/app/utils/albumApi';
import { readProductCategories, createCategory, updateCategory, deleteCategory } from '@/app/utils/categoryApi';
import { readProductById, updateProduct } from '@/app/utils/productApi';
import type { Album, Category, Product } from '@/app/utils/types';

export default function AdminEventPackage() {
  const pathname = usePathname();
  const [product, setProduct] = useState<Product | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = pathname.split('/').pop();
        if (id) {
          const product = await readProductById(parseInt(id));
          const albums = await readAlbumsByProductId(parseInt(id));
          setProduct(product);
          setAlbums(albums);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      }
    };

    fetchData();
  }, [pathname]);

  const router = useRouter();
  const handleBackClick = () => {
    router.push(`/admin/manage-vendor/product/${product?.vendorId}`);
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
            {product && <EditVendorProduct product={product} albums={albums} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function EditVendorProduct({ product, albums }: { product: Product, albums: Album[] }) {
  const router = useRouter();
  const [initialized, setInitialized] = useState(false);
  const [productId, setProductId] = useState<number | null>(null);
  const [vendorId, setVendorId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [specification, setSpecification] = useState('');
  const [selectedRate, setSelectedRate] = useState<string | null>(null);
  const [price, setPrice] = useState('');
  const [capacity, setCapacity] = useState('');
  const [description, setDescription] = useState('');
  const [productImages, setProductImages] = useState<string[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newFee, setNewFee] = useState('');
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const categories = await readProductCategories();
      setCategories(categories);
    };

    if (product && !initialized) {
      setProductId(product.id);
      setVendorId(product.vendorId);
      setSelectedCategoryId(product.categoryId);
      setSelectedRate(product.rate);
      setName(product.name);
      setSpecification(product.specification);
      setPrice(product.price.toString());
      setCapacity(product.capacity ? product.capacity.toString() : '');
      setDescription(product.description || '');

      const images = [];
      if (product.productImage) {
        images.push(product.productImage);
      }

      for (const album of albums) {
        if (album.albumImage) {
          images.push(album.albumImage);
        }
      }

      setProductImages(images);
      setInitialized(true);
    }

    fetchData();
  }, [product, initialized]);

  const handleRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    }
    setShowPopup(false);
  };

  const handleEditCategory = (category: Category) => {
    setCategoryToEdit(category);
    setNewCategory(category.name);
    setNewFee(category.fee.toString());
    setShowEditPopup(true);
  };

  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category);
    setShowDeletePopup(true);
  };

  const handleUpdateCategory = async () => {
    if (categoryToEdit) {
      const updatedCategory = { ...categoryToEdit, name: newCategory, fee: parseFloat(newFee) };
      setCategories(categories.map(cat => cat.id === categoryToEdit.id ? updatedCategory : cat));

      const categoryData = { name: newCategory, fee: parseFloat(newFee) };
      await updateCategory(categoryToEdit.id, categoryData);
      
      setCategoryToEdit(null);
      setNewCategory('');
      setNewFee('');
    }
    setShowEditPopup(false);
  };

  const handleConfirmDeleteCategory = async () => {
    if (categoryToDelete) {
      if (categoryToDelete.id === selectedCategoryId) {
        setSelectedCategoryId(null);
      }
      await deleteCategory(categoryToDelete.id);
      setCategoryToDelete(null);
      setCategories(categories.filter(cat => cat.id !== categoryToDelete.id));
    }
    setShowDeletePopup(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    toggleDropdown();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productId) {
      throw new Error('Product ID is not set');
    }

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
      await updateProduct(productId, productData);

      for (let i = 0; i < albums.length; i++) {
        if (i < albumImages.length) {
          await updateAlbum(albums[i].id, albumImages[i]);
        } else {
          await deleteAlbum(albums[i].id);
        }
      }

      for (let i = albums.length; i < albumImages.length; i++) {
        await createAlbum(albumImages[i], null, productId);
      }

      router.push(`/admin/manage-vendor/product/${vendorId}`);
    } catch (error) {
      console.error('Failed to edit product:', error);
    }
  };

  return (
    <div className="px-6 pt-4 pb-6 bg-white rounded-xl shadow-md">
      {/* Text in center */}
      <h1 className="text-2xl md:text-3xl font-bold md:mb-3 text-pink-900 font-sofia text-center mt-5 md:mt-0">Edit {product.name}</h1>
      {/* Breadcrumb Navigation */}
      <div className="hidden md:flex items-center mb-4">
        <div className="flex items-center">
          <a onClick={() => router.push('/admin/manage-vendor')} className="text-pink-600 font-semibold font-sofia cursor-pointer">Kelola Vendor</a>
          <span className="mx-2 text-gray-600 font-sofia font-semibold"> {'>'} </span>
          <a onClick={() => router.push(`/admin/manage-vendor/product/${vendorId}`)} className="text-pink-600 font-semibold font-sofia cursor-pointer">Kelola Produk</a>
          <span className="mx-2 text-gray-600 font-sofia font-semibold"> {'>'} </span>
          <p className="text-gray-600 font-sofia font-semibold">Tambah Produk</p>
        </div>
      </div>
      {/* Form */}
      <form className="grid grid-cols-1 gap-4 font-sofia text-black mt-6 md:mt-0">
        <div className="flex flex-col md:flex-row md:space-x-6">
          <div className="w-full md:w-2/5 mb-3 md:mb-0">
            <label className="block text-gray-700 font-sofia text-sm md:text-base">Nama Produk</label>
            <p className="text-gray-500 text-xs md:text-sm font-sofia mb-1 md:mb-2">Nama maksimal 40 karakter dengan memasukkan nama barang</p>
            <input
              className="w-full px-3 md:px-4 py-1 md:py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
              type="text"
              placeholder="Contoh: Gedung Sabuga ITB"
              maxLength={40} 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />            
          </div>
          <div className="w-full md:w-[30%] mb-3 md:mb-0">
            <label className="block text-gray-700 font-sofia text-sm md:text-base">Spesifikasi Produk</label>
            <p className="text-gray-500 text-xs md:text-sm font-sofia mb-1 md:mb-2">Spesifikasi produk yang dijual oleh vendor</p>
            <input
              className="w-full px-3 md:px-4 py-1 md:py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
              type="text"
              placeholder="Contoh: Multifunction Hall"
              value={specification}
              onChange={(e) => setSpecification(e.target.value)}
            />
          </div>
          <div className="w-full md:w-[30%]">
            <label className="block text-gray-700 font-sofia text-sm md:text-base">Kapasitas Produk</label>
            <p className="text-gray-500 text-xs md:text-sm font-sofia mb-1 md:mb-2">Kosongkan jika produk tidak memiliki kapasitas</p>
            <input
              className="w-full px-3 md:px-4 py-1 md:py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
              type="text"
              placeholder="Masukkan Kapasitas"
              value={capacity || ''}
              onChange={(e) => setCapacity(e.target.value ? e.target.value : '')}
            />
          </div>
        </div>
        <div className="md:flex space-x-6">
          <div className="w-full -mt-1 md:mt-4">
            <label className="block text-gray-700 font-sofia text-sm md:text-base">Deskripsi Paket</label>
            <p className="text-gray-500 text-xs md:text-sm font-sofia mb-1 md:mb-2">Pastikan deskripsi paket memuat penjelasan detail terkait paketmu agar pembeli mudah mengerti dan menemukan paketmu</p>
            <textarea
              rows={3}
              className="w-full px-2 md:px-4 py-1 md:py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
              placeholder="Contoh: Gedung Sabuga ITB adalah gedung Sasana Budaya Ganesha"
              value={description || ''}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:space-x-6">
          <div className="flex flex-col md:flex-row -mt-2 md:mt-0">
            <div className="w-full mb-2 md:mb-0">
              <label className="block text-gray-700 font-sofia text-sm md:text-base">Kategori Paket</label>
              <p className="text-gray-500 text-xs md:text-sm font-sofia mb-1 md:mb-2">Kategori produk yang tersedia</p>
              <div className="relative">
                <button
                  type="button"
                  onClick={toggleDropdown}
                  className="w-full md:w-11/12 px-2 md:px-4 py-1 md:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 bg-white text-sm md:text-base"
                >
                  {selectedCategoryId === 1
                  ? product.categoryName || 'Pilih Kategori'
                  : categories.find(cat => cat.id === selectedCategoryId)?.name || 'Pilih Kategori'}
                </button>
                {isDropdownOpen && selectedCategoryId !== 1 && (
                  <div className="absolute bg-white border rounded-lg shadow-lg mt-1 w-full z-10 max-h-40 overflow-y-auto">
                    {categories.map((category) => (
                      <div 
                        key={category.id}
                        onClick={() => handleOptionClick(category.id)}
                        className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer text-xs md:text-base"
                      >
                        {category.name}
                        <button
                          className="text-blue-500 text-xs ml-20"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleDropdown();
                            handleEditCategory(category);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-500 text-xs"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleDropdown();
                            handleDeleteCategory(category);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                    <div
                      className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        toggleDropdown();
                        setShowPopup(true);
                      }}
                    >
                      <span>+ Tambah Kategori</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full md:w-[21rem]">
              <label className="block text-gray-700 font-sofia mb-1 md:mb-2 text-sm md:text-base">Harga Paket</label>
              <div className="flex">
                <span className="flex items-center px-3 text-gray-500 border border-r-0 rounded-l-lg border-gray-300">Rp</span>
                <input
                className="w-full px-4 py-1 md:py-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-pink-600 text-sm md:text-base"
                type="text"
                placeholder="Masukkan Harga"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
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
                <label className="block text-gray-700 font-sofia text-sm md:text-base -mt-2 md:mt-0">Foto Paket (masukkan 5 foto)</label>
              </div>
              <label className="border bg-pink-600 px-2 md:py-1 -mt-1 mb-3 rounded-lg cursor-pointer flex justify-center items-center ml-auto">
                <span className="text-white text-sm md:text-base">Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
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
          <button
            type="submit"
            className="w-full py-1 md:py-2 mt-2 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-600"
            onClick={handleSubmit}
          >
            Edit Produk
          </button>
        </div>
      </form>

      {/* Popup for Adding New Category */}
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

      {/* Popup for Editing Category */}
      {showEditPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 text-black font-sofia">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto">
            <h2 className="text-xl font-semibold mb-4">Edit Kategori Produk</h2>
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
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setCategoryToEdit(null);
                  setNewCategory('');
                  setShowEditPopup(false);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCategory}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup for Deleting Category */}
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 text-black">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto">
            <h3 className="text-lg font-semibold">Delete Category</h3>
            <p>Apakah kamu yakin ingin menghapus kategori "{categoryToDelete?.name}"?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setCategoryToDelete(null);
                  setShowDeletePopup(false);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteCategory}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}