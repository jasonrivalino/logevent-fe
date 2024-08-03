'use client';
import React, { useState } from 'react';
import { Navbar } from '../../../page';
import { CommandLeft } from '../../commandLeft';
import { ContactBoxShort } from '@/app/signin/page';
import { useRouter } from 'next/navigation';

export default function AdminVendor() {
    const router = useRouter();
    const handleBackClick = () => {
        router.push('/admin/manage-vendor');
    };

    return (
        <div>
            <Navbar />
            <div className="min-h-screen flex flex-col px-6 md:px-6 md:py-8 mt-32 md:mt-16">
                <div className="flex flex-col md:flex-row flex-grow">
                    <div className="md:hidden flex justify-center items-center">
                        {/* Back button with SVG arrow */}
                        <button 
                          onClick={handleBackClick} 
                          className="absolute top-20 left-4 p-2 rounded-full bg-white text-black shadow-lg flex items-center justify-center w-10 h-10 md:w-12 md:h-12 hover:bg-gray-100"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-6 h-6 text-gray-700"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                    </div>
                    <div className="hidden md:block">
                        <CommandLeft />
                    </div>
                    <div className="flex-grow ml-0 md:ml-7 py-[0.15rem]">
                        <EditVendor />
                    </div>
                </div>
            </div>
            <div className="overflow-hidden">
                <ContactBoxShort />
            </div>
      </div>
    );
}

function EditVendor() {
    const router = useRouter();

    const [vendorData, setVendorData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        instagram: '',
        socialMedia: '',
        MoU: ''
    });

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setVendorData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        // TODO: Add your form submission logic here
        console.log(vendorData);
    };

    return (
        <div className="px-6 md:px-8 pt-6 pb-10 bg-white rounded-xl font-sofia shadow-md">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-3 text-pink-900 font-sofia text-center">Edit Vendor</h1>
            {/* Breadcrumb Navigation */}
            <div className="hidden md:flex items-center mb-4">
                <a onClick={() => router.push('/admin/manage-vendor')} className="text-pink-600 font-semibold font-sofia cursor-pointer">Kelola Vendor</a>
                <span className="mx-2 text-gray-600 font-sofia font-semibold"> {'>'} </span>
                <span className="text-gray-600 font-sofia font-semibold">Edit Vendor</span>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row flex-wrap md:mb-3">
                    <div className="flex-1 md:mr-2">
                        <label className="block text-gray-700 text-sm font-bold mb-1 md:mb-2" htmlFor="name">
                            Nama *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={vendorData.name}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full mb-3 md:mb-0 py-1 md:py-2 px-3 text-sm md:text-base text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Nama Lengkap"
                        />
                    </div>
                    <div className="flex-1 md:mx-2">
                        <label className="block text-gray-700 text-sm font-bold mb-1 md:mb-2" htmlFor="phone">
                            Nomor Telepon / Hp *
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={vendorData.phone}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full mb-3 md:mb-0 py-1 md:py-2 px-3 text-sm md:text-base text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="ex: 089732579"
                        />
                    </div>
                    <div className="flex-1 md:ml-2">
                        <label className="block text-gray-700 text-sm font-bold mb-1 md:mb-2" htmlFor="email">
                            Email *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={vendorData.email}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full mb-3 md:mb-0 py-1 md:py-2 px-3 text-sm md:text-base text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="ex: LogEvent@gmail.com"
                        />
                    </div>
                </div>
                <div className="md:mb-3">
                    <label className="block text-gray-700 text-sm font-bold mb-1 md:mb-2" htmlFor="address">
                        Alamat *
                    </label>
                    <input
                        type="text"
                        name="address"
                        value={vendorData.address}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full mb-3 md:mb-0 py-1 md:py-2 px-3 text-sm md:text-base text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Alamat"
                    />
                </div>
                <div className="flex flex-col md:flex-row flex-wrap md:mb-3">
                    <div className="flex-1 md:mr-4">
                        <label className="block text-gray-700 text-sm font-bold mb-1 md:mb-2" htmlFor="instagram">
                            Instagram *
                        </label>
                        <input
                            type="text"
                            name="instagram"
                            value={vendorData.instagram}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full mb-3 md:mb-0 py-1 md:py-2 px-3 text-sm md:text-base text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Instagram"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-gray-700 text-sm font-bold mb-1 md:mb-2" htmlFor="socialMedia">
                            Sosial Media Lainnya
                        </label>
                        <input
                            type="text"
                            name="socialMedia"
                            value={vendorData.socialMedia}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full mb-3 md:mb-0 py-1 md:py-2 px-3 text-sm md:text-base text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Sosial Media Lainnya"
                        />
                    </div>
                </div>
                <div className="mb-5">
                    <label className="block text-gray-700 text-sm font-bold mb-1 md:mb-2" htmlFor="MoU">
                        Link MoU Kerjasama *
                    </label>
                    <input
                        type="text"
                        name="MoU"
                        value={vendorData.MoU}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full mb-3 md:mb-0 py-1 md:py-2 px-3 text-sm md:text-base text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Link MoU"
                    />
                </div>
                <div className="flex items-center justify-center md:justify-end -mb-2">
                    <button
                        type="submit"
                        className="bg-pink-800 hover:bg-pink-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={() => router.push('/admin/manage-vendor')}
                    >
                        Edit Vendor
                    </button>
                </div>
            </form>
        </div>
    );
}