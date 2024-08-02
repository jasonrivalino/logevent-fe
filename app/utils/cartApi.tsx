// app/utils/cartApi.tsx

// dependency modules
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const readCartsByUserId = async (userId: number) => {
  try {
    const response = await axios.get(`${API_URL}/carts/read/user/${userId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || `Failed to fetch carts for user ${userId}`);
  }
};