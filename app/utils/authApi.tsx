// app/utils/authApi.tsx
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const readUserProfile = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user data');
  }
};

export const verifyEmail = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/auth/verify`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to verify email');
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signin`, { email, password }, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });  
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to sign in');
  }
};

export const signUp = async (email: string, password: string, name: string, phone: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, { email, password, name, phone }, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to sign up');
  }
};

export const resetPassword = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/reset-password`, { email }, {
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to reset password');
  }
}

export const updateUser = async (token: string, userData: { name?: string; email?: string; password?: string; picture?: string; isAdmin?: boolean }) => {
  try {
    const response = await axios.put(`${API_URL}/auth/update`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update user');
  }
};

export const googleSignIn = () => {
  window.location.href = `${API_URL}/auth/google`;
};
