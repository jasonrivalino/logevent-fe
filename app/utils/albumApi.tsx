// app/utils/albumApi.tsx

// dependency modules
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const readAlbumsByProductId = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/albums/read/product/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch product albums');
  }
};