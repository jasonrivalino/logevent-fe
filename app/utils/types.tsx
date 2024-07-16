// app/utils/types.tsx

interface Event {
  id: number;
  name: string;
  type: string;
  location: string;
  price: number;
  rate: number;
  image: string;
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
  rating?: number;
  reviewCount: number;
}

interface Review {
  id: number;
  orderId: number;
  rating: number;
  comment: string;
  reviewDate: string;
}

export type { Event, Product, Review };