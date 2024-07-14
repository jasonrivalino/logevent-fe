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
      <main className="flex flex-col items-center justify-center min-h-screen">
        <Introduction />
        <AboutUsSection />
        <LayananSection />
        <KeunggulanSection />
        <ListPlace />
        <ContactBox />
        <footer className="w-full bg-gray-200 text-gray-700 py-5 text-center font-sofia">
          <p>&copy; 2024 Logevent. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}

export function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLoginClick = () => {
    router.push('/signin');
  };

  const handleScrollToSection1 = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  const handleScrollToSection2 = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-pink-900 shadow-md z-50">
      <div className="container mx-auto px-12 py-4 flex justify-between items-center">
        <Image src="/Image/logo.png" alt="Logevent Logo" width={40} height={30} className='-ml-6 md:-ml-0 cursor-pointer' onClick={() => router.push('/')} />
        <div className="hidden md:flex justify-center space-x-8">
          <ul className="flex justify-center space-x-8">
            <li>
              <a href="#aboutUs" onClick={(e) => handleScrollToSection1(e, 'aboutUs')} className="hover:underline font-sofia">
                About Us
              </a>
            </li>
            <li>
              <a href="#services" onClick={(e) => handleScrollToSection2(e, 'services')} className="hover:underline font-sofia">
                Produk & Layanan
              </a>
            </li>
            <li>
              <Link href="#contact" className="hover:underline font-sofia">
                QnA
              </Link>
            </li>
            <li>
              <button onClick={handleLoginClick} className='font-sofia'>
                Login
              </button>
            </li>
          </ul>
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white -mr-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 20 20" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-pink-900">
          <ul className="flex flex-col items-center space-y-4 py-4">
            <li>
              <a href="#aboutUs" onClick={(e) => {handleScrollToSection1(e, 'aboutUs'); setIsMenuOpen(false);}} className="hover:underline font-sofia">
                About Us
              </a>
            </li>
            <li>
              <a href="#services" onClick={(e) => {handleScrollToSection2(e, 'services'); setIsMenuOpen(false);}} className="hover:underline font-sofia">
                Produk & Layanan
              </a>
            </li>
            <li>
              <Link href="#contact" className="hover:underline font-sofia" onClick={() => setIsMenuOpen(false)}>
                QnA
              </Link>
            </li>
            <li>
              <button onClick={() => {handleLoginClick(); setIsMenuOpen(false);}} className='font-sofia'>
                Login
              </button>
            </li>
          </ul>
        </div>
      )}
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
    <section className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 flex transition-transform duration-1000 ease-in-out" style={{ transform: `translateX(${-currentImageIndex * 100}%)` }}>
        {images.map((image, index) => (
          <div key={index} className="w-full flex-shrink-0 relative">
            <Image
              src={image}
              alt={`Landing Page Image ${index + 1}`}
              fill={true}
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-pink-900 opacity-50"></div>

      {/* Add image and text content */}
      <div className="absolute inset-0 flex flex-col text-white p-10 md:p-20 mt-[6.5rem]">

        {/* Titles and descriptions */}
        <h1 className="text-5xl md:text-5xl font-bold font-poppins flex items-center">
          Wujudkan Event Impianmu
        </h1>
        <h1 className="text-3xl md:text-5xl mt-4 font-bold font-poppins flex items-center">
          dengan&nbsp;
          <span className="text-pink-600">Logevent</span>
        </h1>
        <p className="mt-10 md:mt-14 text-base md:text-2xl font-sofia">Mencari vendor untuk eventmu dengan praktis</p>

        {/* Circles with Information */}
        <div className="flex space-x-6 mt-12">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-2 md:h-4 bg-white rounded-full"></div>
            <span className="text-base md:text-xl font-sofia text-pink-300">Logistik Vendor</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-2 md:h-4 bg-white rounded-full"></div>
            <span className="text-base md:text-xl font-sofia text-pink-300">Event Organizer</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-2 md:h-4 bg-white rounded-full"></div>
            <span className="text-base md:text-xl font-sofia text-pink-300">Paket Event</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-16">
          <button className="px-6 py-3 bg-pink-600 text-white font-sofia font-bold rounded-lg hover:bg-pink-700">Pesan Event Organizer</button>
          <button className="px-6 py-3 mt-5 md:mt-0 md:ml-6  bg-white text-pink-600 border-2 border-pink-600 font-sofia font-bold rounded-lg hover:bg-pink-100 hover:text-pink-600 hover:border-pink-600">Cari Logistik Vendor</button>
        </div>
      </div>
    </section>
  );
}

function AboutUsSection() {
  return (
    <section id="aboutUs">
      <div className="flex flex-col md:flex-row items-center bg-gray-100 p-8 md:p-16 mt-28 md:mt-[4.5rem] rounded-lg">
        <div className="w-full md:w-1/2">
          <iframe 
            className="w-full h-48 md:h-96 rounded-lg" 
            src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>
        <div className="w-full md:w-1/2 mt-6 md:mt-0 md:pl-16">
          <h2 className="text-2xl md:text-4xl font-bold text-pink-500 font-poppins">Tentang Kami</h2>
          <h3 className="text-4xl md:text-5xl font-semibold font-poppins text-pink-900 mt-2 md:mt-4">Welcome To Logevent</h3>
          <p className="mt-4 md:mt-8 font-sofia text-black text-sm md:text-base">
            Kami menghadirkan pengalaman terbaik untuk penyewaan vendor untuk event secara praktis. Dengan pilihan vendor yang handal dan produk yang berkualitas tinggi, kami memastikan bahwa setiap proyek bangunan Anda berjalan lancar dan sesuai harapan.
          </p>
          <div className="w-full md:w-3/5 mt-4 md:mt-8">
            <div className="flex justify-between">
              <div className="text-left">
                <h4 className="text-3xl font-bold text-pink-900 font-poppins">30 +</h4>
                <p className="text-sm text-black font-poppins">Vendor Mitra</p>
              </div>
              <div className="text-left">
                <h4 className="text-3xl font-bold text-pink-900 font-poppins">30 +</h4>
                <p className="text-sm text-black font-poppins">Vendor Mitra</p>
              </div>
              <div className="text-left">
                <h4 className="text-3xl font-bold text-pink-900 font-poppins">30 +</h4>
                <p className="text-sm text-black font-poppins">Vendor Mitra</p>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <button className="px-6 py-2 md:py-[0.88rem] bg-pink-600 text-white font-sofia font-bold rounded-lg hover:bg-pink-700">Pesan Event Organizer</button>
            <button className="px-6 py-2 md:py-3 mt-3 md:mt-0 md:ml-6 bg-white text-pink-600 border-2 border-pink-600 font-sofia font-bold rounded-lg hover:bg-pink-100 hover:text-pink-600 hover:border-pink-600">Cari Logistik Vendor</button>          
          </div>
        </div>
      </div>
  </section>
  );
}

function LayananCard({ image, title, description, link }: { image: string, title: string, description: string, link: string }) {
  const router = useRouter();

  return (
    <div className="relative flex-col items-center mb-4 md:mb-8 md:p-4 rounded-lg">
      {/* Pink Circle */}
      <div className="absolute top-0 left-1 w-10 h-10 bg-pink-200 rounded-full z-0"></div>
      
      {/* Image with top-left alignment */}
      <div className="relative z-10 ml-4 mt-4 mb-4 md:ml-0 md:mt-0">
        <Image
          src={image}
          alt={title}
          width={60}
          height={60}
          className="object-cover rounded-lg"
        />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-2 font-sofia text-gray-700">{title}</h2>
        <p className="text-gray-600 font-sofia mb-4">{description}</p>
        {/* "Detail Layanan" Button */}
        <button
          className="text-pink-500 hover:text-pink-700 font-bold"
          onClick={() => router.push(link)}
        >
          Detail Layanan
        </button>
      </div>
    </div>
  );
}

function LayananSection() {
  const descriptions = [
    {
      image: "/Image/building.png", // You should replace this with the actual path to your image
      title: "Logistik Vendor",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse dictum maximus sapien, in vestibulum dui. Phasellus viverra lectus nibh, at maximus diam laoreet vitae.",
      link: "/logistik-vendor"
    },
    {
      image: "/Image/building.png",
      title: "Event Organizer",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse dictum maximus sapien, in vestibulum dui. Phasellus viverra lectus nibh, at maximus diam laoreet vitae.",
      link: "/event-organizer"
    },
    {
      image: "/Image/building.png",
      title: "Paket Event",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse dictum maximus sapien, in vestibulum dui. Phasellus viverra lectus nibh, at maximus diam laoreet vitae.",
      link: "/paket-event"
    },
  ];

  return (
    <section id="services" className="p-8 md:p-16 mt-16 md:mt-0">
      <h1 className="text-4xl text-pink-900 font-bold mt-10 mb-7 md:mb-10 font-sofia">Layanan Kami</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
        {descriptions.map((item, index) => (
          <LayananCard
            key={index}
            image={item.image}
            title={item.title}
            description={item.description}
            link={item.link}
          />
        ))}
      </div>
    </section>
  );
}

function KeunggulanCard ({ image, title, description }: { image: string, title: string, description: string }) {
  return (
    <div className="flex flex-col md:flex-row items-center mb-2 md:mb-3 p-6 md:p-8 bg-white shadow-lg rounded-lg">
      {/* Increased image container size */}
      <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16">
        <Image
          src={image}
          alt={title}
          width={80}
          height={80}
          className="object-cover rounded-lg"
        />
      </div>
      <div className="text-center md:text-left md:ml-10 mt-4 md:mt-0">
        <h2 className="text-2xl font-bold mb-4 md:mb-2 font-sofia text-gray-700">{title}</h2>
        <p className="text-gray-600 font-sofia text-xs md:text-base">{description}</p>
      </div>
    </div>
  );
}

function KeunggulanSection() {
  // Dummy data for the section
  const descriptions = [
    {
      image: "/Image/building.png",
      title: "Sample Title 1",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
      image: "/Image/building.png",
      title: "Sample Title 2",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
      image: "/Image/building.png",
      title: "Sample Title 3",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
      image: "/Image/building.png",
      title: "Sample Title 4",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
  ];

  return (
    <section id="keunggulan" className="p-8 md:p-16">
      <h1 className="text-4xl text-pink-900 font-bold mt-20 md:mt-5 mb-8 md:mb-10 font-sofia">Mengapa memilih Logevent?</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-12">
        {descriptions.map((item, index) => (
          <KeunggulanCard
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
  const router = useRouter();

  const places = [
    { image: "/Image/planetarium.jpg", name: "Sunset Beach", type: "Beach", rate: "4.5", location: "California, USA" },
    { image: "/Image/planetarium.jpg", name: "Mountain View", type: "Mountain", rate: "4.7", location: "Alps, Switzerland" },
    { image: "/Image/planetarium.jpg", name: "City Park", type: "Park", rate: "4.3", location: "New York, USA" },
    { image: "/Image/planetarium.jpg", name: "Planetarium", type: "Museum", rate: "4.8", location: "Jakarta, Indonesia" },
    { image: "/Image/planetarium.jpg", name: "Grand Canyon", type: "Canyon", rate: "4.9", location: "Arizona, USA" },
    { image: "/Image/planetarium.jpg", name: "Eiffel Tower", type: "Monument", rate: "4.6", location: "Paris, France" }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  const totalItems = places.length;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1);
      } else {
        setItemsPerPage(4);
      }
    };

    window.addEventListener('resize', handleResize);

    // Set the initial value
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + itemsPerPage) % totalItems);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - itemsPerPage + totalItems) % totalItems);
  };

  const displayedPlaces = () => {
    let display = [];
    for (let i = 0; i < itemsPerPage; i++) {
      const index = (currentIndex + i) % totalItems;
      display.push(places[index]);
    }
    return display;
  };

  return (
    <section className="p-8">
      <h1 className="text-4xl md:text-4xl text-pink-900 font-bold mt-44 md:mt-32 mb-2 md:mb-0 md:-ml-[5.25rem] font-sofia">Rekomendasi Vendor</h1>
      <button className="mt-2 md:mt-5 mb-2 md:mb-0 md:-ml-[5.25rem] px-6 py-2 bg-pink-600 text-white font-sofia font-bold rounded-lg hover:bg-pink-700">Lihat Selengkapnya</button>
      <div className="relative flex items-center justify-center mt-10 mb-2">
        <div className="flex flex-wrap gap-10 justify-center mx-4">
          {displayedPlaces().map((place, index) => (
            <div key={index} className="w-[16.75rem] md:w-[17.5rem] bg-white shadow-lg rounded-3xl overflow-hidden relative">
              <Image
                src={place.image}
                alt={`${place.name} Image`}
                width={400}
                height={200}
                className="object-cover"
              />
              <div className="p-4 ml-2 font-sofia flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-xl text-pink-900 font-bold">{place.name}</h3>
                  <p className="text-gray-700">{place.type}</p>
                  <p className="text-gray-500 flex flex-row">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className= "h-4 w-4 text-yellow-500 mr-[0.3rem] mt-[0.125rem]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.14 3.51a1 1 0 00.95.69h3.7c.967 0 1.372 1.24.588 1.81l-2.992 2.179a1 1 0 00-.364 1.118l1.14 3.51c.3.921-.755 1.688-1.54 1.118l-2.992-2.178a1 1 0 00-1.175 0l-2.992 2.178c-.785.57-1.84-.197-1.54-1.118l1.14-3.51a1 1 0 00-.364-1.118L2.93 8.937c-.784-.57-.38-1.81.588-1.81h3.7a1 1 0 00.95-.69l1.14-3.51z" />
                  </svg> {place.rate}
                </p>
                  <p className="text-gray-500">{place.location}</p>
                </div>
                <button className="self-start text-pink-500 hover:text-pink-700 font-bold mt-4"
                  onClick={() => router.push(`/info-detail`)}    
                >
                    Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>
        <button 
          className="absolute left-0 md:-left-6 px-1 md:px-3 py-1 md:py-2 bg-pink-600 text-white rounded-full shadow-lg hover:shadow-2xl focus:outline-none"
          onClick={handlePrev}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          className="absolute right-0 md:-right-6 px-1 md:px-3 py-1 md:py-2 bg-pink-600 text-white rounded-full shadow-lg hover:shadow-2xl focus:outline-none"
          onClick={handleNext}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
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
            <Image src="/Image/logo.png" alt="Logevent Logo" width={60} height={60} className='mb-2 cursor-pointer'/>
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