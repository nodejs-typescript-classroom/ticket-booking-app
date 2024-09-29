import { ApiResponse } from './api';

export type EventResponse = ApiResponse<Event>;
export type EventListResponse = ApiResponse<{events: Event[], pageInfo: PageInfo}>;
export type DeleteEventResponse = ApiResponse<{id: string}>;
export type Event = {
  id: string
  name: string
  location: string
  totalTicketsPurchased: number
  totalTicketsEntered: number
  startDate: string
  createdAt: string
  updatedAt: string
}
export type PageInfo = {
  total: number
  offset: number
  limit: number
}