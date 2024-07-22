'use client';
import React from 'react';
import { ContactBox, Navbar } from '../../page';
import { CommandLeft } from '../commandLeft';

export default function AdminOrderRecap() {
    return (
      <div>
        <div className="min-h-screen flex flex-col p-10 mt-16">
            <Navbar />
            <div className="flex flex-col md:flex-row flex-grow">
                <CommandLeft />
                <div className="flex-grow ml-0 md:ml-7 py-[0.15rem]">
                    <Table />
                </div>
            </div>
        </div>
        <ContactBox />
      </div>
    );
}

function Table() {
    const dummyData = [
        {
            id: 1,
            name: "Fulan bin Fulan",
            phone: "+628123456789",
            email: "fulanbinfulan@email.co.id",
            address: "Dago, Bandung",
            startDate: "18/7/2024",
            endDate: "20/7/2024"
        },
        {
            id: 2,
            name: "Ahmad bin Ahmad",
            phone: "+628987654321",
            email: "ahmadbinahmad@email.co.id",
            address: "Cihampelas, Bandung",
            startDate: "19/7/2024",
            endDate: "21/7/2024"
        },
        {
            id: 3,
            name: "Siti binti Siti",
            phone: "+6281122334455",
            email: "sitibintisiti@email.co.id",
            address: "Riau, Bandung",
            startDate: "20/7/2024",
            endDate: "22/7/2024"
        }
    ];

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
                    {dummyData.map((data, index) => (
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