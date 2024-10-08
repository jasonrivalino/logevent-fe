// app/utils/productApi.tsx

// dependency modules
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const readAllProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products/read`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
};

export const readTopProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products/read/top`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch top products');
  }
};

export const readAdminProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products/read/admin`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch admin products');
  }
};

export const readProductsByVendorId = async (vendorId: number) => {
  try {
    const response = await axios.get(`${API_URL}/products/read/vendor/${vendorId}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
};

export const readProductById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/products/read/${id}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch product');
  }
};

export const createProduct = async (productData: {
  vendorId: number;
  categoryId: number;
  name: string;
  specification: string;
  rate: string;
  price: number;
  capacity: number | null;
  description: string | null;
  productImage: string | null;
}) => {
  try {
    const response = await axios.post(`${API_URL}/products/create`, productData, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create product');
  }
};

export const updateProduct = async (id: number, productData: {
  vendorId?: number;
  categoryId?: number;
  name?: string;
  specification?: string;
  rate?: string;
  price?: number;
  capacity?: number | null;
  description?: string | null;
  productImage?: string | null;
}) => {
  try {
    const response = await axios.put(`${API_URL}/products/update/${id}`, productData, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update product');
  }
};

export const deleteProduct = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/products/delete/${id}`, {
      withCredentials: true
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete product');
  }
};
