// app/utils/types.tsx

export interface Album {
  id: number;
  eventId: number | null;
  productId: number | null;
  albumImage: string | null;
}

export interface Bundle {
  id: number;
  eventId: number;
  productId: number;
}

export interface Cart {
  id: number;
  userId: number;
  type: string;
  cartDate: string;
  cartStatus: string;
}

export interface Category {
  id: number;
  name: string;
  type: string;
}

export interface Event {
  id: number;
  categoryId: number;
  categoryName: string;
  name: string;
  rate: string;
  price: number;
  capacity: number | null;
  description: string | null;
  eventImage: string | null;
  isDeleted: boolean;
  bundles: string | null;
  rating: number;
  reviewCount: number;
}

export interface EventItem {
  id: number;
  cartId: number;
  eventId: number;
  eventName: string;
  eventPrice: number;
  eventDescription: string | null;
  eventImage: string | null;
  eventBundles: string | null;
  eventRating: number;
  isReviewed: boolean;
};

export interface Faq {
  id: number;
  question: string;
  answer: string;
}

export interface Item {
  id: number;
  cartId: number;
  eventId: number | null;
  productId: number | null;
  duration: number | null;
  quantity: number | null;
}

export interface Order {
  id: number;
  cartId: number;
  cartType: string;
  userId: number;
  userEmail: string;
  userName: string;
  userPhone: string | null;
  name: string;
  phone: string;
  address: string;
  notes: string | null;
  startDate: string;
  endDate: string;
  orderDate: string;
  orderStatus: string | null;
  orderTotal: number;
}

export interface Product {
  date: any;
  id: number;
  vendorId: number;
  vendorName: string;
  vendorPhone: string;
  vendorAddress: string;
  categoryId: number;
  categoryName: string;
  name: string;
  specification: string;
  rate: string;
  price: number;
  capacity: number | null;
  description: string | null;
  productImage: string | null;
  isDeleted: boolean;
  rating: number;
  reviewCount: number;
}

export interface ProductItem {
  id: number;
  cartId: number;
  productId: number;
  productName: string;
  productSpecification: string;
  productPrice: number;
  productImage: string | null;
  productRating: number;
  vendorId: number;
  vendorAddress: string;
  duration: number | null;
  quantity: number | null;
  isReviewed: boolean;
};

export interface Review {
  id: number;
  itemId: number;
  eventId: number | null;
  productId: number | null;
  cartId: number;
  userId: number;
  userName: string;
  userPicture: string | null;
  rating: number;
  comment: string | null;
  tag: string | null;
  reviewDate: string;
}

export interface Vendor {
  id: number;
  email: string;
  name: string;
  phone: string;
  address: string;
  instagram: string | null;
  socialMedia: string | null;
  documentUrl: string | null;
  joinDate: string;
  isDeleted: boolean;
  productCount: number;
}

export interface Visit {
  id: number;
  ipAddress: string | null;
  visitDate: string;
}