// app/admin/statistics/page.tsx
'use client';

// dependency modules
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// self-defined modules
import { ContactBox, Navbar } from '@/app/page';
import { CommandLeft } from '@/app/admin/commandLeft';
import { getVisitToday, getVisitYesterday, getVisitDaily, getOrderPastMonth, getOrderPastTwoMonths, getOrderWeekly } from '@/app/utils/helpers';
import { readPastWeekVisits } from '@/app/utils/visitApi';
import { readPastTwoMonthOrders } from '@/app/utils/orderApi';
import { Order, Visit } from '@/app/utils/types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function AdminStatistics() {
    const [visits, setVisits] = useState<Visit[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const visits = await readPastWeekVisits(new Date());
                const orders = await readPastTwoMonthOrders(new Date());
                setVisits(visits);
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
                    <Statistics orders={orders} visits={visits} />
                </div>
            </div>
        </div>
        <ContactBox />
      </div>
    );
}

function Statistics({ orders, visits }: { orders: Order[], visits: Visit[] }) {
    const [pengunjungDate, setPengunjungDate] = useState(new Date());
    const [pemesananDate, setPemesananDate] = useState(new Date());

    const visitToday = getVisitToday(visits, pengunjungDate);
    const visitYesterday = getVisitYesterday(visits, pengunjungDate);
    const visitImprovement = visitYesterday === 0 ? 0 : Math.round(((visitToday - visitYesterday) / visitYesterday) * 100);
    const visitStats = getVisitDaily(visits, pengunjungDate);

    const orderPastMonth = getOrderPastMonth(orders, pemesananDate);
    const orderPastTwoMonths = getOrderPastTwoMonths(orders, pemesananDate);
    const orderImprovement = orderPastTwoMonths === 0 ? 0 : Math.round(((orderPastMonth - orderPastTwoMonths) / orderPastTwoMonths) * 100);
    const orderStats = getOrderWeekly(orders, pemesananDate);

    const visitData = {
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
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
                label: 'Pemesanan Mingguan',
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
                beginAtZero: true,
                max: orderStats.reduce((a, b) => Math.max(a, b)) + 1
            }
        }
    };

    return (
        <div className="px-8 pt-6 pb-10 bg-white rounded-xl shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-pink-900 font-sofia">Welcome Admin LogEvent!</h1>
            <div className="grid grid-cols-1 gap-6 font-sofia">
                <div className="bg-gray-100 shadow-md rounded-lg p-4 relative">
                    <h2 className="text-xl font-bold text-black">Statistik Pengunjung</h2>
                    <div className="absolute top-4 right-4 flex space-x-2">
                        <DatePicker
                            selected={pengunjungDate}
                            onChange={(date) => setPengunjungDate(date ?? new Date())}
                            className="border p-1 rounded text-black"
                        />
                    </div>
                    <p className="text-gray-600">Pengunjung Hari Ini: {visitToday}</p>
                    <p className="text-gray-600">Perubahan {visitImprovement}% dari hari sebelumnya</p>
                    <div className="h-[18rem]">
                        <Line data={visitData} options={visitOptions} />
                    </div>
                </div>
                <div className="bg-gray-100 shadow-md rounded-lg p-4 relative text-black">
                    <h2 className="text-xl font-bold">Statistik Pemesanan</h2>
                    <div className="absolute top-4 right-4 flex space-x-2">
                        <DatePicker
                            selected={pemesananDate}
                            onChange={(date) => setPemesananDate(date ?? new Date())}
                            className="border p-1 rounded"
                        />
                    </div>
                    <p className="text-gray-600">Pemesanan Bulan Ini: {orderPastMonth}</p>
                    <p className="text-gray-600">Perubahan {orderImprovement}% dari 30 hari sebelumnya</p>
                    <div className="h-[18rem]">
                        <Line data={orderData} options={orderOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
}