// app/admin/commandLeft.tsx

// dependency modules
import Cookies from 'js-cookie';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaChartBar, FaClipboardList, FaUserPlus, FaCalendarAlt } from 'react-icons/fa';
// self-defined modules
import { readUserProfile } from '@/app/utils/authApi';

export function CommandLeft() {
    const router = useRouter();
    const pathname = usePathname();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);

    useEffect(() => {
      const fetchUserProfile = async () => {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const user = await readUserProfile(token);
            setImagePreview(user.picture);
            setName(user.name);
          } catch (error: any) {
            console.error('Failed to fetch user data:', error.message);
            localStorage.removeItem('token');
            Cookies.remove('token');
          }
        }
      };
  
      fetchUserProfile();
    }, []);
  
    return (
        <div className="bg-white border-2 rounded-xl w-full md:w-80 max-h-[27rem] mb-4 md:mb-0 mt-[0.1rem]">
            <div className="flex items-center border-b mb-4 p-6">
                <img src={imagePreview || "https://via.placeholder.com/50"} alt="Admin" className="w-12 h-12 rounded-full mr-4 border-xl bg-gray-400" />
                <div>
                    <h1 className="text-xl font-bold font-sofia text-black">{name || 'Admin'}</h1>
                </div>
            </div>
            <div className="p-6 text-black font-sofia">
                <div className="mb-4">
                    <button 
                        className={`flex items-center mb-4 text-lg p-3 w-full rounded-lg ${pathname === '/admin/statistics' ? 'border-pink-400 border-2 shadow-lg' : 'bg-white'}`}
                        onClick={() => router.push('/admin/statistics')}
                    >
                        <FaChartBar className="mr-5 text-pink-900" /> Statistik
                    </button>
                    <button 
                        className={`flex items-center mb-4 text-lg p-3 w-full rounded-lg ${pathname === '/admin/order-recap' ? 'border-pink-400 border-2 shadow-lg' : 'bg-white'}`}
                        onClick={() => router.push('/admin/order-recap')}
                    >
                        <FaClipboardList className="mr-5 text-pink-900" /> Rekap Pesanan
                    </button>
                    <button 
                        className={`flex items-center mb-4 text-lg p-3 w-full rounded-lg ${pathname === '/admin/manage-vendor' || pathname === '/admin/manage-vendor/add' || pathname === '/admin/manage-vendor/edit' ? 'border-pink-400 border-2 shadow-lg' : 'bg-white'}`}
                        onClick={() => router.push('/admin/manage-vendor')}
                    >
                        <FaUserPlus className="mr-5 text-pink-900" /> Kelola Vendor
                    </button>
                    <button 
                        className={`flex items-center text-lg p-3 w-full rounded-lg ${pathname === '/admin/manage-event-package' ? 'border-pink-400 border-2 shadow-lg' : 'bg-white'}`}
                        onClick={() => router.push('/admin/manage-event-package')}
                    >
                        <FaCalendarAlt className="mr-5 text-pink-900" /> Kelola Paket Event
                    </button>
                </div>
            </div>
        </div>
    );
  }