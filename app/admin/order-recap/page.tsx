'use client';
import React, { useState } from 'react';
import { ContactBox, Navbar } from '../../page';
import { CommandLeft } from '../commandLeft';
import { useRouter } from 'next/navigation';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function AdminOrderRecap() {
    const [data, setData] = useState([
        { id: 1, name: 'John Doe', phone: '123456789', email: 'john@example.com', address: '123 Main St', startDate: '2024-07-01', endDate: '2024-07-05' },
        { id: 2, name: 'Jane Smith', phone: '987654321', email: 'jane@example.com', address: '456 Elm St', startDate: '2024-07-10', endDate: '2024-07-12' },
        { id: 3, name: 'Alice Johnson', phone: '456789123', email: 'alice@example.com', address: '789 Maple St', startDate: '2024-07-15', endDate: '2024-07-18' },
        { id: 4, name: 'Bob Brown', phone: '321654987', email: 'bob@example.com', address: '101 Pine St', startDate: '2024-07-20', endDate: '2024-07-22' },
        { id: 5, name: 'Charlie Davis', phone: '789123456', email: 'charlie@example.com', address: '202 Oak St', startDate: '2024-07-25', endDate: '2024-07-28' },
        { id: 6, name: 'Diana Evans', phone: '654789321', email: 'diana@example.com', address: '303 Cedar St', startDate: '2024-07-30', endDate: '2024-08-02' },
        { id: 7, name: 'Edward Foster', phone: '123456789', email: 'edward@example.com', address: '404 Birch St', startDate: '2024-08-05', endDate: '2024-08-08' },
        { id: 8, name: 'Fiona Green', phone: '987654321', email: 'fiona@example.com', address: '505 Walnut St', startDate: '2024-08-10', endDate: '2024-08-13' },
        { id: 9, name: 'George Harris', phone: '456789123', email: 'george@example.com', address: '606 Willow St', startDate: '2024-08-15', endDate: '2024-08-18' },
        { id: 10, name: 'Hannah White', phone: '321654987', email: 'hannah@example.com', address: '707 Spruce St', startDate: '2024-08-20', endDate: '2024-08-23' },
        { id: 11, name: 'Ian Brown', phone: '789123456', email: 'ian@example.com', address: '808 Pine St', startDate: '2024-08-25', endDate: '2024-08-28' },
        { id: 12, name: 'Jackie Davis', phone: '654789321', email: 'jackie@example.com', address: '909 Oak St', startDate: '2024-08-30', endDate: '2024-09-02' },
        { id: 13, name: 'Kevin Evans', phone: '123456789', email: 'kevin@example.com', address: '1010 Cedar St', startDate: '2024-09-05', endDate: '2024-09-08' },
        { id: 14, name: 'Laura Foster', phone: '987654321', email: 'laura@example.com', address: '1111 Birch St', startDate: '2024-09-10', endDate: '2024-09-13' },
        { id: 15, name: 'Michael Green', phone: '456789123', email: 'michael@example.com', address: '1212 Walnut St', startDate: '2024-09-15', endDate: '2024-09-18' },
    ]);

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
                        <Table data={data} />
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

interface DataItem {
    id: number;
    name: string;
    phone: string;
    email: string;
    address: string;
    startDate: string;
    endDate: string;
}

interface TableProps {
    data: DataItem[];
}

function Table({ data }: TableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const itemsPerPage = 10;
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

    const handleConfirmation = (action: string) => {
        setModalContent(action === "approve" ? "Apakah kamu yakin ingin menyetujui pemesanan ini?" : "Apakah kamu yakin ingin menolak pemesanan ini?");
        setShowModal(true);
    };

    return (
        <div className="bg-white rounded-xl w-full mb-4 md:mb-0 px-6 md:px-8 py-6 shadow-md">
            <div className="flex flex-col justify-center md:justify-start md:sticky md:top-0 bg-white z-10">
                <h1 className="text-lg md:text-3xl font-bold mb-2 md:mb-6 text-pink-900 font-sofia">Welcome Admin LogEvent!</h1>
                <button className="font-sofia text-sm md:text-base bg-pink-500 hover:bg-pink-600 px-2 py-1 md:-mt-10 mb-4 rounded-md md:ml-auto w-28 md:w-auto">Export to Excel</button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 mb-6 md:mb-3">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-1 md:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-4 py-1 md:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lengkap</th>
                            <th className="px-4 py-1 md:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Telepon</th>
                            <th className="px-4 py-1 md:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-4 py-1 md:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</th>
                            <th className="px-4 py-1 md:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mulai Acara</th>
                            <th className="px-4 py-1 md:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selesai Acara</th>
                            <th className="px-4 py-1 md:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori Layanan</th>
                            <th className="px-4 py-1 md:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Konfirmasi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedData.map((data, index) => (
                            <tr key={index}>
                                <td className="px-4 py-[0.4rem] md:py-2 whitespace-nowrap text-sm font-medium text-gray-900">{data.id}</td>
                                <td className="px-4 py-[0.4rem] md:py-2 whitespace-nowrap text-sm text-gray-900">{data.name}</td>
                                <td className="px-4 py-[0.4rem] md:py-2 whitespace-nowrap text-sm text-gray-900">{data.phone}</td>
                                <td className="px-4 py-[0.4rem] md:py-2 whitespace-nowrap text-sm text-gray-900">{data.email}</td>
                                <td className="px-4 py-[0.4rem] md:py-2 whitespace-nowrap text-sm text-gray-900">{data.address}</td>
                                <td className="px-4 py-[0.4rem] md:py-2 whitespace-nowrap text-sm text-gray-900">{data.startDate}</td>
                                <td className="px-4 py-[0.4rem] md:py-2 whitespace-nowrap text-sm text-gray-900">{data.endDate}</td>
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
            </div>
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