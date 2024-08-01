'use client';
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { ContactBox, Navbar } from '../../page';
import { CommandLeft } from '../commandLeft';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/navigation';
import 'react-datepicker/dist/react-datepicker.css';

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

export default function AdminStatistics() {
    const router = useRouter();
  
    const handlePrev = () => {
      // Add your routing logic for the previous button
      router.push('/admin/manage-faq'); // Update with the actual route
    };
  
    const handleNext = () => {
      // Add your routing logic for the next button
      router.push('/admin/order-recap'); // Update with the actual route
    };
  
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex flex-col px-6 mt-24">
          <div className="flex flex-col md:flex-row flex-grow">
            <div className="md:hidden flex justify-center items-center">
              <h1 className="text-4xl font-bold text-pink-900 font-sofia mt-4 mb-8">Statistics</h1>
            </div>
            <div className="hidden md:block">
              <CommandLeft />
            </div>
            <div className="flex-grow ml-0 md:ml-7 py-[0.15rem]">
              <Statistics />
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

function Statistics() {
    const [startPengunjungDate, setStartPengunjungDate] = useState(new Date());
    const [startStatistikDate, setStartStatistikDate] = useState(new Date());

    return (
        <div className="px-6 md:px-8 pt-6 pb-10 bg-white rounded-xl shadow-md">
            <div className="flex justify-center md:justify-start">
                <h1 className="text-lg md:text-3xl font-bold mb-4 md:mb-6 text-pink-900 font-sofia">Welcome Admin LogEvent!</h1>
            </div>
            <div className="grid grid-cols-1 gap-6 font-sofia">
            <div className="bg-gray-100 shadow-md rounded-lg p-4 relative">
                <h2 className="text-lg md:text-xl font-bold text-black">Pengunjung Harian</h2>
                <p className="md:text-base text-sm text-gray-600">0</p>
                <p className="md:text-base text-sm text-gray-600">0% dari 30 hari terakhir</p>
                    <div className="relative md:absolute md:top-4 md:right-4 flex space-x-2 md:-mr-[5.5rem] mt-1 md:mt-0 mb-2 md:mb-0">
                        <DatePicker
                            selected={startPengunjungDate}
                            onChange={(date) => setStartPengunjungDate(date ?? new Date())}
                            className="border text-xs md:text-base p-[0.15rem] md:p-1 rounded text-black w-1/2 md:w-3/5"
                        />
                    </div>
                    <div className="h-40 md:h-[18rem]">
                        <Line data={dataPengunjung} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
                <div className="bg-gray-100 shadow-md rounded-lg p-4 relative text-black">
                    <h2 className="text-xl font-bold">Statistik Pemesanan</h2>
                    <p className="md:text-base text-sm text-gray-600">0</p>
                    <p className="md:text-base text-xs text-gray-600">Peningkatan 0% sejak 30 hari terakhir</p>
                    <div className="relative md:absolute md:top-4 md:right-4 flex space-x-2 md:-mr-[5.5rem] mt-1 md:mt-0 mb-2 md:mb-0">
                        <DatePicker
                            selected={startStatistikDate}
                            onChange={(date) => setStartStatistikDate(date ?? new Date())}
                            className="border text-xs md:text-base p-[0.15rem] md:p-1 rounded text-black w-1/2 md:w-3/5"
                        />
                    </div>
                    <div className="h-40 md:h-[18rem]">
                        <Line data={dataStatistik} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>
        </div>
    );
}