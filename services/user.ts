import { AuthResponse, RegisterResponse } from '@/types/user';
import { Api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
type Credentials = {
  email: string
  password: string
}
async function login(credentials: Credentials): Promise<AuthResponse> {
  return Api.post('/auth/login', credentials);
}

async function register(credentials: Credentials): Promise<RegisterResponse> {
  return Api.post('/auth/register', credentials)
}
async function refresh(): Promise<AuthResponse> {
  const refreshToken = await AsyncStorage.getItem('refresh_token');
  await AsyncStorage.setItem('access_token', refreshToken?? '');
  return Api.post('/auth/refresh');
}
const userService = {
  login,
  register,
  refresh
}
export { userService };