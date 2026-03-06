// 通知管理工具
import { message } from 'antd';
import dayjs from 'dayjs';
import type { Schedule } from '@/api';

// 存储所有定时器
const notificationTimers: Map<number, any> = new Map();

/**
 * 检查浏览器是否支持通知
 */
export const checkNotificationPermission = (): boolean => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }
  return Notification.permission === 'granted';
};

/**
 * 请求通知权限
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

/**
 * 发送通知
 */
export const sendNotification = (title: string, body: string): void => {
  if (checkNotificationPermission()) {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
    });
  } else {
    // 如果没有通知权限，使用Ant Design的message
    message.info({
      content: `${title}: ${body}`,
      duration: 5,
    });
  }
};

/**
 * 为日程设置提醒
 */
export const setScheduleReminder = (schedule: Schedule): void => {
  // 清除已存在的定时器
  if (notificationTimers.has(schedule.id)) {
    clearTimeout(notificationTimers.get(schedule.id)!);
  }

  const startTime = dayjs(schedule.start_time);
  const reminderTime = startTime.subtract(5, 'minute');
  const now = dayjs();

  // 如果提醒时间已过，不设置定时器
  if (reminderTime.isBefore(now)) {
    return;
  }

  // 计算延迟时间（毫秒）
  const delay = reminderTime.diff(now);

  // 设置定时器
  const timer = setTimeout(() => {
    sendNotification('日程提醒', `您的日程 "${schedule.title}" 将在5分钟后开始`);
    notificationTimers.delete(schedule.id);
  }, delay);

  notificationTimers.set(schedule.id, timer);
};

/**
 * 为多个日程设置提醒
 */
export const setScheduleReminders = (schedules: Schedule[]): void => {
  // 清除所有现有定时器
  clearAllReminders();

  // 为每个日程设置提醒
  schedules.forEach(schedule => {
    setScheduleReminder(schedule);
  });
};

/**
 * 清除所有提醒
 */
export const clearAllReminders = (): void => {
  notificationTimers.forEach(timer => {
    clearTimeout(timer);
  });
  notificationTimers.clear();
};

/**
 * 移除特定日程的提醒
 */
export const removeScheduleReminder = (scheduleId: number): void => {
  if (notificationTimers.has(scheduleId)) {
    clearTimeout(notificationTimers.get(scheduleId)!);
    notificationTimers.delete(scheduleId);
  }
};