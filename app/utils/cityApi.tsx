// app/utils/cityApi.tsx

// dependency modules
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const readAllCities = async () => {
  try {
    const response = await axios.get(`${API_URL}/cities/read`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch cities');
  }
};

export const createCity = async (cityData: {
  name: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/cities/create`, cityData, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create city');
  }
};

export const updateCity = async (cityId: number, cityData: {
  name?: string;
}) => {
  try {
    const response = await axios.put(`${API_URL}/cities/update/${cityId}`, cityData, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update city');
  }
};

export const deleteCity = async (cityId: number) => {
  try {
    const response = await axios.delete(`${API_URL}/cities/delete/${cityId}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete city');
  }
};