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

export const readActiveEventCartByUserId = async (userId: number) => {
  try {
    const response = await axios.get(`${API_URL}/carts/read/event/${userId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || `Failed to fetch active event cart for user ${userId}`);
  }
};

export const readActiveProductCartByUserId = async (userId: number) => {
  try {
    const response = await axios.get(`${API_URL}/carts/read/product/${userId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || `Failed to fetch active product cart for user ${userId}`);
  }
};

export const createCart = async (userId: number, type: string) => {
  try {
    const response = await axios.post(`${API_URL}/carts/create`, { userId, type });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || `Failed to create cart for user ${userId}`);
  }
};