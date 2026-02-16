<script setup>
import { useRoute, useRouter } from 'vue-router'
import { 
  LayoutDashboard, 
  FilePlus, 
  FileText, 
  LayoutTemplate, 
  User, 
  LogOut 
} from 'lucide-vue-next'
import { useToastStore } from '@/stores/toast'

const route = useRoute()
const router = useRouter()
const toastStore = useToastStore()

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Mis Cotizaciones', href: '/quotes', icon: FileText },
  { name: 'Crear Cotización', href: '/quotes/new', icon: FilePlus },
  { name: 'Plantillas', href: '/templates', icon: LayoutTemplate },
  { name: 'Perfil', href: '/profile', icon: User },
]

const isActive = (path) => route.path === path

const logout = () => {
  localStorage.removeItem('isAuthenticated')
  toastStore.info('Has cerrado sesión')
  router.push('/login')
}
</script>

<template>
  <div class="flex flex-col h-full bg-slate-900 text-white">
    <div class="p-6 border-b border-slate-800">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
          <FileText class="w-5 h-5 text-white" />
        </div>
        <span class="font-bold text-xl tracking-tight">QuotePro</span>
      </div>
    </div>

    <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
      <router-link 
        v-for="item in navigation" 
        :key="item.name" 
        :to="item.href"
        class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors group"
        :class="[
          isActive(item.href) 
            ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        ]"
      >
        <component 
          :is="item.icon" 
          class="mr-3 h-5 w-5 flex-shrink-0"
          :class="isActive(item.href) ? 'text-white' : 'text-slate-500 group-hover:text-white'" 
        />
        {{ item.name }}
      </router-link>
    </nav>

    <div class="p-4 border-t border-slate-800">
      <button 
        @click="logout"
        class="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-400 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
      >
        <LogOut class="mr-3 h-5 w-5 text-slate-500" />
        Cerrar Sesión
      </button>
    </div>
  </div>
</template>
