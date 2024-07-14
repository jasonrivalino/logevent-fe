'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '../page';
import { readUserProfile, updateUser } from '../utils/authApi';
import Image from 'next/image';

const ProfilePage = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const user = await readUserProfile(token);
          setImagePreview(user.picture);
          setUserName(user.name);
          setEmail(user.email);
          setPhone(user.phone);
        } catch (error: any) {
          console.error('Failed to fetch user data:', error.message);
          localStorage.removeItem('token');
        }
      }
    };

    fetchUserProfile();
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const updatedUserData = {
          name: userName || undefined,
          email: email || undefined,
          phone: phone || undefined,
          password: password || undefined,
          picture: imagePreview || undefined,
        };
        console.log(updatedUserData.picture);
        await updateUser(token, updatedUserData);
        alert('Profile updated successfully');
      } catch (error: any) {
        console.error('Failed to update user:', error.message);
        alert('Failed to update profile');
      }
    } else {
      alert('User is not authenticated');
    }
  };

  return (
    <div className="bg-gray-200 font-sofia">
      <Navbar />
      <main className="container mx-auto mt-16 flex flex-col items-center py-8">
        <h2 className="text-2xl md:text-3xl text-gray-700 font-bold mb-6 text-center">Profil Pengguna</h2>
        <div className="bg-white w-full max-w-72 md:max-w-3xl p-4 md:p-8 rounded-md shadow-md flex">
          <form onSubmit={handleSubmit} className="w-full flex flex-col md:flex-row">
            <div className="flex flex-col items-center w-full md:w-1/4 mr-8">
              <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">Foto Profil</h3>
              <div className=" w-16 md:w-32 h-20 md:h-40 bg-gray-300 overflow-hidden mb-4">
                {imagePreview ? (
                  <img src={imagePreview} alt="Selected" className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    Foto Profil
                  </div>
                )}
              </div>
              <label className="md:mt-4 inline-block cursor-pointer bg-pink-900 text-white mb-4 md:mb-0 py-1 md:py-2 px-4 rounded-md text-xs md:text-base">
                Pilih Foto
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            <div className="space-y-2 w-full md:w-2/3">
              <div>
                <label className="text-sm md:text-base block text-gray-700">Nama</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 px-2 md:py-[0.3rem] rounded-md placeholder:text-xs text-black text-sm md:text-base"
                  placeholder="Nama Lengkap"
                  value={userName || ''}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm md:text-base block text-gray-700">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 px-2 md:py-[0.3rem] rounded-md text-black placeholder:text-xs text-sm md:text-base"
                  placeholder="ex: LogEvent@gmail.com"
                  value={email || ''}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm md:text-base block text-gray-700">No. HP</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 px-2 md:py-[0.3rem] mb-2 md:mb-4 rounded-md placeholder:text-xs text-black text-sm md:text-base"
                  placeholder="ex: 089732579"
                  value={phone || ''}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <button className="bg-pink-600 text-white py-1 px-4 rounded-md text-xs md:text-base">Ubah Password</button>
              </div>
              <div className="flex justify-end">
                <button className="bg-pink-900 text-white py-1 md:py-2 px-4 rounded-md text-sm md:text-base">Simpan Perubahan</button>
              </div>
            </div>
          </form>
        </div>
      </main>
      <ContactBoxSignIn />
    </div>
  );
};

function ContactBoxSignIn() {
  return (
    <footer className="w-full bg-pink-900 text-white py-6 mt-5">
      <div className="container mx-auto flex flex-col items-center text-center">
        <Image src="/Image/logo.png" alt="Logevent Logo" width={60} height={60} className='cursor-pointer' />
        <p className="mt-6 md:mt-2 font-sofia">Jangan khawatir pusing nyari vendor, Logevent solusinya</p>
      </div>
    </footer>
  );
}

export default ProfilePage;