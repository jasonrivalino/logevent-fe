// app/isi-pemesanan/review/page.tsx
'use client';

// dependency modules
import Cookies from 'js-cookie';
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
// self-defined modules
import { ContactBox } from "@/app/page";
import { readUserProfile } from '@/app/utils/authApi';
import { readCartById, updateCart } from '@/app/utils/cartApi';
import { readEventItemsByCartId, readProductItemsByCartId } from "@/app/utils/itemApi";
import { createOrder } from '@/app/utils/orderApi';
import { EventItem, ProductItem } from "@/app/utils/types";

export default function ReviewPesanan() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [eventItems, setEventItems] = useState<EventItem[]>([]);
  const [productItems, setProductItems] = useState<ProductItem[]>([]);

  const cartId = searchParams.get('cartId') || '';
  const name = searchParams.get('name') || '';
  const phone = searchParams.get('phone') || '';
  const address = searchParams.get('address') || '';
  const notes = searchParams.get('notes') || '';
  const startDateString = searchParams.get('startDate') || '';
  const endDateString = searchParams.get('endDate') || '';

  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);
  const formattedStartDate = startDateString ? new Date(startDateString).toLocaleDateString('id-ID') : 'N/A';
  const formattedEndDate = endDateString ? new Date(endDateString).toLocaleDateString('id-ID') : 'N/A';

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const user = await readUserProfile(token);
          const cart = await readCartById(Number(cartId));
          if (cart.cartStatus !== 'Active' || cart.userId !== user.id) {
            throw new Error('Cart not found or not active');
          }

          setEmail(user.email);
          if (cart.type === 'Event') {
            const eventItems = await readEventItemsByCartId(Number(cartId));
            setEventItems(eventItems);
          } else if (cart.type === 'Product') {
            const productItems = await readProductItemsByCartId(Number(cartId));
            setProductItems(productItems);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          router.push('/wishlist');
        }
      } else {
        localStorage.removeItem('token');
        Cookies.remove('token');
        router.push('/login');
      }
    }

    fetchData();
  }, [cartId]);

  const calculateDaysBetweenDates = (startDate: Date, endDate: Date) => {
    const timeDiff = endDate.getTime() - startDate.getTime();
    const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    return dayDiff + 1;
  };

  const totalEventPrice = eventItems.reduce((acc, item) => {
    const days = calculateDaysBetweenDates(startDate, endDate);
    const totalPrice = Math.ceil(item.eventPrice * days * (1 + item.categoryFee / 100));
    return acc + totalPrice;
  }, 0);

  const totalProductPrice = productItems.reduce((acc, item) => {
    const days = calculateDaysBetweenDates(startDate, endDate);
    const totalPrice =
      item.duration !== null
        ? Math.ceil(item.productPrice * item.duration * (1 + item.categoryFee / 100))
        : item.quantity !== null
        ? Math.ceil(item.productPrice * item.quantity * (1 + item.categoryFee / 100))
        : Math.ceil(item.productPrice * days * (1 + item.categoryFee / 100));
    return acc + totalPrice;
  }, 0);
  
  const totalPayment = totalEventPrice + totalProductPrice;

  const handleSubmit = async () => {
    const orderData = {
      cartId: Number(cartId),
      name,
      phone,
      address,
      notes: notes || null,
      startDateString: startDate.toISOString(),
      endDateString: endDate.toISOString()
    };

    const cartData = {
      cartStatus: 'Checked Out'
    };

    await createOrder(orderData);
    await updateCart(Number(cartId), cartData);
    router.push('/isi-pemesanan/complete');
  };

  const handleBackClick = () => {
    router.push('/wishlist');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Back button with SVG arrow */}
      <button 
          onClick={handleBackClick} 
          className="absolute top-4 left-4 p-2 rounded-full bg-white text-black shadow-lg flex items-center justify-center w-10 h-10 md:w-12 md:h-12 hover:bg-gray-100"
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

      {/* Review Pesanan */}
      <div className="flex flex-col flex-1 items-center justify-center p-6 md:p-16 font-sofia text-black">
        <div className="bg-white rounded-xl shadow-lg px-6 py-10 md:p-10 max-w-4xl w-full"> {/* Increased padding */}
          <h2 className="text-center text-pink-600 text-3xl font-semibold mb-6 md:mb-10">Review Pesanan</h2>

          <div className="flex justify-between mb-8">
            <div className="w-full md:w-1/2 text-black">
              <h3 className="text-pink-500 font-bold mb-2 text-lg md:text-xl">Identitas</h3>
              <div className="text-xs md:text-sm text-gray-600">
                <p>Nama Lengkap : {name}</p>
                <p>Nomor Whatsapp : {phone}</p>
                <p>Email : {email}</p>
                <p>Alamat : {address}</p>
                <p>Tanggal mulai acara : {formattedStartDate}</p>
                <p>Tanggal berakhir acara : {formattedEndDate}</p>
                <p>Catatan untuk vendor : {notes || 'Tidak ada catatan'}</p>
              </div>
            </div>
          </div>

          <div className="-mx-6 md:-mx-10 text-black mb-10">
              <table className="w-full text-left border-collapse md:mb-8">
              <thead>
                  <tr className="border-t-2 border-b-2 border-black">
                  {/* Make table aligned center */}
                  <th className="p-1 md:p-4 text-center text-xs md:text-base">INFO PRODUK</th>
                  <th className="p-1 md:p-4 text-center text-xs md:text-base">HARGA SATUAN</th>
                  <th className="p-1 md:p-4 text-center text-xs md:text-base">JUMLAH</th>
                  <th className="p-1 md:p-4 text-center text-xs md:text-base">TOTAL HARGA</th>
                  </tr>
              </thead>
              <tbody>
                  {eventItems.map((item, index) => {
                    const startDate = new Date(startDateString);
                    const endDate = new Date(endDateString);
                    const days = calculateDaysBetweenDates(startDate, endDate);
                    const totalPrice = Math.ceil(item.eventPrice * days * (1 + item.categoryFee / 100));

                    return (
                      <tr key={index}>
                        <td className="p-1 md:p-4 text-center text-xs md:text-base">
                          <strong>{item.eventName}</strong> <br/>
                          <span className="text-xs md:text-sm text-black">Paket Event - {item.categoryName}</span>
                        </td>
                        <td className="p-1 md:p-4 text-center text-xs md:text-base">Rp {item.eventPrice.toLocaleString('id-ID')}</td>
                        <td className="p-1 md:p-4 text-center text-xs md:text-base">{days} Hari</td>
                        <td className="p-1 md:p-4 text-center text-xs md:text-base">Rp {totalPrice.toLocaleString('id-ID')}</td>
                      </tr>
                    );
                  })}
                  {productItems.map((item, index) => {
                    const startDate = new Date(startDateString);
                    const endDate = new Date(endDateString);
                    let durationOrQuantityText;
                    if (item.duration !== null) {
                      durationOrQuantityText = `${item.duration} Jam`;
                    } else if (item.quantity !== null) {
                      durationOrQuantityText = `${item.quantity} Pcs`;
                    } else {
                      durationOrQuantityText = `${calculateDaysBetweenDates(startDate, endDate)} Hari`;
                    }

                    const totalPrice =
                      item.duration !== null
                        ? Math.ceil(item.productPrice * item.duration * (1 + item.categoryFee / 100))
                        : item.quantity !== null
                        ? Math.ceil(item.productPrice * item.quantity * (1 + item.categoryFee / 100))
                        : Math.ceil(item.productPrice * calculateDaysBetweenDates(startDate, endDate) * (1 + item.categoryFee / 100));

                    return (
                      <tr key={index}>
                        <td className="p-1 md:p-4 text-center text-xs md:text-base">
                          <strong>{item.productName}</strong> <br/>
                          <span className="text-xs md:text-sm text-black">Logistik Vendor - {item.categoryName}</span>
                        </td>
                        <td className="p-1 md:p-4 text-center text-xs md:text-base">Rp {item.productPrice.toLocaleString('id-ID')}</td>
                        <td className="p-1 md:p-4 text-center text-xs md:text-base">{durationOrQuantityText}</td>
                        <td className="p-1 md:p-4 text-center text-xs md:text-base">Rp {totalPrice.toLocaleString('id-ID')}</td>
                      </tr>
                    );
                  })}
              </tbody>
              </table>
          </div>

          <div className="flex justify-between items-stretch mb-8">
            {/* Payment Info */}
            <div className="text-xs md:text-base flex-1">
              <p><strong>Payment Info:</strong></p>
              <p>Account No: 102470393708</p>
              <p>A.C Name: Satria Octavianus Nababan</p>
              <p>Bank Details: Bank Jago</p>
            </div>

            {/* Total Payment */}
            <div className="text-right text-xs md:text-base flex-1">
              <p className="text-sm md:text-lg font-bold">Total Pembayaran: Rp {totalPayment.toLocaleString('id-ID')}</p>
            </div>
          </div>

          {/* Add submit button */}
          <div className="flex justify-center mt-12 md:mt-8">
              <button
                className="bg-pink-800 text-white font-bold py-2 px-10 rounded-lg hover:bg-pink-900"
                onClick={handleSubmit}
              >
                Submit
              </button>
          </div>
        </div>  
      </div>
      <ContactBox />
    </div>
  );
}