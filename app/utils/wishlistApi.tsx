// app/utils/albumApi.tsx

// dependency modules
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const readEventWishlistsByUserId = async (userId: number) => {
  try {
    const response = await axios.get(`${API_URL}/wishlists/read/event/${userId}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch event wishlists');
  }
};

export const readProductWishlistsByUserId = async (userId: number) => {
  try {
    const response = await axios.get(`${API_URL}/wishlists/read/product/${userId}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch product wishlists');
  }
};

export const createWishlist = async (userId: number, eventId: number | null, productId: number | null) => {
  try {
    const response = await axios.post(`${API_URL}/wishlists/create`, { userId, eventId, productId }, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create wishlist');
  }
};

export const deleteWishlist = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/wishlists/delete/${id}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete wishlist');
  }
};
