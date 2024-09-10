// app/logistik-vendor/page.tsx
'use client';

// dependency modules
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
// self-defined modules
import { Navbar, ContactBox } from '@/app/page';
import { readProductCategories } from '@/app/utils/categoryApi';
import { readAllCities } from '@/app/utils/cityApi';
import { generateGoogleMapsUrl } from '@/app/utils/helpers';
import { readAllProducts } from '@/app/utils/productApi';
import { Product } from '@/app/utils/types';
import { Category, City } from '@/app/utils/types';

export default function LogistikVendor() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await readAllProducts();
        const categories = await readProductCategories();
        const cities = await readAllCities();
        setFilteredProducts(products);
        setCategories(categories);
        setCities(cities);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="p-4">
        <Head>
          <title>Vendor Logistik</title>
        </Head>
        <Navbar />
        <div className="flex flex-col md:flex-row py-14 md:py-20">
          <ProductList products={filteredProducts} categories={categories} cities={cities} />
        </div>
      </div>
      <ContactBox />
    </div>
  );
}

export function Filter({ categories, tempCategory, cities, tempCity, tempPriceRange, setCategory, setCity, setPriceRange, handleReset }: {
    categories: Category[], 
    tempCategory: string,
    cities: City[],
    tempCity: string,
    tempPriceRange: string,
    setCategory: any,
    setCity: any,
    setPriceRange: any,
    handleReset: any 
  }) {
  return (
    <div className="w-full md:w-96 md:pl-4 md:pr-8 py-4 -mb-2 md:mb-0">
      <h2 className="text-xl md:text-2xl font-semibold font-sofia text-black mb-4">Filter by</h2>
      <div className="mb-2 md:mb-4">
        <label htmlFor="category" className="block mb-1 md:mb-2 text-gray-700 font-sofia text-sm md:text-base">Kategori Produk</label>
        <select
          id="category"
          className="w-full p-[0.35rem] md:p-2 text-xs md:text-base border rounded bg-white text-black font-sofia"
          onChange={(e) => setCategory(e.target.value)}
          value={tempCategory}
        >
          <option value="" className="font-sofia">Pilih kategori produk</option>
          {categories.map(category => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex md:flex-col flex-row">
        <div className="mb-2 md:mb-4 mr-4 md:mr-0">
          <label htmlFor="location" className="block mb-1 md:mb-2 text-gray-700 font-sofia text-sm md:text-base">Lokasi Vendor</label>
          <select
            id="location"
            className="w-32 md:w-full p-[0.35rem] md:p-2 text-xs md:text-base border rounded bg-white text-black font-sofia"
            onChange={(e) => setCity(e.target.value)}
            value={tempCity}
          >
            <option value="" className="font-sofia">Pilih lokasi vendor</option>
            {cities.map(city => (
              <option key={city.id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4 md:mb-8">
          <label htmlFor="price" className="block mb-1 md:mb-2 text-gray-700 font-sofia text-sm md:text-base">Harga</label>
          <select
            id="price"
            className="w-[10.75rem] md:w-full p-[0.35rem] md:p-2 text-xs md:text-base border rounded bg-white text-black font-sofia"
            onChange={(e) => setPriceRange(e.target.value)}
            value={tempPriceRange}
          >
            <option value="" className="font-sofia">Pilih range harga</option>
            <option value="> 25.000.000" className="font-sofia">{`> 25.000.000`}</option>
            <option value="15.000.000 - 25.000.000" className="font-sofia">15.000.000 - 25.000.000</option>
            <option value="5.000.000 - 15.000.000" className="font-sofia">5.000.000 - 15.000.000</option>
            <option value="< 5.000.000" className="font-sofia">{`< 5.000.000`}</option>
          </select>
        </div>
      </div>
      <div className="flex flex-row md:flex-col items-center">
        <button
          className="w-full text-sm md:text-base bg-white text-pink-600 border-2 border-pink-600 font-sofia font-bold hover:bg-pink-100 hover:text-pink-600 hover:border-pink-600 p-[0.2rem] md:p-2 rounded mb-3 md:mb-2"
          onClick={handleReset}
        >
          Reset Filter
        </button>
      </div>
    </div>
  );
}

export function ProductList({ products, categories, cities }: { products: Product[], categories: Category[], cities: City[] }) {
  const router = useRouter();
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [tempCategory, setTempCategory] = useState('');
  const [tempCity, setTempCity] = useState('');
  const [tempPriceRange, setTempPriceRange] = useState('');

  useEffect(() => {
    handleFilter();
  }, [searchQuery, tempCategory, tempCity, tempPriceRange, products]);

  const handleFilter = () => {
    let result = products;
    
    if (searchQuery) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (tempCategory) {
      result = result.filter(product => product.categoryName === tempCategory);
    }

    if (tempCity) {
      result = result.filter(product => product.cityName.includes(tempCity));
    }

    if (tempPriceRange) {
      result = result.filter((product) => {
        switch (tempPriceRange) {
          case '> 25.000.000':
            return product.price > 25000000;
          case '15.000.000 - 25.000.000':
            return product.price >= 15000000 && product.price <= 25000000;
          case '5.000.000 - 15.000.000':
            return product.price >= 5000000 && product.price <= 15000000;
          case '< 5.000.000':
            return product.price < 5000000;
          default:
            return true;
        }
      });
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (event: { target: { value: string; }; }) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchQuery('');
    setTempCategory('');
    setTempCity('');
    setTempPriceRange('');
    setFilteredProducts(products);
    setCurrentPage(1);
  };

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleAddressClick = (address: string) => {
    const googleMapsUrl = generateGoogleMapsUrl(address);
    window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col md:flex-row">
      <Filter
        categories={categories}
        tempCategory={tempCategory}
        cities={cities}
        tempCity={tempCity}
        tempPriceRange={tempPriceRange}
        handleReset={handleReset}
        setCategory={setTempCategory}
        setCity={setTempCity}
        setPriceRange={setTempPriceRange}
      />
      <div className="w-full md:w-[69rem] h-full p-5 md:p-6 mr-4 bg-white rounded-2xl">
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
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-pink-900 font-sofia">Semua Venue</h2>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {paginatedProducts.map((product) => (
            <div key={product.id} className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col justify-between">
              <Image
                src={product.productImage || "/Image/planetarium.jpg"}
                alt={`${product.name} Image`}
                width={400}
                height={200}
                className="object-cover h-20 md:h-32"
              />
              <div className="p-3 md:p-3 font-sofia flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-sm md:text-base text-pink-900 font-bold mb-2">{product.name}</h3>
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
                  <p
                    className="text-xs md:text-sm text-gray-500 cursor-pointer"
                    onClick={() => handleAddressClick(product.vendorAddress)}
                  >
                    {product.vendorAddress}
                  </p>
                  <p className="text-xs md:text-sm text-pink-500 font-bold mt-2">Rp{product.price.toLocaleString('id-ID')}</p>
                </div>
                <button className="self-start text-xs md:text-base text-pink-500 hover:text-pink-700 font-bold mt-4"
                onClick={() => router.push(`/logistik-vendor/info-detail/${product.id}`)}
                >
                  Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        )}
      </div>
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