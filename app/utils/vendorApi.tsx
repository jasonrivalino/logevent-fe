// app/utils/vendorApi.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const readAllVendor = async () => {
  try {
    const response = await axios.get(`${API_URL}/vendors/read`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch vendors');
  }
};

export const readVendorById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/vendors/read/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch vendor');
  }
};

export const createVendor = async (vendorData: {
  name: string;
  phone: string;
  address: string;
  picture: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/vendors/create`, vendorData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create vendor');
  }
};

export const updateVendor = async (id: number, vendorData: {
  name?: string;
  phone?: string;
  address?: string;
  picture?: string;
}) => {
  try {
    const response = await axios.put(`${API_URL}/vendors/update/${id}`, vendorData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update vendor');
  }
};

export const deleteVendor = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/vendors/delete/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete vendor');
  }
};
