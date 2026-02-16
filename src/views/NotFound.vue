<script setup>
import { FileQuestion, ArrowLeft } from 'lucide-vue-next'
import BaseButton from '../components/common/BaseButton.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
    <div class="text-center">
      <div class="bg-primary-100 p-4 rounded-full inline-flex mb-6">
        <FileQuestion class="w-12 h-12 text-primary-600" />
      </div>
      <h1 class="text-4xl font-bold text-gray-900 mb-2">Página no encontrada</h1>
      <p class="text-lg text-gray-600 mb-8 max-w-md mx-auto">
        Lo sentimos, no pudimos encontrar la página que estás buscando. Es posible que haya sido movida o eliminada.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <BaseButton variant="secondary" @click="router.back()">
          <ArrowLeft class="w-4 h-4 mr-2" />
          Regresar
        </BaseButton>
        <BaseButton @click="router.push('/')">
          Ir al Inicio
        </BaseButton>
      </div>
    </div>
  </div>
</template>
