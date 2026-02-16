<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Download, Share2, ArrowLeft, Printer, PenTool, Eye, Send, Edit } from 'lucide-vue-next'
import MainLayout from '../components/layout/MainLayout.vue'
import BaseButton from '../components/common/BaseButton.vue'
import BaseModal from '../components/common/BaseModal.vue'
import SignaturePad from '../components/common/SignaturePad.vue'
import BaseBadge from '../components/common/BaseBadge.vue'
import { useQuotesStore } from '../stores/quotes'
import { useUserStore } from '../stores/user'
import { useTemplatesStore } from '../stores/templates'
import { useToastStore } from '../stores/toast'
import { formatCurrency, formatDate } from '../utils/format'
import { getStatusLabel, getStatusVariant } from '@/utils/quoteStatus'

const route = useRoute()
const router = useRouter()
const quotesStore = useQuotesStore()
const userStore = useUserStore()
const templatesStore = useTemplatesStore()
const toastStore = useToastStore()

const quote = ref(null)
const showSignatureModal = ref(false)
const showShareModal = ref(false)
const signing = ref(false)
const sending = ref(false)

onMounted(() => {
  const id = route.params.id
  const foundQuote = quotesStore.getQuoteById(id)
  if (foundQuote) {
    quote.value = foundQuote
  } else {
    router.push('/404')
  }
})

const templateClass = computed(() => {
  return templatesStore.currentTemplate.id
})

const formatMoney = (amount) => {
  return formatCurrency(amount, quote.value?.currency)
}

const downloadPDF = async () => {
  const btn = document.getElementById('download-btn')
  const originalText = btn.innerText
  btn.innerText = 'Generando PDF...'
  await new Promise(resolve => setTimeout(resolve, 1500))
  btn.innerText = originalText
  toastStore.success('PDF descargado exitosamente')
}

const printQuote = () => {
  window.print()
}

const sendQuote = async () => {
  sending.value = true
  // Simulate email sending
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  quotesStore.updateQuote(quote.value.id, { status: 'sent' })
  quote.value.status = 'sent'
  
  sending.value = false
  toastStore.success(`Cotización enviada a ${quote.value.clientEmail || quote.value.clientName}`)
}

const simulateView = async () => {
  if (quote.value.status === 'sent') {
    quotesStore.updateQuote(quote.value.id, { status: 'viewed' })
    quote.value.status = 'viewed'
    toastStore.info('El cliente ha visto la cotización (Simulado)')
  } else {
    toastStore.info('Esta cotización ya ha sido vista o no está en estado Enviada')
  }
}

const handleSign = (signature) => {
  signing.value = true
  // Simulate saving signature
  setTimeout(() => {
    quotesStore.updateQuote(quote.value.id, { 
      clientSignature: signature,
      status: 'accepted',
      signedAt: new Date().toISOString()
    })
    quote.value.clientSignature = signature
    quote.value.status = 'accepted'
    showSignatureModal.value = false
    signing.value = false
    toastStore.success('Cotización firmada exitosamente')
  }, 1000)
}
</script>

<template>
  <MainLayout>
    <div v-if="quote" class="max-w-5xl mx-auto">
      <!-- Toolbar -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 no-print">
        <div class="flex items-center gap-4">
          <BaseButton variant="ghost" size="sm" @click="router.back()">
            <ArrowLeft class="w-5 h-5" />
          </BaseButton>
          <div>
            <div class="flex items-center gap-3">
              <h1 class="text-2xl font-bold text-gray-900">Vista Previa</h1>
              <BaseBadge 
                :label="getStatusLabel(quote.status)" 
                :variant="getStatusVariant(quote.status)" 
              />
            </div>
            <p class="mt-1 text-sm text-gray-500">Referencia: #{{ quote.id.slice(0, 8).toUpperCase() }}</p>
          </div>
        </div>
        <div class="flex gap-3 flex-wrap">
          <BaseButton v-if="quote.status === 'draft'" variant="secondary" @click="router.push(`/quotes/${quote.id}/edit`)">
            <Edit class="w-4 h-4 mr-2" />
            Editar
          </BaseButton>
          <BaseButton v-if="quote.status === 'draft'" @click="sendQuote" :loading="sending">
            <Send class="w-4 h-4 mr-2" />
            Enviar al Cliente
          </BaseButton>
          <BaseButton v-if="quote.status === 'sent'" variant="ghost" @click="simulateView">
            <Eye class="w-4 h-4 mr-2" />
            Simular Vista
          </BaseButton>
          <BaseButton variant="secondary" @click="showShareModal = true">
            <Share2 class="w-4 h-4 mr-2" />
            Compartir
          </BaseButton>
          <BaseButton id="download-btn" @click="printQuote">
            <Printer class="w-4 h-4 mr-2" />
            Imprimir / PDF
          </BaseButton>
          <BaseButton v-if="!quote.clientSignature && quote.status !== 'draft'" @click="showSignatureModal = true">
            <PenTool class="w-4 h-4 mr-2" />
            Firmar
          </BaseButton>
        </div>
      </div>

      <!-- Preview Container -->
      <div class="bg-white shadow-lg rounded-none sm:rounded-lg overflow-hidden print-container">
        <!-- Template Rendering -->
        <div 
          class="p-8 sm:p-12 min-h-[800px]"
          :class="{
            'font-sans': templateClass === 'minimal',
            'font-serif bg-slate-50': templateClass === 'corporate',
            'font-mono bg-indigo-50/30': templateClass === 'creative'
          }"
        >
          <!-- Document Header -->
          <div class="flex justify-between items-start mb-12 border-b pb-8 border-gray-100">
            <div>
              <div 
                v-if="userStore.user.logo" 
                class="h-16 w-16 mb-4 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500"
              >
                Logo
              </div>
              <div v-else class="h-16 w-16 mb-4 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                {{ userStore.user.name.charAt(0) }}
              </div>
              <h2 class="text-xl font-bold text-gray-900">{{ userStore.user.company }}</h2>
              <div class="text-sm text-gray-500 mt-2 space-y-1">
                <p>{{ userStore.user.name }}</p>
                <p>{{ userStore.user.email }}</p>
                <p>{{ userStore.user.phone }}</p>
              </div>
            </div>
            <div class="text-right">
              <h1 class="text-4xl font-light text-gray-900 mb-2">COTIZACIÓN</h1>
              <p class="text-sm text-gray-500 font-medium">#{{ quote.id.slice(0, 8).toUpperCase() }}</p>
              <div class="mt-6 space-y-1 text-sm">
                <div class="flex justify-end gap-4">
                  <span class="text-gray-500">Fecha:</span>
                  <span class="font-medium">{{ formatDate(quote.issueDate) }}</span>
                </div>
                <div class="flex justify-end gap-4">
                  <span class="text-gray-500">Vence:</span>
                  <span class="font-medium">{{ formatDate(quote.expiryDate) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Client Info -->
          <div class="mb-12">
            <h3 class="text-xs uppercase tracking-wider text-gray-500 font-bold mb-4">Cotizado a:</h3>
            <div class="text-gray-900">
              <p class="font-bold text-lg">{{ quote.clientName }}</p>
              <p class="text-gray-600">{{ quote.clientCompany }}</p>
              <p class="text-gray-500">{{ quote.clientEmail }}</p>
              <p class="text-gray-500">{{ quote.clientPhone }}</p>
            </div>
          </div>

          <!-- Project Title -->
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900">{{ quote.projectName }}</h2>
          </div>

          <!-- Items Table -->
          <div class="mb-12">
            <table class="w-full">
              <thead>
                <tr class="border-b-2 border-gray-900">
                  <th class="text-left py-4 font-bold text-gray-900">Descripción</th>
                  <th class="text-right py-4 font-bold text-gray-900 w-24">Cant.</th>
                  <th class="text-right py-4 font-bold text-gray-900 w-32">Precio</th>
                  <th class="text-right py-4 font-bold text-gray-900 w-32">Total</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(item, index) in quote.items" :key="index">
                  <td class="py-4 pr-4">
                    <p class="font-medium text-gray-900">{{ item.name }}</p>
                    <p class="text-sm text-gray-500 mt-1" v-if="item.description">{{ item.description }}</p>
                  </td>
                  <td class="py-4 text-right text-gray-600">{{ item.quantity }}</td>
                  <td class="py-4 text-right text-gray-600">{{ formatMoney(item.price) }}</td>
                  <td class="py-4 text-right font-medium text-gray-900">{{ formatMoney(item.total) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Totals -->
          <div class="flex justify-end mb-12">
            <div class="w-64 space-y-3">
              <div class="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{{ formatMoney(quote.subtotal) }}</span>
              </div>
              <div v-if="quote.discountRate > 0" class="flex justify-between text-sm text-red-600">
                <span>Descuento ({{ quote.discountRate }}%)</span>
                <span>-{{ formatMoney(quote.discountAmount) }}</span>
              </div>
              <div v-if="quote.taxRate > 0" class="flex justify-between text-sm text-gray-600">
                <span>Impuesto ({{ quote.taxRate }}%)</span>
                <span>{{ formatMoney(quote.taxAmount) }}</span>
              </div>
              <div class="border-t-2 border-gray-900 pt-3 flex justify-between items-baseline">
                <span class="font-bold text-xl text-gray-900">Total</span>
                <span class="font-bold text-xl text-primary-600">{{ formatMoney(quote.total) }}</span>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div v-if="quote.notes" class="mb-12 bg-gray-50 p-6 rounded-lg">
            <h3 class="font-bold text-gray-900 mb-2">Términos y Condiciones</h3>
            <p class="text-sm text-gray-600 whitespace-pre-line">{{ quote.notes }}</p>
          </div>

          <!-- Signatures -->
          <div class="grid grid-cols-2 gap-12 mt-20">
            <!-- Freelancer Signature -->
            <div>
              <div class="h-20 mb-2 flex items-end">
                <!-- Simulated signature image -->
                <div v-if="userStore.user.signature" class="mb-2">
                  <img :src="userStore.user.signature" alt="Firma Freelancer" class="max-h-16" />
                </div>
                <div v-else class="text-2xl font-script text-gray-400 italic mb-4 font-serif">
                  {{ userStore.user.name }}
                </div>
              </div>
              <div class="border-t border-gray-300 pt-2">
                <p class="font-bold text-sm text-gray-900">{{ userStore.user.name }}</p>
                <p class="text-xs text-gray-500">{{ userStore.user.company }}</p>
              </div>
            </div>

            <!-- Client Signature -->
            <div>
              <div class="h-20 mb-2 flex items-end">
                <div v-if="quote.clientSignature" class="mb-2">
                   <img :src="quote.clientSignature" alt="Firma Cliente" class="max-h-16" />
                </div>
              </div>
              <div class="border-t border-gray-300 pt-2">
                <p class="font-bold text-sm text-gray-900">{{ quote.clientName }}</p>
                <p class="text-xs text-gray-500">Firma de Aceptación</p>
                <p v-if="quote.signedAt" class="text-xs text-gray-400 mt-1">
                  Firmado el {{ new Date(quote.signedAt).toLocaleString() }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sign Modal -->
    <BaseModal 
      :show="showSignatureModal" 
      title="Firmar Cotización"
      @close="showSignatureModal = false"
    >
      <div class="space-y-4">
        <p class="text-sm text-gray-500">
          Por favor firme a continuación para aceptar esta cotización y sus términos.
        </p>
        <SignaturePad @save="handleSign" />
        <div class="flex justify-end gap-3 mt-4">
          <BaseButton variant="secondary" @click="showSignatureModal = false">Cancelar</BaseButton>
          <BaseButton :loading="signing" disabled>
            Esperando firma...
          </BaseButton>
        </div>
      </div>
    </BaseModal>

    <!-- Share Modal -->
    <BaseModal
      :show="showShareModal"
      title="Compartir Cotización"
      @close="showShareModal = false"
    >
      <div class="space-y-4">
        <p class="text-sm text-gray-500">Copia el enlace para compartir esta cotización con tu cliente.</p>
        <div class="flex gap-2">
          <BaseInput
            readonly
            :model-value="`https://quotepro.app/q/${quote?.id}`"
            class="flex-1"
          />
          <BaseButton variant="secondary">Copiar</BaseButton>
        </div>
      </div>
    </BaseModal>
  </MainLayout>
</template>
