<script setup>
import { ref } from 'vue'
import { Save, User, Settings, CreditCard } from 'lucide-vue-next'
import MainLayout from '../components/layout/MainLayout.vue'
import BaseButton from '../components/common/BaseButton.vue'
import BaseInput from '../components/common/BaseInput.vue'
import BaseCard from '../components/common/BaseCard.vue'
import SignaturePad from '../components/common/SignaturePad.vue'
import { useUserStore } from '../stores/user'
import { useToastStore } from '../stores/toast'

const userStore = useUserStore()
const toastStore = useToastStore()
const loading = ref(false)
const activeTab = ref('profile')

// Clone user data to avoid direct mutation until save
const formData = ref({ ...userStore.user })

const saveProfile = async () => {
  loading.value = true
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800))
  
  userStore.updateUser(formData.value)
  loading.value = false
  toastStore.success('Perfil actualizado correctamente')
}

const handleSignatureSave = (signature) => {
  formData.value.signature = signature
}

const resetApp = () => {
  if (confirm('¿Estás seguro de que quieres borrar todos los datos? Esta acción es irreversible.')) {
    localStorage.clear()
    window.location.reload()
  }
}
</script>

<template>
  <MainLayout>
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Configuración de Perfil</h1>
          <p class="mt-1 text-sm text-gray-500">Administra tu información personal y preferencias de negocio.</p>
        </div>
        <BaseButton @click="saveProfile" :loading="loading">
          <Save class="w-5 h-5 mr-2" />
          Guardar Cambios
        </BaseButton>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Sidebar Navigation -->
        <div class="lg:col-span-3">
          <nav class="space-y-1">
            <button
              @click="activeTab = 'profile'"
              :class="[
                activeTab === 'profile'
                  ? 'bg-primary-50 text-primary-700 border-primary-600'
                  : 'text-gray-900 hover:bg-gray-50 hover:text-gray-900 border-transparent',
                'group w-full flex items-center border-l-4 px-3 py-2 text-sm font-medium'
              ]"
            >
              <User class="mr-3 h-5 w-5 flex-shrink-0" :class="activeTab === 'profile' ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'" />
              Información Personal
            </button>
            <button
              @click="activeTab = 'business'"
              :class="[
                activeTab === 'business'
                  ? 'bg-primary-50 text-primary-700 border-primary-600'
                  : 'text-gray-900 hover:bg-gray-50 hover:text-gray-900 border-transparent',
                'group w-full flex items-center border-l-4 px-3 py-2 text-sm font-medium'
              ]"
            >
              <Settings class="mr-3 h-5 w-5 flex-shrink-0" :class="activeTab === 'business' ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'" />
              Negocio y Finanzas
            </button>
          </nav>
        </div>

        <!-- Content -->
        <div class="lg:col-span-9 space-y-6">
          <!-- Profile Tab -->
          <div v-if="activeTab === 'profile'" class="space-y-6">
            <BaseCard title="Información Básica">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BaseInput
                  v-model="formData.name"
                  label="Nombre Completo"
                />
                <BaseInput
                  v-model="formData.email"
                  type="email"
                  label="Correo Electrónico"
                />
                <BaseInput
                  v-model="formData.phone"
                  type="tel"
                  label="Teléfono"
                />
                <BaseInput
                  v-model="formData.company"
                  label="Nombre de la Empresa / Marca"
                />
              </div>
            </BaseCard>

            <BaseCard title="Firma Predeterminada">
              <p class="text-sm text-gray-500 mb-4">Esta firma se utilizará automáticamente en tus cotizaciones si así lo deseas.</p>
              <div v-if="formData.signature" class="mb-4 p-4 border rounded bg-gray-50 flex flex-col items-center relative">
                <img :src="formData.signature" alt="Firma guardada" class="h-24 object-contain" />
                <button 
                  @click="formData.signature = null"
                  class="text-xs text-red-600 hover:text-red-800 mt-2 underline"
                >
                  Eliminar firma actual
                </button>
              </div>
              <SignaturePad v-else @save="handleSignatureSave" />
            </BaseCard>
          </div>

          <!-- Business Tab -->
          <div v-if="activeTab === 'business'" class="space-y-6">
            <BaseCard title="Configuración Financiera">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">Moneda</label>
                  <select
                    v-model="formData.currency"
                    class="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  >
                    <option value="USD">USD - Dólar Estadounidense</option>
                    <option value="MXN">MXN - Peso Mexicano</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="COP">COP - Peso Colombiano</option>
                  </select>
                </div>
                <BaseInput
                  v-model="formData.taxRate"
                  type="number"
                  label="Impuesto por defecto (%)"
                />
              </div>
            </BaseCard>

            <BaseCard title="Textos Predeterminados">
              <div class="space-y-4">
                <BaseInput
                  v-model="formData.defaultNotes"
                  type="textarea"
                  label="Notas y Condiciones"
                  placeholder="Términos que aparecerán en todas tus cotizaciones..."
                  :rows="4"
                />
              </div>
            </BaseCard>

            <BaseCard title="Zona de Peligro">
              <div class="space-y-4">
                <p class="text-sm text-gray-600">
                  Si deseas reiniciar la aplicación a su estado original (borrar todas las cotizaciones, configuraciones y datos guardados), utiliza el siguiente botón. Esta acción no se puede deshacer.
                </p>
                <BaseButton variant="danger" @click="resetApp">
                  Reiniciar Aplicación / Borrar Datos
                </BaseButton>
              </div>
            </BaseCard>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
