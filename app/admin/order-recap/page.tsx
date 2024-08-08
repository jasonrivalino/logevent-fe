// app/admin/order-recap/page.tsx
'use client';

// dependency modules
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaCheck, FaTimes } from 'react-icons/fa';
// self-defined modules
import { ContactBox, Navbar } from '@/app/page';
import { CommandLeft } from '@/app/admin/commandLeft';
import { convertDate, generateEmailUrl, generateGoogleMapsUrl, generateWhatsAppUrl } from '@/app/utils/helpers';
import { readAllOrders } from '@/app/utils/orderApi';
import { Order } from '@/app/utils/types';

export default function AdminOrderRecap() {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await readAllOrders();
                setOrders(data);
            } catch (error: any) {
                console.error('Failed to fetch orders:', error.message);
            }
        };

        fetchOrders();
    }, []);

    const router = useRouter();
  
    const handlePrev = () => {
      // Add your routing logic for the previous button
      router.push('/admin/statistics'); // Update with the actual route
    };
  
    const handleNext = () => {
      // Add your routing logic for the next button
      router.push('/admin/manage-vendor'); // Update with the actual route
    };

    return (
        <div>
            <Navbar />
            <div className="min-h-screen flex flex-col px-6 mt-24">
                <div className="flex flex-col md:flex-row flex-grow">
                    <div className="md:hidden flex justify-center items-center">
                        <h1 className="text-4xl font-bold text-pink-900 font-sofia mt-4 mb-8">Order Recap</h1>
                    </div>
                    <div className="hidden md:block">
                        <CommandLeft />
                    </div>
                    <div className="flex-grow ml-0 md:ml-7 py-[0.15rem]">
                        <Table orders={orders} />
                    </div>
                </div>
            </div>
            <ContactBox />
            <button 
                className="md:hidden fixed top-[25rem] left-2 px-1 py-1 bg-pink-600 text-white rounded-full shadow-lg hover:shadow-2xl focus:outline-none"
                onClick={handlePrev}
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                </button>
                <button 
                className="md:hidden fixed top-[25rem] right-2 px-1 md:px-3 py-1 md:py-2 bg-pink-600 text-white rounded-full shadow-lg hover:shadow-2xl focus:outline-none"
                onClick={handleNext}
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
};

function Table({ orders }: { orders: Order[] }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const itemsPerPage = 10;
    const totalPages = Math.ceil(orders.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedOrders = orders.slice(startIndex, startIndex + itemsPerPage);

    const handleConfirmation = (action: string) => {
        setModalContent(action === "approve" ? "Apakah kamu yakin ingin menyetujui pemesanan ini?" : "Apakah kamu yakin ingin menolak pemesanan ini?");
        setShowModal(true);
    };

    return (
        <div className="bg-white border-2 rounded-xl w-full mb-4 md:mb-0 px-8 pt-6 pb-10 overflow-x-auto">
            <h1 className="text-3xl font-bold mb-6 text-pink-900 font-sofia">Welcome Admin LogEvent !</h1>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lengkap</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Telepon</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Mulai Acara</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Berakhir Acara</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedOrders.map((order, index) => (
                        <tr key={index}>
                            <td className="px-4 py-[0.4rem] md:py-2 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                            <td className="px-4 py-[0.4rem] md:py-2 whitespace-nowrap text-sm text-gray-900">{order.name}</td>
                            <td className="px-4 py-[0.4rem] md:py-2 whitespace-nowrap text-sm text-gray-900">
                                <a href={generateWhatsAppUrl(order.phone)} target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:underline">
                                    {order.phone}
                                </a>
                            </td>
                            <td className="px-4 py-[0.4rem] md:py-2 whitespace-nowrap text-sm text-gray-900">
                                <a href={generateEmailUrl(order.userEmail)} className="text-gray-900 hover:underline">
                                    {order.userEmail}
                                </a>
                            </td>
                            <td className="px-4 py-[0.4rem] md:py-2 whitespace-nowrap text-sm text-gray-900">
                                <a href={generateGoogleMapsUrl(order.address)} target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:underline">
                                    {order.address}
                                </a>
                            </td>
                            <td className="px-4 py-[0.4rem] md:py-2 whitespace-nowrap text-sm text-gray-900">{convertDate(order.startDate)}</td>
                            <td className="px-4 py-[0.4rem] md:py-2 whitespace-nowrap text-sm text-gray-900">{convertDate(order.endDate)}</td>
                            <td className="px-4 py-[0.4rem] md:py-2 whitespace-nowrap text-sm text-gray-900">Wedding</td>
                            <td className="px-4 py-[0.4rem] md:py-2 whitespace-nowrap text-sm text-gray-900 flex justify-center items-center">
                                <button onClick={() => handleConfirmation("approve")} className="mr-2">
                                    <FaCheck className="text-green-500" />
                                </button>
                                <button onClick={() => handleConfirmation("reject")}>
                                    <FaTimes className="text-red-500" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-center bg-white z-10">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 font-sofia">
                    <div className="bg-white p-4 md:p-8 rounded shadow-lg z-60 max-w-xs md:max-w-md w-full">
                        <p className="text-black text-sm md:text-lg">{modalContent}</p>
                        <div className="mt-4 flex justify-end">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 text-black rounded mr-2 text-sm md:text-base">Cancel</button>
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-pink-500 text-white rounded text-sm md:text-base">Confirm</button>
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
        <div className="flex justify-center mt-8 md:mt-0">
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