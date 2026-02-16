<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Search, Filter, Eye, Trash2, Edit } from 'lucide-vue-next'
import MainLayout from '../components/layout/MainLayout.vue'
import BaseButton from '../components/common/BaseButton.vue'
import BaseCard from '../components/common/BaseCard.vue'
import BaseBadge from '../components/common/BaseBadge.vue'
import BaseInput from '../components/common/BaseInput.vue'
import BaseModal from '../components/common/BaseModal.vue'
import { useQuotesStore } from '../stores/quotes'
import { formatCurrency, formatShortDate } from '../utils/format'
import { getStatusLabel, getStatusVariant, QUOTE_STATUS_LABELS } from '../utils/quoteStatus'

const router = useRouter()
const quotesStore = useQuotesStore()

const searchQuery = ref('')
const statusFilter = ref('all')
const showDeleteModal = ref(false)
const quoteToDelete = ref(null)

const filters = [
  { label: 'Todos', value: 'all' },
  ...Object.entries(QUOTE_STATUS_LABELS).map(([value, label]) => ({ label, value }))
]

const filteredQuotes = computed(() => {
  return quotesStore.quotes.filter(quote => {
    const matchesSearch = 
      quote.clientName?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      quote.projectName?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      quote.id?.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesStatus = statusFilter.value === 'all' || quote.status === statusFilter.value

    return matchesSearch && matchesStatus
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

const getStatusVariant = (status) => {
  switch (status) {
    case 'accepted': return 'green'
    case 'rejected': return 'red'
    case 'sent': return 'blue'
    case 'viewed': return 'purple'
    default: return 'gray'
  }
}

const getStatusLabel = (status) => {
  switch (status) {
    case 'accepted': return 'Aceptada'
    case 'rejected': return 'Rechazada'
    case 'sent': return 'Enviada'
    case 'viewed': return 'Vista'
    default: return 'Borrador'
  }
}

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
    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Mis Cotizaciones</h1>
        <p class="mt-1 text-sm text-gray-500">Administra y da seguimiento a todas tus propuestas.</p>
      </div>
      <BaseButton @click="createNewQuote">
        <Plus class="w-5 h-5 mr-2" />
        Nueva Cotización
      </BaseButton>
    </div>

    <BaseCard no-padding>
      <!-- Filters and Search -->
      <div class="p-4 border-b border-gray-200 bg-gray-50 sm:flex sm:items-center sm:justify-between gap-4">
        <div class="relative flex-1 max-w-sm">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            class="block w-full rounded-md border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
            placeholder="Buscar por cliente, proyecto o ID..."
          />
        </div>
        
        <div class="mt-4 sm:mt-0 flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          <Filter class="h-5 w-5 text-gray-400 hidden sm:block" />
          <button
            v-for="filter in filters"
            :key="filter.value"
            @click="statusFilter = filter.value"
            class="px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
            :class="[
              statusFilter === filter.value
                ? 'bg-primary-100 text-primary-700'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            ]"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>

      <!-- Quotes Table -->
      <div class="overflow-x-auto min-h-[400px]">
        <table class="min-w-full divide-y divide-gray-300">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">ID</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Cliente</th>
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
            <tr v-if="filteredQuotes.length === 0">
              <td colspan="7" class="text-center py-12 text-gray-500">
                No se encontraron cotizaciones que coincidan con tu búsqueda.
              </td>
            </tr>
            <tr v-for="quote in filteredQuotes" :key="quote.id" class="hover:bg-gray-50 transition-colors">
              <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-mono text-gray-500 sm:pl-6">
                #{{ quote.id.slice(0, 8).toUpperCase() }}
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                {{ quote.clientName || 'Sin nombre' }}
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {{ quote.projectName || 'Sin título' }}
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {{ formatShortDate(quote.createdAt) }}
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {{ formatCurrency(quote.total, quote.currency) }}
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm">
                <BaseBadge :label="getStatusLabel(quote.status)" :variant="getStatusVariant(quote.status)" />
              </td>
              <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <div class="flex items-center justify-end gap-2">
                  <router-link 
                    v-if="quote.status === 'draft'"
                    :to="`/quotes/${quote.id}/edit`" 
                    class="text-gray-400 hover:text-blue-600 transition-colors" 
                    title="Editar"
                  >
                    <Edit class="w-5 h-5" />
                  </router-link>
                  <router-link 
                    :to="`/quotes/${quote.id}`" 
                    class="text-gray-400 hover:text-primary-600 transition-colors" 
                    title="Ver Cotización"
                  >
                    <Eye class="w-5 h-5" />
                  </router-link>
                  <button 
                    @click="confirmDelete(quote)" 
                    class="text-gray-400 hover:text-red-600 transition-colors" 
                    title="Eliminar"
                  >
                    <Trash2 class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>

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
