import axios from 'axios';
import { angrok_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const registerEtudiant = async (data) => {
  return await axios.post(`${angrok_URL}/register`, data);
};

export const login = (email, mdps) => {
  return axios.post(`${angrok_URL}/login`, { email, mdps });
};

export const saveToken = async (token) => {
  await AsyncStorage.setItem('token', token);
};

export const getProfile = async () => {
  const token = await AsyncStorage.getItem('token');
  return axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};