import { DeleteEventResponse, EventListResponse, EventResponse } from '@/types/event';
import { Api } from './api';

async function createOne(name: string, location: string, date: string): Promise<EventResponse> {
  return Api.post('/events', {
    name: name,
    location: location,
    date: date
  });
}
async function getOne(eventId: string): Promise<EventResponse> {
  return Api.get(`/events/${eventId}`);
}
async function getAll(): Promise<EventListResponse> {
  return Api.get(`/events`);
}
async function updateOne(id: string, name: string, location: string, date: string): Promise<EventResponse> {
  return Api.patch(`/events/${id}`, { name, location, date});
}
async function deleteOne(id: string): Promise<DeleteEventResponse> {
  return Api.delete(`/events/${id}`);
} 
const eventService = {
  createOne,
  getOne,
  getAll,
  updateOne,
  deleteOne,
}

export { eventService }