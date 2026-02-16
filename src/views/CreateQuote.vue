<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Save, ArrowLeft, Calculator } from 'lucide-vue-next'
import MainLayout from '../components/layout/MainLayout.vue'
import BaseButton from '../components/common/BaseButton.vue'
import BaseInput from '../components/common/BaseInput.vue'
import BaseCard from '../components/common/BaseCard.vue'
import ServiceItemsTable from '../components/quotes/ServiceItemsTable.vue'
import { useQuotesStore } from '../stores/quotes'
import { useUserStore } from '../stores/user'
import { useToastStore } from '../stores/toast'
import { formatCurrency } from '../utils/format'

const router = useRouter()
const route = useRoute()
const quotesStore = useQuotesStore()
const userStore = useUserStore()
const toastStore = useToastStore()

const loading = ref(false)
const isEditing = ref(false)

const quote = ref({
  clientName: '',
  clientCompany: '',
  clientEmail: '',
  clientPhone: '',
  projectName: '',
  issueDate: new Date().toISOString().split('T')[0],
  expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  items: [
    { name: '', description: '', quantity: 1, price: 0, total: 0 }
  ],
  taxRate: userStore.user.taxRate || 0,
  discountRate: 0,
  notes: userStore.user.defaultNotes || 'Gracias por su confianza. Esta cotización es válida por 15 días.',
  currency: userStore.user.currency || 'USD'
})

onMounted(() => {
  if (route.name === 'edit-quote' && route.params.id) {
    isEditing.value = true
    const existingQuote = quotesStore.getQuoteById(route.params.id)
    if (existingQuote) {
      // Deep copy to avoid mutating store directly
      quote.value = JSON.parse(JSON.stringify(existingQuote))
      
      // Ensure simulated dates format match input date
      if (quote.value.issueDate) quote.value.issueDate = quote.value.issueDate.split('T')[0]
      if (quote.value.expiryDate) quote.value.expiryDate = quote.value.expiryDate.split('T')[0]
    } else {
      toastStore.error('Cotización no encontrada')
      router.push('/quotes')
    }
  }
})

const addItem = () => {
  quote.value.items.push({
    name: '',
    description: '',
    quantity: 1,
    price: 0,
    total: 0
  })
}

const removeItem = (index) => {
  if (quote.value.items.length > 1) {
    quote.value.items.splice(index, 1)
  }
}

const subtotal = computed(() => {
  return quote.value.items.reduce((sum, item) => sum + (item.total || 0), 0)
})

const discountAmount = computed(() => {
  return subtotal.value * (quote.value.discountRate / 100)
})

const taxAmount = computed(() => {
  return (subtotal.value - discountAmount.value) * (quote.value.taxRate / 100)
})

const total = computed(() => {
  return subtotal.value - discountAmount.value + taxAmount.value
})

const saveQuote = async () => {
  if (!quote.value.clientName || !quote.value.projectName) {
    toastStore.error('Por favor completa los campos requeridos (Cliente y Proyecto)')
    return
  }

  loading.value = true
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const quoteData = {
    ...quote.value,
    subtotal: subtotal.value,
    taxAmount: taxAmount.value,
    discountAmount: discountAmount.value,
    total: total.value
  }
  
  if (isEditing.value) {
    quotesStore.updateQuote(quote.value.id, quoteData)
    toastStore.success('Cotización actualizada exitosamente')
  } else {
    quotesStore.addQuote(quoteData)
    toastStore.success('Cotización creada exitosamente')
  }
  
  loading.value = false
  router.push('/quotes')
}
</script>

<template>
  <MainLayout>
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-4">
          <BaseButton variant="ghost" size="sm" @click="router.back()">
            <ArrowLeft class="w-5 h-5" />
          </BaseButton>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ isEditing ? 'Editar Cotización' : 'Nueva Cotización' }}</h1>
            <p class="mt-1 text-sm text-gray-500">Completa los detalles para generar una propuesta profesional.</p>
          </div>
        </div>
        <div class="flex gap-3">
          <BaseButton variant="secondary" @click="router.back()">Cancelar</BaseButton>
          <BaseButton @click="saveQuote" :loading="loading">
            <Save class="w-5 h-5 mr-2" />
            {{ isEditing ? 'Actualizar' : 'Guardar' }} Cotización
          </BaseButton>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Form -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Client Info -->
          <BaseCard title="Información del Cliente">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput
                v-model="quote.clientName"
                label="Nombre del Cliente *"
                placeholder="Ej. Juan Pérez"
              />
              <BaseInput
                v-model="quote.clientCompany"
                label="Empresa"
                placeholder="Ej. Tech Solutions"
              />
              <BaseInput
                v-model="quote.clientEmail"
                type="email"
                label="Correo Electrónico"
                placeholder="juan@empresa.com"
              />
              <BaseInput
                v-model="quote.clientPhone"
                type="tel"
                label="Teléfono"
                placeholder="+52 555 000 0000"
              />
            </div>
          </BaseCard>

          <!-- Project Details -->
          <BaseCard title="Detalles del Proyecto">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <BaseInput
                v-model="quote.projectName"
                label="Nombre del Proyecto *"
                placeholder="Ej. Rediseño de Sitio Web"
                class="md:col-span-2"
              />
              <BaseInput
                v-model="quote.issueDate"
                type="date"
                label="Fecha de Emisión"
              />
              <BaseInput
                v-model="quote.expiryDate"
                type="date"
                label="Fecha de Vencimiento"
              />
            </div>

            <div class="border-t border-gray-100 pt-6">
              <h4 class="text-sm font-medium text-gray-900 mb-4">Servicios y Costos</h4>
              <ServiceItemsTable 
                :items="quote.items"
                @update:items="quote.items = $event"
                @add-item="addItem"
                @remove-item="removeItem"
              />
            </div>
          </BaseCard>
          
          <BaseCard title="Notas y Condiciones">
            <BaseInput
              v-model="quote.notes"
              type="textarea"
              placeholder="Agrega notas adicionales, términos de pago o condiciones del servicio..."
              :rows="4"
            />
          </BaseCard>
        </div>

        <!-- Summary Sidebar -->
        <div class="lg:col-span-1">
          <BaseCard title="Resumen" class="sticky top-24">
            <div class="space-y-4">
              <div class="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{{ formatCurrency(subtotal, quote.currency) }}</span>
              </div>
              
              <div class="flex justify-between items-center text-sm text-gray-600">
                <span class="flex items-center gap-2">
                  Descuento
                  <input 
                    type="number" 
                    v-model="quote.discountRate"
                    min="0"
                    max="100"
                    class="w-16 rounded-md border-0 py-1 text-right text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-xs sm:leading-5"
                  />
                  %
                </span>
                <span class="text-red-500">-{{ formatCurrency(discountAmount, quote.currency) }}</span>
              </div>

              <div class="flex justify-between items-center text-sm text-gray-600">
                <span class="flex items-center gap-2">
                  Impuestos
                  <input 
                    type="number" 
                    v-model="quote.taxRate"
                    min="0"
                    max="100"
                    class="w-16 rounded-md border-0 py-1 text-right text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-xs sm:leading-5"
                  />
                  %
                </span>
                <span>{{ formatCurrency(taxAmount, quote.currency) }}</span>
              </div>

              <div class="border-t border-gray-200 pt-4 flex justify-between items-center">
                <span class="text-base font-bold text-gray-900">Total</span>
                <span class="text-2xl font-bold text-primary-600">
                  {{ formatCurrency(total, quote.currency) }}
                </span>
              </div>
            </div>
            
            <template #footer>
              <div class="bg-blue-50 rounded-lg p-4 flex gap-3">
                <Calculator class="w-5 h-5 text-blue-600 flex-shrink-0" />
                <p class="text-xs text-blue-700">
                  Los cálculos se actualizan automáticamente al modificar los servicios, impuestos o descuentos.
                </p>
              </div>
            </template>
          </BaseCard>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
