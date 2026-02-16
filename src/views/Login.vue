<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { FileText, Lock, Mail } from 'lucide-vue-next'
import BaseButton from '../components/common/BaseButton.vue'
import BaseInput from '../components/common/BaseInput.vue'
import { useUserStore } from '../stores/user'
import { useToastStore } from '../stores/toast'

const router = useRouter()
const userStore = useUserStore()
const toastStore = useToastStore()

const email = ref('demo@freelancer.com')
const password = ref('password')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  userStore.login()
  loading.value = false
  toastStore.success('¡Bienvenido de nuevo!')
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <div class="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg transform rotate-3">
          <FileText class="w-7 h-7 text-white" />
        </div>
      </div>
      <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
        QuotePro
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Sistema de Cotizaciones Inteligentes
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <BaseInput
            v-model="email"
            type="email"
            label="Correo Electrónico"
            placeholder="tu@email.com"
            required
          />

          <BaseInput
            v-model="password"
            type="password"
            label="Contraseña"
            placeholder="••••••••"
            required
          />

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">Recordarme</label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-primary-600 hover:text-primary-500">¿Olvidaste tu contraseña?</a>
            </div>
          </div>

          <div>
            <BaseButton type="submit" block :loading="loading">
              Iniciar Sesión
            </BaseButton>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="bg-white px-2 text-gray-500">O continúa con</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3">
            <BaseButton variant="secondary" block>
              Google
            </BaseButton>
            <BaseButton variant="secondary" block>
              GitHub
            </BaseButton>
          </div>
        </div>
      </div>
      
      <p class="mt-6 text-center text-xs text-gray-500">
        Esta es una demo. Puedes usar cualquier credencial para entrar.
      </p>
    </div>
  </div>
</template>
