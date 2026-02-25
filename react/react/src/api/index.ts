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
  // 获取日程列表，支持分页和多条件查询
  // - page (可选)：页码，默认值为 1
  // - per_page (可选)：每页数量，默认值为 10
  // - status (可选)：状态过滤，可选值： pending 、 in_progress 、 completed
  // - priority (可选)：优先级过滤，可选值： high 、 medium 、 low
  // - title (可选)：标题模糊查询，支持包含匹配
  getSchedules: (params?: { page?: number; per_page?: number; status?: string; priority?: string; title?: string }) =>
    request.get<{ schedules: Schedule[]; total: number; pages: number; current_page: number }>('/schedules', { params }),
  
  // 获取单个日程的详细信息
  // id (必填)：日程的唯一标识符
  getSchedule: (id: number) =>
    request.get<{ schedule: Schedule }>(`/schedules/${id}`),
  
  // 创建日程
  // data: CreateScheduleRequest (必填)：日程创建数据对象
  createSchedule: (data: CreateScheduleRequest) =>
    request.post<{ message: string; schedule: Schedule }>('/schedules', data),
  
  // 更新日程
  // - id: number (必填)：要更新的日程ID
  // - data: UpdateScheduleRequest (必填)：更新的日程数据对象
  updateSchedule: (id: number, data: UpdateScheduleRequest) =>
    request.put<{ message: string; schedule: Schedule }>(`/schedules/${id}`, data),
  
  // 删除日程
  // id: number (必填)：要删除的日程ID
  deleteSchedule: (id: number) =>
    request.delete<{ message: string }>(`/schedules/${id}`),
};