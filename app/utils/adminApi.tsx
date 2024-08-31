// app/utils/adminApi.tsx

// dependency modules
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const readAllAdmins = async () => {
  try {
    const response = await axios.get(`${API_URL}/admins/read`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch admins');
  }
};

export const createAdmin = async (adminData: {
  email: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/admins/create`, adminData, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create admin');
  }
};

export const updateAdmin = async (adminId: number, adminData: {
  email?: string;
}) => {
  try {
    const response = await axios.put(`${API_URL}/admins/update/${adminId}`, adminData, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update admin');
  }
};

export const deleteAdmin = async (adminId: number) => {
  try {
    const response = await axios.delete(`${API_URL}/admins/delete/${adminId}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete admin');
  }
};