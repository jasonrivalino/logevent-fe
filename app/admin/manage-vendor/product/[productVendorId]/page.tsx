// app/admin/manage-vendor/product/[productVendorId]/page.tsx
'use client';

// dependency modules
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
// self-defined modules
import { ContactBox, Navbar } from '@/app/page';
import { CommandLeft } from '@/app/admin/commandLeft';
import { generateGoogleMapsUrl } from '@/app/utils/helpers';
import { readAdminProducts, readProductsByVendorId, deleteProduct } from '@/app/utils/productApi';
import { readVendorById } from '@/app/utils/vendorApi';
import { Product, Vendor } from '@/app/utils/types';

export default function AdminEventPackage() {
    const pathname = usePathname();
    const [vendor, setVendor] = useState<Vendor | null>(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const id = pathname.split('/').pop();
          if (id) {
            const vendor = await readVendorById(parseInt(id));
            setVendor(vendor);
          }
        } catch (error) {
          console.error('Failed to fetch vendor:', error);
        }
      };
  
      fetchData();
    }, [pathname]);
    
    const router = useRouter();
    const handleBackClick = () => {
        router.push('/admin/manage-vendor');
    }

    return (
      <div>
        <Navbar />
            <div className="min-h-screen flex flex-col px-6 mt-24">
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
                  <div className="flex-grow ml-0 md:ml-7 py-[0.15rem]">
                      {vendor && <ManageVendorProduct vendor={vendor} />}
                  </div>
            </div>
        </div>
        <ContactBox />
      </div>
    );
}

function ManageVendorProduct({ vendor }: { vendor: Vendor }) {
  const router = useRouter();
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productList, setProductList] = useState<Product[]>([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let products: Product[] = [];
        if (vendor.id === 1) {
          products = await readAdminProducts();
        } else {
          products = await readProductsByVendorId(vendor.id);
        }
        setProductList(products);
      } catch (error) {
        console.error('Failed to fetch vendor products:', error);
      }
    };

    fetchData();
  }, [vendor, refresh]);

  const handleAddressClick = (address: string) => {
    const googleMapsUrl = generateGoogleMapsUrl(address);
    window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setShowPopup(true);
  };

  const handleDelete = async () => {
    try {
      if (selectedProduct) {
        await deleteProduct(selectedProduct.id);
        setSelectedProduct(null);
        setShowPopup(false);
        setRefresh(!refresh);
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const paginatedProducts = productList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(productList.length / itemsPerPage);

  return (
    <div className="px-4 md:px-8 pt-6 pb-10 bg-white rounded-xl shadow-md">
      <h1 className="md:hidden text-2xl md:text-3xl font-bold mb-6 md:mb-3 text-pink-900 font-sofia text-center">Product List</h1>
      <h1 className="hidden md:block text-3xl font-bold mb-6 text-pink-900 font-sofia">Welcome Admin LogEvent!</h1>
      {/* Breadcrumb Navigation */}
      <div className="md:flex items-center mb-6">
        <div className="hidden md:flex items-center">
          <a onClick={() => router.push('/admin/manage-vendor')} className="text-pink-600 font-semibold font-sofia cursor-pointer">Kelola Vendor</a>
          <span className="mx-2 text-gray-600 font-sofia font-semibold"> {'>'} </span>
          <span className="text-gray-600 font-sofia font-semibold">Kelola Produk</span>
        </div>
        {/* Search Bar */}
        <div className="flex items-center md:ml-auto">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="w-3 md:w-4 h-3 md:h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l4.287 4.287a1 1 0 01-1.414 1.414l-4.287-4.287zM8 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Cari kebutuhan vendormu"
              className="w-[17.5rem] md:w-full text-sm md:text-base p-1 md:p-2 pl-9 md:pl-12 border rounded bg-white text-black font-sofia"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white rounded-xl p-1 md:p-3 mb-6 -mt-2 mb:mt-0 shadow-md border-pink-600 border-2 font-sofia">
        <div className="flex md:items-center ml-3 md:ml-5">
          <span className="text-lg md:text-xl text-pink-900 font-bold mr-4">{vendor.name}</span>
        </div>
        <div className="flex md:items-center">
          <span className="text-xs md:text-base text-gray-700 px-3 md:px-5 mr-12 md:mr-0">Jumlah Produk: {productList.length}</span>
          <button className="bg-pink-500 text-white px-1 md:px-3 py-1 rounded-full font-bold text-xs md:text-base -mt-2 md:mt-0 mb-1 md:mb-0 mr-1 md:mr-4 ml-auto" onClick={() => router.push(`/admin/manage-vendor/product/${vendor.id}/add`)}>
            + Tambah Produk
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {paginatedProducts.map((product) => (
          <div key={product.id} className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col justify-between">
            <Image
              src={product.productImage || "/Image/planetarium.jpg"}
              alt={`${product.name} Image`}
              width={245}
              height={50}
              className="object-cover h-20 md:h-32 w-full"
            />
            <div className="p-3 md:p-3 font-sofia flex flex-col justify-between flex-grow">
              <div>
                <h3 className="text-sm md:text-base text-pink-900 font-bold mb-2">{product.name}</h3>
                <p className="text-xs md:text-sm text-gray-700 line-clamp-2 mb-1 md:mb-0">{product.specification}</p>                
                <p className="text-xs md:text-sm text-gray-500 flex flex-row mb-1 md:mb-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 md:h-4 w-3 md:w-4 text-yellow-500 mr-[0.3rem] mt-[0.075rem] md:mt-[0.05rem]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.14 3.51a1 1 0 00.95.69h3.7c.967 0 1.372 1.24.588 1.81l-2.992 2.179a1 1 0 00-.364 1.118l1.14 3.51c.3.921-.755 1.688-1.54 1.118l-2.992-2.178a1 1 0 00-1.175 0l-2.992 2.178c-.785.57-1.84-.197-1.54-1.118l1.14-3.51a1 1 0 00-.364-1.118L2.93 8.937c-.784-.57-.38-1.81.588-1.81h3.7a1 1 0 00.95-.69l1.14-3.51z" />
                  </svg> {product.rating && product.rating.toFixed(2) !== "0.00" ? product.rating.toFixed(2) : "N/A"}
                </p>
                <p
                  className="text-xs md:text-sm text-gray-500 line-clamp-1"
                  onClick={() => handleAddressClick(product.vendorAddress)}
                >
                  {product.vendorAddress}
                </p>
                <p className="text-xs md:text-sm text-pink-500 font-bold mt-2">Rp{product.price.toLocaleString('id-ID')}</p>
              </div>
              <div className="flex justify-between items-center mt-4">
                <button
                  className="text-xs md:text-base text-pink-500 hover:text-pink-700 font-bold"
                  onClick={() => router.push(`/admin/manage-vendor/product/${vendor.id}/detail/${product.id}`)}
                >
                  Lihat Detail
                </button>
                <div className="flex space-x-1 md:space-x-2">
                  <FaEdit
                    className="text-pink-500 cursor-pointer hover:text-pink-700 w-3 md:w-4 h-3 md:h-4"
                    onClick={() => router.push(`/admin/manage-vendor/product/${vendor.id}/edit/${product.id}`)}
                  />
                  <FaTrashAlt
                    className="text-pink-500 cursor-pointer hover:text-pink-700 w-3 md:w-4 h-3 md:h-4"
                    onClick={() => handleDeleteClick(product)}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      )}

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