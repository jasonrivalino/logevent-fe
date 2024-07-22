// app/admin/manage-vendor/page.tsx
'use client';
import React from 'react';
import { ContactBox, Navbar } from '@/app/page';
import { CommandLeft } from '@/app/admin/commandLeft';

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
    return (
        <div className="px-8 pt-6 pb-10 bg-white rounded-xl shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-pink-900 font-sofia">Welcome Admin LogEvent !</h1>
            <div className="grid grid-cols-1 gap-6 font-sofia">
                <p className='text-black'>This is Manage Vendor Package</p>
            </div>
        </div>
    );
}