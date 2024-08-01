// app/admin/manage-event-package/page.tsx
'use client';

// dependency modules
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
// self-defined modules
import { ContactBox, Navbar } from '@/app/page';
import { CommandLeft } from '@/app/admin/commandLeft';
import { readAllEvents, deleteEvent } from '@/app/utils/eventApi';
import { Event } from '@/app/utils/types';

export default function AdminVendor() {
    return (
        <div>
            <div className="min-h-screen flex flex-col p-10 mt-16">
                <Navbar />
                <div className="flex flex-col md:flex-row flex-grow">
                    <CommandLeft />
                    <div className="flex-grow ml-0 md:ml-7 py-[0.15rem]">
                        <ManagePackage />
                    </div>
                </div>
            </div>
            <ContactBox />
        </div>
    );
}

function ManagePackage() {
    const router = useRouter();
    const [expandedEventId, setExpandedEventId] = useState<number | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);
    const [eventToDelete, setEventToDelete] = useState<number | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await readAllEvents();
                setEvents(data);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            }
        };
    
        fetchEvents();
    }, []);

    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 5;
    const totalPages = Math.ceil(events.length / eventsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const toggleExpand = (id: number | null) => {
        setExpandedEventId(expandedEventId === id ? null : id);
    };

    const confirmDelete = (id: number) => {
        setEventToDelete(id);
        setShowPopup(true);
    };

    const handleDeleteClick = async () => {
        if (eventToDelete !== null) {
            await deleteEvent(eventToDelete);
            setShowPopup(false);
            setEventToDelete(null);
            setEvents(events.filter(event => event.id !== eventToDelete));
        }
    };

    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

    const handleDetailClick = (id: number) => {
        toggleExpand(id);
    };

    return (
        <div className="px-8 pt-6 pb-10 bg-white rounded-xl font-sofia shadow-md">
            <h1 className="text-3xl font-bold mb-3 text-pink-900">Welcome Admin LogEvent!</h1>
            <div className="flex items-center text-black mb-4">
                <span className="mr-2 text-lg">Total Paket</span>
                <span className="text-2xl font-bold border-pink-900 border-2 px-3 py-1">{events.length}</span>
            </div>
            <div className="flex justify-between items-center w-full mb-4">
                <div className="relative w-full md:w-[56rem]">
                    <span className="absolute inset-y-0 left-0 flex items-center">
                        <svg className="w-3 md:w-4 h-3 md:h-4 ml-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l4.287 4.287a1 1 0 01-1.414 1.414l-4.287-4.287zM8 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Cari kebutuhan paketmu"
                        className="w-full text-sm md:text-base p-1 md:p-2 pl-9 md:pl-12 border rounded bg-white text-black font-sofia"
                    />
                </div>
                <div className="flex justify-end items-center">
                    <button className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-md" onClick={() => router.push('/admin/manage-event-package/add')}>+ Tambah Paket</button>
                </div>
            </div>
            <div className="flex flex-col gap-4 w-[65rem]">
                {currentEvents.map(event => (
                    <div key={event.id} className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col md:flex-row justify-between relative">
                        <Image
                            src={event.eventImage || "/Image/planetarium.jpg"}
                            alt={`${event.name} Image`}
                            width={400}
                            height={200}
                            className="object-cover w-80 h-28 md:h-auto"
                        />
                        <div className="p-3 md:p-4 md:ml-3 flex-grow font-sofia relative">
                            {/* Icon buttons */}
                            <div className="absolute top-4 right-4 flex space-x-2">
                                <FaEdit
                                    className="text-pink-500 cursor-pointer hover:text-pink-700 w-6 h-6"
                                    onClick={() => router.push(`/admin/manage-event-package/edit/${event.id}`)}
                                />
                                <FaTrashAlt
                                    className="text-pink-500 cursor-pointer hover:text-pink-700 w-5 h-5 mt-[0.15rem]"
                                    onClick={() => confirmDelete(event.id)}
                                />
                            </div>
                            <h3 className="text-base md:text-xl text-pink-900 font-bold">{event.name}</h3>
                            {/* <p className="text-xs md:text-sm text-gray-700">{pkg.type}</p> */}
                            <p className="text-xs md:text-sm text-gray-700 flex flex-row">
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    className= "h-3 md:h-4 w-3 md:w-4 text-yellow-500 mr-[0.3rem] mt-[0.075rem] md:mt-[0.05rem]"
                                    fill="currentColor"
                                    viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.14 3.51a1 1 0 00.95.69h3.7c.967 0 1.372 1.24.588 1.81l-2.992 2.179a1 1 0 00-.364 1.118l1.14 3.51c.3.921-.755 1.688-1.54 1.118l-2.992-2.178a1 1 0 00-1.175 0l-2.992 2.178c-.785.57-1.84-.197-1.54-1.118l1.14-3.51a1 1 0 00-.364-1.118L2.93 8.937c-.784-.57-.38-1.81.588-1.81h3.7a1 1 0 00.95-.69l1.14-3.51z" />
                                </svg> {event.rating && event.rating.toFixed(2) !== "0.00" ? event.rating.toFixed(2) : "N/A"}
                            </p>
                            <p className="line-clamp-3 text-xs md:text-sm text-gray-700 font-sofia">{event.description}</p>
                            <div className="mt-1 mb-2 flex justify-between items-center">
                                <span className="text-base md:text-lg font-bold text-pink-600">Rp{event.price.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="mt-2 flex justify-between items-center">
                                <div className="flex flex-col">
                                    <p className="text-xs md:text-sm text-gray-700 font-sofia">Rincian Paket:</p>
                                    <p className={`text-xs md:text-sm text-gray-700 mb-14 md:mb-0 ${expandedEventId === event.id ? 'w-full' : 'w-[35rem]'}`}>
                                        {event.bundles}
                                    </p>
                                </div>
                                <button
                                    className="absolute bottom-4 right-4 text-sm md:text-base bg-pink-600 hover:bg-pink-800 text-white font-semibold px-3 py-1 md:py-2 rounded"
                                    onClick={() => handleDetailClick(event.id)}
                                >
                                    Lihat Detail
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
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
                  <p className="mb-4 text-black font-sofia">Apakah Anda yakin ingin menghapus paket ini?</p>
                  <p className="mb-6 text-black font-sofia">Dengan menekan tombol ya maka paket yang dipilih akan terhapus dan pengunjung tidak akan dapat melihatnya lagi </p>
                  <div className="flex justify-center space-x-4 font-sofia">
                    <button className="bg-gray-500 text-white px-4 py-2 rounded-md" onClick={() => setShowPopup(false)}>Tidak</button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={handleDeleteClick}>Ya</button>
                  </div>
                </div>
              </div>
            )}
        </div>
    );
}

function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (page: number) => void }) {
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