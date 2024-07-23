// app/admin/manage-vendor/add/page.tsx
'use client';

// dependency modules
import { useRouter } from 'next/navigation';
import { useState } from 'react';
// self-defined modules
import { Navbar } from '@/app/page';
import { CommandLeft } from '@/app/admin/commandLeft';
import { ContactBoxShort } from '@/app/signin/page';
import { createVendor } from '@/app/utils/vendorApi';

export default function AdminVendor() {
    return (
      <div className="min-h-screen flex flex-col overflow-hidden">
        <div className="flex-grow p-10 mt-16">
            <Navbar />
            <div className="flex flex-col md:flex-row flex-grow">
                <CommandLeft />
                <div className="flex-grow ml-0 md:ml-7 py-[0.15rem]">
                    <AddVendor />
                </div>
            </div>
        </div>
        <div className="overflow-hidden">
            <ContactBoxShort />
        </div>
      </div>
    );
}

function AddVendor() {
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

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            await createVendor(vendorData);
            router.push('/admin/manage-vendor');
        } catch (error: any) {
            console.error('Failed to create vendor:', error.message);
        }
    };

    return (
        <div className="px-8 pt-6 pb-10 bg-white rounded-xl font-sofia shadow-md">
            <h1 className="text-3xl font-bold mb-3 text-pink-900">Welcome Admin LogEvent!</h1>
            {/* Breadcrumb Navigation */}
            <div className="hidden md:flex items-center mb-4">
                <a onClick={() => router.push('/admin/manage-vendor')} className="text-pink-600 font-semibold font-sofia cursor-pointer">Kelola Vendor</a>
                <span className="mx-2 text-gray-600 font-sofia font-semibold"> {'>'} </span>
                <span className="text-gray-600 font-sofia font-semibold">Tambah Vendor</span>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-wrap mb-3">
                    <div className="flex-1 mr-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Nama
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={vendorData.name}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Nama Lengkap"
                        />
                    </div>
                    <div className="flex-1 mx-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                            Nomor Telepon / Hp
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={vendorData.phone}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="ex: 089732579"
                        />
                    </div>
                    <div className="flex-1 ml-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={vendorData.email}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="ex: LogEvent@gmail.com"
                        />
                    </div>
                </div>
                <div className="mb-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                        Alamat
                    </label>
                    <input
                        type="text"
                        name="address"
                        value={vendorData.address}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Alamat"
                    />
                </div>
                <div className="flex flex-wrap mb-3">
                    <div className="flex-1 mr-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="instagram">
                            Instagram
                        </label>
                        <input
                            type="text"
                            name="instagram"
                            value={vendorData.instagram}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Instagram"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="socialMedia">
                            Sosial Media Lainnya
                        </label>
                        <input
                            type="text"
                            name="socialMedia"
                            value={vendorData.socialMedia}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Sosial Media Lainnya"
                        />
                    </div>
                </div>
                <div className="mb-7">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="MoU">
                        Link MoU Kerjasama
                    </label>
                    <input
                        type="text"
                        name="MoU"
                        value={vendorData.MoU}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Link MoU"
                    />
                </div>
                <div className="flex items-center justify-end -mb-2">
                    <button
                        type="submit"
                        className="bg-pink-800 hover:bg-pink-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Tambah Vendor
                    </button>
                </div>
            </form>
        </div>
    );
}