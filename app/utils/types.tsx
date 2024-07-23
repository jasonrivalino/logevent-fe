// app/utils/types.tsx

export interface Album {
  id: number;
  productId: number;
  albumImage?: string;
}

export interface Event {
  id: number;
  name: string;
  description: string;
  type: string;
  image: string;
  rate: number;
  location: string;
  price: number;
  listProduct: string[];
}

export interface Order {
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

export interface Product {
  id: number;
  vendorId: number;
  vendorPhone: string;
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

export interface Review {
  id: number;
  productId: number;
  orderId: number;
  userName: string;
  userPicture?: string;
  reviewRating: number;
  reviewComment: string;
  reviewDate: string;
}

export interface Vendor {
  id: number;
  email: string;
  name: string;
  phone: string;
  address: string;
  joined: string;
  instagram?: string;
  facebook?: string;
  socialMedia?: string;
  MoU?: string;
  other?: string;
  picture?: string;
  productCount: number;
}