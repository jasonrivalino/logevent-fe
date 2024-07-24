'use client';
import React, { useState } from 'react';
import { ContactBox, Navbar } from '../../page';
import { CommandLeft } from '../commandLeft';

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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(data.length / itemsPerPage);

    return (
        <div>
            <div className="min-h-screen flex flex-col p-10 mt-16">
                <Navbar />
                <div className="flex flex-col md:flex-row flex-grow">
                    <CommandLeft />
                    <div className="flex-grow ml-0 md:ml-7 py-[0.15rem]">
                        <Table data={data} currentPage={currentPage} itemsPerPage={itemsPerPage} />
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    </div>
                </div>
            </div>
            <ContactBox />
        </div>
    );
};

function Table({ data, currentPage, itemsPerPage }: { data: any[], currentPage: number, itemsPerPage: number }) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="bg-white border-2 rounded-xl w-full mb-4 md:mb-0 px-8 pt-6 pb-10 overflow-x-auto">
            <h1 className="text-3xl font-bold mb-6 text-pink-900 font-sofia">Welcome Admin LogEvent!</h1>
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
                    {paginatedData.map((data: { id: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; name: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; phone: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; email: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; address: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; startDate: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; endDate: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }, index: React.Key | null | undefined) => (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{data.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.phone}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.address}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.startDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.endDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
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