import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { Platform } from 'react-native';

const url = Platform.OS === 'android' ? 'http://10.0.2.2:3000':'http://127.0.0.1:3000';

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