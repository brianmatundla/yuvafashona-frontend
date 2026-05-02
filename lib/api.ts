import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = {
  test: async () => {
    const response = await axios.get(`${API_URL}/health`);
    return response.data;
  },
  getProducts: async () => {
    const response = await axios.get(`${API_URL}/api/products`);
    return response.data;
  }
};