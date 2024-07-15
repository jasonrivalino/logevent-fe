// app/utils/productApi.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const readAllProduct = async () => {
  try {
    const response = await axios.get(`${API_URL}/products/read`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
};

export const readProductById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/products/read/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch product');
  }
};

export const createProduct = async (productData: {
  vendorId: number;
  name: string;
  specification: string;
  category: string;
  price: number;
  description: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/products/create`, productData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create product');
  }
};

export const updateProduct = async (id: number, productData: {
  vendorId?: number;
  name?: string;
  specification?: string;
  category?: string;
  price?: number;
  description?: string;
}) => {
  try {
    const response = await axios.put(`${API_URL}/products/update/${id}`, productData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update product');
  }
};

export const deleteProduct = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/products/delete/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete product');
  }
};