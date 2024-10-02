import { ApiResponse } from './api';
import { Event, PageInfo } from './event';
export type TicketResponse = ApiResponse<Ticket>;
export type TicketListResponse = ApiResponse<{tickets: Ticket[], pageInfo: PageInfo}>
export type Ticket = {
  id: string;
  eventId: string;
  event: Event
  entered: boolean
  createdAt: string
  updatedAt: string
}