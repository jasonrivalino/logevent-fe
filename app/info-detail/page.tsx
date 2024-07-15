'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Navbar, ContactBox } from '../page';

export default function Product() {
  const homeRef = useRef(null);
  const albumRef = useRef(null);
  const reviewsRef = useRef(null);

  const scrollToSection = (ref: { current: { offsetTop: number; }; }) => {
    const offset = 20; // Adjust this value for the desired offset

    window.scrollTo({
      top: ref.current.offsetTop - offset,
      behavior: 'smooth',
    });
  };

  return (
    <div className="font-sofia">
      <Navbar />
      <div className="container mx-auto mt-24 px-20">
        <ProductImage />
        <Tabs scrollToSection={scrollToSection} refs={{ homeRef, albumRef, reviewsRef }} />
        <div ref={homeRef}><Home /></div>
        <div ref={albumRef}><ImageGallery /></div>
        <div ref={reviewsRef}><Reviews /></div>
      </div>
      <ContactBox />
    </div>
  );
}

function ProductImage() {
  return (
    <div className="px-8 py-4">
      <div className="flex space-x-4">
        <img src="/Image/planetarium.jpg" alt="Main Hall" className="w-1/2 h-auto rounded-md" />
        <div className="grid grid-cols-2 gap-4 w-1/2">
          <img src="/Image/planetarium.jpg" alt="Hall Image" className="w-full h-auto rounded-md" />
          <img src="/Image/planetarium.jpg" alt="Hall Image" className="w-full h-auto rounded-md" />
          <img src="/Image/planetarium.jpg" alt="Hall Image" className="w-full h-auto rounded-md" />
          <img src="/Image/planetarium.jpg" alt="Hall Image" className="w-full h-auto rounded-md" />
        </div>
      </div>
      <div className="flex space-x-4">
        <div className="w-1/2">
          <h1 className="text-3xl text-pink-900 font-bold mt-4">Gedung Sabuga ITB</h1>
          <p className="text-base text-gray-600">Multifunctional Hall</p>
          <p className="text-base text-gray-600">Kapasitas: 1000 Orang</p>
          <p className="text-base text-gray-600">Rp 5.000.000 / hari</p>
          <div className="flex items-center space-x-2 text-gray-600">
            <span>Dago, Bandung</span>
            <span>|</span>
            <span>⭐⭐⭐⭐⭐ (190 reviews)</span>
          </div>
        </div>
        <div className="flex space-x-4 w-1/2 justify-end items-center">
          <button className="bg-pink-500 text-white rounded-lg px-4 py-2">Chat vendor</button>
          <button className="text-pink-500 flex flex-col items-center">
            <svg className="w-6 h-6 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 8a3 3 0 00-2.24-2.93 5 5 0 10-5.52 0A3 3 0 005 8v1h10V8zM5 11h10v1a4 4 0 01-4 4H9a4 4 0 01-4-4v-1zm5-9a4 4 0 014 4v1H6V6a4 4 0 014-4z" />
            </svg>
            Share
          </button>
          <button className="text-pink-500 flex flex-col items-center">
            <svg className="w-6 h-6 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.343l-6.828-6.828a4 4 0 010-5.656z" />
            </svg>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function Tabs({ scrollToSection, refs }: { scrollToSection: (ref: React.RefObject<any>) => void; refs: { homeRef: React.RefObject<any>; albumRef: React.RefObject<any>; reviewsRef: React.RefObject<any> } }) {
  return (
    <nav className="flex justify-center space-x-8 py-4 border-b">
      <button onClick={() => scrollToSection(refs.homeRef)} className="text-gray-600 hover:text-pink-500">Home</button>
      <button onClick={() => scrollToSection(refs.albumRef)} className="text-gray-600 hover:text-pink-500">Album</button>
      <button onClick={() => scrollToSection(refs.reviewsRef)} className="text-gray-600 hover:text-pink-500">Reviews</button>
    </nav>
  );
}

function Home() {
  return (
    <div className="px-8 py-14 border-b">
      <h2 className="text-3xl font-bold text-pink-900 pt-10">Home</h2>
      <p className="text-gray-600 mt-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus odio nisi, pellentesque eu molestie eget, lobortis non nisl. Fusce sit amet massa porta, condimentum elit eu, finibus ipsum. Sed sed arcu eu turpis lacinia scelerisque. Vestibulum lacinia mauris vitae nunc tempus, sed laoreet eros gravida. Nullam rhoncus scelerisque odio, eu lobortis urna viverra sed. Quisque feugiat, eros at sagittis commodo, risus lectus viverra odio, a fringilla elit lectus eget purus. Suspendisse tortor mi, pulvinar at vulputate et, cursus ac odio. Integer faucibus quam non nulla lacinia, vel dignissim tellus pulvinar.
        <br></br><br></br>
        Suspendisse molestie dictum egestas. Proin vehicula nunc in volutpat cursus. Etiam eu ullamcorper metus. Integer commodo orci eu nisi gravida, a lacinia libero molestie. Nulla luctus rhoncus erat, eget blandit nunc maximus vel. Maecenas convallis vulputate orci, varius venenatis nunc lacinia non. Donec ac vestibulum sapien, eget ullamcorper metus. Donec dolor justo, accumsan ut est eu, maximus sollicitudin dui. Nullam dictum ex dui. Integer justo risus, tincidunt nec mattis lobortis, commodo non magna. Cras non ex eget magna euismod efficitur. Fusce in ullamcorper justo.
        <br></br><br></br>
        Phasellus id lorem non massa molestie iaculis. Ut porttitor varius purus, quis feugiat sem commodo et. Donec laoreet nulla sed dui bibendum accumsan. Nullam dignissim massa et commodo accumsan. Mauris suscipit tristique quam, vitae ullamcorper sapien molestie non. Nunc accumsan in felis sit amet posuere. Etiam sodales accumsan tempus. Aliquam nec velit commodo, suscipit ante ac, pulvinar libero. Praesent nunc lectus, venenatis vel libero sed, sollicitudin pellentesque tellus. Vivamus accumsan erat in turpis tincidunt, commodo pulvinar nisl pellentesque. Maecenas at dolor rhoncus, varius elit nec, facilisis nisl. 
      </p>
    </div>
  );
}

function ImageGallery() {
  const places = [
    { image: "/Image/planetarium.jpg" },
    { image: "/Image/planetarium.jpg" },
    { image: "/Image/planetarium.jpg" },
    { image: "/Image/planetarium.jpg" },
    { image: "/Image/planetarium.jpg" },
    { image: "/Image/planetarium.jpg" },
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
    const display = [];
    for (let i = 0; i < itemsPerPage; i++) {
      const index = (currentIndex + i) % totalItems;
      display.push(places[index]);
    }
    return display;
  };

  return (
    <section className="px-8 py-14 border-b">
      <h2 className="text-3xl font-bold text-pink-900 pt-10">Album</h2>
      <div className="relative flex items-center justify-center mt-6 mb-2">
        <div className="flex flex-wrap gap-10 justify-center mx-4">
          {displayedPlaces().map((place, index) => (
            <div key={index} className="w-[16.75rem] md:w-[17.5rem] bg-white shadow-lg rounded-3xl overflow-hidden relative">
              <Image
                src={place.image}
                alt={`Image`}
                width={400}
                height={200}
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <button 
          className="absolute left-0 px-1 md:px-3 py-1 md:py-2 bg-pink-600 text-white rounded-full shadow-lg hover:shadow-2xl focus:outline-none"
          onClick={handlePrev}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          className="absolute right-0 px-1 md:px-3 py-1 md:py-2 bg-pink-600 text-white rounded-full shadow-lg hover:shadow-2xl focus:outline-none"
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

function Reviews() {
  const reviews = [
    {
      user: "User1",
      category: "Venue & Decoration",
      date: "3 Maret 2024",
      review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse dictum maximus sapien, in vestibulum dui. Phasellus viverra lectus nibh, at maximus diam laoreet vitae.",
      imageUrl: "https://via.placeholder.com/50" // Replace with actual image URLs
    },
    {
      user: "User2",
      category: "Food & Service",
      date: "5 April 2024",
      review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse dictum maximus sapien, in vestibulum dui. Phasellus viverra lectus nibh, at maximus diam laoreet vitae.",
      imageUrl: "https://via.placeholder.com/50" // Replace with actual image URLs
    },
    {
      user: "User3",
      category: "Overall Experience",
      date: "10 Mei 2024",
      review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse dictum maximus sapien, in vestibulum dui. Phasellus viverra lectus nibh, at maximus diam laoreet vitae.",
      imageUrl: "https://via.placeholder.com/50" // Replace with actual image URLs
    },
  ];

  return (
    <div className="mt-4 px-8 py-14">
      <h2 className="text-3xl font-bold text-pink-900 pt-10">Reviews</h2>
      <div className="flex items-center space-x-8 mt-6">
        {reviews.map((review, index) => (
          <div key={index} className="border border-gray-400 rounded-lg p-4 w-1/3">
            <div className="flex items-center space-x-4">
              <img src={review.imageUrl} alt="User profile" className="w-12 h-12 rounded-full" />
              <div>
                <h3 className="text-xl text-gray-600 font-bold">{review.user}</h3>
                <p className="text-gray-600">{review.category}</p>
                <p className="text-gray-600">{review.date}</p>
              </div>
            </div>
            <p className="text-gray-600 mt-2">
              {review.review}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}