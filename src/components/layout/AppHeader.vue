<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Bell, ChevronDown, Menu as MenuIcon } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useNotificationsStore } from '@/stores/notifications'
import { useToastStore } from '@/stores/toast'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

const router = useRouter()
const userStore = useUserStore()
const notificationsStore = useNotificationsStore()
const toastStore = useToastStore()
const emit = defineEmits(['open-sidebar'])

const formatTime = (time) => {
  return formatDistanceToNow(new Date(time), { addSuffix: true, locale: es })
}

const logout = () => {
  userStore.logout()
  toastStore.info('Has cerrado sesión')
  router.push('/login')
}
</script>

<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Mobile menu button -->
        <button 
          @click="$emit('open-sidebar')"
          class="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
        >
          <MenuIcon class="h-6 w-6" />
        </button>

        <!-- Right section -->
        <div class="flex items-center gap-4 ml-auto">
          <!-- Notifications -->
          <Menu as="div" class="relative">
            <MenuButton class="p-2 text-gray-400 hover:text-gray-500 relative rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <span class="sr-only">Ver notificaciones</span>
              <Bell class="h-5 w-5" />
              <span v-if="notificationsStore.unreadCount > 0" class="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </MenuButton>
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems class="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div class="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                  <h3 class="text-sm font-semibold text-gray-900">Notificaciones</h3>
                  <button 
                    v-if="notificationsStore.unreadCount > 0"
                    @click="notificationsStore.markAllAsRead()"
                    class="text-xs text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Marcar leídas
                  </button>
                </div>
                <div class="max-h-96 overflow-y-auto">
                  <div v-if="notificationsStore.notifications.length === 0" class="px-4 py-6 text-center text-sm text-gray-500">
                    No tienes notificaciones.
                  </div>
                  <MenuItem 
                    v-for="notification in notificationsStore.notifications" 
                    :key="notification.id" 
                    v-slot="{ active }"
                  >
                    <div 
                      :class="[
                        active ? 'bg-gray-50' : '', 
                        !notification.read ? 'bg-blue-50/50' : '',
                        'px-4 py-3 border-b border-gray-50 last:border-0 cursor-pointer transition-colors'
                      ]"
                      @click="notificationsStore.markAsRead(notification.id)"
                    >
                      <div class="flex justify-between items-start">
                        <p class="text-sm font-medium text-gray-900" :class="{ 'text-primary-700': !notification.read }">
                          {{ notification.title }}
                        </p>
                        <span v-if="!notification.read" class="h-2 w-2 rounded-full bg-primary-600 mt-1.5"></span>
                      </div>
                      <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ notification.message }}</p>
                      <p class="text-xs text-gray-400 mt-2">{{ formatTime(notification.time) }}</p>
                    </div>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>

          <div class="h-6 w-px bg-gray-200"></div>

          <!-- User dropdown -->
          <Menu as="div" class="relative ml-3">
            <div>
              <MenuButton class="flex items-center gap-3 max-w-xs rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                <div class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                  {{ userStore.user.name.charAt(0) }}
                </div>
                <div class="hidden md:flex flex-col items-start">
                  <span class="text-sm font-medium text-gray-700">{{ userStore.user.name }}</span>
                  <span class="text-xs text-gray-500">{{ userStore.user.company }}</span>
                </div>
                <ChevronDown class="h-4 w-4 text-gray-400 hidden md:block" />
              </MenuButton>
            </div>
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <MenuItem v-slot="{ active }">
                  <router-link to="/profile" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">
                    Mi Perfil
                  </router-link>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <a href="#" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">
                    Configuración
                  </a>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <button 
                    @click="logout"
                    :class="[active ? 'bg-gray-100' : '', 'block w-full text-left px-4 py-2 text-sm text-gray-700']"
                  >
                    Cerrar Sesión
                  </button>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </div>
  </header>
</template>
