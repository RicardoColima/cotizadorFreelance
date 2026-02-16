<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, FileText, CheckCircle, Clock, DollarSign, Trash2, Eye } from 'lucide-vue-next'
import MainLayout from '../components/layout/MainLayout.vue'
import BaseButton from '../components/common/BaseButton.vue'
import BaseCard from '../components/common/BaseCard.vue'
import BaseModal from '../components/common/BaseModal.vue'
import ActivityTimeline from '../components/dashboard/ActivityTimeline.vue'
import RevenueChart from '../components/dashboard/RevenueChart.vue'
import QuoteStatusBadge from '../components/quotes/QuoteStatusBadge.vue'
import { useQuotesStore } from '../stores/quotes'
import { formatCurrency, formatShortDate } from '../utils/format'
import { getStatusLabel, getStatusVariant } from '../utils/quoteStatus'

const router = useRouter()
const quotesStore = useQuotesStore()

const showDeleteModal = ref(false)
const quoteToDelete = ref(null)

const stats = computed(() => [
  { 
    name: 'Total Cotizaciones', 
    value: quotesStore.stats.total, 
    icon: FileText, 
    color: 'bg-blue-500' 
  },
  { 
    name: 'Pendientes', 
    value: quotesStore.stats.pending, 
    icon: Clock, 
    color: 'bg-yellow-500' 
  },
  { 
    name: 'Aceptadas', 
    value: quotesStore.stats.accepted, 
    icon: CheckCircle, 
    color: 'bg-green-500' 
  },
  { 
    name: 'Ingresos Proyectados', 
    value: formatCurrency(quotesStore.stats.revenue), 
    icon: DollarSign, 
    color: 'bg-purple-500' 
  },
])

const recentQuotes = computed(() => {
  return [...quotesStore.quotes]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
})

const createNewQuote = () => {
  router.push('/quotes/new')
}

const confirmDelete = (quote) => {
  quoteToDelete.value = quote
  showDeleteModal.value = true
}

const deleteQuote = () => {
  if (quoteToDelete.value) {
    quotesStore.deleteQuote(quoteToDelete.value.id)
    showDeleteModal.value = false
    quoteToDelete.value = null
  }
}
</script>

<template>
  <MainLayout>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p class="mt-1 text-sm text-gray-500">Resumen de tu actividad reciente.</p>
      </div>
      <BaseButton @click="createNewQuote">
        <Plus class="w-5 h-5 mr-2" />
        Nueva Cotización
      </BaseButton>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <div 
        v-for="stat in stats" 
        :key="stat.name" 
        class="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
      >
        <dt>
          <div :class="['absolute rounded-md p-3', stat.color]">
            <component :is="stat.icon" class="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <p class="ml-16 truncate text-sm font-medium text-gray-500">{{ stat.name }}</p>
        </dt>
        <dd class="ml-16 flex items-baseline pb-1 sm:pb-7">
          <p class="text-2xl font-semibold text-gray-900">{{ stat.value }}</p>
        </dd>
      </div>
    </div>

    <!-- Revenue Chart -->
    <div class="mb-8">
      <RevenueChart />
    </div>

    <!-- Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Recent Quotes -->
      <div class="lg:col-span-2">
        <BaseCard title="Cotizaciones Recientes" no-padding>
          <div v-if="recentQuotes.length === 0" class="text-center py-12">
            <FileText class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-semibold text-gray-900">No hay cotizaciones</h3>
            <p class="mt-1 text-sm text-gray-500">Comienza creando tu primera cotización profesional.</p>
            <div class="mt-6">
              <BaseButton @click="createNewQuote">
                <Plus class="w-5 h-5 mr-2" />
                Crear Cotización
              </BaseButton>
            </div>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Cliente</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Proyecto</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Fecha</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Estado</th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="quote in recentQuotes" :key="quote.id">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {{ quote.clientName || 'Sin nombre' }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ quote.projectName || 'Sin título' }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ formatShortDate(quote.createdAt) }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ formatCurrency(quote.total) }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm">
                    <BaseBadge :label="getStatusLabel(quote.status)" :variant="getStatusVariant(quote.status)" />
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <div class="flex items-center justify-end gap-2">
                      <router-link :to="`/quotes/${quote.id}`" class="text-gray-400 hover:text-primary-600 transition-colors" title="Ver Cotización">
                        <Eye class="w-5 h-5" />
                      </router-link>
                      <button @click="confirmDelete(quote)" class="text-gray-400 hover:text-red-600 transition-colors" title="Eliminar">
                        <Trash2 class="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </BaseCard>
      </div>

      <!-- Activity Timeline -->
      <div class="lg:col-span-1">
        <ActivityTimeline />
      </div>
    </div>

    <BaseModal
      :show="showDeleteModal"
      title="Eliminar Cotización"
      @close="showDeleteModal = false"
    >
      <div class="space-y-4">
        <p class="text-sm text-gray-500">
          ¿Estás seguro de que quieres eliminar la cotización para <strong>{{ quoteToDelete?.clientName }}</strong>? 
          Esta acción no se puede deshacer.
        </p>
        <div class="flex justify-end gap-3 mt-4">
          <BaseButton variant="secondary" @click="showDeleteModal = false">Cancelar</BaseButton>
          <BaseButton variant="danger" @click="deleteQuote">
            Eliminar
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </MainLayout>
</template>
