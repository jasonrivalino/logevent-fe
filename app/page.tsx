// app/page.tsx
"use client";

// dependency modules
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { FaCaretDown } from 'react-icons/fa';
// self-defined modules
import { readUserProfile } from '@/app/utils/authApi';
import { generateWhatsAppUrl } from '@/app/utils/helpers';
import { readAllFaqs } from '@/app/utils/faqApi';
import { readTopProducts } from '@/app/utils/productApi';
import { readSetting } from '@/app/utils/settingApi';
import { createVisit } from '@/app/utils/visitApi';
import { Faq, Product, Setting } from '@/app/utils/types';

export default function Home() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [setting, setSetting] = useState<Setting | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const faqs = await readAllFaqs();
        const products = await readTopProducts();
        const setting = await readSetting();
        setFaqs(faqs);
        setProducts(products);
        setSetting(setting);
        
        await createVisit();
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-screen">
        <Introduction />
        <AboutUsSection setting={setting} />
        <LayananSection />
        <KeunggulanSection />
        <FAQ faqs={faqs} />
        <ListProduct products={products}/>
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
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const user = await readUserProfile(token);
          setUserName(user.name || user.email);

          if (user.isAdmin) {
            setIsAdmin(true);
          }
        } catch (error: any) {
          console.error('Failed to fetch user data:', error.message);
          localStorage.removeItem('token');
          Cookies.remove('token');
        }
      }
    };

    fetchUserProfile();
  }, []);

  const handleSignInClick = () => {
    router.push('/signin');
  };

  const handleSignOutClick = () => {
    localStorage.removeItem('token');
    Cookies.remove('token');
    setUserName(null);
    setIsDropdownOpen(false);
    router.push('/');
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    router.push('/profile');
  };

  const handleWishlistClick = () => {
    setIsDropdownOpen(false);
    router.push('/wishlist');
  };

  const handleHistoryClick = () => {
    setIsDropdownOpen(false);
    router.push('/histori-pemesanan');
  };

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
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

  return (
    <nav className="fixed top-0 left-0 w-full bg-pink-900 shadow-md z-50">
      <div className="container mx-auto px-12 py-4 flex justify-between items-center">
        <Image
          src="/Image/logo.png"
          alt="Logevent Logo"
          width={40}
          height={30}
          className="-ml-6 md:-ml-0 cursor-pointer"
          onClick={() => {
            if (!isAdmin) {
              router.push('/');
            } else {
              router.push('/admin/statistics');
            }
          }}
        />
        <div className="hidden md:flex justify-center space-x-8">
          <ul className="flex justify-center space-x-8">
            {!isAdmin && (
              <>
                <li>
                  {pathname === '/' ? (
                    <a
                      href="#about-us"
                      onClick={(e) => handleScrollToSection(e, 'about-us')}
                      className="hover:underline font-sofia text-white"
                    >
                      About Us
                    </a>
                  ) : (
                    <a
                      href="/#about-us"
                      className="hover:underline font-sofia text-white"
                    >
                      About Us
                    </a>
                  )}
                </li>
                <li>
                  {pathname === '/' ? (
                    <a
                      href="#services"
                      onClick={(e) => handleScrollToSection(e, 'services')}
                      className="hover:underline font-sofia text-white"
                    >
                      Produk & Layanan
                    </a>
                  ) : (
                    <a
                      href="/#services"
                      className="hover:underline font-sofia text-white"
                    >
                      Produk & Layanan
                    </a>
                  )}
                </li>
                <li>
                  {pathname === '/' ? (
                    <a
                      href="#faq"
                      onClick={(e) => handleScrollToSection(e, 'faq')}
                      className="hover:underline font-sofia text-white"
                    >
                      FAQ
                    </a>
                  ) : (
                    <a
                      href="/#faq"
                      className="hover:underline font-sofia text-white"
                    >
                      FAQ
                    </a>
                  )}
                </li>
              </>
            )}
            {userName ? (
              <li className="relative bg-pink-900">
                <div className="flex items-center space-x-2">
                  <span
                    className="font-sofia cursor-pointer text-white flex items-center"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    {userName.length > 10 ? `${userName.substring(0, 10)}...` : userName}
                    <FaCaretDown className="text-white ml-2" />
                  </span>
                  {isDropdownOpen && (
                    <div className="absolute top-full right-0 mt-[1.125rem] w-[13rem] bg-pink-900 shadow-lg max-h-44 overflow-y-auto z-50">
                      {isAdmin ? (
                        <>
                          <button
                            onClick={handleProfileClick}
                            className="pl-[1.2rem] py-[0.6rem] text-white w-full justify-start flex items-center font-sofia text-base hover:bg-pink-800"
                          >
                            <Image src="/Image/IconButton/profile.png" alt="User Profile" width={18} height={18} className="mr-[0.8rem]" />
                            Profile
                          </button>
                          <button
                            onClick={handleSignOutClick}
                            className="pl-[1.3rem] py-[0.6rem] text-white w-full justify-start flex items-center font-sofia text-base hover:bg-pink-800"
                          >
                              <Image src="/Image/IconButton/logout.png" alt="Sign Out" width={16} height={16} className="mr-[0.7rem] mb-[0.15rem]" />
                              Sign Out
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={handleProfileClick}
                            className="pl-[1.2rem] py-[0.6rem] text-white w-full justify-start flex items-center font-sofia text-base hover:bg-pink-800"
                          >
                            <Image src="/Image/IconButton/profile.png" alt="User Profile" width={18} height={18} className="mr-[0.8rem]" />
                            Profile
                          </button>
                          <button
                            onClick={handleWishlistClick}
                            className="pl-[1.2rem] py-[0.6rem] text-white w-full justify-start flex items-center font-sofia text-base hover:bg-pink-800"
                          >
                            <Image src="/Image/IconButton/shopping.png" alt="User Wishlist" width={18} height={18} className="mr-[0.8rem]" />
                            Wishlist
                          </button>
                          <button
                            onClick={handleHistoryClick}
                            className="pl-[1.2rem] py-[0.6rem] text-white w-full justify-start flex items-center font-sofia text-base hover:bg-pink-800"
                          >
                            <Image src="/Image/IconButton/history.png" alt="Order History" width={18} height={18} className="mr-[0.8rem]" />
                            Histori Pemesanan
                          </button>
                          <button
                            onClick={handleSignOutClick}
                            className="pl-[1.3rem] py-[0.6rem] text-white w-full justify-start flex items-center font-sofia text-base hover:bg-pink-800"
                          >
                            <Image src="/Image/IconButton/logout.png" alt="Sign Out" width={16} height={16} className="mr-[0.7rem] mb-[0.15rem]" />
                            Sign Out
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ) : (
              <li>
                <button onClick={handleSignInClick} className="font-sofia text-white">
                  Sign In
                </button>
              </li>
            )}
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
          <ul className="flex flex-col items-center space-y-4 py-2 md:py-4">
            {!isAdmin && (
              <>
                <li>
                  {pathname === '/' ? (
                    <a
                      href="#about-us"
                      onClick={(e) => handleScrollToSection(e, 'about-us')}
                      className="hover:underline font-sofia text-white"
                    >
                      About Us
                    </a>
                  ) : (
                    <a
                      href="/#about-us"
                      className="hover:underline font-sofia text-white"
                    >
                      About Us
                    </a>
                  )}
                </li>
                <li>
                  {pathname === '/' ? (
                    <a
                      href="#services"
                      onClick={(e) => handleScrollToSection(e, 'services')}
                      className="hover:underline font-sofia text-white"
                    >
                      Produk & Layanan
                    </a>
                  ) : (
                    <a
                      href="/#services"
                      className="hover:underline font-sofia text-white"
                    >
                      Produk & Layanan
                    </a>
                  )}
                </li>
                <li>
                  {pathname === '/' ? (
                    <a
                      href="#faq"
                      onClick={(e) => handleScrollToSection(e, 'faq')}
                      className="hover:underline font-sofia text-white"
                    >
                      FAQ
                    </a>
                  ) : (
                    <a
                      href="/#faq"
                      className="hover:underline font-sofia text-white"
                    >
                      FAQ
                    </a>
                  )}
                </li>
              </>
            )}
            {userName ? (
              <div className="flex flex-col items-center space-y-4">
                <span
                  className="font-sofia cursor-pointer text-white flex items-center"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {userName.length > 15 ? `${userName.substring(0, 10)}...` : userName}
                  <FaCaretDown className="text-white ml-2" />
                </span>
                {isDropdownOpen && (
                  <div className="w-96 bg-pink-900 flex flex-col items-center">
                    {isAdmin ? (
                      <>
                        <button
                          onClick={handleProfileClick}
                          className="w-full px-4 py-2 text-white text-center flex items-center justify-center font-sofia text-base hover:bg-pink-700"
                        >
                          <Image src="/Image/IconButton/profile.png" alt="User Profile" width={18} height={18} className="mr-2" />
                          Profile
                        </button>
                        <button
                          onClick={handleSignOutClick}
                          className="w-full px-4 py-2 text-white text-center flex items-center justify-center font-sofia text-base hover:bg-pink-700"
                        >
                          <Image src="/Image/IconButton/logout.png" alt="Sign Out" width={16} height={16} className="mr-2" />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleProfileClick}
                          className="w-full px-4 py-2 text-white text-center flex items-center justify-center font-sofia text-base hover:bg-pink-700"
                        >
                          <Image src="/Image/IconButton/profile.png" alt="User Profile" width={18} height={18} className="mr-2" />
                          Profile
                        </button>
                        <button
                          onClick={handleWishlistClick}
                          className="w-full px-4 py-2 text-white text-center flex items-center justify-center font-sofia text-base hover:bg-pink-700"
                        >
                          <Image src="/Image/IconButton/shopping.png" alt="User Wishlist" width={18} height={18} className="mr-2" />
                          Wishlist
                        </button>
                        <button
                          onClick={handleHistoryClick}
                          className="w-full px-4 py-2 text-white text-center flex items-center justify-center font-sofia text-base hover:bg-pink-700"
                        >
                          <Image src="/Image/IconButton/history.png" alt="Order History" width={18} height={18} className="mr-2" />
                          Histori Pemesanan
                        </button>
                        <button
                          onClick={handleSignOutClick}
                          className="w-full px-4 py-2 text-white text-center flex items-center justify-center font-sofia text-base hover:bg-pink-700"
                        >
                          <Image src="/Image/IconButton/logout.png" alt="Sign Out" width={16} height={16} className="mr-2" />
                          Sign Out
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <li>
                <button onClick={handleSignInClick} className="font-sofia text-white">
                  Sign In
                </button>
              </li>
            )}
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
      <div className="absolute inset-0 flex flex-col text-white p-10 md:p-20 mt-[6.5rem] h-sm:mt-14 md:h-sm:mt-[6.5rem]">
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
        <div className="mt-12">
          <button className="px-6 py-2 md:py-3 bg-pink-600 text-white font-sofia font-bold rounded-lg hover:bg-pink-700" onClick={() => router.push('/event-organizer')}>Pesan Event Organizer</button>
          <button className="px-6 py-2 md:py-3 mt-5 md:mt-0 md:ml-6  bg-white text-pink-600 border-2 border-pink-600 font-sofia font-bold rounded-lg hover:bg-pink-100 hover:text-pink-600 hover:border-pink-600" onClick={() => router.push('/logistik-vendor')}>Cari Logistik Vendor</button>
        </div>
      </div>
    </section>
  );
}

function AboutUsSection({ setting }: { setting: Setting | null }) {
  const handleChat = () => {
    const adminNumber = process.env.NEXT_PUBLIC_ADMIN_NUMBER;
    const messageTemplate = `Hai Admin LOGEVENT, saya tertarik menjadi bagian dari mitra Vendor LOGEVENT, apa saja persyaratan yang harus saya persiapkan?`;
    
    const whatsappUrl = generateWhatsAppUrl(adminNumber || "", messageTemplate);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="about-us">
      <div className="flex flex-col md:flex-row items-center p-8 md:p-16 mt-4 md:mt-[4.5rem] rounded-lg">
        <div className="w-full md:w-1/2">
          <iframe 
            className="w-full h-48 md:h-96 rounded-lg" 
            src={setting?.youtubeUrl || ""} 
            title="YouTube video player" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>
        <div className="w-full md:w-1/2 mt-6 md:mt-0 md:pl-16">
          <h2 className="text-lg md:text-4xl font-bold text-pink-500 font-poppins">Tentang Kami</h2>
          <h3 className="text-2xl md:text-5xl font-semibold font-poppins text-pink-900 mt-2 md:mt-4">Welcome To Logevent</h3>
          <p className="mt-4 md:mt-8 font-sofia text-black text-sm md:text-base">
            {setting?.description}
          </p>
          <div className="w-full md:w-3/5 mt-4 md:mt-8">
            <div className="flex justify-between">
              <div className="text-left">
                <h4 className="text-3xl font-bold text-pink-900 font-poppins">{setting?.vendorCount} +</h4>
                <p className="text-sm text-black font-poppins">Vendor Mitra</p>
              </div>
              <div className="text-left">
                <h4 className="text-3xl font-bold text-pink-900 font-poppins">{setting?.productCount} +</h4>
                <p className="text-sm text-black font-poppins">Logistik Vendor</p>
              </div>
              <div className="text-left">
                <h4 className="text-3xl font-bold text-pink-900 font-poppins">{setting?.orderCount} +</h4>
                <p className="text-sm text-black font-poppins">Event Terlaksana</p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col md:flex-row">
            <button
              className="px-6 py-2 md:py-3 md:mt-0 bg-white text-pink-600 border-2 border-pink-600 font-sofia font-bold rounded-lg hover:bg-pink-100 hover:text-pink-600 hover:border-pink-600"
              onClick={handleChat}
            >
              Menjadi Vendor
            </button>
            <div className='md:ml-6 flex mt-3 md:mt-0 flex-col font-sofia'>
              <h3 className="text-base md:text-lg text-pink-600">Bergabung Menjadi Mitra Vendor Kami !</h3>     
              <p className="text-sm text-black">Naikkan penjualan Anda, dan jangkau lebih banyak pelanggan </p>
            </div>
          </div>
        </div>
      </div>
  </section>
  );
}

function LayananCard({ image, title, description, link, onClick }: { image: string, title: string, description: string, link: string, onClick?: () => void }) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (link.startsWith('http')) {
      window.open(link, '_blank');
    } else {
      router.push(link);
    }
  };

  return (
    <div className="relative flex-col items-center mb-4 md:mb-8 md:p-4 rounded-lg">
      {/* Pink Circle */}
      <div className="absolute top-0 left-1 w-7 h-7 md:w-10 md:h-10 bg-pink-400 rounded-full z-0"></div>
      {/* Image with top-left alignment */}
      <div className="relative z-10 ml-3 mt-2 mb-2 md:ml-0 md:-mt-1">
        <Image
          src={image}
          alt={title}
          width={60}
          height={60}
          className="object-cover rounded-lg w-8 h-8 md:w-12 md:h-12"
        />
      </div>

      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-2 font-sofia text-gray-700">{title}</h2>
        <p className="text-gray-600 font-sofia mb-2 md:mb-4 text-sm md:text-base">{description}</p>
        {/* "Detail Layanan" Button */}
        <button
          className="text-pink-500 hover:text-pink-700 font-bold font-sofia"
          onClick={handleClick}
        >
          Detail Layanan
        </button>
      </div>
    </div>
  );
}

function LayananSection() {
  const router = useRouter();

  const descriptions = [
    {
      image: "/Image/IconButton/house.png",
      title: "Logistik Vendor",
      description: "Kami bekerja sama dengan berbagai vendor terpercaya yang menawarkan beragam produk dan layanan berkualitas tinggi. Dari panggung, sound system, hingga dekorasi, semua kebutuhan logistik event Anda dapat kami penuhi dengan cepat dan efisien.",
      link: "/logistik-vendor"
    },
    {
      image: "/Image/IconButton/calendar.png",
      title: "Event Organizer",
      description: "Tidak hanya menyediakan logistik, Logevent juga menawarkan jasa Event Organizer profesional yang siap merancang dan mengelola event impian Anda. Tim kami yang berpengalaman akan bekerja sama dengan Anda dari tahap perencanaan hingga eksekusi, memastikan setiap detail acara Anda tertata dengan sempurna.",
      link: "/event-organizer"
    },
    {
      image: "/Image/IconButton/box.png",
      title: "Paket Event",
      description: "Kami memahami bahwa setiap event memiliki karakteristik dan kebutuhan yang berbeda. Oleh karena itu, Logevent menyediakan berbagai paket event sesuai dengan kategori acara yang akan diadakan. Baik itu pesta pernikahan, konser musik, atau ulang tahun, kami memiliki paket yang dapat disesuaikan dengan kebutuhan dan anggaran Anda.",
      link: "/paket-event"
    },
  ];

  return (
    <section id="services" className="p-8 md:px-16 mt-8 md:-mt-14">
      <h1 className="text-3xl md:text-4xl text-pink-900 font-bold mt-24 mb-7 md:mb-10 font-sofia">Layanan Kami</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
        {descriptions.map((item, index) => (
          <LayananCard
            key={index}
            image={item.image}
            title={item.title}
            description={item.description}
            link={item.link}
            onClick={() => router.push(item.link)}
          />
        ))}
      </div>
    </section>
  );
}

function KeunggulanCard({ image, description }: { image: string, description: string }) {
  return (
    <div className="relative flex flex-row items-center mb-2 md:mb-3 p-4 md:p-8 bg-white shadow-lg rounded-lg">
      {/* Circle on the left */}
      <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-4 md:h-4 bg-pink-600 rounded-full"></div>
      
      {/* Increased image container size */}
      <div className="flex-shrink-0 w-10 h-10 md:w-16 md:h-16 ml-2"> {/* Adjusted margin for the circle */}
        <Image
          src={image}
          alt="image"
          width={80}
          height={80}
          className="object-cover rounded-lg"
        />
      </div>
      <div className="text-left ml-6 md:ml-8 md:mt-1">
        <p className="text-gray-600 font-sofia text-sm md:text-xl">{description}</p>
      </div>
    </div>
  );
}

function KeunggulanSection() {
  // Dummy data for the section
  const descriptions = [
    {
      image: "/Image/IconButton/keunggulan1.png",
      description: "Praktis dan Efisien, Komparasi harga antar vendor, Banyak Pilihan"
    },
    {
      image: "/Image/IconButton/keunggulan2.png",
      description: "Paket logistik berdasarkan kebutuhan acara & budget pengguna"
    },
    {
      image: "/Image/IconButton/keunggulan4.png",
      description: "Keamanan berbagai jenis transaksi antara vendor dan pengguna"
    },
    {
      image: "/Image/IconButton/keunggulan3.png",
      description: "Kemudahan memesan jasa EO dan berbagai kategori logistik yang diperlukan event"
    },
  ];

  return (
    <section id="keunggulan" className="p-8 md:p-16 mt-8 md:-mt-8">
      <h1 className="text-3xl md:text-4xl text-pink-900 font-bold mt-6 md:mt-5 mb-8 md:mb-10 font-sofia">Mengapa memilih Logevent?</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-6">
        {descriptions.map((item, index) => (
          <KeunggulanCard
            key={index}
            image={item.image}
            description={item.description}
          />
        ))}
      </div>
    </section>
  );
}

function FAQ({ faqs }: { faqs: Faq[] }) {
  const [openIndicesLeft, setOpenIndicesLeft] = useState<number[]>([]);
  const [openIndicesRight, setOpenIndicesRight] = useState<number[]>([]);

  const toggleOpenLeft = (index: number) => {
    if (openIndicesLeft.includes(index)) {
      setOpenIndicesLeft(openIndicesLeft.filter(i => i !== index));
    } else {
      setOpenIndicesLeft([...openIndicesLeft, index]);
    }
  };

  const toggleOpenRight = (index: number) => {
    if (openIndicesRight.includes(index)) {
      setOpenIndicesRight(openIndicesRight.filter(i => i !== index));
    } else {
      setOpenIndicesRight([...openIndicesRight, index]);
    }
  };

  return (
    <section id="faq" className="p-8 md:p-16 mt-8 md:-mt-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-12 text-pink-900 font-sofia mt-0 md:mt-16">
        Pertanyaan Yang Sering Ditanyakan
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg p-4 md:p-6 cursor-pointer transition-transform duration-200 hover:scale-105 overflow-hidden w-full h-full"
            onClick={() => (index % 2 === 0 ? toggleOpenLeft(index) : toggleOpenRight(index))}
          >
            <div className="flex justify-between items-center text-black">
            <span className="text-sm md:text-base font-semibold break-words whitespace-normal">
              {faq.question}
            </span>
              <span>{(index % 2 === 0 ? openIndicesLeft : openIndicesRight).includes(index) ? '-' : '>'}</span>
            </div>
            <div
              className={`mt-4 text-gray-600 text-sm md:text-base break-words transition-all duration-300 ${
                (index % 2 === 0 ? openIndicesLeft : openIndicesRight).includes(index) ? 'max-h-full' : 'max-h-0'
              }`}
              style={{
                overflow: 'hidden',
                maxHeight: (index % 2 === 0 ? openIndicesLeft : openIndicesRight).includes(index) ? '1000px' : '0',
              }}
            >
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ListProduct({ products }: { products: Product[] }) {
  const router = useRouter();

  const [totalItems, setTotalItems] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  useEffect(() => {
    setTotalItems(products.length);

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1);
      } else {
        if (totalItems < 4) {
          setItemsPerPage(totalItems);
        } else {
          setItemsPerPage(4);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [products.length, totalItems]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + itemsPerPage) % totalItems);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - itemsPerPage + totalItems) % totalItems);
  };

  const displayedProducts = () => {
    const display = [];
    for (let i = 0; i < itemsPerPage; i++) {
      const index = (currentIndex + i) % totalItems;
      display.push(products[index]);
    }
    return display;
  };

  if (products.length === 0) {
    return (
      <section className="px-8 py-14 border-b font-sofia">
        <h2 className="text-3xl font-bold text-pink-900 pt-10">Rekomendasi Produk</h2>
        <p className="text-gray-700 mt-6 -ml-3 justify-center items-center">Rekomendasi produk tidak tersedia saat ini.</p>
      </section>
    );
  }

  return (
    <section className="p-8 md:p-16 mt-8 md:-mt-8">
      <h1 className="text-3xl md:text-4xl text-pink-900 font-bold mt-44 md:mt-16 mb-2 md:mb-0 md:-ml-[5.25rem] font-sofia">Rekomendasi Produk</h1>
      <button className="mt-2 md:mt-5 mb-2 md:mb-0 md:-ml-[5.25rem] px-6 py-2 bg-pink-600 text-white font-sofia font-bold rounded-lg hover:bg-pink-700" onClick={() => router.push('/logistik-vendor')}>Lihat Selengkapnya</button>
      <div className="relative flex items-center justify-center mt-10 mb-2">
        <div className="flex flex-wrap gap-10 justify-center mx-4">
          {displayedProducts().map((product, index) => (
            product && (
              <div key={index} className="w-[16.75rem] md:w-[17.5rem] bg-white shadow-lg rounded-3xl overflow-hidden relative">
                <Image
                  src={product.productImage || "/Image/planetarium.jpg"}
                  alt={`${product.name} Image`}
                  width={400}
                  height={200}
                  className="object-cover h-36 md:h-40 w-full"
                />
                <div className="p-4 ml-2 font-sofia flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-xl text-pink-900 font-bold">{product.name}</h3>
                    <p className="text-gray-700">{product.specification}</p>
                    <p className="text-gray-500 flex flex-row">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-yellow-500 mr-[0.3rem] mt-[0.125rem]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.14 3.51a1 1 0 00.95.69h3.7c.967 0 1.372 1.24.588 1.81l-2.992 2.179a1 1 0 00-.364 1.118l1.14 3.51c.3.921-.755 1.688-1.54 1.118l-2.992-2.178a1 1 0 00-1.175 0l-2.992 2.178c-.785.57-1.84-.197-1.54-1.118l1.14-3.51a1 1 0 00-.364-1.118L2.93 8.937c-.784-.57-.38-1.81.588-1.81h3.7a1 1 0 00.95-.69l1.14-3.51z" />
                      </svg> {product.rating && product.rating.toFixed(2) !== "0.00" ? product.rating.toFixed(2) : "N/A"}
                    </p>
                    <p className="text-gray-500">{product.vendorAddress}</p>
                  </div>
                  <button className="self-start text-pink-500 hover:text-pink-700 font-bold mt-4"
                    onClick={() => router.push(`logistik-vendor/info-detail/${product.id}`)}
                  >
                    Lihat Detail
                  </button>
                </div>
              </div>
            )
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
            <p className="mt-2 mb-4 font-sofia px-5 md:px-0">Jangan khawatir pusing nyari vendor, Logevent solusinya</p>
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