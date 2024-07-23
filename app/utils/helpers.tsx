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

export const generateGoogleMapsUrl = (address: string) => {
  const encodedAddress = encodeURIComponent(address);
  return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
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

export const getOrderCountsToday = (orders: Order[]) => {
  const currentDate = new Date();
  const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  let count = 0;

  orders.forEach(order => {
      const orderDate = new Date(order.orderDate);
      if (orderDate >= today) {
          count++;
      }
  });

  return count;
};

export const getOrderCountsWeekly = (orders: Order[]) => {
  const currentDate = new Date();
  const past30Days = new Date(currentDate.getTime() - (30 * 24 * 60 * 60 * 1000));
  const weeks = [0, 0, 0, 0, 0];

  orders.forEach(order => {
      const orderDate = new Date(order.orderDate);
      if (orderDate >= past30Days) {
          const weekIndex = Math.floor((currentDate.getTime() - orderDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
          if (weekIndex < 5) {
              weeks[4 - weekIndex]++;
          }
      }
  });

  return weeks;
};

export const getVisitCountsToday = (visits: Visit[]) => {
  const currentDate = new Date();
  const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  let count = 0;

  visits.forEach(visit => {
      const visitDate = new Date(visit.visitDate);
      if (visitDate >= today) {
          count++;
      }
  });

  return count;
};

export const getVisitCountsWeekly = (visits: Visit[]) => {
  const currentDate = new Date();
  const past30Days = new Date(currentDate.getTime() - (30 * 24 * 60 * 60 * 1000));
  const weeks = [0, 0, 0, 0, 0];

  visits.forEach(visit => {
      const visitDate = new Date(visit.visitDate);
      if (visitDate >= past30Days) {
          const weekIndex = Math.floor((currentDate.getTime() - visitDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
          if (weekIndex < 5) {
              weeks[4 - weekIndex]++;
          }
      }
  });

  return weeks;
};