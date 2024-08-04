// app/utils/itemApi.tsx

// dependency modules
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const readEventItemsByCartId = async (cartId: number) => {
  try {
    const response = await axios.get(`${API_URL}/items/read/event/${cartId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch event items');
  }
}

export const readProductItemsByCartId = async (cartId: number) => {
  try {
    const response = await axios.get(`${API_URL}/items/read/product/${cartId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch product items');
  }
}

export const readItemById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/items/read/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch item');
  }
};