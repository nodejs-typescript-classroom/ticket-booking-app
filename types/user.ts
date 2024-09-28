import { ApiResponse } from './api';

export enum UserRole {
  Admin = 'admin',
  Attendee = 'attendee'
}
export type AuthResponse = ApiResponse<{user: User, access_token: string, refresh_token: string}>;
export type RegisterResponse = ApiResponse<{id: string}>;
export type User = {
  id: number
  email: string
  role: UserRole
  createdAt: string
  updatedAt: string
}