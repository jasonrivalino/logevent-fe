// app/utils/itemApi.tsx
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const readReviewByProductId = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/items/read/review/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch product reviews');
  }
};