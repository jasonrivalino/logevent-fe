// app/admin/manage-vendor/edit/[editVendorId]/page.tsx
'use client';

// dependency modules
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
// self-defined modules
import { Navbar } from '@/app/page';
import { CommandLeft } from '@/app/admin/commandLeft';
import { ContactBoxShort } from '@/app/signin/page';
import { readAllCities, createCity, updateCity, deleteCity } from '@/app/utils/cityApi';
import { readVendorById, updateVendor } from '@/app/utils/vendorApi';
import { City, Vendor } from '@/app/utils/types';
import { set } from 'react-datepicker/dist/date_utils';

export default function AdminVendor() {
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
        console.error('Failed to fetch product:', error);
      }
    };

    fetchData();
  }, [pathname]);

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
                      {vendor && <EditVendor vendor={vendor} />}
                  </div>
              </div>
          </div>
          <div className="overflow-hidden">
              <ContactBoxShort />
          </div>
    </div>
  );
}

function EditVendor({ vendor }: { vendor: Vendor }) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [newCity, setNewCity] = useState('');
  const [editCityName, setEditCityName] = useState('');
  const [cityToEdit, setCityToEdit] = useState<City | null>(null);
  const [cityToDelete, setCityToDelete] = useState<City | null>(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [cities, setCities] = useState<City[]>([]);

  const [vendorData, setVendorData] = useState({
    name: vendor.name,
    phone: vendor.phone,
    email: vendor.email,
    address: vendor.address,
    instagram: vendor.instagram || '',
    socialMedia: vendor.socialMedia || '',
    documentUrl: vendor.documentUrl || '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cities = await readAllCities();
        setCities(cities);
        setSelectedCityId(vendor.cityId);
      } catch (error) {
        console.error('Failed to fetch cities:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setVendorData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      if (!vendorData.name) {
        throw new Error('Nama vendor tidak boleh kosong');
      }

      if (!vendorData.phone) {
        throw new Error('Nomor telepon vendor tidak boleh kosong');
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

      if (!selectedCityId) {
        throw new Error('Kota vendor harus dipilih');
      }

      const vendorDataWithCityId = {
        ...vendorData,
        cityId: selectedCityId,
      };
      await updateVendor(vendor.id, vendorDataWithCityId);
      router.push('/admin/manage-vendor');
    } catch (error: any) {
      console.error('Failed to update vendor:', error.message);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (id: number | null) => {
    setSelectedCityId(id);
    toggleDropdown();
  };

  const handleEditCity = (city: City) => {
    setCityToEdit(city);
    setEditCityName(city.name);
    setShowEditPopup(true);
  };

  const handleDeleteCity = (city: City) => {
    setCityToDelete(city);
    setShowDeletePopup(true);
  };
  
  const handleSaveCity = async () => {
    if (cityToEdit) {
      const updatedCity = { ...cityToEdit, name: editCityName };
      setCities(cities.map((city) => (city.id === cityToEdit.id ? updatedCity : city)));

      const cityData = { name: editCityName };
      await updateCity(cityToEdit.id, cityData);

      setCityToEdit(null);
      setEditCityName('');
    }
    setShowEditPopup(false);
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

  const handleConfirmDeleteCity = async () => { 
    if (cityToDelete) {
      if (cityToDelete.id === selectedCityId) {
        setSelectedCityId(null);
      }
      await deleteCity(cityToDelete.id);
      setCities((prevCities) => prevCities.filter((city) => city.id !== cityToDelete.id));
      setCityToDelete(null);
      setShowDeletePopup(false);
    }
  };

  return (
    <div className="px-6 md:px-8 pt-6 pb-10 bg-white rounded-xl font-sofia shadow-md">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-3 text-pink-900 font-sofia text-center">
        Edit Vendor
      </h1>
      {/* Breadcrumb Navigation */}
      <div className="hidden md:flex items-center mb-4">
        <a
          onClick={() => router.push('/admin/manage-vendor')}
          className="text-pink-600 font-semibold font-sofia cursor-pointer"
        >
          Kelola Vendor
        </a>
        <span className="mx-2 text-gray-600 font-sofia font-semibold"> {'>'} </span>
        <span className="text-gray-600 font-sofia font-semibold">Edit Vendor</span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row flex-wrap md:mb-3">
          <div className="flex-1 md:mr-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-1 md:mb-2"
              htmlFor="name"
            >
              Nama
            </label>
            <input
              type="text"
              name="name"
              value={vendorData.name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full mb-3 md:mb-0 py-1 md:py-2 px-3 text-sm md:text-base text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Nama Lengkap"
            />
          </div>
          <div className="flex-1 md:mx-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-1 md:mb-2"
              htmlFor="phone"
            >
              Nomor Telepon / Hp
            </label>
            <input
              type="text"
              name="phone"
              value={vendorData.phone}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full mb-3 md:mb-0 py-1 md:py-2 px-3 text-sm md:text-base text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="ex: 089732579"
            />
          </div>
          <div className="flex-1 md:ml-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-1 md:mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={vendorData.email}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full mb-3 md:mb-0 py-1 md:py-2 px-3 text-sm md:text-base text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="ex: LogEvent@gmail.com"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row flex-wrap md:mb-3">
          <div className="flex-[2] md:mr-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-1 md:mb-2"
              htmlFor="address"
            >
              Alamat
            </label>
            <input
              type="text"
              name="address"
              value={vendorData.address}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full mb-3 md:mb-0 py-1 md:py-2 px-3 text-sm md:text-base text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Alamat"
            />
          </div>
          <div className="flex-1">
            <label
              className="block text-gray-700 text-sm font-bold mb-1 md:mb-2"
              htmlFor="address"
            >
              Kota *
            </label>
            <div className="relative text-black">
              <button
                type="button"
                onClick={toggleDropdown}
                className="w-full text-black px-2 md:px-4 py-1 md:py-[0.5rem] border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 bg-white text-sm md:text-base overflow-auto max-h-48"
              >
                {cities.find((city) => city.id === selectedCityId)?.name ||
                  'Pilih Kota'}
              </button>
              {isDropdownOpen && (
                <div className="absolute bg-white border rounded-lg shadow-lg mt-1 w-full z-10 max-h-40 overflow-y-auto">
                  {cities.map((city) => (
                    <div
                      key={city.id}
                      onClick={() => handleOptionClick(city.id)}
                      className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer text-xs md:text-base"
                    >
                      {city.name}
                      <button
                        className="text-blue-500 text-xs ml-20"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleDropdown();
                          handleEditCity(city);
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
                          handleDeleteCity(city);
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
                    <span>+ Tambah Kota</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row flex-wrap md:mb-3">
          <div className="flex-1 md:mr-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-1 md:mb-2"
              htmlFor="instagram"
            >
              Instagram
            </label>
            <input
              type="text"
              name="instagram"
              value={vendorData.instagram}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full mb-3 md:mb-0 py-1 md:py-2 px-3 text-sm md:text-base text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Instagram"
            />
          </div>
          <div className="flex-1">
            <label
              className="block text-gray-700 text-sm font-bold mb-1 md:mb-2"
              htmlFor="socialMedia"
            >
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
        <div className="mb-5">
          <label
            className="block text-gray-700 text-sm font-bold mb-1 md:mb-2"
            htmlFor="documentUrl"
          >
            Link MoU Kerjasama
          </label>
          <input
            type="text"
            name="documentUrl"
            value={vendorData.documentUrl}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full mb-3 md:mb-0 py-1 md:py-2 px-3 text-sm md:text-base text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Link MoU"
          />
        </div>
        <div className="flex items-center justify-center md:justify-end -mb-2">
          <button
            type="submit"
            className="bg-pink-800 hover:bg-pink-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Edit Vendor
          </button>
        </div>
      </form>

      {/* Popup for Adding New City */}
      {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 font-sofia text-black">
          <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Tambah Kota</h2>
              <input
              type="text"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              className="w-full px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 mb-2"
              placeholder="Masukkan nama kota"
              />
              <div className="flex justify-end space-x-4">
              <button onClick={() => setShowPopup(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg">
                  Batal
              </button>
              <button onClick={handleAddCity} className="px-4 py-2 bg-pink-600 text-white rounded-lg">
                  Tambah
              </button>
              </div>
          </div>
          </div>
      )}

      {/* Edit City Popup */}
      {showEditPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-black">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl mb-4">Edit Kota</h2>
            <input
              type="text"
              value={editCityName}
              onChange={(e) => setEditCityName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Nama Kota"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setCityToEdit(null);
                  setEditCityName('');
                  setShowEditPopup(false)
                }}
                className="mr-2 bg-gray-300 hover:bg-gray-400 text-black py-1 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCity}
                className="bg-pink-600 hover:bg-pink-700 text-white py-1 px-4 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup for Deleting City */}
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 text-black">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto">
            <h3 className="text-lg font-semibold">Delete City</h3>
            <p>Apakah kamu yakin ingin menghapus kota ini?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setCityToDelete(null);
                  setShowDeletePopup(false);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={handleConfirmDeleteCity}
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
  