// app/wishlist/page.tsx
'use client';

// dependency module
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { SetStateAction, useEffect, useState } from 'react';
import { FaCartPlus, FaTrashAlt } from 'react-icons/fa';
// self-defined modules
import { ContactBox, Navbar } from '@/app/page';
import { readUserProfile } from '@/app/utils/authApi';
import { readActiveEventCartByUserId, readActiveProductCartByUserId, createCart } from '@/app/utils/cartApi';
import { createItem, deleteItemsByCartId } from '@/app/utils/itemApi';
import { readEventWishlistsByUserId, readProductWishlistsByUserId, deleteWishlist } from '@/app/utils/wishlistApi';
import { EventWishlist, ProductWishlist } from '@/app/utils/types';

export default function HomePage() {
  const router = useRouter();
  const [activeOption, setActiveOption] = useState('Logistik Vendor');
  const [eventWishlists, setEventWishlists] = useState<EventWishlist[]>([]);
  const [productWishlists, setProductWishlists] = useState<ProductWishlist[]>([]);

  const handleToggle = (option: string) => {
    setActiveOption(option);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('User token not found');
        }

        const user = await readUserProfile(token);
        const eventWishlists = await readEventWishlistsByUserId(user.id);
        const productWishlists = await readProductWishlistsByUserId(user.id);

        setEventWishlists(eventWishlists);
        setProductWishlists(productWishlists);
      } catch (error: any) {
        console.error((error as any).message);
        router.push('/signin');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto font-sofia">
      <Navbar />
      <div className="flex flex-col gap-4 px-6 md:px-8 py-16 md:py-20">
        <div className="flex flex-col gap-4 bg-white shadow-lg rounded-xl p-4 md:p-8 mt-6">
          <div className='flex flex-col md:flex-row justify-between'>
            <div className='flex flex-row'>
              <FaCartPlus className="text-4xl text-pink-900 mr-5 -mt-[0.15rem]" />
              <h1 className="text-xl md:text-3xl font-bold text-pink-900 font-sofia mt-1 md:mt-0 mb-5">
                {activeOption === 'Paket Event' ? 'Wishlist Paket Event' : 'Wishlist Logistik Vendor'}
              </h1>
            </div>
            <div className="flex flex-row rounded-full border border-white transition-all duration-300">
            <button
                className={`px-2 py-2 md:py-1 text-xs md:text-base rounded-l-full transition-all duration-300 ${activeOption === 'Logistik Vendor' ? 'bg-pink-600 text-white' : 'bg-white text-pink-600 border border-pink-600'}`}
                onClick={() => handleToggle('Logistik Vendor')}
            >
                Logistik Vendor
            </button>
            <button
                className={`px-3 py-2 md:py-1 text-xs md:text-base rounded-r-full transition-all duration-300 ${activeOption === 'Paket Event' ? 'bg-pink-600 text-white' : 'bg-white text-pink-600 border border-pink-600'}`}
                onClick={() => handleToggle('Paket Event')}
            >
                Paket Event
            </button>
            </div>
          </div>
          {activeOption === 'Paket Event' ? (
            <WishlistPaketEvent eventWishlists={eventWishlists} />
          ) : (
            <WishlistLogistikVendor productWishlists={productWishlists} />
          )}
        </div>
      </div>
      <ContactBox />
    </div>
  );
}

const WishlistPaketEvent = ({ eventWishlists }: { eventWishlists: EventWishlist[] }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [eventToRemove, setEventToRemove] = useState<EventWishlist | null>(null);
  const eventsPerPage = 5;

  const handleDetailClick = (id: string | number) => {
    router.push(`/paket-event/info-detail/${id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedEvents = eventWishlists.slice((currentPage - 1) * eventsPerPage, currentPage * eventsPerPage);
  const totalPages = Math.ceil(eventWishlists.length / eventsPerPage);

  const handleEventOrder = async (e: { preventDefault: () => void; }, event: EventWishlist) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User token not found');
      }

      const user = await readUserProfile(token);
      let cart = await readActiveEventCartByUserId(user.id);
      if (!cart) {
        cart = await createCart(user.id, 'Event');
      }

      await deleteItemsByCartId(cart.id);
      const itemData = {
        cartId: cart.id,
        eventId: event.eventId,
        productId: null,
        duration: null,
        quantity: null,
      };

      await createItem(itemData);
      router.push('/isi-pemesanan/paket-event');
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handleDeleteClick = (event: EventWishlist) => {
    setEventToRemove(event);
    setShowPopup(true);
  };

  const confirmDeleteEventWishlists = () => {
    if (eventToRemove) {
      deleteWishlist(eventToRemove.id);
      eventWishlists.splice(eventWishlists.indexOf(eventToRemove), 1);
      setShowPopup(false);
      setEventToRemove(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {eventWishlists.length === 0 ? (        
        <div className="text-center py-44">
          <p className="text-base md:text-xl text-gray-600 font-bold">Wishlist Anda Kosong</p>
          <p className="text-xs md:text-base text-gray-500">Tambahkan paket ke wishlist untuk memulai pemesanan</p>
        </div>
      ) : (
        <>
          {paginatedEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col md:flex-row justify-between relative mt-4"
            >
              {/* Delete icon */}
              <FaTrashAlt
                className="text-red-600 hover:text-red-700 absolute top-2 right-2 cursor-pointer w-5 h-5"
                onClick={() => handleDeleteClick(event)}
              />
              
              <Image
                src={event.eventImage || '/images/placeholder-image.jpg'}
                alt={`${event.eventName} Image`}
                width={400}
                height={200}
                className="object-cover w-80 h-24 md:h-auto"
              />
              <div className="p-3 md:p-4 md:ml-3 flex-grow font-sofia">
                <h3 className="text-base md:text-xl text-pink-900 font-bold">{event.eventName}</h3>
                <p className="text-xs md:text-sm text-gray-700 flex flex-row">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 md:h-4 w-3 md:w-4 text-yellow-500 mr-[0.3rem] mt-[0.075rem] md:mt-[0.05rem]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.14 3.51a1 1 0 00.95.69h3.7c.967 0 1.372 1.24.588 1.81l-2.992 2.179a1 1 0 00-.364 1.118l1.14 3.51c.3.921-.755 1.688-1.54 1.118l-2.992-2.178a1 1 0 00-1.175 0l-2.992 2.178c-.785.57-1.84-.197-1.54-1.118l1.14-3.51a1 1 0 00-.364-1.118L2.93 8.937c-.784-.57-.38-1.81.588-1.81h3.7a1 1 0 00.95-.69l1.14-3.51z" />
                  </svg> {event.eventRating && event.eventRating.toFixed(2) !== "0.00" ? event.eventRating.toFixed(2) : "N/A"}
                </p>
                <p className="line-clamp-3 text-xs md:text-sm text-gray-700 font-sofia">{event.eventDescription}</p>
                <div className="mt-1 mb-2 flex justify-between items-center">
                  <span className="text-base md:text-lg font-bold text-pink-600">Rp{event.eventPrice.toLocaleString('id-ID')}</span>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <div className="flex flex-col">
                    <p className="text-xs md:text-sm text-gray-700 font-sofia">Rincian Paket:</p>
                    <p className="text-xs md:text-sm text-gray-700 w-full md:w-[36rem] mb-14 md:mb-0">
                      {event.eventBundles}
                    </p>
                  </div>
                  <div className="flex flex-row md:flex-col absolute bottom-4 md:right-4 w-full md:w-auto">
                    <button
                      className="text-xs md:text-sm w-2/5 mr-2 md:mr-0 md:w-auto bg-pink-400 hover:bg-pink-700 text-white font-semibold px-1 py-1 rounded md:mb-2"
                      onClick={() => handleDetailClick(event.eventId)}
                    >
                      Lihat Detail
                    </button>
                    <button
                      className="text-xs md:text-sm w-1/2 md:w-auto bg-pink-600 hover:bg-pink-800 text-white font-semibold px-3 py-1 md:py-3 mr-6 md:mr-0 rounded"
                      onClick={(e) => handleEventOrder(e, event)}
                    >
                      Lanjut Pemesanan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          )}
        </>
      )}
      
      {/* Confirmation Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-10/12 md:w-1/2">
            <p className="text-black text-base md:text-lg font-bold mb-4">Hapus Paket Event</p>
            <p className="text-black text-sm md:text-base mb-4">Apakah Anda yakin ingin menghapus paket ini dari wishlist?</p>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded mr-2 text-sm md:text-base"
                onClick={() => setShowPopup(false)}
              >
                Batal
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm md:text-base"
                onClick={confirmDeleteEventWishlists}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function WishlistLogistikVendor({ productWishlists }: { productWishlists: ProductWishlist[] }) {
  const router = useRouter();
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<ProductWishlist[]>([]);
  const [amount, setAmount] = useState<{ [key: number]: number }>({});
  const [showPopup, setShowPopup] = useState(false); // State for confirmation popup

  const totalPages = Math.ceil(productWishlists.length / itemsPerPage);

  const handlePageChange = (page: SetStateAction<number>) => {
    setCurrentPage(page);
  };

  const currentItems = productWishlists.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCheckboxChange = (productWishlist: ProductWishlist) => {
    const isSelected = selectedItems.includes(productWishlist);
    let updatedItems = [];

    const itemAmount = amount[productWishlist.id] || 1;

    if (isSelected) {
      updatedItems = selectedItems.filter((item) => item.id !== productWishlist.id);
    } else {
      updatedItems = [...selectedItems, productWishlist];
    }

    setSelectedItems(updatedItems);
  };

  const increaseAmount = (id: number) => {
    setAmount((prev) => ({
      ...prev,
      [id]: (prev[id] || 1) + 1,
    }));
  };

  const decreaseAmount = (id: number) => {
    setAmount((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) - 1),
    }));
  };

  const handleRemoveSelectedItems = () => {
    setShowPopup(true); // Show confirmation popup
  };

  const confirmDeleteProductWishlists = () => {
    for (const item of selectedItems) {
      deleteWishlist(item.id);
      productWishlists.splice(productWishlists.indexOf(item), 1);
    }
    setSelectedItems([]);
    setShowPopup(false);
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (selectedItems.length < 1) {
      alert('Please select at least one item');
    } else {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('User token not found');
        }

        const user = await readUserProfile(token);
        let cart = await readActiveProductCartByUserId(user.id);
        if (!cart) {
          cart = await createCart(user.id, 'Product');
        }

        await deleteItemsByCartId(cart.id);
        for (const item of selectedItems) {
          const itemData = {
            cartId: cart.id,
            eventId: null,
            productId: item.productId,
            duration: item.productRate === "Hourly" ? amount[item.id] : null,
            quantity: item.productRate === "Quantity" ? amount[item.id] : null,
          };

          await createItem(itemData);
        }

        router.push('/isi-pemesanan/logistik-vendor');
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="relative py-4">
      {productWishlists.length === 0 ? (
        <div className="text-center py-40">
          <p className="text-base md:text-xl text-gray-600 font-bold">Wishlist Anda Kosong</p>
          <p className="text-xs md:text-base text-gray-500">Tambahkan paket ke wishlist untuk memulai pemesanan</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {currentItems.map((item) => (
              <div key={item.id} className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col justify-between">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="absolute w-5 h-5 top-2 left-2 z-10 cursor-pointer"
                    onChange={() => handleCheckboxChange(item)}
                  />
                </div>
                <Image
                  src={item.productImage || '/images/placeholder-image.jpg'}
                  alt={`${item.productName} Image`}
                  width={400}
                  height={200}
                  className="object-cover w-full h-20 md:h-32"
                />
                <div className="p-3 md:p-3 font-sofia flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-sm md:text-base text-pink-900 font-bold mb-2">{item.productName}</h3>
                    <p className="text-xs md:text-sm text-gray-700">{item.productSpecification}</p>
                    <p className="text-xs md:text-sm text-gray-500 flex flex-row">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 md:h-4 w-3 md:w-4 text-yellow-500 mr-[0.3rem] mt-[0.075rem] md:mt-[0.05rem]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.14 3.51a1 1 0 00.95.69h3.7c.967 0 1.372 1.24.588 1.81l-2.992 2.179a1 1 0 00-.364 1.118l1.14 3.51c.3.921-.755 1.688-1.54 1.118l-2.992-2.178a1 1 0 00-1.175 0l-2.992 2.178c-.785.57-1.84-.197-1.54-1.118l1.14-3.51a1 1 0 00-.364-1.118L2.93 8.937c-.784-.57-.38-1.81.588-1.81h3.7a1 1 0 00.95-.69l1.14-3.51z" />
                      </svg> {item.productRating && item.productRating.toFixed(2) !== "0.00" ? item.productRating.toFixed(2) : "N/A"}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500">{item.vendorAddress}</p>
                    <p className="text-xs md:text-sm text-pink-500 font-bold mt-2">Rp{item.productPrice.toLocaleString('id-ID')}</p>
                  </div>
                  {(item.productRate === "Hourly" || item.productRate === "Quantity") && (
                    <div className="flex justify-between items-center mt-2 bg-gray-100 w-2/5 text-xs md:text-base">
                      <button
                        className="bg-gray-200 text-gray-700 px-1 md:px-2 md:py-1 rounded-md"
                        onClick={() => decreaseAmount(item.id)}
                        disabled={amount[item.id] === 1}
                      >
                        -
                      </button>
                      <span className="mx-2 text-black">{amount[item.id] || 1}</span>
                      <button
                        className="bg-gray-200 text-gray-700 px-1 md:px-2 md:py-1 rounded-md"
                        onClick={() => increaseAmount(item.id)}
                      >
                        +
                      </button>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <button className="self-start text-xs md:text-base text-pink-500 hover:text-pink-700 font-bold mt-2"
                      onClick={() => router.push(`/logistik-vendor/info-detail/${item.productId}`)}
                    >
                      Lihat Detail
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          )}
        </>
      )}

      {/* Confirmation Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 text-black">
          <div className="bg-white p-6 rounded-md shadow-md w-10/12 md:w-1/2">
            <h2 className="text-base md:text-lg font-bold mb-4">Konfirmasi Hapus</h2>
            <p className="text-sm md:text-base mb-4">Apakah Anda yakin ingin menghapus produk yang dipilih?</p>
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded-md text-sm md:text-base"
                onClick={() => setShowPopup(false)}
              >
                Batal
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm md:text-base"
                onClick={confirmDeleteProductWishlists}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="fixed bottom-0 left-0 right-0 bg-gray-100 shadow-md p-4 z-40">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-black font-sofia text-sm md:text-base">
              Jumlah Barang: {selectedItems.length}
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-1 md:gap-4">
            <button
              className="bg-red-600 border text-white hover:bg-red-600 hover:text-white font-bold py-1 md:py-2 px-2 md:px-4 rounded-md transition-colors duration-300 ease-in-out text-sm md:text-base"
              onClick={handleRemoveSelectedItems}
              disabled={selectedItems.length === 0}
            >
              Hapus Pilihan
            </button>
            <button
              className="bg-pink-500 text-white hover:bg-pink-700 font-bold py-1 md:py-2 px-2 md:px-4 rounded-md transition-colors duration-300 ease-in-out text-sm md:text-base"
              onClick={handleSubmit}
              disabled={selectedItems.length === 0}
            >
              Tambah ke Keranjang
            </button>
          </div>
        </div>
      </footer>
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