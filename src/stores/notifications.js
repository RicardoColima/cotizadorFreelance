import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref([
    {
      id: 1,
      title: 'Cotización Aceptada',
      message: 'Maria González aceptó la cotización #87654321',
      time: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
      read: false,
      type: 'success'
    },
    {
      id: 2,
      title: 'Nueva Visualización',
      message: 'Tech Solutions Inc. ha visto tu cotización',
      time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      read: false,
      type: 'info'
    },
    {
      id: 3,
      title: 'Recordatorio',
      message: 'La cotización de Juan Pérez vence mañana',
      time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      read: true,
      type: 'warning'
    }
  ])

  const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

  const markAsRead = (id) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.read = true
    }
  }

  const markAllAsRead = () => {
    notifications.value.forEach(n => n.read = true)
  }

  const addNotification = (notification) => {
    notifications.value.unshift({
      id: Date.now(),
      read: false,
      time: new Date().toISOString(),
      ...notification
    })
  }

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification
  }
})
