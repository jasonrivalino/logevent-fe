// app/utils/settingApi.tsx

// dependency modules
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const readLatestSettings = async () => {
  try {
    const response = await axios.get(`${API_URL}/settings/read`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch latest settings');
  }
};

export const updateSetting = async (settingData: {
  description?: string;
  youtubeUrl?: string;
  vendorCount?: number;
  productCount?: number;
  orderCount?: number;
}) => {
  try {
    const response = await axios.put(`${API_URL}/settings/update`, 
      settingData, 
      {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update setting');
  }
};
