import axios from 'axios';
import { API_URL } from './config';

export const registerEtudiant = async (data) => {
  return await axios.post(`${API_URL}/auth/register`, data);
};

export const login = async (email, mdps) => {
  return await axios.post(`${API_URL}/auth/login`, { email, mdps });
};
