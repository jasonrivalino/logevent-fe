"use client";
import Image from 'next/image';
import { SetStateAction, useState } from 'react';
import { ContactBox, Navbar } from '../page';
import { FaShoppingCart, FaTrashAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [activeOption, setActiveOption] = useState('Logistik Vendor');

  const handleToggle = (option: string) => {
    setActiveOption(option);
    // Dummy function for toggling action
    console.log(`Switched to ${option}`);
  };

  return (
    <div className="container mx-auto font-sofia">
      <Navbar />
      <div className="flex flex-col gap-4 px-14 py-24">
        <div className="flex flex-col gap-4 bg-white shadow-lg rounded-xl p-4 md:p-8 mt-6">
          <div className='flex justify-between'>
            <div className='flex flex-row'>
              <FaShoppingCart className="text-4xl text-pink-900 mr-5 -mt-[0.15rem]" />
              <h1 className="text-3xl font-bold text-pink-900 font-sofia mb-5">
                {activeOption === 'Paket Event' ? 'Keranjang Paket Event' : 'Keranjang Logistik Vendor'}
              </h1>
            </div>
            <div className="flex flex-row rounded-full border border-white transition-all duration-300">
            <button
                className={`px-2 py-1 rounded-l-full transition-all duration-300 ${activeOption === 'Logistik Vendor' ? 'bg-pink-600 text-white' : 'bg-white text-pink-600 border border-pink-600'}`}
                onClick={() => handleToggle('Logistik Vendor')}
            >
                Logistik Vendor
            </button>
            <button
                className={`px-3 py-1 rounded-r-full transition-all duration-300 ${activeOption === 'Paket Event' ? 'bg-pink-600 text-white' : 'bg-white text-pink-600 border border-pink-600'}`}
                onClick={() => handleToggle('Paket Event')}
            >
                Paket Event
            </button>
            </div>
          </div>
          {activeOption === 'Paket Event' ? (
            <KeranjangPaketEvent events={dummyEvents} />
          ) : (
            <KeranjangLogistikVendor />
          )}
        </div>
      </div>
      <ContactBox />
    </div>
  );
}

const dummyEvents = [
    {
      id: 1,
      name: 'Ballroom A',
      description: 'Paket ulang tahun yang cocok untuk kantong pelajar, murah dan berkelas untuk membuat ulang tahunmu semakin berkesan. Dapatkan harga spesial untuk ulang tahunmu di Ballroom A. Tersedia berbagai pilihan paket yang bisa disesuaikan dengan kebutuhanmu. Jangan lewatkan kesempatan ini, segera pesan sekarang!',
      categoryName: 'Ballroom',
      image: '/Image/partyevent.jpg',
      rate: '4.5',
      location: 'Lebak Bulus, Jakarta',
      price: 10000000,
      listProduct: ['Gedung Sabuga ITB', 'Set sound system - Raka Sound', 'Dekorasi Tema lautan', 'Catering - Sari Rasa', 'Marina Catering', 'Photobooth - Snapy' ]
    },
    {
      id: 2,
      name: 'Hall B',
      description: 'Sweet Seventeen Anda hanya sekali seumur hidup, jangan lewatkan memori indah yang akan Anda ingat selamanya. Paket ini menawarkan perencanaan ulang tahun mewah dan elegan bernuansa pantai Bali.',
      categoryName: 'Hall',
      image: '/Image/partyevent.jpg',
      rate: 4.7,
      location: 'Cihampelas, Bandung',
      price: 15000000,
      listProduct: ['Gedung Sabuga ITB', 'Set sound system - Raka Sound', 'Dekorasi Tema lautan']
    },
    {
      id: 3,
      name: 'Event Space C',
      description: 'Perfect event space for corporate events.',
      categoryName: 'Event Space',
      image: '/Image/partyevent.jpg',
      rate: 4.3,
      location: 'Pakuwon, Surabaya',
      price: 20000000,
      listProduct: ['Gedung Sabuga ITB', 'Set sound system - Raka Sound', 'Dekorasi Tema lautan']
    },
    {
      id: 4,
      name: 'Venue D',
      description: 'Luxury venue for special occasions.',
      categoryName: 'Venue',
      image: '/Image/partyevent.jpg',
      rate: 4.8,
      location: 'Denpasar, Bali',
      price: 25000000,
      listProduct: ['Gedung Sabuga ITB', 'Set sound system - Raka Sound', 'Dekorasi Tema lautan']
    },
    {
      id: 5,
      name: 'Conference Room E',
      description: 'Ideal for conferences and seminars.',
      categoryName: 'Conference Room',
      image: '/Image/partyevent.jpg',
      rate: 4.2,
      location: 'Malioboro, Yogyakarta',
      price: 5000000,
      listProduct: ['Gedung Sabuga ITB', 'Set sound system - Raka Sound', 'Dekorasi Tema lautan']
    },
    {
      id: 6,
      name: 'Outdoor Venue F',
      description: 'Beautiful outdoor space for any event.',
      categoryName: 'Outdoor Venue',
      image: '/Image/partyevent.jpg',
      rate: 4.6,
      location: 'Lombok, NTT',
      price: 7500000,
      listProduct: ['Gedung Sabuga ITB', 'Set sound system - Raka Sound', 'Dekorasi Tema lautan']
    },
    {
      id: 7,
      name: 'Banquet Hall G',
      description: 'Elegant banquet hall for weddings and receptions.',
      categoryName: 'Banquet Hall',
      image: '/Image/partyevent.jpg',
      rate: 4.9,
      location: 'Medan, Sumatera Utara',
      price: 12500000,
      listProduct: ['Gedung Sabuga ITB', 'Set sound system - Raka Sound', 'Dekorasi Tema lautan']
    }
];

const KeranjangPaketEvent = ({ events }: { events: Array<any> }) => {
    const router = useRouter();
    const [expandedProducts, setExpandedProducts] = useState<{ [key: string]: boolean }>({});
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 5;
  
    const handleDetailClick = (id: string | number) => {
      setExpandedProducts((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    };
  
    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };
  
    const paginatedEvents = events.slice((currentPage - 1) * eventsPerPage, currentPage * eventsPerPage);
    const totalPages = Math.ceil(events.length / eventsPerPage);
  
    return (
      <div className="flex flex-col gap-4">
        {paginatedEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col md:flex-row justify-between relative"
          >
            <Image
              src={event.image}
              alt={`${event.name} Image`}
              width={400}
              height={200}
              className="object-cover w-80 h-28 md:h-auto"
            />
            <div className="p-3 md:p-4 md:ml-3 flex-grow font-sofia">
              <h3 className="text-base md:text-xl text-pink-900 font-bold">{event.name}</h3>
              <p className="text-xs md:text-sm text-gray-700">{event.type}</p>
              <p className="text-xs md:text-sm text-gray-700 flex flex-row">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 md:h-4 w-3 md:w-4 text-yellow-500 mr-[0.3rem] mt-[0.075rem] md:mt-[0.05rem]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.14 3.51a1 1 0 00.95.69h3.7c.967 0 1.372 1.24.588 1.81l-2.992 2.179a1 1 0 00-.364 1.118l1.14 3.51c.3.921-.755 1.688-1.54 1.118l-2.992-2.178a1 1 0 00-1.175 0l-2.992 2.178c-.785.57-1.84-.197-1.54-1.118l1.14-3.51a1 1 0 00-.364-1.118L2.93 8.937c-.784-.57-.38-1.81.588-1.81h3.7a1 1 0 00.95-.69l1.14-3.51z" />
                </svg>
                {event.rate}
              </p>
              <p className="text-xs md:text-sm text-gray-700 mb-3">{event.location}</p>
              <p className="line-clamp-3 text-xs md:text-sm text-gray-700 font-sofia">{event.description}</p>
              <div className="mt-1 mb-2 flex justify-between items-center">
                <span className="text-base md:text-lg font-bold text-pink-600">Rp{event.price.toLocaleString('id-ID')}</span>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <div className="flex flex-col">
                  <p className="text-xs md:text-sm text-gray-700 font-sofia">Rincian Paket:</p>
                  <p className="text-xs md:text-sm text-gray-700 w-full md:w-[36rem] mb-14 md:mb-0">
                    {expandedProducts[event.id]
                      ? event.listProduct.join(', ')
                      : event.listProduct.join(', ')}
                  </p>
                </div>
                <div className="flex flex-col absolute bottom-4 right-4">
                <button
                  className="text-sm md:text-sm bg-pink-400 hover:bg-pink-700 text-white font-semibold px-1 md:py-1 rounded mb-2"
                  onClick={() => handleDetailClick(event.id)}
                >
                  Lihat Detail
                </button>
                <button
                  className="text-sm md:text-sm bg-pink-600 hover:bg-pink-800 text-white font-semibold px-3 md:py-3 rounded"
                  onClick={() => router.push(`/isi-pemesanan`)}
                >
                  Lanjut Pemesanan
                </button>
              </div>
              </div>
            </div>
          </div>
        ))}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
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

type Vendor = {
  id: number;
  name: string;
  type: string;
  location: string;
  price: number;
  rate: number;
  image: string;
};

const dummyVendors: Vendor[] = [
  {
    id: 1,
    name: 'Gedung Sabuga ITB',
    type: 'Multifunctional Hall',
    location: 'Dago, Bandung',
    price: 25000000,
    rate: 5.0,
    image: '/Image/planetarium.jpg',
  },
  {
    id: 2,
    name: 'Institut Francais Indonesia',
    type: 'Multifunctional Hall',
    location: 'Dago, Bandung',
    price: 25000000,
    rate: 4.5,
    image: '/Image/planetarium.jpg',
  },
  {
    id: 3,
    name: 'Balai Sartika',
    type: 'Multifunctional Hall',
    location: 'Dago, Bandung',
    price: 25000000,
    rate: 4.5,
    image: '/Image/planetarium.jpg',
  },
  {
    id: 4,
    name: 'Gedung Merdeka',
    type: 'Multifunctional Hall',
    location: 'Dago, Bandung',
    price: 25000000,
    rate: 4.5,
    image: '/Image/planetarium.jpg',
  },
  {
    id: 5,
    name: 'Gedung Sate',
    type: 'Multifunctional Hall',
    location: 'Dago, Bandung',
    price: 25000000,
    rate: 4.5,
    image: '/Image/planetarium.jpg',
  },
  {
    id: 6,
    name: 'Gedung Merah Putih',
    type: 'Multifunctional Hall',
    location: 'Dago, Bandung',
    price: 25000000,
    rate: 4.5,
    image: '/Image/planetarium.jpg',
  },
  {
    id: 7,
    name: 'Gedung Indonesia Menggugat',
    type: 'Multifunctional Hall',
    location: 'Dago, Bandung',
    price: 25000000,
    rate: 4.5,
    image: '/Image/planetarium.jpg',
  },
  {
    id: 8,
    name: 'Asia Africa Museum',
    type: 'Multifunctional Hall',
    location: 'Dago, Bandung',
    price: 25000000,
    rate: 4.5,
    image: '/Image/planetarium.jpg',
  },
  {
    id: 9,
    name: 'Geology Museum',
    type: 'Multifunctional Hall',
    location: 'Dago, Bandung',
    price: 25000000,
    rate: 4.5,
    image: '/Image/planetarium.jpg',
  },
  {
    id: 10,
    name: 'Museum Konferensi Asia Afrika',
    type: 'Multifunctional Hall',
    location: 'Dago, Bandung',
    price: 25000000,
    rate: 4.5,
    image: '/Image/planetarium.jpg',
  },
  {
    id: 11,
    name: 'Museum Konferensi Asia Afrika',
    type: 'Multifunctional Hall',
    location: 'Dago, Bandung',
    price: 25000000,
    rate: 4.5,
    image: '/Image/planetarium.jpg',
  }
];
  
const itemsPerPage = 12;

function KeranjangLogistikVendor() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const totalPages = Math.ceil(dummyVendors.length / itemsPerPage);

  const handlePageChange = (page: SetStateAction<number>) => {
    setCurrentPage(page);
  };

  const currentItems = dummyVendors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteClick = (vendor) => {
    setSelectedVendor(vendor);
    setShowPopup(true);
  };

  const handleDelete = () => {
    if (selectedVendor) {
      // Perform the delete operation here, e.g., make an API call to delete the vendor
      const updatedVendors = dummyVendors.filter(v => v.id !== selectedVendor.id);
      // Update the state to reflect the deletion
      dummyVendors.length = 0;
      dummyVendors.push(...updatedVendors);
      setShowPopup(false);
      setSelectedVendor(null); // Reset the selectedVendor after deletion
    } else {
      console.error('No vendor selected for deletion.');
    }
  };

  const handleCheckboxChange = (vendor: { id: any; name?: string; type?: string; location?: string; price: any; rate?: number; image?: string; }) => {
    const isSelected = selectedItems.includes(vendor);
    let updatedItems = [];
    let updatedPrice = totalPrice;

    if (isSelected) {
      updatedItems = selectedItems.filter(item => item.id !== vendor.id);
      updatedPrice -= vendor.price;
    } else {
      updatedItems = [...selectedItems, vendor];
      updatedPrice += vendor.price;
    }

    setSelectedItems(updatedItems);
    setTotalPrice(updatedPrice);
  };

  const handleSubmit = () => {
    // Handle submit logic here
    console.log('Selected Items:', selectedItems);
  };

  return (
    <div className="relative py-4">
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {currentItems.map((vendor) => (
          <div key={vendor.id} className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col justify-between">
            <div className="relative">
              <input
                type="checkbox"
                className="absolute w-5 h-5 top-2 left-2 z-10 cursor-pointer"
                onChange={() => handleCheckboxChange(vendor)}
              />
            </div>
            <Image
              src={vendor.image}
              alt={`${vendor.name} Image`}
              width={400}
              height={200}
              className="object-cover"
            />
            <div className="p-3 md:p-3 font-sofia flex flex-col justify-between flex-grow">
              <div>
                <h3 className="text-sm md:text-base text-pink-900 font-bold mb-2">{vendor.name}</h3>
                <p className="text-xs md:text-sm text-gray-700">{vendor.type}</p>
                <p className="text-xs md:text-sm text-gray-500 flex flex-row">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 md:h-4 w-3 md:w-4 text-yellow-500 mr-[0.3rem] mt-[0.075rem] md:mt-[0.05rem]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.14 3.51a1 1 0 00.95.69h3.7c.967 0 1.372 1.24.588 1.81l-2.992 2.179a1 1 0 00-.364 1.118l1.14 3.51c.3.921-.755 1.688-1.54 1.118l-2.992-2.178a1 1 0 00-1.175 0l-2.992 2.178c-.785.57-1.84-.197-1.54-1.118l1.14-3.51a1 1 0 00-.364-1.118L2.93 8.937c-.784-.57-.38-1.81.588-1.81h3.7a1 1 0 00.95-.69l1.14-3.51z" />
                  </svg> {vendor.rate}
                </p>
                <p className="text-xs md:text-sm text-gray-500">{vendor.location}</p>
                <p className="text-xs md:text-sm text-pink-500 font-bold mt-2">Rp {vendor.price.toLocaleString('id-ID')}</p>
              </div>
              <div className="flex justify-between items-center">
                <button className="self-start text-xs md:text-base text-pink-500 hover:text-pink-700 font-bold mt-4"
                  onClick={() => router.push(`/logistik-vendor/info-detail`)}
                >
                  Lihat Detail
                </button>
                <div className="flex space-x-2">
                  <FaTrashAlt
                    className="text-pink-500 cursor-pointer hover:text-pink-700 mt-4"
                    onClick={() => handleDeleteClick(vendor)}
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
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-100 shadow-md p-4 z-50">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-black font-sofia">Total Items: {selectedItems.length}</p>
            <p className="text-black font-sofia">Total Price: Rp {totalPrice.toLocaleString('id-ID')}</p>
          </div>
          <button className="bg-pink-500 text-white px-4 py-2 rounded-md font-sofia" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </footer>
    </div>
  );
}