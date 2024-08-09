// app/utils/faqApi.tsx

// dependency modules
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const readAllFaqs = async () => {
  try {
    const response = await axios.get(`${API_URL}/faqs/read`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch product albums');
  }
};

export const createFaq = async (faqData: any) => {
  try {
    const response = await axios.post(`${API_URL}/faqs/create`, faqData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create the faq');
  }
};

export const updateFaq = async (faqId: number, faqData: any) => {
  try {
    const response = await axios.put(`${API_URL}/faqs/update/${faqId}`, faqData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update the faq');
  }
};

export const deleteFaq = async (faqId: number) => {
  try {
    const response = await axios.delete(`${API_URL}/faqs/delete/${faqId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete the faq');
  }
};