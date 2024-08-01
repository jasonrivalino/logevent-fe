// app/utils/bundleApi.tsx

// dependency modules
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const readBundlesByEventId = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/bundles/read/event/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch event bundles');
  }
};