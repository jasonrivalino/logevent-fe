"use client"; // Ensures client-side rendering

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Home component (unchanged)

export default function Home() {
  return (
    <div>
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-screen py-2 md:pt-20"> {/* Added md:pt-20 for padding top */}
        <Introduction />
        <ListPlace />
        <ContactBox />
      </main>
    </div>
  );
}

// Navbar component (unchanged)

function Navbar() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/login');
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-400 shadow-md z-50"> {/* Added z-50 for z-index */}
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">eventee</Link>
        <ul className="flex space-x-4">
          <li><Link href="#home" className="hover:underline">Home</Link></li>
          <li><Link href="#about" className="hover:underline">About</Link></li>
          <li><Link href="#services" className="hover:underline">Services</Link></li>
          <li><Link href="#contact" className="hover:underline">Contact</Link></li>
          <li><button onClick={handleLoginClick}>Login</button></li>
        </ul>
      </div>
    </nav>
  );
}

// Introduction component with adjustments for image positioning

function Introduction() {
  return (
    <section className="text-center p-6 mt-16 md:mt-0"> {/* Added mt-16 md:mt-0 for margin-top */}
      <h1 className="mt-10 mb-10 text-4xl text-gray-700 font-bold">Welcome to Eventee</h1>
      
      {/* Image Wrapper */}
      <div className="relative w-full max-w-4xl mb-10">
        {/* Image Component */}
        <Image
          src="/Image/landingPage.png"
          alt="Landing Page Image"
          width={1000}
          height={300}
          className="rounded-lg"
        />

        {/* Purple Overlay */}
        <div className="absolute inset-0 bg-pink-900 opacity-50 rounded-lg"></div>

        {/* Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
          <h2 className="text-3xl font-bold">Wujudkan Event Impianmu</h2>
          <p className="mt-2 text-lg">Mencari vendor untuk eventmu dengan praktis</p>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar />
    </section>
  );
}

function SearchBar() {
  const [query, setQuery] = useState("");

  const handleSearch = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle the search functionality here, for now just log the query
    console.log("Searching for:", query);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-4xl mb-10">
      <div className="flex w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for vendors, events, or services..."
          className="w-full p-3 border rounded-l-lg text-gray-700"
        />
        <button
          type="submit"
          className="p-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
        >
          Search
        </button>
      </div>
    </form>
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
    <section className="p-6 mt-8">
      <h2 className="text-3xl text-gray-700 font-bold mb-6 text-center">Discover Amazing Places</h2>
      <div className="flex flex-wrap justify-center gap-6">
        {places.map((place, index) => (
          <div key={index} className="w-80 bg-white shadow-lg rounded-lg overflow-hidden">
            <Image
              src={place.image}
              alt={`${place.name} Image`}
              width={320}
              height={200}
              className="object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl text-gray-950 font-bold">{place.name}</h3>
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
            <div className="text-4xl font-bold">eventee</div>
            <p className="mt-2">Jangan khawatir pusing nyari vendor, eventee solusinya</p>
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
          <Link href="mailto:support@eventee.com" aria-label="Email" className="hover:text-gray-300">
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