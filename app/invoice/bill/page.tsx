import React from 'react';
import Image from 'next/image';
import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';

export default function BillInvoice() {
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

  return (
    <div className="max-w-2xl mx-auto p-10 bg-gradient-to-b from-pink-300 to-yellow-100 border border-gray-300 shadow-lg text-black font-sofia">
      <header className="flex justify-between items-center mb-8">
        <div>
          {/* Add Logevent logo */}
          <Image src="/Image/logo2.png" alt="Logevent Logo" width={100} height={100} className="mb-2 cursor-pointer"/>
        </div>
        {/* <div className="text-right">
          <p>Invoice No : <strong>3</strong></p>
          <p>Date : <strong>08/03/2021 19:30</strong></p>
        </div> */}
      </header>
      
      <section className="mb-8">
        <p><strong>Tagihan Kepada:</strong> Emely River</p>
        <p className="text-sm">District Solnechny st. Rainbow, house 7, Location</p>
      </section>
      
      <div className="-mx-10">
        <table className="w-full text-left border-collapse mb-8">
          <thead>
            <tr className="border-t-2 border-b-2 border-black">
              {/* Make table aligned center */}
              <th className="p-4 text-center">INFO PRODUK</th>
              <th className="p-4 text-center">HARGA SATUAN</th>
              <th className="p-4 text-center">JUMLAH</th>
              <th className="p-4 text-center">TOTAL HARGA</th>
            </tr>
          </thead>
          <tbody>
            {invoiceItems.map((item, index) => (
              <tr key={index}>
                <td className="p-2 text-center">{item.product} <br/><span className="text-sm text-black">{item.description}</span></td>
                <td className="p-2 text-center">Rp {item.unitPrice.toLocaleString()}</td>
                <td className="p-2 text-center">{item.quantity}</td>
                <td className="p-2 text-center">Rp {item.totalPrice.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mb-8">
        <p><strong>Payment Info:</strong></p>
        <p>Account No: 102470393708</p>
        <p>A.C Name: Satria Octavianus Nababan</p>
        <p>Bank Details: Bank Jago</p>
      </div>
      
      <div className="text-right">
        <p>Sub Total: <strong>Rp 33.625.000</strong></p>
        <p>Biaya Layanan: <strong>1.75%</strong></p>
        <p className="text-lg font-bold">Total Pembayaran: Rp 39.509.375</p>
      </div>
      
      <footer className="mt-20 text-center text-sm text-gray-600">
          <div className='flex flex-row justify-center space-x-20'>
            <div className='flex flex-col items-center'>
                <FaPhoneAlt className='mb-2'/>
                <p>089520771715</p>
            </div>
            <div className='flex flex-col items-center'>
                <FaEnvelope className='mb-2'/>
                <p>www.logevent.com</p>
                <p>logevent.eo@gmail.com</p>
            </div>
            <div className='flex flex-col items-center'>
                <FaLocationDot className='mb-2'/>
                <p>Jl. Ganesha No. 10</p>
            </div>
          </div>
      </footer>
    </div>
  );
}