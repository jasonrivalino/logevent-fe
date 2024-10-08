// app/utils/types.tsx

export interface Admin {
  id: number;
  email: string;
}

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
  fee: number;
  type: string;
}

export interface City {
  id: number;
  name: string;
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
  categoryName: string;
  categoryFee: number;
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
  id: number;
  vendorId: number;
  vendorName: string;
  vendorPhone: string;
  vendorAddress: string;
  cityId: number;
  cityName: string;
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
  categoryName: string;
  categoryFee: number;
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

export interface Setting {
  id: number;
  description: string | null;
  youtubeUrl: string | null;
  vendorCount: number;
  productCount: number;
  orderCount: number;
}

export interface Vendor {
  id: number;
  cityId: number;
  cityName: string;
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

export interface EventWishlist {
  id: number;
  userId: number;
  eventId: number;
  eventName: string;
  eventPrice: number;
  eventDescription: string | null;
  eventImage: string | null;
  eventBundles: string | null;
  eventRating: number;
}

export interface ProductWishlist {
  id: number;
  userId: number;
  productId: number;
  productName: string;
  productSpecification: string;
  productRate: string;
  productPrice: number;
  productImage: string | null;
  productRating: number;
  vendorId: number;
  vendorAddress: string;
}