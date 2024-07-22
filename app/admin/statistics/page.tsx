// app/admin/statistics/page.tsx
'use client';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { ContactBox, Navbar } from '@/app/page';
import { CommandLeft } from '@/app/admin/commandLeft';
import { readAllOrder } from '@/app/utils/orderApi';
import { readAllProduct } from '@/app/utils/productApi';
import type { Order, Product } from '@/app/utils/types';

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
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
              const products = await readAllProduct();
                const orders = await readAllOrder();
                setProducts(products);
                setOrders(orders);
            } catch (error: any) {
                console.error('Failed to fetch data:', error.message);
            }
        };

        fetchData();
    }, []);

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
    return (
        <div className="px-8 pt-6 pb-10 bg-white rounded-xl shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-pink-900 font-sofia">Welcome Admin LogEvent !</h1>
            <div className="grid grid-cols-1 gap-6 font-sofia">
                <div className="bg-gray-100 shadow-md rounded-lg p-4">
                    <h2 className="text-xl font-bold text-black">Pengunjung Harian</h2>
                    <p className="text-gray-600">0</p>
                    <p className="text-gray-600">0% dari 30 hari terakhir</p>
                    <div className="h-[18rem]">
                        <Line data={dataPengunjung} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
                <div className="bg-gray-100 shadow-md rounded-lg p-4 text-black">
                    <h2 className="text-xl font-bold">Statistik Pemesanan</h2>
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