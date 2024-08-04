// app/utils/reviewApi.tsx

// dependency modules
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const readReviewsByEventId = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/reviews/read/event/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch event reviews');
  }
}

export const readReviewsByProductId = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/reviews/read/product/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch product reviews');
  }
};

export const createReview = async (reviewData: {
  itemId: number;
  rating: number;
  comment: string | null;
  tag: string | null;
}) => {
  try {
    const response = await axios.post(`${API_URL}/reviews/create`, reviewData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create review');
  }
};