'use client';
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { FaChartBar, FaClipboardList, FaUserPlus, FaCalendarAlt } from 'react-icons/fa';
import { ContactBox, Navbar } from '../../page';
import { useRouter, usePathname } from 'next/navigation';
import { CommandLeft } from '../commandLeft';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const dataPengunjung = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    datasets: [
        {
            label: 'Pengunjung Harian',
            data: [2, 1, 3, 2, 6],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }
    ]
};

const dataStatistik = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
        {
            label: 'Statistik Pemesanan',
            data: [0, 0, 0, 0],
            fill: false,
            borderColor: 'rgb(255, 99, 132)',
            tension: 1
        }
    ]
};

export default function AdminEventPackage() {
    return (
      <div>
        <div className="min-h-screen flex flex-col p-10 mt-16">
            <Navbar />
            <div className="flex flex-col md:flex-row flex-grow">
                <CommandLeft />
                <div className="flex-grow ml-0 md:ml-7 py-[0.15rem]">
                    <ManageEventPackage />
                </div>
            </div>
        </div>
        <ContactBox />
      </div>
    );
}

function ManageEventPackage() {
    return (
        <div className="px-8 pt-6 pb-10 bg-white rounded-xl shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-pink-900 font-sofia">Welcome Admin LogEvent !</h1>
            <div className="grid grid-cols-1 gap-6 font-sofia">
                <p className='text-black'>This is Manage Event Package</p>
            </div>
        </div>
    );
}