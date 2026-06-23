export interface Notification {
  id: number
  user_id: number
  title: string | null
  description: string | null
  link: string | null
  is_read: boolean
  is_view: boolean
  created_at: string
  updated_at: string
  created_by: number | null
  updated_by: number | null
}

export interface NotificationsTopResponse {
  data: Notification[]
  unread: number
  unview: number
}

export interface NotificationsPaginatedMeta {
  current_page: number
  from: number | null
  last_page: number
  per_page: number
  to: number | null
  total: number
}

export interface NotificationsPaginatedResponse {
  data: Notification[]
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
  meta: NotificationsPaginatedMeta
  unread: number
  unview: number
}
