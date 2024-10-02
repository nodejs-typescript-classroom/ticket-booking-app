import { TicketResponse, Ticket, TicketListResponse } from '@/types/ticket';
import { Api } from './api';
import { ApiResponse } from '@/types/api';

async function createOne(eventId: string, userId: string): Promise<TicketResponse> {
  return Api.post('/tickets', { eventId, userId, ticketNumber: 1});
}
async function getOne(ticketId: string): Promise<ApiResponse<{ticket: Ticket, qrcode: string}>> {
  return Api.get(`/tickets/${ticketId}`);
}
async function getAll(userId: string): Promise<TicketListResponse> {
  return Api.get(`/tickets?userId=${userId}`);
}
async function validateOne(ticketId: string, userId: string): Promise<TicketResponse> {
  return Api.patch('/tickets', {id: ticketId, userId: userId });
}
const ticketService = {
  createOne,
  getOne,
  getAll,
  validateOne
}

export { ticketService }