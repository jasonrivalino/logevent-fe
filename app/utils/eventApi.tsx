// app/utils/eventApi.tsx

// dependency modules
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const readAllEvents = async () => {
  try {
    const response = await axios.get(`${API_URL}/events/read`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch events');
  }
};

export const readEventById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/events/read/${id}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch event');
  }
};

export const createEvent = async (eventData: {
  categoryId: number;
  name: string;
  price: number;
  capacity: number | null;
  description: string | null;
  eventImage: string | null;
}) => {
  try {
    const response = await axios.post(`${API_URL}/events/create`, eventData, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create event');
  }
};

export const updateEvent = async (id: number, eventData: {
  categoryId?: number;
  name?: string;
  price?: number;
  capacity?: number | null;
  description?: string | null;
  eventImage?: string | null;
}) => {
  try {
    const response = await axios.put(`${API_URL}/events/update/${id}`, eventData, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update event');
  }
};

export const deleteEvent = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/events/delete/${id}`, {
      withCredentials: true
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete event');
  }
};
