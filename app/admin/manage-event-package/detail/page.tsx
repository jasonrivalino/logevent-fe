'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Navbar, ContactBox } from '../../../page';
import { useRouter } from 'next/navigation';
import { CommandLeft } from '@/app/admin/commandLeft';

export default function ProductDetail() {
  const descriptionRef = useRef(null);
  const vendorListRef = useRef(null);
  const albumRef = useRef(null);
  const reviewsRef = useRef(null);

  const scrollToSection = (ref: { current: { offsetTop: number; }; }) => {
    var offset = 20; // Adjust this value for the desired offset
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      offset = 45;
    }

    window.scrollTo({
      top: ref.current.offsetTop - offset,
      behavior: 'smooth',
    });
  };

  const router = useRouter();
  const handleBackClick = () => {
      router.push('/admin/manage-event-package');
  };

  return (
    <div>
        <Navbar />
            <div className="min-h-screen flex flex-col px-6 mt-24">
                <div className="flex flex-col md:flex-row flex-grow">
                  <div className="md:hidden flex justify-center items-center">
                        {/* Back button with SVG arrow */}
                        <button 
                            onClick={handleBackClick} 
                            className="absolute top-20 left-4 p-2 rounded-full bg-white text-black shadow-lg flex items-center justify-center w-10 h-10 md:w-12 md:h-12 hover:bg-gray-100"
                            >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-6 h-6 text-gray-700"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    </div>
                <div className="hidden md:block">
                    <CommandLeft />
                </div>
                <div className="flex-grow ml-0 md:ml-7 mt-1 font-sofia bg-white rounded-xl p-5">
                    {/* Breadcrumb Navigation */}
                    <div className="hidden md:flex items-center mb-4">
                      <div className="flex items-center">
                        <a onClick={() => router.push('/admin/manage-event-package')} className="text-pink-600 font-semibold font-sofia cursor-pointer">Kelola Paket</a>
                        <span className="mx-2 text-gray-600 font-sofia font-semibold"> {'>'} </span>
                        <p className="text-gray-600 font-sofia font-semibold">Info Detail Paket</p>
                      </div>
                    </div>
                    <ProductImage />
                    <Tabs scrollToSection={scrollToSection} refs={{ descriptionRef, vendorListRef, albumRef, reviewsRef }} />
                    <div ref={descriptionRef}><Description/></div>
                    <div ref={vendorListRef}><VendorList/></div>
                    <div ref={reviewsRef}><Reviews /></div>
                </div>
            </div>
        </div>
        <ContactBox />
    </div>
  );
}

const images = [
    "/Image/landingpage1.jpg",
    "/Image/landingpage2.jpg",
    "/Image/landingpage3.jpg",
    "/Image/planetarium.jpg",
    "/Image/partyevent.jpg"
  ];
  
  const useWindowWidth = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
    useEffect(() => {
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
  
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);
  
    return windowWidth;
  };
  
  const ProductImage = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const timeoutRef = useRef<null | NodeJS.Timeout>(null);
    const windowWidth = useWindowWidth();
    const router = useRouter();
  
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
        2000
      );
  
      return () => {
        resetTimeout();
      };
    }, [currentImageIndex]);
  
    return (
      <div className="mt-2 md:-mt-4">
        {windowWidth >= 768 ? (
          <div className="py-4">
            <div className="flex md:space-x-4">
              <img src={images[0]} alt="Main Hall" className="w-full md:w-1/2 h-auto md:h-[21rem] rounded-md" />
              <div className="grid grid-cols-2 gap-4 w-0 md:w-1/2">
                {images.slice(1).map((image, index) => (
                  <img key={index} src={image} alt={`Hall Image ${index + 1}`} className="w-0 md:w-full h-auto md:h-40 rounded-md" />
                ))}
              </div>
            </div>
            <div className="flex flex-col md:flex-row space-x-4">
              <div className="w-full md:w-1/2">
                <h1 className="text-2xl md:text-3xl text-pink-900 font-bold mt-4">Paket Event A</h1>
                <p className="text-sm md:text-base text-gray-600">Birthday Party</p>
                <p className="text-sm md:text-base text-gray-600">Kapasitas: 100 Orang</p>
                <p className="text-base md:text-lg text-gray-800 font-extrabold">Rp 3.000.000 / hari</p>
                <div className="text-sm md:text-base flex items-center space-x-2 text-gray-600">
                  <span>Dago, Bandung</span>
                  <span>|</span>
                  <span>⭐ 4.2 (190 reviews)</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="md:px-8 pb-4">
            <div className="flex md:space-x-4">
              <img
                src={images[currentImageIndex]}
                alt="Main Hall"
                className="w-full md:w-1/2 h-44 rounded-md"
              />
              <div className="grid grid-cols-2 gap-4 w-0 md:w-1/2">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Hall Image ${index + 1}`}
                    className="w-0 md:w-full h-auto rounded-md"
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col md:flex-row space-x-4">
              <div className="w-full md:w-1/2">
                <h1 className="text-2xl md:text-3xl text-pink-900 font-bold mt-4">Gedung Sabuga ITB</h1>
                <p className="text-sm md:text-base text-gray-600">Multifunctional Hall</p>
                <p className="text-sm md:text-base text-gray-600">Kapasitas: 1000 Orang</p>
                <p className="text-base md:text-lg text-gray-800 font-extrabold">Rp 5.000.000 / hari</p>
                <div className="text-sm md:text-base flex items-center space-x-2 text-gray-600">
                  <span>Dago, Bandung</span>
                  <span>|</span>
                  <span>⭐ 4.2 (190 reviews)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  function Tabs({ scrollToSection, refs }: { scrollToSection: (ref: React.RefObject<any>) => void; refs: { descriptionRef: React.RefObject<any>; vendorListRef: React.RefObject<any>; albumRef: React.RefObject<any>; reviewsRef: React.RefObject<any>; }; }) {
    return (
      <nav className="flex justify-center space-x-4 md:space-x-8 mt-2 md:mt-0 py-2 md:pb-5 border-b text-sm md:text-base">
        <button onClick={() => scrollToSection(refs.descriptionRef)} className="text-gray-600 hover:text-pink-500">Description</button>
        <button onClick={() => scrollToSection(refs.vendorListRef)} className="text-gray-600 hover:text-pink-500">Bundle Logistik</button>
        <button onClick={() => scrollToSection(refs.reviewsRef)} className="text-gray-600 hover:text-pink-500">Reviews</button>
      </nav>
    );
  }
  
  function Description() {
    return (
      <div className="px-0 md:px-2 pb-8 md:py-14 border-b">
        <h2 className="text-2xl md:text-3xl font-bold text-pink-900 pt-10">Description</h2>
        <p className="text-gray-600 mt-4 text-sm md:text-base">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus odio nisi, pellentesque eu molestie eget, lobortis non nisl. Fusce sit amet massa porta, condimentum elit eu, finibus ipsum. Sed sed arcu eu turpis lacinia scelerisque. Vestibulum lacinia mauris vitae nunc tempus, sed laoreet eros gravida. Nullam rhoncus scelerisque odio, eu lobortis urna viverra sed. Quisque feugiat, eros at sagittis commodo, risus lectus viverra odio, a fringilla elit lectus eget purus. Suspendisse tortor mi, pulvinar at vulputate et, cursus ac odio. Integer faucibus quam non nulla lacinia, vel dignissim tellus pulvinar.
          <br></br><br></br>
          Suspendisse molestie dictum egestas. Proin vehicula nunc in volutpat cursus. Etiam eu ullamcorper metus. Integer commodo orci eu nisi gravida, a lacinia libero molestie. Nulla luctus rhoncus erat, eget blandit nunc maximus vel. Maecenas convallis vulputate orci, varius venenatis nunc lacinia non. Donec ac vestibulum sapien, eget ullamcorper metus. Donec dolor justo, accumsan ut est eu, maximus sollicitudin dui. Nullam dictum ex dui. Integer justo risus, tincidunt nec mattis lobortis, commodo non magna. Cras non ex eget magna euismod efficitur. Fusce in ullamcorper justo.
          <br></br><br></br>
          Phasellus id lorem non massa molestie iaculis. Ut porttitor varius purus, quis feugiat sem commodo et. Donec laoreet nulla sed dui bibendum accumsan. Nullam dignissim massa et commodo accumsan. Mauris suscipit tristique quam, vitae ullamcorper sapien molestie non. Nunc accumsan in felis sit amet posuere. Etiam sodales accumsan tempus. Aliquam nec velit commodo, suscipit ante ac, pulvinar libero. Praesent nunc lectus, venenatis vel libero sed, sollicitudin pellentesque tellus. Vivamus accumsan erat in turpis tincidunt, commodo pulvinar nisl pellentesque. Maecenas at dolor rhoncus, varius elit nec, facilisis nisl. 
        </p>
      </div>
    );
  }
  
  function VendorList() {
    const router = useRouter();
    const windowWidth = useWindowWidth();
  
    const places = [
      { image: "/Image/planetarium.jpg", name: "Sunset Beach", type: "Beach", rate: "4.5", location: "California, USA" },
      { image: "/Image/planetarium.jpg", name: "Mountain View", type: "Mountain", rate: "4.7", location: "Alps, Switzerland" },
      { image: "/Image/planetarium.jpg", name: "City Park", type: "Park", rate: "4.3", location: "New York, USA" },
    ];
  
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(2);
  
    const totalItems = places.length;
  
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth < 768) {
          setItemsPerPage(2);
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
      <section className="px-0 md:px-2 py-12 md:pb-16 border-b">
        <h2 className="text-2xl md:text-3xl font-bold text-pink-900 md:pt-5 mb-6">Bundle Logistik</h2>
        {windowWidth >= 768 ? (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {places.map((place, index) => (
              <div key={index} className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col justify-between">
                <Image
                  src={place.image}
                  alt={`${place.name} Image`}
                  width={400}
                  height={200}
                  className="object-cover"
                />
                <div className="p-3 md:p-3 font-sofia flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-sm md:text-base text-pink-900 font-bold mb-2">{place.name}</h3>
                    <p className="text-xs md:text-sm text-gray-700">{place.type}</p>
                    <p className="text-xs md:text-sm text-gray-500 flex flex-row">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 md:h-4 w-3 md:w-4 text-yellow-500 mr-[0.3rem] mt-[0.075rem] md:mt-[0.05rem]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.14 3.51a1 1 0 00.95.69h3.7c.967 0 1.372 1.24.588 1.81l-2.992 2.179a1 1 0 00-.364 1.118l1.14 3.51c.3.921-.755 1.688-1.54 1.118l-2.992-2.178a1 1 0 00-1.175 0l-2.992 2.178c-.785.57-1.84-.197-1.54-1.118l1.14-3.51a1 1 0 00-.364-1.118L2.93 8.937c-.784-.57-.38-1.81.588-1.81h3.7a1 1 0 00.95-.69l1.14-3.51z" />
                      </svg> {place.rate}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500">{place.location}</p>
                  </div>
                  <button className="self-start text-xs md:text-base text-pink-500 hover:text-pink-700 font-bold mt-4"
                    onClick={() => router.push(`/logistik-vendor/info-detail`)}
                  >
                    Lihat Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative">
            <div className="grid grid-cols-2 gap-4 px-4">
              {displayedPlaces().map((place, index) => (
                <div key={index} className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col justify-between">
                  <Image
                    src={place.image}
                    alt={`${place.name} Image`}
                    width={400}
                    height={200}
                    className="object-cover"
                  />
                  <div className="p-3 md:p-3 font-sofia flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-sm md:text-base text-pink-900 font-bold md:mb-2">{place.name}</h3>
                      <p className="text-xs md:text-sm text-gray-700">{place.type}</p>
                      <p className="text-xs md:text-sm text-gray-500 flex flex-row">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 md:h-4 w-3 md:w-4 text-yellow-500 mr-[0.3rem] mt-[0.075rem] md:mt-[0.05rem]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.14 3.51a1 1 0 00.95.69h3.7c.967 0 1.372 1.24.588 1.81l-2.992 2.179a1 1 0 00-.364 1.118l1.14 3.51c.3.921-.755 1.688-1.54 1.118l-2.992-2.178a1 1 0 00-1.175 0l-2.992 2.178c-.785.57-1.84-.197-1.54-1.118l1.14-3.51a1 1 0 00-.364-1.118L2.93 8.937c-.784-.57-.38-1.81.588-1.81h3.7a1 1 0 00.95-.69l1.14-3.51z" />
                        </svg> {place.rate}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500">{place.location}</p>
                    </div>
                    <button className="self-start text-xs md:text-base text-pink-500 hover:text-pink-700 font-bold mt-4"
                      onClick={() => router.push(`/logistik-vendor/info-detail`)}
                    >
                      Lihat Detail
                    </button>
                  </div>
                </div>
              ))}
            <button 
              className="absolute left-0 top-12 px-1 md:px-3 py-1 md:py-2 bg-pink-600 text-white rounded-full shadow-lg hover:shadow-2xl focus:outline-none"
              onClick={handlePrev}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              className="absolute right-0 top-12 px-1 md:px-3 py-1 md:py-2 bg-pink-600 text-white rounded-full shadow-lg hover:shadow-2xl focus:outline-none"
              onClick={handleNext}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            </div>
          </div>
        )}
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
      <div className="mt-4 px-0 md:px-2 pb-8 md:py-14">
        <div className="flex items-center justify-between space-x-4">
          <h2 className="text-2xl md:text-3xl font-bold text-pink-900 pt-10">Reviews</h2>
          <button className="text-sm md:text-base bg-pink-600 text-white px-2 md:px-4 py-1 md:py-2 rounded-lg -mb-10 md:-mb-8">Lihat Review lengkap</button>
        </div>
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8 mt-6">
          {reviews.map((review, index) => (
            <div key={index} className="border border-gray-400 rounded-lg p-4 w-full md:w-1/3">
              <div className="flex items-center space-x-4">
                <img src={review.imageUrl} alt="User profile" className="w-12 h-12 rounded-full" />
                <div>
                  <h3 className="text-lg md:text-xl text-gray-600 font-bold">{review.user}</h3>
                  <p className="text-gray-600 text-sm md:text-base">{review.category}</p>
                  <p className="text-gray-600 text-sm md:text-base">{review.date}</p>
                </div>
              </div>
              <p className="text-gray-600 mt-2 text-xs md:text-base">
                {review.review}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }