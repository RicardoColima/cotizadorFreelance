<script setup>
import { computed } from 'vue'
import { Trash2, Plus } from 'lucide-vue-next'
import BaseButton from '../common/BaseButton.vue'
import { formatCurrency } from '@/utils/format'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  }
})

const emit = defineEmits(['update:items', 'add-item', 'remove-item'])

const updateItem = (index, field, value) => {
  const newItems = [...props.items]
  newItems[index] = { ...newItems[index], [field]: value }
  
  // Auto-calculate total if price or quantity changes
  if (field === 'price' || field === 'quantity') {
    const qty = parseFloat(newItems[index].quantity) || 0
    const price = parseFloat(newItems[index].price) || 0
    newItems[index].total = qty * price
  }
  
  emit('update:items', newItems)
}
</script>

<template>
  <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
    <table class="min-w-full divide-y divide-gray-300">
      <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 w-1/2">Servicio / Descripción</th>
          <th scope="col" class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 w-24">Cant.</th>
          <th scope="col" class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 w-32">Precio</th>
          <th scope="col" class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 w-32">Total</th>
          <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6 w-16">
            <span class="sr-only">Eliminar</span>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 bg-white">
        <tr v-for="(item, index) in items" :key="index">
          <td class="py-4 pl-4 pr-3 sm:pl-6">
            <div class="space-y-2">
              <BaseInput
                :model-value="item.name"
                @update:model-value="updateItem(index, 'name', $event)"
                placeholder="Nombre del servicio"
              />
              <BaseInput
                :model-value="item.description"
                @update:model-value="updateItem(index, 'description', $event)"
                type="textarea"
                :rows="2"
                placeholder="Descripción detallada (opcional)"
              />
            </div>
          </td>
          <td class="px-3 py-4 align-top">
            <BaseInput
              type="number"
              :model-value="item.quantity"
              @update:model-value="updateItem(index, 'quantity', $event)"
              min="1"
              class="text-right"
            />
          </td>
          <td class="px-3 py-4 align-top">
            <BaseInput
              type="number"
              :model-value="item.price"
              @update:model-value="updateItem(index, 'price', $event)"
              min="0"
              step="0.01"
            />
          </td>
          <td class="px-3 py-4 align-top text-right text-sm font-medium text-gray-900 pt-4">
            {{ formatCurrency(item.total, currency) }}
          </td>
          <td class="relative py-4 pl-3 pr-4 text-center align-top sm:pr-6 pt-3">
            <BaseButton variant="ghost" size="sm" @click="$emit('remove-item', index)">
              <Trash2 class="h-5 w-5" />
            </BaseButton>
          </td>
        </tr>
      </tbody>
      <tfoot class="bg-gray-50">
        <tr>
          <td colspan="5" class="px-4 py-3 sm:px-6">
            <BaseButton variant="secondary" size="sm" @click="$emit('add-item')">
              <Plus class="h-4 w-4 mr-1" />
              Agregar Servicio
            </BaseButton>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>
