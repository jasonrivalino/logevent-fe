'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '../page';
import { readUserProfile, updateUser } from '../utils/authApi';

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


  const handleImageUpload = (event : React.ChangeEvent<HTMLInputElement>) => {
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
    <div className="min-h-screen bg-gray-200">
    <Navbar />
      <main className="container mx-auto p-4 mt-16">
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-xl text-gray-500 font-bold mb-4">Profile Pengguna</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col items-center md:items-start">
                <div className="w-32 h-32 bg-gray-300 rounded-full overflow-hidden">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Selected" className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      Foto Profil
                    </div>
                  )}
                </div>
                <label className="mt-4 inline-block cursor-pointer bg-pink-900 text-white py-2 px-4 rounded-md">
                  Pilih Foto
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700">Nama</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 p-2 rounded-md text-black"
                    placeholder="Nama Lengkap"
                    value={userName || ''}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Email</label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 p-2 rounded-md text-black"
                    placeholder="ex: LogEvent@gmail.com"
                    value={email || ''}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">No. HP</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 p-2 rounded-md text-black"
                    placeholder="ex: 089732579"
                    value={phone || ''}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Password</label>
                  <input
                    type="password"
                    className="w-full border border-gray-300 p-2 rounded-md text-black"
                    placeholder="Isi untuk mengganti password"
                    value={password || ''}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                    <button className="bg-pink-900 text-white py-2 px-4 rounded-md">Simpan Perubahan</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;