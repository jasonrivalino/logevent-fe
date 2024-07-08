// app/utils/api.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface SignInResponse {
  token: string;
  message?: string;
}

export const getUserProfile = async (token: string) => {
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

export const signIn = async (email: string, password: string): Promise<SignInResponse> => {
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

export const signUp = async (name: string, email: string, password: string): Promise<SignInResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, { name, email, password }, {
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

export const googleSignIn = () => {
  window.location.href = `${API_URL}/auth/google`;
};
