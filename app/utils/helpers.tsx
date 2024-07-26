// app/utils/helpers.tsx

// self-defined modules
import { Order, Visit } from '@/app/utils/types';

export const convertDate = (date: string) => {
  return new Date(date).toLocaleDateString('id-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

export const generateEmailUrl = (email: string) => {
  return `mailto:${email}`;
};

export const generateGoogleMapsUrl = (address: string) => {
  const encodedAddress = encodeURIComponent(address);
  return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
};

export const generateInstagramUrl = (username: string) => {
  return `https://www.instagram.com/${username}`;
};

export const generateWhatsAppUrl = (phone: string) => {
  const encodedPhone = phone.replace(/\D/g, '');
  return `https://wa.me/${encodedPhone}`;
};

export const getStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStars = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;

  const starStyle = {
    color: 'gold',
    fontSize: '1rem',
  };

  const starEmptyStyle = {
    color: 'lightgray',
    fontSize: '1rem',
  };

  return (
    <>
      {Array(fullStars)
        .fill(0)
        .map((_, index) => (
          <span key={`full-${index}`} style={starStyle}>&#9733;</span>
        ))}
      {Array(halfStars)
        .fill(0)
        .map((_, index) => (
          <span key={`half-${index}`} style={starStyle}>&#9733;</span>
        ))}
      {Array(emptyStars)
        .fill(0)
        .map((_, index) => (
          <span key={`empty-${index}`} style={starEmptyStyle}>&#9733;</span>
        ))}
    </>
  );
};

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const getVisitToday = (visits: Visit[], chosenDate: Date) => {
  const today = startOfDay(chosenDate);
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

  return visits.filter(visit => {
    const visitDate = new Date(visit.visitDate);
    return visitDate >= today && visitDate < tomorrow;
  }).length;
};

export const getVisitYesterday = (visits: Visit[], chosenDate: Date) => {
  const today = startOfDay(chosenDate);
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  return visits.filter(visit => {
    const visitDate = new Date(visit.visitDate);
    return visitDate >= yesterday && visitDate < today;
  }).length;
};

export const getVisitDaily = (visits: Visit[], chosenDate: Date) => {
  const pastWeek = new Date(startOfDay(chosenDate).getTime() - 6 * 24 * 60 * 60 * 1000);
  const days = Array(7).fill(0);

  visits.forEach(visit => {
    const visitDate = startOfDay(new Date(visit.visitDate));
    if (visitDate >= pastWeek) {
      const dayIndex = Math.floor((chosenDate.getTime() - visitDate.getTime()) / (24 * 60 * 60 * 1000));
      if (dayIndex < 7) {
        days[6 - dayIndex]++;
      }
    }
  });

  return days;
};

export const getOrderPastMonth = (orders: Order[], chosenDate: Date) => {
  const today = startOfDay(chosenDate);
  const pastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  return orders.filter(order => {
    const orderDate = new Date(order.orderDate);
    return orderDate >= pastMonth && orderDate < today;
  }).length;
};

export const getOrderPastTwoMonths = (orders: Order[], chosenDate: Date) => {
  const today = startOfDay(chosenDate);
  const pastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  const pastTwoMonths = new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000);
  return orders.filter(order => {
    const orderDate = new Date(order.orderDate);
    return orderDate >= pastTwoMonths && orderDate < pastMonth;
  }).length;
};

export const getOrderWeekly = (orders: Order[], chosenDate: Date) => {
  const today = startOfDay(chosenDate);
  const pastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  const weeks = [0, 0, 0, 0, 0];

  orders.forEach(order => {
    const orderDate = new Date(order.orderDate);
    if (orderDate >= pastMonth) {
      const dayDifference = Math.floor((today.getTime() - orderDate.getTime()) / (24 * 60 * 60 * 1000));
      const weekIndex = Math.floor(dayDifference / 7);
      if (weekIndex < 5) {
        weeks[4 - weekIndex]++;
      }
    }
  });

  return weeks;
};