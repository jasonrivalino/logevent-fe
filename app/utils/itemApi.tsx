// app/utils/itemApi.tsx

// dependency modules
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const readEventItemsByCartId = async (cartId: number) => {
  try {
    const response = await axios.get(`${API_URL}/items/read/event/${cartId}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch event items');
  }
}

export const readProductItemsByCartId = async (cartId: number) => {
  try {
    const response = await axios.get(`${API_URL}/items/read/product/${cartId}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch product items');
  }
}

export const readItemById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/items/read/${id}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch item');
  }
};

export const createItem = async (itemData: {
  cartId: number;
  eventId: number | null;
  productId: number | null;
  duration: number | null;
  quantity: number | null;
}) => {
  try {
    const response = await axios.post(`${API_URL}/items/create`, itemData, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create item');
  }
};

export const deleteItemsByCartId = async (cartId: number) => {
  try {
    const response = await axios.delete(`${API_URL}/items/delete/cart/${cartId}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete cart items');
  }
};
