// app/admin/manage-vendor/add/page.tsx
'use client';

// dependency modules
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
// self-defined modules
import { Navbar } from '@/app/page';
import { CommandLeft } from '@/app/admin/commandLeft';
import { ContactBoxShort } from '@/app/signin/page';
import { readAllCities, createCity } from '@/app/utils/cityApi';
import { createVendor } from '@/app/utils/vendorApi';
import { City } from '@/app/utils/types';

export default function AdminVendor() {
    const router = useRouter();
    const handleBackClick = () => {
        router.push('/admin/manage-vendor');
    };

    return (
        <div>
            <Navbar />
            <div className="min-h-screen flex flex-col px-6 md:px-6 md:py-8 mt-32 md:mt-16">
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
                        <AddVendor />
                    </div>
                </div>
            </div>
            <div className="overflow-hidden">
                <ContactBoxShort />
            </div>
      </div>
    );
}

function AddVendor() {
    const router = useRouter();
    const [showPopup, setShowPopup] = useState(false);

    const [cities, setCities] = useState<City[]>([]);
    const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
    const [newCity, setNewCity] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);

    const [vendorData, setVendorData] = useState({
      name: '',
      phone: '',
      email: '',
      address: '',
      instagram: '',
      socialMedia: '',
      documentUrl: '',
    });

    useEffect(() => {
      const fetchCities = async () => {
        try {
          const cities = await readAllCities();
          setCities(cities);
        } catch (error: any) {
          console.error('Failed to fetch cities:', error.message);
        }
      };
      fetchCities();
    }, []);
  
    const handleChange = (e: { target: { name: any; value: any } }) => {
      const { name, value } = e.target;
      setVendorData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };
  
    const handleCityChange = (event: { target: { value: any } }) => {
      if (event.target.value === 'add-new') {
        setShowPopup(true);
      } else {
        setSelectedCityId(parseInt(event.target.value));
      }
    };
  
    const handleAddCity = async () => {
      const newCityValue = newCity.trim();
      if (newCityValue !== '') {
        const cityData = {
          name: newCityValue,
        };
  
        const newCity = await createCity(cityData);
        setCities([...cities, newCity]);
        setSelectedCityId(newCity.id);
        setNewCity('');
        setShowPopup(false);
      }
    };
  
    const handleSubmit = async (e: { preventDefault: () => void }) => {
      e.preventDefault();
      setFormSubmitted(true);
      try {
        if (!vendorData.name) {
          throw new Error('Nama vendor tidak boleh kosong');
        }

        if (!vendorData.phone) {
          throw new Error('Nomortelepon vendor tidak boleh kosong');
        }

        if (!vendorData.email) {
          throw new Error('Email vendor tidak boleh kosong');
        }

        if (!vendorData.address) {
          throw new Error('Alamat vendor tidak boleh kosong');
        }

        if (!vendorData.instagram) {
          throw new Error('Instagram vendor tidak boleh kosong');
        }

        if (!vendorData.documentUrl) {
          throw new Error('Link MoU vendor tidak boleh kosong');
        }

        if (!selectedCityId) {
          throw new Error('Kota vendor harus dipilih');
        }
        
        const vendorDataWithCityId = {
          ...vendorData,
          cityId: selectedCityId,
        };
        await createVendor(vendorDataWithCityId);
        router.push('/admin/manage-vendor');
      } catch (error: any) {
        alert(error.message);
        console.error('Failed to create vendor:', error.message);
      }
    };
  
    return (
      <div className="px-6 md:px-8 pt-6 pb-10 bg-white rounded-xl font-sofia shadow-md">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-3 text-pink-900 font-sofia text-center">
          Tambah Vendor
        </h1>
        {/* Breadcrumb Navigation */}
        <div className="hidden md:flex items-center mb-4">
          <a
            onClick={() => router.push('/admin/manage-vendor')}
            className="text-pink-600 font-semibold font-sofia cursor-pointer"
          >
            Kelola Vendor
          </a>
          <span className="mx-2 text-gray-600 font-sofia font-semibold">
            {' '}
            {'>'}{' '}
          </span>
          <span className="text-gray-600 font-sofia font-semibold">
            Tambah Vendor
          </span>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row flex-wrap md:mb-3">
                <div className="flex-1 md:mr-2">
                    <label className="block text-gray-700 text-sm font-bold mb-1 md:mb-2" htmlFor="name">
                        Nama *
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={vendorData.name}
                        onChange={handleChange}
                        className={`shadow appearance-none border rounded w-full mb-3 md:mb-0 py-1 md:py-2 px-3 text-sm md:text-base text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formSubmitted && !vendorData.name ? 'border-red-500' : ''}`}
                        placeholder="Nama Lengkap"
                        required
                    />
                </div>
                <div className="flex-1 md:mx-2">
                    <label className="block text-gray-700 text-sm font-bold mb-1 md:mb-2" htmlFor="phone">
                        Nomor Telepon / Hp *
                    </label>
                    <input
                        type="text"
                        name="phone"
                        value={vendorData.phone}
                        onChange={handleChange}
                        className={`shadow appearance-none border rounded w-full mb-3 md:mb-0 py-1 md:py-2 px-3 text-sm md:text-base text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formSubmitted && !vendorData.phone ? 'border-red-500' : ''}`}
                        placeholder="ex: 089732579"
                        required
                    />
                </div>
                <div className="flex-1 md:ml-2">
                    <label className="block text-gray-700 text-sm font-bold mb-1 md:mb-2" htmlFor="email">
                        Email *
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={vendorData.email}
                        onChange={handleChange}
                        className={`shadow appearance-none border rounded w-full mb-3 md:mb-0 py-1 md:py-2 px-3 text-sm md:text-base text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formSubmitted && !vendorData.email ? 'border-red-500' : ''}`}
                        placeholder="ex: LogEvent@gmail.com"
                        required
                    />
                </div>
            </div>
            <div className="flex flex-col md:flex-row flex-wrap md:mb-3">
                <div className="flex-[2] md:mr-4">
                    <label
                    className="block text-gray-700 text-sm font-bold mb-1 md:mb-2"
                    htmlFor="address"
                    >
                    Alamat *
                    </label>
                    <input
                    type="text"
                    name="address"
                    value={vendorData.address}
                    onChange={handleChange}
                    className={`shadow appearance-none border rounded w-full mb-3 md:mb-0 py-1 md:py-2 px-3 text-sm md:text-base text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                        formSubmitted && !vendorData.address ? 'border-red-500' : ''
                    }`}
                    placeholder="Alamat"
                    required
                    />
                </div>
                {/* Adjusted flex value for Kota */}
                <div className="flex-1">
                    <label
                    className="block text-gray-700 text-sm font-bold mb-1 md:mb-2"
                    htmlFor="address"
                    >
                    Kota *
                    </label>
                    <select
                    onFocus={(e) => (e.target.size = 3)}
                    onBlur={(e) => (e.target.size = 1)}
                    onChange={(e) => {
                        e.target.size = 1;
                        e.target.blur();
                        handleCityChange(e);
                    }}
                    className="w-full text-black px-2 md:px-4 py-1 md:py-[0.65rem] border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 bg-white text-sm md:text-base overflow-auto max-h-48"
                    value={selectedCityId ?? 0}
                    required
                    >
                    <option value={0}>Pilih Kota</option>
                    {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                        {city.name}
                        </option>
                    ))}
                    <option value="add-new">+ Tambah Kota</option>
                    </select>
                </div>
            </div>
            <div className="flex flex-col md:flex-row flex-wrap md:mb-3">
                <div className="flex-1 md:mr-4">
                    <label className="block text-gray-700 text-sm font-bold mb-1 md:mb-2" htmlFor="instagram">
                        Instagram *
                    </label>
                    <input
                        type="text"
                        name="instagram"
                        value={vendorData.instagram}
                        onChange={handleChange}
                        className={`shadow appearance-none border rounded w-full mb-3 md:mb-0 py-1 md:py-2 px-3 text-sm md:text-base text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formSubmitted && !vendorData.instagram ? 'border-red-500' : ''}`}
                        placeholder="Instagram"
                        required
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-gray-700 text-sm font-bold mb-1 md:mb-2" htmlFor="socialMedia">
                        Sosial Media Lainnya
                    </label>
                    <input
                        type="text"
                        name="socialMedia"
                        value={vendorData.socialMedia}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full mb-3 md:mb-0 py-1 md:py-2 px-3 text-sm md:text-base text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Sosial Media Lainnya"
                    />
                </div>
            </div>
            <div className="mb-7">
                <label className="block text-gray-700 text-sm font-bold mb-2 md:mb-2" htmlFor="documentUrl">
                    Link MoU Kerjasama *
                </label>
                <input
                    type="text"
                    name="documentUrl"
                    value={vendorData.documentUrl}
                    onChange={handleChange}
                    className={`shadow appearance-none border rounded w-full mb-3 md:mb-0 py-1 md:py-2 px-3 text-sm md:text-base text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formSubmitted && !vendorData.documentUrl ? 'border-red-500' : ''}`}
                    placeholder="Link MoU"
                    required
                />
            </div>
            <div className="flex items-center justify-center md:justify-end -mb-2">
                <button
                    type="submit"
                    className="bg-pink-800 hover:bg-pink-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Tambah Vendor
                </button>
            </div>
        </form>

  
        {/* Popup for adding new Kota */}
        {showPopup && (
          <div className="fixed z-10 inset-0 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
            <div className="relative bg-white rounded-xl p-6 md:p-8 w-full md:w-1/4">
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setShowPopup(false)}
                  className="p-2 rounded-full bg-white text-black shadow-lg flex items-center justify-center w-10 h-10 hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-700"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-3 text-pink-900 font-sofia text-center">
                Tambah Kota
              </h1>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col md:flex-row flex-wrap md:mb-3">
                  <div className="flex-1">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-1 md:mb-2"
                      htmlFor="city"
                    >
                      Nama Kota *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="shadow appearance-none border rounded w-full mb-3 md:mb-0 py-1 md:py-2 px-3 text-sm md:text-base text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Nama Kota"
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center justify-center md:justify-end -mb-2">
                  <button
                    onClick={handleAddCity}
                    type="button"
                    className="bg-pink-800 hover:bg-pink-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Tambah Kota
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }