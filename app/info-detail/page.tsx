import Head from 'next/head';
import Image from 'next/image';
import { Navbar } from '../page';

export default function Product() {
  return (
    <div className="bg-gray-200">
      <main className="max-w-7xl mx-auto p-4 mt-16">
        <div className="p-6 mb-6">
          <Navbar />
          <ImageGallery />
          <h1 className="text-3xl font-bold text-pink-600 mt-5">Gedung Sabuga ITB</h1>
          <p className="text-gray-600">Multifunctional Hall</p>
          <p className="text-gray-600">Dago, Bandung | [190 reviews]</p>
          <div className="flex space-x-4 mt-4">
            <button className="bg-pink-600 text-white p-2 rounded">Chat vendor</button>
            <button className="p-2 border bg-pink-600 border-gray-300 rounded">Share</button>
            <button className="p-2 border bg-pink-600 border-gray-300 rounded">Save</button>
          </div>
        </div>
        <nav className="flex space-x-4 mb-6">
          <a href="#home" className="text-pink-600">Home</a>
          <a href="#album" className="text-gray-600">Album</a>
          <a href="#pricelist" className="text-gray-600">Pricelist</a>
          <a href="#reviews" className="text-gray-600">Reviews</a>
        </nav>
        <Section id="home" title="Home">
          <p className="text-gray-600">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quod, voluptatem, quas, quae quia doloremque quos quidem tempora quibusdam voluptatum nemo. Quisquam quod, voluptatem, quas, quae quia doloremque quos quidem tempora quibusdam voluptatum nemo. Quisquam quod, voluptatem, quas, quae quia doloremque quos quidem tempora quibusdam voluptatum nemo. Quisquam quod, voluptatem, quas, quae quia doloremque quos quidem tempora quibusdam voluptatum nemo.</p>   
        </Section>
        <Section id="album" title="Album" bgWhite>
          <ImageGallery />
        </Section>
        <Section id="pricelist" title="Pricelist" bgWhite>
          <Pricelist />
        </Section>
        <Section id="reviews" title="Reviews" bgWhite>
          <Reviews />
        </Section>
      </main>
    </div>
  );
}

function ImageGallery() {
  const images = [
    '/Image/planetarium.jpg',
    '/Image/planetarium.jpg',
    '/Image/planetarium.jpg',
    '/Image/planetarium.jpg'
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
      {images.map((src, index) => (
        <Image key={index} src={src} alt={`Image ${index + 1}`} width={500} height={300} className="w-full h-auto" />
      ))}
    </div>
  );
}

function Section({ id, title, children, bgWhite }: { id: string, title: string, children: React.ReactNode, bgWhite?: boolean }) {
  const sectionClasses = `mt-8 p-6 rounded ${bgWhite ? 'bg-white' : ''}`;

  return (
    <section id={id} className={sectionClasses}>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Pricelist() {
  const pricelist = [
    { title: 'Main Hall', capacity: 1000, price: 'Rp 5.000.000 / hari' },
    { title: 'Main Hall', capacity: 1000, price: 'Rp 5.000.000 / hari' },
    { title: 'Main Hall', capacity: 1000, price: 'Rp 5.000.000 / hari' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {pricelist.map((item, index) => (
        <div key={index} className="bg-white p-4 shadow rounded">
          <h3 className="text-xl font-bold">{item.title}</h3>
          <p>Capacity: {item.capacity} People</p>
          <p>{item.price}</p>
        </div>
      ))}
    </div>
  );
}

function Reviews() {
  const reviews = [
    { user: 'User1', category: 'Venue & Decoration', date: '3 March 2024', content: 'Lorem ipsum dolor sit amet...' },
    { user: 'User1', category: 'Venue & Decoration', date: '3 March 2024', content: 'Lorem ipsum dolor sit amet...' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {reviews.map((review, index) => (
        <div key={index} className="bg-white p-4 shadow rounded">
          <h3 className="text-xl font-bold">{review.user}</h3>
          <p className="text-gray-600">{review.category}</p>
          <p className="text-gray-600">{review.date}</p>
          <p className="text-gray-600">{review.content}</p>
        </div>
      ))}
    </div>
  );
}