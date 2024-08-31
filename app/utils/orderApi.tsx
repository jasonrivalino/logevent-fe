// app/utils/orderApi.tsx

// dependency modules
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const readAllOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/orders/read`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch orders');
  }
};

export const readPastTwoMonthOrders = async (chosenDate: Date) => {
  try {
    const response = await axios.get(`${API_URL}/orders/read/past-two-month/${chosenDate}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch orders');
  }
};

export const readOrdersByUserId = async (userId: number) => {
  try {
    const response = await axios.get(`${API_URL}/orders/read/user/${userId}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch orders');
  }
};

export const readOrderAvailabilityByCartId = async (cartId: number) => {
  try {
    const response = await axios.get(`${API_URL}/orders/read/availability/${cartId}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch order availability');
  }
};

export const readOrderById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/orders/read/${id}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch order');
  }
};

export const createOrder = async (orderData: {
  cartId: number;
  name: string;
  phone: string;  
  address: string;
  notes: string | null;
  startDateString: string;
  endDateString: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/orders/create`, orderData, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create order');
  }
};

export const updateOrder = async (id: number, orderData: {
  productId?: number;
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  usageDate?: Date;
  orderDate?: Date;
  orderImage?: string;
}) => {
  try {
    const response = await axios.put(`${API_URL}/orders/update/${id}`, orderData, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update order');
  }
};

export const confirmOrderPayment = async (id: number) => {
  try {
    const response = await axios.put(`${API_URL}/orders/confirm-payment/${id}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to confirm order payment');
  }
};

export const cancelOrder = async (id: number, cancelMessage: string) => {
  try {
    const response = await axios.put(`${API_URL}/orders/cancel/${id}`, {
      cancelMessage,
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to cancel order');
  }
};

export const deleteOrder = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/orders/delete/${id}`, {
      withCredentials: true
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete order');
  }
};
