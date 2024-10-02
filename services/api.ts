import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { Platform } from 'react-native';

const url = Platform.OS === 'android' ? 'https://55ff-2001-b400-e240-2ac4-5fa-a26c-8c43-5580.ngrok-free.app':'http://127.0.0.1:3000';

const Api: AxiosInstance = axios.create({baseURL: url });
Api.interceptors.request.use(async config =>{
  const token = await AsyncStorage.getItem('access_token');
  if (token) config.headers.set('Authorization', token);
  return config;
});

Api.interceptors.response.use(
  async (res: AxiosResponse) => res.data,
  async (err: AxiosError<{statusCode: number, message: string, error: string}, any>) => {
    return Promise.reject(err.response?.data)
  }
);

export {Api};