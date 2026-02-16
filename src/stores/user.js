import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref({
    name: 'Freelancer Demo',
    email: 'hola@freelancer.com',
    company: 'Studio Creativo',
    phone: '+52 555 555 5555',
    logo: null,
    brandColor: '#0ea5e9',
    taxRate: 16,
    currency: 'USD',
    signature: null
  })

  const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true')

  // Load from LocalStorage
  if (localStorage.getItem('userProfile')) {
    user.value = JSON.parse(localStorage.getItem('userProfile'))
  }

  const updateUser = (data) => {
    user.value = { ...user.value, ...data }
    localStorage.setItem('userProfile', JSON.stringify(user.value))
  }

  const login = () => {
    isAuthenticated.value = true
    localStorage.setItem('isAuthenticated', 'true')
  }

  const logout = () => {
    isAuthenticated.value = false
    localStorage.removeItem('isAuthenticated')
  }

  return {
    user,
    isAuthenticated,
    updateUser,
    login,
    logout
  }
})
