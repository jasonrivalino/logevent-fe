// app/utils/bundleApi.tsx

// dependency modules
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const readBundlesByEventId = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/bundles/read/event/${id}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch event bundles');
  }
};

export const createBundle = async (bundleData: {
  eventId: number;
  productId: number;
}) => {
  try {
    const response = await axios.post(`${API_URL}/bundles/create`, bundleData, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create bundle');
  }
};

export const deleteBundle = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/bundles/delete/${id}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete bundle');
  }
};
