'use client';

import { useState } from 'react';
import { Navbar } from '../page';

const ProfilePage = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (event : React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setSelectedImage(file);
  
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200">
    <Navbar />
      <main className="container mx-auto p-4 mt-16">
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-xl font-bold mb-4">Profile Pengguna</h2>
          <form>
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
                  <input type="text" className="w-full border border-gray-300 p-2 rounded-md" placeholder="Nama Lengkap" />
                </div>
                <div>
                  <label className="block text-gray-700">Username</label>
                  <input type="text" className="w-full border border-gray-300 p-2 rounded-md" placeholder="Username" />
                </div>
                <div>
                  <label className="block text-gray-700">Email</label>
                  <input type="email" className="w-full border border-gray-300 p-2 rounded-md" placeholder="ex: LogEvent@gmail.com" />
                </div>
                <div>
                  <label className="block text-gray-700">No. HP</label>
                  <input type="text" className="w-full border border-gray-300 p-2 rounded-md" placeholder="ex: 089732579" />
                </div>
                <div>
                  <label className="block text-gray-700">Password</label>
                  <input type="password" className="w-full border border-gray-300 p-2 rounded-md" placeholder="Isi untuk mengganti password" />
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