// app/utils/itemApi.tsx

// dependency modules
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const readItemsByCartId = async (cartId: number) => {
  try {
    const response = await axios.get(`${API_URL}/items/read/${cartId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch items');
  }
}