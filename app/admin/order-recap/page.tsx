// app/admin/order-recap/page.tsx
'use client';
import React from 'react';
import { ContactBox, Navbar } from '../../page';
import { CommandLeft } from '../commandLeft';

export default function AdminOrderRecap() {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await readAllOrder();
                setOrders(data);
            } catch (error: any) {
                console.error('Failed to fetch orders:', error.message);
            }
        };

        fetchOrders();
    }, []);

    return (
      <div>
        <div className="min-h-screen flex flex-col p-10 mt-16">
            <Navbar />
            <div className="flex flex-col md:flex-row flex-grow">
                <CommandLeft />
                <div className="flex-grow ml-0 md:ml-7 py-[0.15rem]">
                    <Table orders={orders} />
                </div>
            </div>
        </div>
        <ContactBox />
      </div>
    );
}

function Table({ orders }: { orders: Order[] }) {
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
                    {orders.map((order, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.userName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.userPhone}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.userEmail}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.address}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{convertDate(order.startDate)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{convertDate(order.endDate)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}