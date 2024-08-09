// app/utils/albumApi.tsx

// dependency modules
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const readAlbumsByProductId = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/albums/read/product/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch product albums');
  }
};

export const readAlbumsByEventId = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/albums/read/event/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch event albums');
  }
};

export const createAlbum = async (albumImage: string, eventId: number | null, productId: number | null) => {
  try {
    const response = await axios.post(`${API_URL}/albums/create`, 
      { albumImage, eventId, productId }, 
      {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create album');
  }
};

export const updateAlbum = async (id: number, albumImage: string) => {
  try {
    const response = await axios.put(`${API_URL}/albums/update/${id}`, 
      { albumImage }, 
      {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update album');
  }
};

export const deleteAlbum = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/albums/delete/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete album');
  }
};
