'use client';
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { ContactBox, Navbar } from '../../page';
import { CommandLeft } from '../commandLeft';
import DatePicker from 'react-datepicker';
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
    return (
      <div>
        <div className="min-h-screen flex flex-col p-10 mt-16">
            <Navbar />
            <div className="flex flex-col md:flex-row flex-grow">
                <CommandLeft />
                <div className="flex-grow ml-0 md:ml-7 py-[0.15rem]">
                    <Statistics />
                </div>
            </div>
        </div>
        <ContactBox />
      </div>
    );
}

function Statistics() {
    const [startPengunjungDate, setStartPengunjungDate] = useState(new Date());
    const [startStatistikDate, setStartStatistikDate] = useState(new Date());

    return (
        <div className="px-8 pt-6 pb-10 bg-white rounded-xl shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-pink-900 font-sofia">Welcome Admin LogEvent !</h1>
            <div className="grid grid-cols-1 gap-6 font-sofia">
                <div className="bg-gray-100 shadow-md rounded-lg p-4 relative">
                    <h2 className="text-xl font-bold text-black">Pengunjung Harian</h2>
                    <div className="absolute top-4 right-4 flex space-x-2">
                        <DatePicker
                            selected={startPengunjungDate}
                            onChange={(date) => setStartPengunjungDate(date ?? new Date())}
                            className="border p-1 rounded text-black"
                        />
                    </div>
                    <p className="text-gray-600">0</p>
                    <p className="text-gray-600">0% dari 30 hari terakhir</p>
                    <div className="h-[18rem]">
                        <Line data={dataPengunjung} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
                <div className="bg-gray-100 shadow-md rounded-lg p-4 relative text-black">
                    <h2 className="text-xl font-bold">Statistik Pemesanan</h2>
                    <div className="absolute top-4 right-4 flex space-x-2">
                        <DatePicker
                            selected={startStatistikDate}
                            onChange={(date) => setStartStatistikDate(date ?? new Date())}
                            className="border p-1 rounded"
                        />
                    </div>
                    <p className="text-gray-600">0</p>
                    <p className="text-gray-600">Peningkatan 0% sejak 30 hari terakhir</p>
                    <div className="h-[18rem]">
                        <Line data={dataStatistik} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>
        </div>
    );
}