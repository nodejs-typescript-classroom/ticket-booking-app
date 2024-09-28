import { AuthResponse, RegisterResponse } from '@/types/user';
import { Api } from './api';
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

const userService = {
  login,
  register
}
export { userService };