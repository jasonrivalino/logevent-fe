// app/admin/order-recap/page.tsx
'use client';

// dependency modules
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import * as XLSX from 'xlsx';
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

    function exportToExcel(orders: Order[]) {
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(orders);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
        XLSX.writeFile(workbook, 'orders.xlsx');
    }

    const handleExport = () => {
        exportToExcel(orders);
    };
  
    const handlePrev = () => {
      router.push('/admin/statistics');
    };
  
    const handleNext = () => {
      router.push('/admin/manage-vendor');
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
                        <Table orders={orders} onExport={handleExport} />
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

function Table({ orders, onExport }: { orders: Order[], onExport: () => void }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [action, setAction] = useState(""); // State to store the current action
    const [modalContent, setModalContent] = useState("");
    const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
    const ordersPerPage = 10;
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    useEffect(() => {
        handleFilter();
    }, [searchQuery, orders]);

    const handleConfirmation = (action: string) => {
        setAction(action); // Set the current action
        setModalContent(action === "approve" ? "Apakah kamu yakin ingin menyelesaikan pemesanan ini?" : "Apakah kamu yakin ingin membatalkan pemesanan ini?");
        setShowModal(true);
    };

    const handleSearch = (event: { target: { value: string; }; }) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const handleFilter = () => {
      let result = orders;
      
      if (searchQuery) {
          result = result.filter((order) =>
              order.name.toLowerCase().includes(searchQuery) ||
              order.phone.toLowerCase().includes(searchQuery) ||
              order.userEmail.toLowerCase().includes(searchQuery) ||
              order.address.toLowerCase().includes(searchQuery)
          );
      }
    
        setFilteredOrders(result);
        setCurrentPage(1);
    };

    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * ordersPerPage,
        currentPage * ordersPerPage
    );

    return (
        <div className="bg-white border-2 rounded-xl w-full mb-4 md:mb-0 px-8 pt-6 pb-10 overflow-x-auto">
            <div className="flex justify-center md:justify-start">
                <h1 className="text-lg md:text-3xl font-bold mb-4 md:mb-6 text-pink-900 font-sofia">Welcome Admin LogEvent!</h1>
            </div>
            <div className="flex items-center text-black mb-4">
                <span className="mr-2 text-base md:text-lg">Total Pemesanan</span>
                <span className="text-2xl font-bold border-pink-900 border-2 px-2 md:px-3 md:py-1">{orders.length}</span>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center w-full mb-4">
                <div className="relative w-full md:w-5/6">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg className="w-3 md:w-4 h-3 md:h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l4.287 4.287a1 1 0 01-1.414 1.414l-4.287-4.287zM8 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Cari pemesanan"
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full text-sm md:text-base p-1 md:p-2 pl-9 md:pl-12 border rounded bg-white text-black font-sofia"
                    />
                </div>
                <div className="flex w-full md:w-1/3 justify-start md:justify-end items-center space-x-2 md:space-x-4 mt-3 md:mt-0">
                    <button className="text-sm md:text-base bg-pink-500 hover:bg-pink-600 px-2 py-1 md:p-2 rounded-md" onClick={onExport}>Export to Excel</button>
                </div>
            </div>
            <div className="overflow-x-auto md:overflow-x-visible"> {/* Scrollable container */}
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lengkap</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Telepon</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Mulai</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Berakhir</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori Pemesanan</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Pemesanan</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedOrders.map((order, index) => (
                            <tr key={index}>
                                <td className="px-4 py-[0.4rem] md:py-2 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                                <td className="px-4 py-[0.4rem] md:py-2 whitespace-nowrap text-sm text-gray-900">{order.name}</td>
                                <td className="px-4 py-[0.4rem] md:py-2 whitespace-nowrap text-sm text-gray-900">
                                    <a href={generateWhatsAppUrl(order.phone, '')} target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:underline">
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
                                <td className="px-4 py-[0.4rem] md:py-2 whitespace-nowrap text-sm text-gray-900">
                                    {order.cartType === 'Product' ? 'Logistik Vendor' : 'Paket Event'}
                                </td>
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
            </div>
            <div className="flex justify-center bg-white z-10">
                {totalPages > 1 && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                )}
            </div>
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 font-sofia">
                    <div className="bg-white p-4 md:p-8 rounded shadow-lg z-60 max-w-xs md:max-w-md w-full">
                        <h2 className="text-lg md:text-xl font-bold mb-2 text-pink-900">{action === "approve" ? "Konfirmasi Penyelesaian" : "Konfirmasi Pembatalan"}</h2>
                        <p className="text-sm md:text-base text-black">{modalContent}</p>
                        <div className="flex justify-end mt-4">
                            <button onClick={() => setShowModal(false)} className="text-sm md:text-base bg-pink-500 hover:bg-pink-600 px-2 py-1 md:p-2 rounded-md mr-2">
                                Cancel
                            </button>
                            {/* Change button based on popup showed between green or red */}
                            <button onClick={() => setShowModal(false)} className={`text-sm md:text-base ${action === "approve" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"} px-2 py-1 md:p-2 rounded-md`}>
                                {action === "approve" ? "Selesaikan" : "Batalkan"}
                            </button>
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