// app/utils/vendorApi.tsx

// dependency modules
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const readAllVendors = async () => {
  try {
    const response = await axios.get(`${API_URL}/vendors/read`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch vendors');
  }
};

export const readVendorById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/vendors/read/${id}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch vendor');
  }
};

export const createVendor = async (vendorData: {
  cityId: number;
  email: string;
  name: string;
  phone: string;
  address: string;
  instagram: string | null;
  socialMedia: string | null;
  documentUrl: string | null;
}) => {
  try {
    const response = await axios.post(`${API_URL}/vendors/create`, vendorData, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create vendor');
  }
};

export const updateVendor = async (id: number, vendorData: {
  cityId?: number;
  email?: string;
  name?: string;
  phone?: string;
  address?: string;
  instagram?: string | null;
  socialMedia?: string | null;
  documentUrl?: string | null;
}) => {
  try {
    const response = await axios.put(`${API_URL}/vendors/update/${id}`, vendorData, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update vendor');
  }
};

export const deleteVendor = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/vendors/delete/${id}`, {
      withCredentials: true
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete vendor');
  }
};
