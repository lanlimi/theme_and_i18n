// d:\theme_and_i18n\theme_and_i18n\react\react\src\api\index.ts
import request from './request';

export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Schedule {
  id: number;
  user_id: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

export interface CreateScheduleRequest {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  priority?: 'high' | 'medium' | 'low';
  status?: 'pending' | 'in_progress' | 'completed';
}

export interface UpdateScheduleRequest {
  title?: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  priority?: 'high' | 'medium' | 'low';
  status?: 'pending' | 'in_progress' | 'completed';
}

export const authApi = {
  register: (data: RegisterRequest) => 
    request.post<{ message: string; user: User }>('/auth/register', data),
  
  login: (data: LoginRequest) => 
    request.post<{ message: string; token: string; user: User }>('/auth/login', data),
};

export const scheduleApi = {
  getSchedules: (params?: { page?: number; per_page?: number; status?: string; priority?: string }) =>
    request.get<{ schedules: Schedule[]; total: number; pages: number; current_page: number }>('/schedules', { params }),
  
  getSchedule: (id: number) =>
    request.get<{ schedule: Schedule }>(`/schedules/${id}`),
  
  createSchedule: (data: CreateScheduleRequest) =>
    request.post<{ message: string; schedule: Schedule }>('/schedules', data),
  
  updateSchedule: (id: number, data: UpdateScheduleRequest) =>
    request.put<{ message: string; schedule: Schedule }>(`/schedules/${id}`, data),
  
  deleteSchedule: (id: number) =>
    request.delete<{ message: string }>(`/schedules/${id}`),
};