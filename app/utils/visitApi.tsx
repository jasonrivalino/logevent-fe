// app/utils/visitApi.tsx

// dependency modules
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const readPastWeekVisits = async () => {
  try {
    const response = await axios.get(`${API_URL}/visits/read/past-week`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch visits');
  }
};

export const createVisit = async (visitData: {
  userId: number | null;
  productId: number | null;
}) => {
  try {
    const response = await axios.post(`${API_URL}/visits/create`, visitData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create visit');
  }
};
