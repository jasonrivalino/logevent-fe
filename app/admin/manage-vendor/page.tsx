// app/admin/manage-vendor/page.tsx
'use client';

// dependency modules
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
// self-defined modules
import { ContactBox, Navbar } from '@/app/page';
import { CommandLeft } from '@/app/admin/commandLeft';
import { convertDate, generateEmailUrl, generateGoogleMapsUrl, generateInstagramUrl, generateWhatsAppUrl } from '@/app/utils/helpers';
import { readAllVendors, deleteVendor } from '@/app/utils/vendorApi';
import { Vendor } from '@/app/utils/types';

export default function AdminVendor() {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const data = await readAllVendors();
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
        
    const router = useRouter();
  
    const handlePrev = () => {
      router.push('/admin/order-recap');
    };
  
    const handleNext = () => {
      router.push('/admin/manage-event-package');
    };

    return (
      <div>
        <Navbar />
            <div className="min-h-screen flex flex-col px-6 mt-24">
                <div className="flex flex-col md:flex-row flex-grow">
                    <div className="md:hidden flex justify-center items-center">
                        <h1 className="text-4xl font-bold text-pink-900 font-sofia mt-4 mb-8">Manage Vendor</h1>
                    </div>
                    <div className="hidden md:block">
                        <CommandLeft />
                    </div>
                <div className="flex-grow ml-0 md:ml-7 py-[0.15rem]">
                    <ManageVendor vendors={vendors} triggerFetch={triggerFetch} onExport={handleExport} />
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
}

function ManageVendor({ vendors, triggerFetch, onExport }: { vendors: Vendor[], triggerFetch: () => void, onExport: () => void }) {
    const router = useRouter();
    const [expandedVendorId, setExpandedVendorId] = useState<number | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [vendorToDelete, setVendorToDelete] = useState<number | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [paginatedVendors, setPaginatedVendors] = useState(vendors);
    
    useEffect(() => {
        setPaginatedVendors(vendors);
    }, [vendors]);

    const [currentPage, setCurrentPage] = useState(1);
    const vendorsPerPage = 10;

    const totalPages = Math.ceil(paginatedVendors.length / vendorsPerPage);

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

    const handleDelete = async () => {
        try {
            if (vendorToDelete) {
                await deleteVendor(vendorToDelete);
                setVendorToDelete(null);
                setShowPopup(false);
                triggerFetch();
            }
        } catch (error: any) {
            console.error('Failed to delete vendor:', error.message);
        }
    };

    const handleSearch = (event: { target: { value: string; }; }) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filteredVendors = vendors.filter((vendor) =>
            vendor.name.toLowerCase().includes(query)
        );
        setPaginatedVendors(filteredVendors);
        setCurrentPage(1);
    };

    const indexOfLastVendor = currentPage * vendorsPerPage;
    const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;
    const currentVendors = paginatedVendors.slice(indexOfFirstVendor, indexOfLastVendor);

    return (
        <div className="px-6 md:px-8 pt-6 pb-10 bg-white rounded-xl font-sofia shadow-md">
            <div className="flex justify-center md:justify-start">
                <h1 className="text-lg md:text-3xl font-bold mb-4 md:mb-6 text-pink-900 font-sofia">Welcome Admin LogEvent!</h1>
            </div>
            <div className="flex items-center text-black mb-4">
                <span className="mr-2 text-base md:text-lg">Total Vendor</span>
                <span className="text-2xl font-bold border-pink-900 border-2 px-2 md:px-3 md:py-1">{vendors.length}</span>
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
                        placeholder="Cari kebutuhan vendormu"
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full text-sm md:text-base p-1 md:p-2 pl-9 md:pl-12 border rounded bg-white text-black font-sofia"
                    />
                </div>
                <div className="flex w-full md:w-1/3 justify-start md:justify-end items-center space-x-2 md:space-x-4 mt-3 md:mt-0">
                    <button className="text-sm md:text-base bg-pink-500 hover:bg-pink-600 px-2 py-1 md:p-2 rounded-md" onClick={() => router.push('/admin/manage-vendor/add')}>+ Tambah Vendor</button>
                    <button className="text-sm md:text-base bg-pink-500 hover:bg-pink-600 px-2 py-1 md:p-2 rounded-md" onClick={onExport}>Export to Excel</button>
                </div>
            </div>
            {currentVendors.map((vendor) => (
                <div key={vendor.id} className="bg-white p-4 rounded-md mb-2 text-black shadow-md">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                        <div className="flex md:items-center mb-1 md:mb-0">
                            <button onClick={() => toggleExpand(vendor.id)} className="text-xl font-bold">
                                <span className="mr-2 text-base md:text-xl">{expandedVendorId === vendor.id ? 'V' : '>'}</span> 
                                <span className="ml-2 text-base md:text-xl">{vendor.id}. {vendor.name}</span>
                            </button>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center">
                            <span className="mr-5 mb-2 md:mb-0 text-sm md:text-base">Jumlah Produk: {vendor.productCount}</span>
                            <div className='flex flex-row items-center'>
                                <button className="text-sm md:text-base bg-white hover:bg-pink-100 border border-pink-500 text-pink-500 px-1 md:px-3 py-1 md:py-[0.35rem] rounded-md mr-2" onClick={() => router.push(`/admin/manage-vendor/product/${vendor.id}`)}>Kelola Produk</button>
                                <button className="text-sm md:text-base bg-white hover:bg-pink-100 border border-pink-500 text-pink-500 px-1 md:px-3 py-1 md:py-[0.35rem] rounded-md mr-2" onClick={() => router.push(`/admin/manage-vendor/edit/${vendor.id}`)}>Edit Vendor</button>
                                <button className="bg-red-500 text-white p-1 md:p-2 rounded-md" onClick={() => confirmDelete(vendor.id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M6.5 4a1 1 0 00-.894.553L5 5H3a1 1 0 000 2h1v9a2 2 0 002 2h8a2 2 0 002-2V7h1a1 1 0 100-2h-2l-.606-1.447A1 1 0 0013.5 4h-7zM6 7v9h8V7H6zm4-3a1 1 0 011 1v1h-2V5a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    {expandedVendorId === vendor.id && (
                        <div className="mt-5 md:mt-2">
                            {[
                                { label: "Nama Lengkap", value: vendor.name },
                                { 
                                    label: "Nomor Telepon", 
                                    value: (
                                        <a href={generateWhatsAppUrl(vendor.phone, '')} target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:underline">
                                            {vendor.phone}
                                        </a>
                                    ) 
                                },
                                { 
                                    label: "Email", 
                                    value: (
                                        <a href={generateEmailUrl(vendor.email)} className="text-gray-900 hover:underline">
                                            {vendor.email}
                                        </a>
                                    ) 
                                },
                                { 
                                    label: "Alamat", 
                                    value: (
                                        <a href={generateGoogleMapsUrl(vendor.address)} target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:underline">
                                            {vendor.address}
                                        </a>
                                    ) 
                                },
                                { 
                                    label: "Instagram", 
                                    value: (
                                        <a href={generateInstagramUrl(vendor.instagram || "#")} target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:underline">
                                            {vendor.instagram}
                                        </a>
                                    ) 
                                },
                                { label: "Sosial Media Lainnya", value: vendor.socialMedia },
                                { label: "Tanggal bergabung", value: convertDate(vendor.joinDate) },
                            ].map((item, index) => (
                                <div key={index} className="flex justify-between text-xs md:text-base">
                                    <div className="w-1/2 md:w-1/6">{item.label}:</div>
                                    <div className="w-1/2 flex-grow">{item.value}</div>
                                </div>
                            ))}
                            <div className="flex justify-between text-xs md:text-base">
                                <div className="flex-grow">
                                    <a href={vendor.documentUrl || "#"} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Lihat MoU Kerjasama disini</a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
            {totalPages > 1 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            )}

            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-lg text-center w-10/12 md:w-full">
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