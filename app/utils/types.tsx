// app/utils/types.tsx

interface Album {
  id: number;
  productId: number;
  albumImage?: string;
}

interface Event {
  id: number;
  name: string;
  type: string;
  location: string;
  price: number;
  rate: number;
  image: string;
}

interface Order {
  id: number;
  userId: number;
  userEmail: string;
  userName: string;
  userPhone: string;
  address: string;
  startDate: string;
  endDate: string;
  orderDate: string;
  orderStatus: string;
}

interface Product {
  id: number;
  vendorId: number;
  vendorAddress: string;
  name: string;
  specification: string;
  category: string;
  price: number;
  description?: string;
  productImage?: string;
  rating: number;
  reviewCount: number;
}

interface Review {
  id: number;
  productId: number;
  orderId: number;
  userName: string;
  userPicture?: string;
  reviewRating: number;
  reviewComment: string;
  reviewDate: string;
}

export type { Album, Event, Order, Product, Review };