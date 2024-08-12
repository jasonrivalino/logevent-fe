// app/utils/helpers.tsx

// self-defined modules
import { Order, Visit } from '@/app/utils/types';

const isDateInRange = (date: Date, startDate: Date, endDate: Date) => {
  return date >= startDate && date <= endDate;
};

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const areDatesOverlapping = (startDate: Date, endDate: Date, bookedDates: Date[]) => {
  for (const date of bookedDates) {
    if (isDateInRange(date, startDate, endDate)) {
      return true;
    }
  }
  return false;
};

export const convertDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Jakarta',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  };

  return new Date(date).toLocaleDateString('id-GB', options);
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

export const generateWhatsAppUrl = (number: string, message: string) => {
  const encodedNumber = encodeURIComponent(number);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${encodedNumber}?text=${encodedMessage}`;
};

export const getExcludedDates = (bookedDates: string[]) => {
  if (!Array.isArray(bookedDates)) {
    return [];
  }

  const today = new Date();
  const pastDates = Array.from({ length: 365 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() - i);
    return date;
  });

  const bookedDateObjects = bookedDates.map(dateStr => new Date(dateStr));
  return [...pastDates, ...bookedDateObjects];
};

export const getRateText = (rate: string) => {
  switch (rate) {
    case "Daily":
      return "/ hari";
    case "Quantity":
      return "/ pcs";
    case "Hourly":
      return "/ jam";
    default:
      return "";
  }
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