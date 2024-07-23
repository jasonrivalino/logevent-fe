// app/admin/manage-vendor/page.tsx
'use client';

// dependency modules
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
// self-defined modules
import { ContactBox, Navbar } from '@/app/page';
import { CommandLeft } from '@/app/admin/commandLeft';
import { readAllVendor, deleteVendor } from '@/app/utils/vendorApi';
import { Vendor } from '@/app/utils/types';

export default function AdminVendor() {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const data = await readAllVendor();
                setVendors(data);
            } catch (error: any) {
                console.error('Failed to fetch vendors:', error.message);
            }
        };

        fetchVendors();
    }, [refresh]);

    const triggerFetch = () => {
        setRefresh(!refresh);
    };

    function exportToExcel(vendors: Vendor[]) {
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(vendors);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendors');
        XLSX.writeFile(workbook, 'vendors.xlsx');
    }

    const handleExport = () => {
        exportToExcel(vendors);
    };
        
    return (
      <div>
        <div className="min-h-screen flex flex-col p-10 mt-16">
            <Navbar />
            <div className="flex flex-col md:flex-row flex-grow">
                <CommandLeft />
                <div className="flex-grow ml-0 md:ml-7 py-[0.15rem]">
                    <ManageVendor vendors={vendors} triggerFetch={triggerFetch} onExport={handleExport} />
                </div>
            </div>
        </div>
        <ContactBox />
      </div>
    );
}

function ManageVendor({ vendors, triggerFetch, onExport }: { vendors: Vendor[], triggerFetch: () => void, onExport: () => void }) {
    const router = useRouter();
    const [expandedVendorId, setExpandedVendorId] = useState<number | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [vendorToDelete, setVendorToDelete] = useState<number | null>(null);

    const toggleExpand = (id: number | null) => {
        setExpandedVendorId(expandedVendorId === id ? null : id);
    };

    const confirmDelete = (id: number) => {
        setVendorToDelete(id);
        setShowPopup(true);
    };

    const handleDelete = async () => {
        try {
            if (vendorToDelete !== null) {
                await deleteVendor(vendorToDelete);
                triggerFetch();
            }
            setShowPopup(false);
            setVendorToDelete(null);
        } catch (error: any) {
            console.error('Failed to delete vendor:', error.message);
        }
    };

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
                    <button className="bg-pink-500 hover:bg-pink-600 p-2 rounded-md" onClick={onExport}>Export to Excel</button>
                </div>
            </div>
            {vendors.map((vendor) => (
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
                            <button className="bg-white hover:bg-pink-100 border border-pink-500 text-pink-500 px-3 py-[0.35rem] rounded-md mr-2" onClick={() => router.push(`/admin/manage-vendor/edit/${vendor.id}`)}>Edit</button>
                            <button className="bg-red-500 text-white p-2 rounded-md" onClick={() => confirmDelete(vendor.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M6.5 4a1 1 0 00-.894.553L5 5H3a1 1 0 000 2h1v9a2 2 0 002 2h8a2 2 0 002-2V7h1a1 1 0 100-2h-2l-.606-1.447A1 1 0 0013.5 4h-7zM6 7v9h8V7H6zm4-3a1 1 0 011 1v1h-2V5a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    {expandedVendorId === vendor.id && (
                        <div className="mt-2">
                            <p>Nama Lengkap: {vendor.name}</p>
                            <p>Nomor Telepon: {vendor.phone}</p>
                            <p>Email: {vendor.email}</p>
                            <p>Alamat: {vendor.address}</p>
                            {/* TODO: Add Join Date, Instagram, Facebook, Other Socmed */}
                            {/* <p>Tanggal bergabung: {vendor.joined}</p> */}
                            {/* <p>Instagram: {vendor.instagram}</p> */}
                            {/* <p>Facebook: {vendor.facebook}</p> */}
                            <p>Sosial Media Lainnya:</p>
                            {/* <p><a href="#" className="text-pink-500">{vendor.other}</a></p> */}
                        </div>
                    )}
                </div>
            ))}
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-lg text-center">
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-red-500 text-white p-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 8v4m0 4h.01m0-4h-.01m-.01 0h.01M11 8v4m0 4h.01m0-4h-.01m-.01 0h.01M13 16h-1v-4h-1m1-4h.01M12 8v4m0 4h.01m0-4h-.01m-.01 0h.01M11 8v4m0 4h.01m0-4h-.01m-.01 0h.01" />
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