'use client';

import React from "react";
import { useRouter } from 'next/navigation';
import { ContactBox } from "@/app/page";

export default function ReviewPesanan() {
    const router = useRouter();

    const invoiceItems = [
        {
          product: "Katering Bu Daffa",
          description: "Logistik Vendor - katering",
          unitPrice: 25000,
          quantity: 25,
          totalPrice: 625000,
        },
        {
          product: "Gedung Sabuga ITB",
          description: "Logistik Vendor - Gedung",
          unitPrice: 5000000,
          quantity: 1,
          totalPrice: 5000000,
        },
        {
          product: "Jasa Event Organizer",
          description: "Event Organizer",
          unitPrice: 3000000,
          quantity: 1,
          totalPrice: 3000000,
        },
        {
          product: "Ulang Tahun Minimalis",
          description: "Paket Event - Ulang Tahun",
          unitPrice: 25000000,
          quantity: 1,
          totalPrice: 25000000,
        },
      ];

    const handleBackClick = () => {
        router.push('/isi-pemesanan');
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
                    <p>Nama Lengkap : Vendor A</p>
                    <p>Nomor Whatsapp : 0812345678967</p>
                    <p>Email : satria@gmail.com</p>
                    <p>Alamat : Bandung, Bandung</p>
                    <p>Tanggal mulai acara : 3/9/2024</p>
                    <p>Tanggal berakhir acara : 5/9/2024</p>
                    <p>Catatan untuk vendor :</p>
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
                    {invoiceItems.map((item, index) => (
                    <tr key={index}>
                        <td className="p-1 md:p-4 text-center text-xs md:text-base">
                            <strong>{item.product}</strong> <br/>
                            <span className="text-xs md:text-sm text-black">{item.description}</span>
                        </td>                        
                        <td className="p-1 md:p-4 text-center text-xs md:text-base">Rp {item.unitPrice.toLocaleString('id-ID')}</td>
                        <td className="p-1 md:p-4 text-center text-xs md:text-base">{item.quantity}</td>
                        <td className="p-1 md:p-4 text-center text-xs md:text-base">Rp {item.totalPrice.toLocaleString('id-ID')}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
  
            {/* Payment Info */}
            <div className="mb-8 text-xs md:text-base">
                <p><strong>Payment Info:</strong></p>
                <p>Account No: 102470393708</p>
                <p>A.C Name: Satria Octavianus Nababan</p>
                <p>Bank Details: Bank Jago</p>
            </div>
  
            {/* Total Payment */}
            <div className="text-right text-xs md:text-base">
                <p>Sub Total: <strong>Rp 33.625.000</strong></p>
                <p>Biaya Layanan: <strong>1.75%</strong></p>
                <p className="text-sm md:text-lg font-bold">Total Pembayaran: Rp 39.509.375</p>
            </div>

            {/* Add submit button */}
            <div className="flex justify-center mt-12 md:mt-8">
                <button className="bg-pink-800 text-white font-bold py-2 px-10 rounded-lg hover:bg-pink-900" onClick={() => router.push('/isi-pemesanan/complete')}>Submit</button>
            </div>
          </div>  
        </div>
        <ContactBox />
      </div>
    );
  }