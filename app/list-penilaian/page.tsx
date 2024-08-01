import React from 'react';
import { Navbar } from '../page';

const reviews = [
  {
    user: "User2",
    category: "Kualitas Barang",
    rating: 5,
    date: "3 Maret 2024",
    comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse dictum maximus sapien, in vestibulum dui. Phasellus viverra lectus nibh, at maximus diam laoreet vitae. Vestibulum feugiat ultrices euismod. Proin mollis ligula id hendrerit rutrum."
  },
  {
    user: "User1",
    category: "Pelayanan Admin/Vendor",
    rating: 4,
    date: "3 Maret 2024",
    comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse dictum maximus sapien, in vestibulum dui. Phasellus viverra lectus nibh, at maximus diam laoreet vitae. Vestibulum feugiat ultrices euismod. Proin mollis ligula id hendrerit rutrum."
  },
  {
    user: "User1",
    category: "Harga Barang",
    rating: 5,
    date: "3 Maret 2024",
    comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse dictum maximus sapien, in vestibulum dui. Phasellus viverra lectus nibh, at maximus diam laoreet vitae. Vestibulum feugiat ultrices euismod. Proin mollis ligula id hendrerit rutrum."
  },
  {
    user: "User1",
    category: "Sesuai Deskripsi",
    rating: 4,
    date: "3 Maret 2024",
    comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse dictum maximus sapien, in vestibulum dui. Phasellus viverra lectus nibh, at maximus diam laoreet vitae. Vestibulum feugiat ultrices euismod. Proin mollis ligula id hendrerit rutrum."
  }
];

export default function ReviewPage() {
  return (
    <div className="max-w-8xl mx-auto p-16">
      <Navbar />
      <div className='text-black font-sofia bg-white rounded-lg mt-14 p-8'>
        <h1 className="text-3xl font-bold text-pink-900">Penilaian & Ulasan</h1>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Gedung Sabuga ITB</h2>
          <p>Vendor A</p>
          <p>Dago, Bandung</p>
          <div className="flex mt-2">
            <div className="flex items-center">
              <span className="text-4xl font-bold">4.5</span>
              <span className="text-xl">/5.0</span>
            </div>
            <span className="ml-2">13 rating diberikan</span>
          </div>
        </div>
        {reviews.map((review, index) => (
          <div key={index} className="flex items-start mb-6 max-w-8xl">
            <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
            <div className="flex-1">
              <h3 className="font-bold">{review.user}</h3>
              <p className="text-sm text-gray-600">{review.category}</p>
              <div className="flex items-center mb-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 fill-current ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-6.16 3.25 1.18-6.89-5-4.87 6.9-1 3.08-6.24 3.08 6.24 6.9 1-5 4.87 1.18 6.89z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-600">{review.date}</p>
              <p className="text-sm mt-2">{review.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};