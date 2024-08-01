"use client";
import Image from 'next/image';
import { SetStateAction, useState } from 'react';
import { ContactBox, Navbar } from '../page';
import { FaHistory } from 'react-icons/fa';
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
              <FaHistory className="text-4xl text-pink-900 mr-5 -mt-[0.15rem]" />
              <h1 className="text-3xl font-bold text-pink-900 font-sofia mb-5">
                {activeOption === 'Paket Event' ? 'Histori Paket Event' : 'Histori Logistik Vendor'}
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
            <HistoriPaketEvent events={dummyEvents} />
          ) : (
            <HistoriLogistikVendor />
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
      description: 'Paket ulang tahun yang cocok untuk kantong pelajar...',
      categoryName: 'Ballroom',
      image: '/Image/partyevent.jpg',
      rate: '4.5',
      location: 'Lebak Bulus, Jakarta',
      price: 10000000,
      listProduct: ['Gedung Sabuga ITB', 'Set sound system - Raka Sound', 'Dekorasi Tema lautan', 'Catering - Sari Rasa', 'Marina Catering', 'Photobooth - Snapy'],
      date: '20 July 2024'
  },
  {
      id: 2,
      name: 'Hall B',
      description: 'Sweet Seventeen Anda hanya sekali seumur hidup...',
      categoryName: 'Hall',
      image: '/Image/partyevent.jpg',
      rate: 4.7,
      location: 'Cihampelas, Bandung',
      price: 15000000,
      listProduct: ['Gedung Sabuga ITB', 'Set sound system - Raka Sound', 'Dekorasi Tema lautan'],
      date: '18 July 2024'
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
      listProduct: ['Gedung Sabuga ITB', 'Set sound system - Raka Sound', 'Dekorasi Tema lautan'],
      date: '15 July 2024'
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
      listProduct: ['Gedung Sabuga ITB', 'Set sound system - Raka Sound', 'Dekorasi Tema lautan'],
      date: '22 July 2024'
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
      listProduct: ['Gedung Sabuga ITB', 'Set sound system - Raka Sound', 'Dekorasi Tema lautan'],
      date: '19 July 2024'
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
      listProduct: ['Gedung Sabuga ITB', 'Set sound system - Raka Sound', 'Dekorasi Tema lautan'],
      date: '25 July 2024'
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
      listProduct: ['Gedung Sabuga ITB', 'Set sound system - Raka Sound', 'Dekorasi Tema lautan'],
      date: '21 July 2024'
  }
];

dummyEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

const HistoriPaketEvent = ({ events }) => {
  const [expandedProducts, setExpandedProducts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 5;

  const handleDetailClick = (id) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handlePageChange = (page) => {
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
            <p className="text-xs md:text-sm text-gray-700">{event.categoryName}</p>
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
                <p className="text-xs md:text-sm text-gray-700 font-sofia mb-2">Ulas layanan kami yuk !</p>
                <button
                  className="text-sm md:text-sm bg-pink-600 hover:bg-pink-800 text-white font-semibold px-3 md:py-2 rounded"
                  onClick={() => handleDetailClick(event.id)}
                >
                  Review
                </button>
              </div>
            </div>
            <p className="text-xs md:text-sm text-pink-700 font-sofia mt-4">Tanggal Pesan: {event.date}</p>
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
    date: string;
  };
  
  const dummyVendors: Vendor[] = [
    { id: 1, name: 'Gedung Sabuga ITB', type: 'Multifunctional Hall', location: 'Dago, Bandung', price: 25000000, rate: 5.0, image: '/Image/planetarium.jpg', date: '20 July 2024' },
    { id: 2, name: 'Institut Francais Indonesia', type: 'Multifunctional Hall', location: 'Dago, Bandung', price: 25000000, rate: 4.5, image: '/Image/planetarium.jpg', date: '21 July 2024' },
    { id: 3, name: 'Balai Sartika', type: 'Multifunctional Hall', location: 'Dago, Bandung', price: 25000000, rate: 4.5, image: '/Image/planetarium.jpg', date: '21 July 2024' },
    { id: 4, name: 'Gedung Merdeka', type: 'Multifunctional Hall', location: 'Dago, Bandung', price: 25000000, rate: 4.5, image: '/Image/planetarium.jpg', date: '31 August 2024' },
    { id: 5, name: 'Gedung Sate', type: 'Multifunctional Hall', location: 'Dago, Bandung', price: 25000000, rate: 4.5, image: '/Image/planetarium.jpg', date: '10 June 2024' },
    { id: 6, name: 'Gedung Merah Putih', type: 'Multifunctional Hall', location: 'Dago, Bandung', price: 25000000, rate: 4.5, image: '/Image/planetarium.jpg', date: '21 March 2024' },
    { id: 7, name: 'Gedung Indonesia Menggugat', type: 'Multifunctional Hall', location: 'Dago, Bandung', price: 25000000, rate: 4.5, image: '/Image/planetarium.jpg', date: '1 January 2024' },
    { id: 8, name: 'Asia Africa Museum', type: 'Multifunctional Hall', location: 'Dago, Bandung', price: 25000000, rate: 4.5, image: '/Image/planetarium.jpg', date: '1 January 2024' },
    { id: 9, name: 'Geology Museum', type: 'Multifunctional Hall', location: 'Dago, Bandung', price: 25000000, rate: 4.5, image: '/Image/planetarium.jpg', date: '1 January 2024' },
    { id: 10, name: 'Museum Konferensi Asia Afrika', type: 'Multifunctional Hall', location: 'Dago, Bandung', price: 25000000, rate: 4.5, image: '/Image/planetarium.jpg', date: '13 August 2023' },
    { id: 11, name: 'Museum Konferensi Asia Afrika', type: 'Multifunctional Hall', location: 'Dago, Bandung', price: 25000000, rate: 4.5, image: '/Image/planetarium.jpg', date: '13 August 2023' },
  ];
  
  const itemsPerPage = 5;
  
  function HistoriLogistikVendor() {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
  
    const uniqueDates = [...new Set(dummyVendors.map(vendor => vendor.date))].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    const totalPages = Math.ceil(uniqueDates.length / itemsPerPage);
  
    const handlePageChange = (page: SetStateAction<number>) => {
      setCurrentPage(page);
    };
  
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = currentPage * itemsPerPage;
    const currentDates = uniqueDates.slice(startIdx, endIdx);
  
    const groupedVendors = currentDates.reduce((groups, date) => {
      groups[date] = dummyVendors.filter(vendor => vendor.date === date);
      return groups;
    }, {});
  
    return (
      <div className="relative py-4">
        {Object.entries(groupedVendors).map(([date, vendors]) => (
          <div key={date} className="mb-8 font-sofia">
            <h2 className="text-lg md:text-xl font-bold mb-4 text-pink-800">{date}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {vendors.map((vendor: Vendor) => (
                <div key={vendor.id} className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col justify-between">
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
                    <div className="flex justify-center items-center mt-2">
                      <button className="bg-pink-600 hover:bg-pink-800 px-2 py-1 rounded-lg text-white self-start text-xs md:text-base font-bold mt-4"
                        onClick={() => router.push(`/logistik-vendor/info-detail`)}
                      >
                        Review
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
  
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />  
      </div>
    );
  }