'use client';
import React, { useState } from 'react';
import { ContactBox, Navbar } from '../../page';
import { CommandLeft } from '../commandLeft';
import { useRouter } from 'next/navigation';

export default function AdminVendor() {
    return (
      <div>
        <div className="min-h-screen flex flex-col p-10 mt-16">
            <Navbar />
            <div className="flex flex-col md:flex-row flex-grow">
                <CommandLeft />
                <div className="flex-grow ml-0 md:ml-7 py-[0.15rem]">
                    <ManageVendor />
                </div>
            </div>
        </div>
        <ContactBox />
      </div>
    );
}

function ManageVendor() {
    const router = useRouter();
    const [expandedVendorId, setExpandedVendorId] = useState<number | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [vendorToDelete, setVendorToDelete] = useState<number | null>(null);
    const [vendors, setVendors] = useState([
        { id: 1, name: 'Vendor A', phone: '083456478967', email: 'vendorA@example.com', address: '123 Main St, City A, Country A', joined: '2022-01-15', instagram: 'https://instagram.com/vendorA', facebook: 'https://facebook.com/vendorA', other: 'Lorem Ipsum', productCount: 17 },
        { id: 2, name: 'Vendor B', phone: '083456478968', email: 'vendorB@example.com', address: '456 Oak St, City B, Country B', joined: '2022-02-20', instagram: 'https://instagram.com/vendorB', facebook: 'https://facebook.com/vendorB', other: 'Lorem Ipsum', productCount: 25 },
        { id: 3, name: 'Vendor C', phone: '083456478969', email: 'vendorC@example.com', address: '789 Pine St, City C, Country C', joined: '2022-03-18', instagram: 'https://instagram.com/vendorC', facebook: 'https://facebook.com/vendorC', other: 'Lorem Ipsum', productCount: 12 },
        { id: 4, name: 'Vendor D', phone: '083456478970', email: 'vendorD@example.com', address: '101 Maple St, City D, Country D', joined: '2022-04-25', instagram: 'https://instagram.com/vendorD', facebook: 'https://facebook.com/vendorD', other: 'Lorem Ipsum', productCount: 9 },
        { id: 5, name: 'Vendor E', phone: '083456478971', email: 'vendorE@example.com', address: '202 Birch St, City E, Country E', joined: '2022-05-10', instagram: 'https://instagram.com/vendorE', facebook: 'https://facebook.com/vendorE', other: 'Lorem Ipsum', productCount: 7 },
        { id: 6, name: 'Vendor F', phone: '083456478972', email: 'vendorF@example.com', address: '303 Cedar St, City F, Country F', joined: '2022-06-14', instagram: 'https://instagram.com/vendorF', facebook: 'https://facebook.com/vendorF', other: 'Lorem Ipsum', productCount: 15 },
        { id: 7, name: 'Vendor G', phone: '083456478973', email: 'vendorG@example.com', address: '404 Elm St, City G, Country G', joined: '2022-07-19', instagram: 'https://instagram.com/vendorG', facebook: 'https://facebook.com/vendorG', other: 'Lorem Ipsum', productCount: 20 },
        { id: 8, name: 'Vendor H', phone: '083456478974', email: 'vendorH@example.com', address: '505 Fir St, City H, Country H', joined: '2022-08-23', instagram: 'https://instagram.com/vendorH', facebook: 'https://facebook.com/vendorH', other: 'Lorem Ipsum', productCount: 18 },
        { id: 9, name: 'Vendor I', phone: '083456478975', email: 'vendorI@example.com', address: '606 Spruce St, City I, Country I', joined: '2022-09-27', instagram: 'https://instagram.com/vendorI', facebook: 'https://facebook.com/vendorI', other: 'Lorem Ipsum', productCount: 13 },
        { id: 10, name: 'Vendor J', phone: '083456478976', email: 'vendorJ@example.com', address: '707 Willow St, City J, Country J', joined: '2022-10-31', instagram: 'https://instagram.com/vendorJ', facebook: 'https://facebook.com/vendorJ', other: 'Lorem Ipsum', productCount: 22 },
        { id: 11, name: 'Vendor K', phone: '083456478977', email: 'vendorK@example.com', address: '808 Ash St, City K, Country K', joined: '2022-11-15', instagram: 'https://instagram.com/vendorK', facebook: 'https://facebook.com/vendorK', other: 'Lorem Ipsum', productCount: 11 },
        { id: 12, name: 'Vendor L', phone: '083456478978', email: 'vendorL@example.com', address: '909 Poplar St, City L, Country L', joined: '2022-12-20', instagram: 'https://instagram.com/vendorL', facebook: 'https://facebook.com/vendorL', other: 'Lorem Ipsum', productCount: 16 },
        { id: 13, name: 'Vendor M', phone: '083456478979', email: 'vendorM@example.com', address: '1010 Redwood St, City M, Country M', joined: '2023-01-24', instagram: 'https://instagram.com/vendorM', facebook: 'https://facebook.com/vendorM', other: 'Lorem Ipsum', productCount: 19 },
        { id: 14, name: 'Vendor N', phone: '083456478980', email: 'vendorN@example.com', address: '1111 Cypress St, City N, Country N', joined: '2023-02-28', instagram: 'https://instagram.com/vendorN', facebook: 'https://facebook.com/vendorN', other: 'Lorem Ipsum', productCount: 14 },
        { id: 15, name: 'Vendor O', phone: '083456478981', email: 'vendorO@example.com', address: '1212 Hickory St, City O, Country O', joined: '2023-03-15', instagram: 'https://instagram.com/vendorO', facebook: 'https://facebook.com/vendorO', other: 'Lorem Ipsum', productCount: 23 }
    ]);

    const [currentPage, setCurrentPage] = useState(1);
    const vendorsPerPage = 10;

    const totalPages = Math.ceil(vendors.length / vendorsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const toggleExpand = (id: number | null) => {
        setExpandedVendorId(expandedVendorId === id ? null : id);
    };

    const confirmDelete = (id: number) => {
        setVendorToDelete(id);
        setShowPopup(true);
    };

    const handleDelete = () => {
        if (vendorToDelete !== null) {
            setVendors(vendors.filter(vendor => vendor.id !== vendorToDelete));
            setShowPopup(false);
            setVendorToDelete(null);
        }
    };

    // Get current vendors
    const indexOfLastVendor = currentPage * vendorsPerPage;
    const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;
    const currentVendors = vendors.slice(indexOfFirstVendor, indexOfLastVendor);

    return (
        <div className="px-8 pt-6 pb-10 bg-white rounded-xl font-sofia shadow-md">
            <h1 className="text-3xl font-bold mb-3 text-pink-900">Welcome Admin LogEvent!</h1>
            <div className="flex items-center text-black mb-4">
                <span className="mr-2 text-lg">Total Vendor</span>
                <span className="text-2xl font-bold border-pink-900 border-2 px-3 py-1">{vendors.length}</span>
            </div>
            <div className="flex justify-between items-center w-full mb-4">
                <div className="relative w-full md:w-5/6">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg className="w-3 md:w-4 h-3 md:h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l4.287 4.287a1 1 0 01-1.414 1.414l-4.287-4.287zM8 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Cari kebutuhan vendormu"
                        className="w-full text-sm md:text-base p-1 md:p-2 pl-9 md:pl-12 border rounded bg-white text-black font-sofia"
                    />
                </div>
                <div className="flex w-full md:w-1/3 justify-end items-center space-x-4">
                    <button className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-md" onClick={() => router.push('/admin/manage-vendor/add')}>+ Tambah Vendor</button>
                    <button className="bg-pink-500 hover:bg-pink-600 p-2 rounded-md">Export to Excel</button>
                </div>
            </div>
            {currentVendors.map((vendor) => (
                <div key={vendor.id} className="bg-white p-4 rounded-md mb-2 text-black shadow-md">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <button onClick={() => toggleExpand(vendor.id)} className="text-xl font-bold">
                                <span className="mr-2">{expandedVendorId === vendor.id ? 'V' : '>'}</span> 
                                <span className="ml-2">{vendor.id}. {vendor.name}</span>
                            </button>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-5">Jumlah Produk: {vendor.productCount}</span>
                            <button className="bg-white hover:bg-pink-100 border border-pink-500 text-pink-500 px-3 py-[0.35rem] rounded-md mr-2">Kelola Produk</button>
                            <button className="bg-white hover:bg-pink-100 border border-pink-500 text-pink-500 px-3 py-[0.35rem] rounded-md mr-2" onClick={() => router.push('/admin/manage-vendor/edit')}>Edit Vendor</button>
                            <button className="bg-red-500 text-white p-2 rounded-md" onClick={() => confirmDelete(vendor.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M6.5 4a1 1 0 00-.894.553L5 5H3a1 1 0 000 2h1v9a2 2 0 002 2h8a2 2 0 002-2V7h1a1 1 0 100-2h-2l-.606-1.447A1 1 0 0013.5 4h-7zM6 7v9h8V7H6zm4-3a1 1 0 011 1v1h-2V5a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    {expandedVendorId === vendor.id && (
                        <div className="mt-2">
                            {[
                                { label: "Nama Lengkap", value: vendor.name },
                                { label: "Nomor Telepon", value: vendor.phone },
                                { label: "Email", value: vendor.email },
                                { label: "Alamat", value: vendor.address },
                                { label: "Tanggal bergabung", value: vendor.joined },
                                { label: "Instagram", value: vendor.instagram },
                                { label: "Facebook", value: vendor.facebook },
                                { label: "Sosial Media Lainnya", value: vendor.other }
                            ].map((item, index) => (
                                <div key={index} className="flex justify-between">
                                    <div className="w-1/6">{item.label}:</div>
                                    <div className="flex-grow">{item.value}</div>
                                </div>
                            ))}
                            <div className="flex justify-between">
                                <div className="flex-grow">
                                    <a href="#" className="text-blue-600 hover:underline">Lihat MoU Kerjasama disini</a>
                                </div>
                                <div className="w-1/6"></div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
            {vendors.length > vendorsPerPage && (
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
                        <p className="mb-4 text-black">Apakah Anda yakin ingin menghapus vendor ini?</p>
                        <p className="mb-6 text-black">Dengan menekan tombol YA maka vendor dan seluruh produk yang dimilikinya akan terhapus dan pengunjung tidak akan dapat melihatnya lagi</p>
                        <div className="flex justify-center space-x-4">
                            <button className="bg-gray-500 text-white px-4 py-2 rounded-md" onClick={() => setShowPopup(false)}>Tidak</button>
                            <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={handleDelete}>Ya</button>
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