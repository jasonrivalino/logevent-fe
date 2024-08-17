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
      router.push('/admin/manage-faq');
    };
  
    const handleNext = () => {
      router.push('/admin/statistics');
    };

    return (
        <div>
            <Navbar />
            <div className="min-h-screen flex flex-col px-6 mt-24">
                <div className="flex flex-col md:flex-row flex-grow">
                    <div className="md:hidden flex justify-center items-center">
                        <h1 className="text-4xl font-bold text-pink-900 font-sofia mt-4 mb-8">Settings</h1>
                    </div>
                    <div className="hidden md:block">
                        <CommandLeft />
                    </div>
                    <div className="flex-grow ml-0 md:ml-7 py-[0.15rem]">
                        <Settings />
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

function Settings() {
    return (
        <div className="bg-white border-2 rounded-xl w-full mb-4 md:mb-0 px-6 md:px-8 py-6 overflow-x-auto font-sofia">
            <div className="flex justify-center md:justify-start">
                <h1 className="text-lg md:text-3xl font-bold mb-4 md:mb-6 text-pink-900 font-sofia">Welcome Admin LogEvent!</h1>
            </div>
            <div className="space-y-2 md:space-y-4 text-black">
                <h2 className="text-lg md:text-2xl font-bold text-gray-700 text-center md:text-left">About Us Page Settings</h2>
                
                {/* Title Section */}
                <div>
                    <label htmlFor="deskripsi" className="block font-medium text-gray-700 text-sm md:text-base">Deskripsi</label>
                    <textarea
                        id="deskripsi"
                        name="deskripsi"
                        rows={4}
                        className="mt-1 p-2 md:p-3 block w-full rounded-md text-xs md:text-base border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm bg-gray-100"
                        defaultValue="Kami menghadirkan pengalaman terbaik untuk penyewaan vendor logistik event secara praktis. Dengan pilihan vendor yang handal dan produk yang berkualitas tinggi, kami memastikan bahwa setiap event Anda berjalan lancar dan sesuai harapan."
                    />
                </div>
                
                {/* Link YouTube Section */}
                <div>
                    <label htmlFor="linkYouTube" className="block font-medium text-gray-700 text-sm md:text-base">Link YouTube</label>
                    <input
                        type="text"
                        name="linkYouTube"
                        id="linkYouTube"
                        className="mt-1 mb-4 md:mb-0 p-2 md:p-3 block w-full rounded-md text-xs md:text-base border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm bg-gray-100"
                        defaultValue="https://youtu.be/ZZI2uAkUfHA"
                    />
                </div>

                {/* Statistics Section */}
                <div className="flex flex-col md:flex-row justify-between md:space-x-4">
                    <div className="md:text-center flex flex-row md:flex-col mb-4 md:mb-0">
                        <label htmlFor="vendorMitra" className="block font-medium mt-2 md:mt-0 text-gray-700 text-sm md:text-base">Vendor Mitra</label>
                        <input
                            type="number"
                            id="vendorMitra"
                            name="vendorMitra"
                            className="p-2 block w-1/4 md:w-full ml-auto rounded-md text-xs md:text-base border-gray-300 shadow-sm bg-gray-100 focus:border-pink-500 focus:ring-pink-500 sm:text-xl text-center no-spinners"
                            defaultValue={30}
                        />
                    </div>
                    <div className="md:text-center flex flex-row md:flex-col mb-4 md:mb-0">
                        <label htmlFor="logistikVendor" className="block font-medium mt-2 md:mt-0 text-gray-700 text-sm md:text-base">Logistik Vendor</label>
                        <input
                            type="number"
                            id="logistikVendor"
                            name="logistikVendor"
                            className="mt-1 p-2 block w-1/4 md:w-full ml-auto rounded-md text-xs md:text-base border-gray-300 shadow-sm bg-gray-100 focus:border-pink-500 focus:ring-pink-500 sm:text-xl text-center no-spinners"
                            defaultValue={100}
                        />
                    </div>
                    <div className="md:text-center flex flex-row md:flex-col">
                        <label htmlFor="eventSukses" className="block font-medium mt-2 md:mt-0 text-gray-700 text-sm md:text-base">Event Sukses Terlaksana</label>
                        <input
                            type="number"
                            id="eventSukses"
                            name="eventSukses"
                            className="mt-1 p-2 block w-1/4 md:w-full ml-auto rounded-md text-xs md:text-base border-gray-300 shadow-sm bg-gray-100 focus:border-pink-500 focus:ring-pink-500 sm:text-xl text-center no-spinners"
                            defaultValue={30}
                        />
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        type="button"
                        className="px-4 md:px-6 py-1 md:py-2 bg-pink-900 text-white rounded-lg shadow hover:bg-pink-800 focus:outline-none mt-5"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}