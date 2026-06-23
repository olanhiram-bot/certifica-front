import { defineStore } from 'pinia'
import {
  getNotificationsTop,
  getNotificationsPaginated,
  markAsRead,
  markAllAsRead,
} from '@/api/notifications'
import type { Notification } from '@/interfaces/Notification'

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    // Top (dropdown) — sin paginación
    topNotifications:  [] as Notification[],
    unread:            0,
    unview:            0,
    loadingTop:        false,

    // Modal — paginadas con infinite scroll
    modalNotifications: [] as Notification[],
    currentPage:        1,
    lastPage:           1,
    loadingModal:       false,
    hasMore:            true,
  }),

  actions: {
    async fetchTop() {
      this.loadingTop = true
      try {
        const res = await getNotificationsTop()
        this.topNotifications = res.data.data.slice(0, 5)
        this.unread            = res.data.unread
        this.unview            = res.data.unview
      } finally {
        this.loadingTop = false
      }
    },

    async openModal() {
      // Reinicia estado modal y carga primera página
      this.modalNotifications = []
      this.currentPage        = 1
      this.lastPage           = 1
      this.hasMore            = true
      await this.fetchNextPage()
      // Marcar todas como leídas (y vistas) al abrir el modal
      if (this.unread > 0 || this.unview > 0) {
        await markAllAsRead()
        this.topNotifications.forEach(n   => { n.is_read = true; n.is_view = true })
        this.modalNotifications.forEach(n => { n.is_read = true; n.is_view = true })
        this.unread = 0
        this.unview = 0
      }
    },

    async fetchNextPage() {
      if (!this.hasMore || this.loadingModal) return
      this.loadingModal = true
      try {
        const res = await getNotificationsPaginated(this.currentPage)
        this.modalNotifications.push(...res.data.data)
        this.currentPage = res.data.meta.current_page + 1
        this.lastPage    = res.data.meta.last_page
        this.hasMore     = res.data.meta.current_page < res.data.meta.last_page
      } finally {
        this.loadingModal = false
      }
    },

    async doMarkAsRead(id: number) {
      await markAsRead(id)
      // Actualizar localmente
      const inTop   = this.topNotifications.find(n => n.id === id)
      const inModal = this.modalNotifications.find(n => n.id === id)
      const wasUnread = (inTop && !inTop.is_read)  || (!inTop && inModal && !inModal.is_read)
      const wasUnview = (inTop && !inTop.is_view)  || (!inTop && inModal && !inModal.is_view)
      if (inTop)   { inTop.is_read   = true; inTop.is_view   = true }
      if (inModal) { inModal.is_read = true; inModal.is_view = true }
      if (wasUnread) this.unread = Math.max(0, this.unread - 1)
      if (wasUnview) this.unview = Math.max(0, this.unview - 1)
    },

    async doMarkAllAsRead() {
      await markAllAsRead()
      this.topNotifications.forEach(n   => { n.is_read = true; n.is_view = true })
      this.modalNotifications.forEach(n => { n.is_read = true; n.is_view = true })
      this.unread = 0
      this.unview = 0
    },
  },
})
