// app/admin/order-recap/page.tsx
'use client';

// dependency modules
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
// self-defined modules
import { ContactBox, Navbar } from '@/app/page';
import { CommandLeft } from '@/app/admin/commandLeft';
import { readAllAdmins, createAdmin, updateAdmin, deleteAdmin } from '@/app/utils/adminApi';
import { readSetting, updateSetting } from '@/app/utils/settingApi';
import { Admin, Setting } from '@/app/utils/types';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

export default function AdminOrderRecap() {
    const [setting, setSetting] = useState<Setting | null>(null);
    const [admins, setAdmins] = useState<Admin[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const setting = await readSetting();
                const admins = await readAllAdmins();
                setSetting(setting);
                setAdmins(admins);
            } catch (error: any) {
                console.error('Failed to fetch latest settings', (error as any).message);
            }
        };

        fetchData();
    }, []);

    const router = useRouter();
  
    const handlePrev = () => {
      router.push('/admin/manage-faq');
    };
  
    const handleNext = () => {
      router.push('/admin/statistics');
    };

    return (
        <div>
            <Navbar />
            <div className="min-h-screen flex flex-col px-6 mt-24">
                <div className="flex flex-col md:flex-row flex-grow">
                    <div className="md:hidden flex justify-center items-center">
                        <h1 className="text-4xl font-bold text-pink-900 font-sofia mt-4 mb-8">Settings</h1>
                    </div>
                    <div className="hidden md:block">
                        <CommandLeft />
                    </div>
                    <div className="flex-grow ml-0 md:ml-7 py-[0.15rem]">
                        {setting && <Settings setting={setting} admins={admins} />}
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
};

// Popup Component
const Popup = ({ isOpen, onClose, onSubmit, title, children }: { isOpen: boolean, onClose: () => void, onSubmit: () => void, title: string, children: React.ReactNode }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center text-black z-50">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-72 md:w-80">
          <h3 className="text-base md:text-lg font-bold mb-4">{title}</h3>
          {children}
          <div className="flex justify-end space-x-2 mt-4">
            <button onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded-md text-sm md:text-base">
              Cancel
            </button>
            <button onClick={onSubmit} className="bg-pink-900 text-white px-4 py-2 rounded-md text-sm md:text-base">
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  function Settings({ setting, admins }: { setting: Setting, admins: Admin[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEmailOpen, setIsEmailOpen] = useState(false);
    const [emailIds, setEmailIds] = useState<number[]>([]);
    const [emails, setEmails] = useState<string[]>([]);
    const [description, setDescription] = useState('');
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [vendorCount, setVendorCount] = useState('');
    const [productCount, setProductCount] = useState('');
    const [orderCount, setOrderCount] = useState('');
    const [popupState, setPopupState] = useState<{ isOpen: boolean, type: string, index: number | null, email: string }>({ isOpen: false, type: '', index: null, email: '' });
  
    useEffect(() => {
      setDescription(setting.description || '');
      setYoutubeUrl(setting.youtubeUrl || '');
      setVendorCount(setting.vendorCount.toString() || '');
      setProductCount(setting.productCount.toString() || '');
      setOrderCount(setting.orderCount.toString() || '');
      setEmailIds(admins.map((admin) => admin.id));
      setEmails(admins.map((admin) => admin.email));
    }, [admins, setting]);
  
    const isValidEmail = (email: string) => {
      // Regular expression for validating email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
  
    const showPopup = () => {
      setPopupState({ isOpen: true, type: 'add', index: null, email: '' });
    };
  
    const showEditPopup = (index: number) => {
      setPopupState({ isOpen: true, type: 'edit', index, email: emails[index] });
    };
  
    const showDeletePopup = (index: number) => {
      setPopupState({ isOpen: true, type: 'delete', index, email: emails[index] });
    };
  
    const handlePopupSubmit = async () => {
      if (popupState.type !== 'delete' && !isValidEmail(popupState.email)) {
        alert('Please enter a valid email address.');
        return;
      }
  
      if (popupState.type === 'add') {
        const adminData = {
          email: popupState.email,
        };

        try {
          const newAdmin = await createAdmin(adminData);
          setEmailIds([...emailIds, newAdmin.id]);
          setEmails([...emails, newAdmin.email]);
        } catch (error) {
          console.error('Failed to create admin', (error as any).message);
        }
      } else if (popupState.type === 'edit' && popupState.index !== null) {
        const adminData = {
          email: popupState.email,
        };

        try {
          const updatedAdmin = await updateAdmin(emailIds[popupState.index], adminData);
          setEmails(emails.map((email, index) => index === popupState.index ? updatedAdmin.email : email));
        } catch (error) {
          console.error('Failed to update admin', (error as any).message);
        }
      } else if (popupState.type === 'delete' && popupState.index !== null) {
        try {
          await deleteAdmin(emailIds[popupState.index]);
          setEmailIds(emailIds.filter((id, index) => index !== popupState.index));
          setEmails(emails.filter((email, index) => index !== popupState.index));
        } catch (error) {
          console.error('Failed to delete admin', (error as any).message);
        }
      }
  
      setPopupState({ isOpen: false, type: '', index: null, email: '' });
    };
  
    const handleSubmit = async () => {
      if (!description || !youtubeUrl || !vendorCount || !productCount || !orderCount) {
        alert('All fields must be filled out');
        return;
      }
  
      const settingData = {
        description,
        youtubeUrl,
        vendorCount: parseInt(vendorCount),
        productCount: parseInt(productCount),
        orderCount: parseInt(orderCount),
      };
  
      try {
        const newSetting = await updateSetting(settingData);
        setDescription(newSetting.description);
        setYoutubeUrl(newSetting.youtubeUrl);
        setVendorCount(newSetting.vendorCount.toString());
        setProductCount(newSetting.productCount.toString());
        setOrderCount(newSetting.orderCount.toString());
      } catch (error) {
        console.error('Failed to update setting', (error as any).message);
      }
    };
  
    return (
      <div className="bg-white border-2 rounded-xl w-full mb-4 md:mb-0 px-6 md:px-8 py-6 overflow-x-auto font-sofia">
        {/* Main Content */}
        <div className="flex justify-center md:justify-start">
          <h1 className="text-lg md:text-3xl font-bold mb-4 md:mb-6 text-pink-900 font-sofia">Welcome Admin LogEvent!</h1>
        </div>
  
        {/* About Us Settings Collapsible */}
        <div
          className="flex justify-between items-center cursor-pointer p-2 md:p-4 bg-white rounded-lg border-2 border-gray-200 shadow-md"
          onClick={() => setIsOpen(!isOpen)}
        >
          <h2 className="text-lg md:text-2xl font-bold text-gray-700">About Us Settings</h2>
          <button className="text-pink-900">{isOpen ? '▲' : '▼'}</button>
        </div>
  
        {/* Collapsible Content */}
        {isOpen && (
        <div className="border border-gray-300 p-4 md:p-6 rounded-md mt-4">
            <div className="space-y-2 md:space-y-4 text-black">
            <div>
                <label htmlFor="deskripsi" className="block font-medium text-gray-700 text-sm md:text-base">
                Deskripsi
                </label>
                <textarea
                id="deskripsi"
                name="deskripsi"
                rows={4}
                className="mt-1 p-2 md:p-3 block w-full rounded-md text-xs md:text-base border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm bg-gray-100"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div>
                <label htmlFor="linkYouTube" className="block font-medium text-gray-700 text-sm md:text-base">
                Link YouTube
                </label>
                <input
                type="text"
                name="linkYouTube"
                id="linkYouTube"
                className="mt-1 mb-4 md:mb-0 p-2 md:p-3 block w-full rounded-md text-xs md:text-base border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm bg-gray-100"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                />
            </div>

            <div className="flex flex-col md:flex-row justify-between md:space-x-4">
                <div className="md:text-center flex flex-row md:flex-col mb-4 md:mb-0">
                <label htmlFor="vendorMitra" className="block font-medium mt-2 md:mt-0 text-gray-700 text-sm md:text-base">
                    Vendor Mitra
                </label>
                <input
                    type="number"
                    id="vendorMitra"
                    name="vendorMitra"
                    className="p-2 block w-1/4 md:w-full ml-auto rounded-md text-xs md:text-base border-gray-300 shadow-sm bg-gray-100 focus:border-pink-500 focus:ring-pink-500 sm:text-xl text-center no-spinners"
                    value={vendorCount}
                    onChange={(e) => setVendorCount(e.target.value)}
                />
                </div>
                <div className="md:text-center flex flex-row md:flex-col mb-4 md:mb-0">
                <label htmlFor="logistikVendor" className="block font-medium mt-2 md:mt-0 text-gray-700 text-sm md:text-base">
                    Logistik Vendor
                </label>
                <input
                    type="number"
                    id="logistikVendor"
                    name="logistikVendor"
                    className="mt-1 p-2 block w-1/4 md:w-full ml-auto rounded-md text-xs md:text-base border-gray-300 shadow-sm bg-gray-100 focus:border-pink-500 focus:ring-pink-500 sm:text-xl text-center no-spinners"
                    value={productCount}
                    onChange={(e) => setProductCount(e.target.value)}
                />
                </div>
                <div className="md:text-center flex flex-row md:flex-col">
                <label htmlFor="eventSukses" className="block font-medium mt-2 md:mt-0 text-gray-700 text-sm md:text-base">
                    Event Sukses Terlaksana
                </label>
                <input
                    type="number"
                    id="eventSukses"
                    name="eventSukses"
                    className="mt-1 p-2 block w-1/4 md:w-full ml-auto rounded-md text-xs md:text-base border-gray-300 shadow-sm bg-gray-100 focus:border-pink-500 focus:ring-pink-500 sm:text-xl text-center no-spinners"
                    value={orderCount}
                    onChange={(e) => setOrderCount(e.target.value)}
                />
                </div>
            </div>

            <div className="flex justify-end">
                <button
                type="button"
                onClick={handleSubmit}
                className="px-4 md:px-6 py-1 md:py-2 bg-pink-900 text-white rounded-lg shadow hover:bg-pink-800 focus:outline-none mt-5"
                >
                Save
                </button>
            </div>
            </div>
        </div>
        )}
  
        {/* Email Admin Collapsible */}
        <div
          className="flex justify-between items-center cursor-pointer p-2 md:p-4 bg-white rounded-lg border-2 border-gray-200 shadow-md mt-3 md:mt-6"
          onClick={() => setIsEmailOpen(!isEmailOpen)}
        >
          <h2 className="text-lg md:text-2xl font-bold text-gray-700">Email Admin</h2>
          <button className="text-pink-900">{isEmailOpen ? '▲' : '▼'}</button>
        </div>
  
        {isEmailOpen && (
          <div className="space-y-2 md:space-y-4 text-black mt-4 border border-gray-300 p-2 md:p-6 rounded-md">
            {emails.map((email, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg border border-gray-300 text-xs md:text-base">
                <span>{email}</span>
                <div className="flex space-x-2">
                  <button onClick={() => showEditPopup(index)} className="text-pink-900">
                    <FaEdit />
                  </button>
                  <button onClick={() => showDeletePopup(index)} className="text-red-600">
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={showPopup}
                className="px-2 md:px-4 py-1 md:py-2 text-xs md:text-base bg-pink-900 text-white rounded-lg shadow hover:bg-pink-800 focus:outline-none mt-2 ml-auto"
              >
                + Tambah Email
              </button>
            </div>
          </div>
        )}
  
        {/* Popup for Add, Edit, and Delete */}
        <Popup
          isOpen={popupState.isOpen}
          onClose={() => setPopupState({ isOpen: false, type: '', index: null, email: '' })}
          onSubmit={handlePopupSubmit}
          title={popupState.type === 'add' ? 'Add Email' : popupState.type === 'edit' ? 'Edit Email' : 'Delete Email'}
        >
          {popupState.type !== 'delete' && (
            <input
              type="email"
              className="border p-2 w-full text-sm md:text-base rounded-md"
              value={popupState.email}
              onChange={(e) => setPopupState({ ...popupState, email: e.target.value })}
              placeholder="Enter email"
            />
          )}
          {popupState.type === 'delete' && (
            <p>Are you sure you want to delete this email: {popupState.email}?</p>
          )}
        </Popup>
      </div>
    );
  }