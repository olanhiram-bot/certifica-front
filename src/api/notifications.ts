import type { AxiosResponse } from 'axios'
import httpClient from '@/api/http'
import type {
  NotificationsTopResponse,
  NotificationsPaginatedResponse,
} from '@/interfaces/Notification'

export const getNotificationsTop = (): Promise<AxiosResponse<NotificationsTopResponse>> =>
  httpClient.get('/notifications')

export const getNotificationsPaginated = (
  page: number,
): Promise<AxiosResponse<NotificationsPaginatedResponse>> =>
  httpClient.get('/notifications', { params: { page } })

export const markAsRead = (id: number): Promise<AxiosResponse<{ message: string }>> =>
  httpClient.put(`/notifications/${id}/read`)

export const markAllAsRead = (): Promise<AxiosResponse<{ message: string }>> =>
  httpClient.put('/notification-all-read')

export const markAllAsViewed = (): Promise<AxiosResponse<{ message: string }>> =>
  httpClient.put('/notifications-all-viewed')
