// app/admin/statistics/page.tsx
'use client';

// dependency modules
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
// self-defined modules
import { ContactBox, Navbar } from '@/app/page';
import { CommandLeft } from '@/app/admin/commandLeft';
import { getOrderCountsToday, getOrderCountsWeekly, getVisitCountsToday, getVisitCountsWeekly } from '@/app/utils/helpers';
import { readPastMonthOrder } from '@/app/utils/orderApi';
import { readPastMonthVisit } from '@/app/utils/visitApi';
import { Order, Visit } from '@/app/utils/types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function AdminStatistics() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [visits, setVisits] = useState<Visit[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const orders = await readPastMonthOrder();
                const visits = await readPastMonthVisit();
                setOrders(orders);
                setVisits(visits);
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
                    <Statistics orders={orders} visits={visits} />
                </div>
            </div>
        </div>
        <ContactBox />
      </div>
    );
}

function Statistics({ orders, visits }: { orders: Order[], visits: Visit[] }) {
    const visitCount = getVisitCountsToday(visits);
    const visitStats = getVisitCountsWeekly(visits);
    const totalVisits = visits.length;
    const visitPercentage = totalVisits === 0 ? 0 : Math.round((visitCount / totalVisits) * 100);

    const orderCount = getOrderCountsToday(orders);
    const orderStats = getOrderCountsWeekly(orders);
    const totalOrders = orders.length;
    const orderAverage = totalOrders === 0 ? 0 : Math.round(totalOrders / 30);
    const orderImprovement = orderAverage === 0 ? 0 : Math.round((orderCount - orderAverage) / orderAverage * 100);

    const visitData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
        datasets: [
            {
                label: 'Pengunjung Harian',
                data: visitStats,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }
        ]
    };

    const visitOptions = {
        maintainAspectRatio: false,
        scales: {
            y: {
                min: 0,
                max: visitStats.reduce((a, b) => Math.max(a, b)) + 1
            }
        }
    };

    const orderData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
        datasets: [
            {
                label: 'Statistik Pemesanan',
                data: orderStats,
                fill: false,
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1
            }
        ]
    };

    const orderOptions = {
        maintainAspectRatio: false,
        scales: {
            y: {
                min: 0,
                max: orderStats.reduce((a, b) => Math.max(a, b)) + 1
            }
        }
    };

    return (
        <div className="px-8 pt-6 pb-10 bg-white rounded-xl shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-pink-900 font-sofia">Welcome Admin LogEvent !</h1>
            <div className="grid grid-cols-1 gap-6 font-sofia">
                <div className="bg-gray-100 shadow-md rounded-lg p-4">
                    <h2 className="text-xl font-bold text-black">Pengunjung Harian</h2>
                    <p className="text-gray-600">Pengunjung Hari Ini: {visitCount}</p>
                    <p className="text-gray-600">{visitPercentage}% dari 30 hari terakhir</p>
                    <div className="h-[18rem]">
                        <Line data={visitData} options={visitOptions} />
                    </div>
                </div>
                <div className="bg-gray-100 shadow-md rounded-lg p-4 text-black">
                    <h2 className="text-xl font-bold">Statistik Pemesanan</h2>
                    <p className="text-gray-600">Pemesanan Hari Ini: {orderCount}</p>
                    <p className="text-gray-600">{orderImprovement}% sejak 30 hari terakhir</p>
                    <div className="h-[18rem]">
                        <Line data={orderData} options={orderOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
}