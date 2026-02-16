<script setup>
import { CheckCircle, AlertCircle, Info, X } from 'lucide-vue-next'
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()

const getIcon = (type) => {
  switch (type) {
    case 'success': return CheckCircle
    case 'error': return AlertCircle
    case 'warning': return AlertCircle
    case 'info': return Info
    default: return Info
  }
}

const getStyles = (type) => {
  switch (type) {
    case 'success': return 'bg-white border-green-500 text-green-700 ring-green-600/20'
    case 'error': return 'bg-white border-red-500 text-red-700 ring-red-600/10'
    case 'warning': return 'bg-white border-yellow-500 text-yellow-800 ring-yellow-600/20'
    case 'info': return 'bg-white border-blue-500 text-blue-700 ring-blue-700/10'
    default: return 'bg-white border-gray-500 text-gray-600 ring-gray-500/10'
  }
}

const getIconColor = (type) => {
  switch (type) {
    case 'success': return 'text-green-500'
    case 'error': return 'text-red-500'
    case 'warning': return 'text-yellow-500'
    case 'info': return 'text-blue-500'
    default: return 'text-gray-500'
  }
}
</script>

<template>
  <div class="fixed bottom-0 right-0 p-6 z-50 flex flex-col gap-3 pointer-events-none">
    <TransitionGroup 
      enter-active-class="transform ease-out duration-300 transition" 
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2" 
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" 
      leave-active-class="transition ease-in duration-100" 
      leave-from-class="opacity-100" 
      leave-to-class="opacity-0"
    >
      <div 
        v-for="toast in toastStore.toasts" 
        :key="toast.id" 
        class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 border-l-4"
        :class="getStyles(toast.type)"
      >
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <component :is="getIcon(toast.type)" class="h-6 w-6" :class="getIconColor(toast.type)" aria-hidden="true" />
            </div>
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-sm font-medium">{{ toast.message }}</p>
            </div>
            <div class="ml-4 flex flex-shrink-0">
              <button 
                type="button" 
                @click="toastStore.removeToast(toast.id)"
                class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <span class="sr-only">Cerrar</span>
                <X class="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>
