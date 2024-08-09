// app/utils/albumApi.tsx

// dependency modules
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const readProductCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories/read/product`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch product categories');
  }
};

export const readEventCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories/read/event`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch event categories');
  }
};