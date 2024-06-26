"use client"; // Ensures client-side rendering

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';

export default function Home() {
  return (
    <div>
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-screen py-2 md:pt-20">
        <Introduction />
        <DescriptionSection />
        <ListPlace />
        <ContactBox />
        <footer className="w-full bg-gray-200 text-gray-700 py-4 text-center font-sofia">
          <p>&copy; 2024 Logevent. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}

function Navbar() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/login');
  };

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault(); // Prevent the default anchor behavior
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 60; // Adjust -100 based on the navbar height
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-400 shadow-md z-50">
      <div className="container mx-auto px-12 py-4 flex justify-between items-center">
        <Image src="/Image/logo.png" alt="Logevent Logo" width={45} height={45} />
        <ul className="flex space-x-8">
          <li>
            <Link href="#home" className="hover:underline font-sofia">Home</Link>
          </li>
          <li>
            <a href="#services" onClick={(e) => handleScrollToSection(e, "services")} className="hover:underline font-sofia">
              Produk & Layanan
            </a>
          </li>
          <li>
            <Link href="#contact" className="hover:underline font-sofia">QnA</Link>
          </li>
          <li>
            <button onClick={handleLoginClick} className='font-sofia mr-3'>Login</button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

function Introduction() {
  const images = [
    "/Image/landingpage1.jpg",
    "/Image/landingpage2.jpg",
    "/Image/landingpage3.jpg"
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const timeoutRef = useRef<null | NodeJS.Timeout>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setCurrentImageIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        ),
      5000
    );

    return () => {
      resetTimeout();
    };
  }, [currentImageIndex]);

  return (
    <section className="px-12 py-8 w-full">
      <div className="flex flex-col items-left">
        <h1 className="mt-1 mb-10 text-4xl text-pink-900 font-bold font-sofia">Welcome to Logevent</h1>
        
        <div className="relative w-full overflow-hidden rounded-3xl mb-12" style={{ maxWidth: '1600px', maxHeight: '350px' }}>
          <div
            className="flex transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(${-currentImageIndex * 1600}px)` }}
          >
            {images.map((image, index) => (
              <div key={index} className="flex-shrink-0 w-full relative" style={{ width: '1600px', height: '350px' }}>
                <Image
                  src={image}
                  alt={`Landing Page Image ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
                  className="rounded-3xl"
                />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-pink-900 opacity-50 rounded-3xl"></div>
          <div className="absolute inset-0 flex flex-col items-start justify-start text-white p-12">
            <h1 className="text-3xl md:text-6xl font-bold font-poppins">Wujudkan Event Impianmu</h1>
            <p className="mt-3 md:mt-6 text-base md:text-2xl font-sofia">Mencari vendor untuk eventmu dengan praktis</p>
            <div className="mt-20">
              <button className="px-6 py-3 bg-pink-600 text-white font-sofia font-bold rounded-lg hover:bg-pink-700">Pesan Event Organizer</button>
              <button className="px-6 py-3 ml-6 bg-white text-pink-600 font-sofia font-bold rounded-lg hover:bg-pink-300">Cari Logistik Vendor</button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <SearchBar />
      </div>
    </section>
  );
}

function SearchBar() {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Searching for:", query);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-md mb-10">
      <div className="flex w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for vendors, events, or services..."
          className="w-full p-4 h-14 border rounded-l-lg text-gray-700 font-sofia"
        />
        <button
          type="submit"
          className="flex items-center justify-center p-4 h-14 bg-pink-900 text-white rounded-r-lg hover:bg-pink-800"
        >
          <FaSearch className="text-xl" />
        </button>
      </div>
    </form>
  );
}

function DescriptionCard ({ image, title, description }: { image: string, title: string, description: string }) {
  return (
    <div className="flex flex-col md:flex-row items-center mb-8 md:mb-12 p-8 bg-white shadow-lg rounded-lg">
      {/* Increased image container size */}
      <div className="flex-shrink-0">
        <Image
          src={image}
          alt={title}
          width={80}
          height={80}
          className="object-cover rounded-lg"
        />
      </div>
      <div className="text-center md:text-left md:ml-10 mt-4 md:mt-0">
        <h2 className="text-2xl font-bold mb-2 font-sofia text-gray-700">{title}</h2>
        <p className="text-gray-600 font-sofia">{description}</p>
      </div>
    </div>
  );
}

function DescriptionSection() {
  // Dummy data for the section
  const descriptions = [
    {
      image: "/Image/building.png",
      title: "Sample Title 1",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      image: "/Image/building.png",
      title: "Sample Title 2",
      description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
      image: "/Image/building.png",
      title: "Sample Title 3",
      description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
    },
    {
      image: "/Image/building.png",
      title: "Sample Title 4",
      description: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
      image: "/Image/building.png",
      title: "Sample Title 5",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    }
  ];

  return (
    <section id="services" className="p-12"> {/* Added id="services" */}
      <h1 className="text-4xl text-pink-900 font-bold mb-10 font-sofia">Layanan Kami</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {descriptions.map((item, index) => (
          <DescriptionCard
            key={index}
            image={item.image}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </section>
  );
}

function ListPlace() {
  // Dummy data for a place
  const places = [
    {
      image: "/Image/planetarium.jpg",
      name: "Sunset Beach",
      type: "Beach",
      rate: "4.5",
      location: "California, USA"
    },
    {
      image: "/Image/planetarium.jpg",
      name: "Mountain View",
      type: "Mountain",
      rate: "4.7",
      location: "Alps, Switzerland"
    },
    {
      image: "/Image/planetarium.jpg",
      name: "City Park",
      type: "Park",
      rate: "4.3",
      location: "New York, USA"
    },
    {
      image: "/Image/planetarium.jpg",
      name: "Planetarium",
      type: "Museum",
      rate: "4.8",
      location: "Jakarta, Indonesia"
    },
    {
      image: "/Image/planetarium.jpg",
      name: "Sunset Beach",
      type: "Beach",
      rate: "4.5",
      location: "California, USA"
    },
    {
      image: "/Image/planetarium.jpg",
      name: "Mountain View",
      type: "Mountain",
      rate: "4.7",
      location: "Alps, Switzerland"
    },
    {
      image: "/Image/planetarium.jpg",
      name: "City Park",
      type: "Park",
      rate: "4.3",
      location: "New York, USA"
    },
    {
      image: "/Image/planetarium.jpg",
      name: "Planetarium",
      type: "Museum",
      rate: "4.8",
      location: "Jakarta, Indonesia"
    }
  ];

  return (
    <section className="p-12">
      <h1 className="text-4xl text-pink-900 font-bold mb-10 font-sofia">Rekomendasi Vendor</h1>
      <div className="flex flex-wrap gap-10">
        {places.map((place, index) => (
          <div key={index} className="w-80 bg-white shadow-lg rounded-3xl overflow-hidden">
            <Image
              src={place.image}
              alt={`${place.name} Image`}
              width={400}
              height={200}
              className="object-cover"
            />
            <div className="p-4 font-sofia">
              <h3 className="text-xl text-pink-900 font-bold">{place.name}</h3>
              <p className="text-gray-700">{place.type}</p>
              <p className="text-gray-500">Rating: {place.rate}</p>
              <p className="text-gray-500">{place.location}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ContactBox() {
  return (
    <footer className="w-full bg-pink-900 text-white py-8 mt-16">
      <div className="container mx-auto flex flex-col items-center">
        {/* Logo and Text */}
        <div className="text-center mb-6">
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold">logevent</div>
            <p className="mt-2 mb-4 font-sofia">Jangan khawatir pusing nyari vendor, Logevent solusinya</p>
          </div>
        </div>
        
        {/* Social Media Links */}
        <div className="flex space-x-6">
          <Link href="https://www.instagram.com" aria-label="Instagram" className="hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-8 w-8" viewBox="0 0 24 24">
              <path d="M12 2.2c3.2 0 3.6.012 4.847.07 1.211.057 1.995.243 2.452.51.52.297.896.68 1.192 1.192.268.457.453 1.241.51 2.452.058 1.247.07 1.647.07 4.847s-.012 3.6-.07 4.847c-.057 1.211-.243 1.995-.51 2.452-.297.52-.68.896-1.192 1.192-.457.268-1.241.453-2.452.51-1.247.058-1.647.07-4.847.07s-3.6-.012-4.847-.07c-1.211-.057-1.995-.243-2.452-.51-.52-.297-.896-.68-1.192-1.192-.268-.457-.453-1.241-.51-2.452-.058-1.247-.07-1.647-.07-4.847s.012-3.6.07-4.847c.057-1.211.243-1.995.51-2.452.297-.52.68-.896 1.192-1.192.457-.268 1.241-.453 2.452-.51 1.247-.058 1.647-.07 4.847-.07zm0-2.2c-3.274 0-3.685.015-4.973.072-1.331.059-2.24.273-3.034.63-.827.374-1.528.875-2.274 1.621-.746.746-1.247 1.447-1.621 2.274-.357.794-.571 1.703-.63 3.034-.057 1.288-.072 1.699-.072 4.973s.015 3.685.072 4.973c.059 1.331.273 2.24.63 3.034.374.827.875 1.528 1.621 2.274.746.746 1.447 1.247 2.274 1.621.794.357 1.703.571 3.034.63 1.288.057 1.699.072 4.973.072s3.685-.015 4.973-.072c1.331-.059 2.24-.273 3.034-.63.827-.374 1.528-.875 2.274-1.621.746-.746 1.247-1.447 1.621-2.274.357-.794.571-1.703.63-3.034.057-1.288.072-1.699.072-4.973s-.015-3.685-.072-4.973c-.059-1.331-.273-2.24-.63-3.034-.374-.827-.875-1.528-1.621-2.274-.746-.746-1.447-1.247-2.274-1.621-.794-.357-1.703-.571-3.034-.63-1.288-.057-1.699-.072-4.973-.072zm0 5.76a6.24 6.24 0 100 12.48 6.24 6.24 0 000-12.48zm0 10.34a4.1 4.1 0 110-8.2 4.1 4.1 0 010 8.2zm7.2-10.88a1.44 1.44 0 110-2.88 1.44 1.44 0 010 2.88z"/>
            </svg>
          </Link>
          <Link href="https://www.facebook.com" aria-label="Facebook" className="hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-8 w-8" viewBox="0 0 24 24">
              <path d="M22.675 0h-21.35c-.731 0-1.325.594-1.325 1.325v21.351c0 .731.594 1.325 1.325 1.325h11.495v-9.283h-3.12v-3.622h3.12v-2.671c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.463.099 2.796.143v3.24l-1.918.001c-1.505 0-1.797.715-1.797 1.764v2.311h3.587l-.467 3.622h-3.12v9.283h6.116c.731 0 1.325-.594 1.325-1.325v-21.351c0-.731-.594-1.325-1.325-1.325z"/>
            </svg>
          </Link>
          <Link href="mailto:support@Logevent.com" aria-label="Email" className="hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-8 w-8" viewBox="0 0 24 24">
              <path d="M22 4h-20c-1.104 0-2 .896-2 2v12c0 1.104.896 2 2 2h20c1.104 0 2-.896 2-2v-12c0-1.104-.896-2-2-2zm-1.4 2l-8.6 5.7-8.6-5.7h17.2zm-18.6 12v-10.6l7.6 5.04c.227.15.491.226.764.226.273 0 .537-.075.764-.226l7.608-5.04v10.6h-16.736z"/>
            </svg>
          </Link>
          <Link href="https://www.twitter.com" aria-label="Twitter" className="hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-8 w-8" viewBox="0 0 24 24">
              <path d="M24 4.557a9.9 9.9 0 01-2.828.775 4.927 4.927 0 002.165-2.724 9.865 9.865 0 01-3.127 1.195 4.916 4.916 0 00-8.389 4.482 13.953 13.953 0 01-10.141-5.144 4.92 4.92 0 001.523 6.574 4.89 4.89 0 01-2.228-.615c-.053 2.281 1.584 4.415 3.946 4.89a4.935 4.935 0 01-2.224.084c.627 1.955 2.445 3.376 4.604 3.416a9.874 9.874 0 01-6.102 2.102c-.397 0-.788-.023-1.175-.069a13.951 13.951 0 007.548 2.212c9.058 0 14.01-7.504 14.01-14.009 0-.214-.005-.428-.014-.641a10.014 10.014 0 002.457-2.548z"/>
            </svg>
          </Link>
        </div>
      </div>
    </footer>
  );
}