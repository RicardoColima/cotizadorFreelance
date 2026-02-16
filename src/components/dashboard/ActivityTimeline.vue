<script setup>
import { computed } from 'vue'
import { CheckCircle, Send, FilePlus, Trash2, Clock, Eye } from 'lucide-vue-next'
import BaseCard from '../common/BaseCard.vue'
import { useQuotesStore } from '@/stores/quotes'
import { formatShortDate } from '@/utils/format'

const quotesStore = useQuotesStore()

const activities = computed(() => {
  return quotesStore.activities.slice(0, 5) // Show last 5 activities
})

const getIcon = (type) => {
  switch (type) {
    case 'created': return FilePlus
    case 'sent': return Send
    case 'viewed': return Eye
    case 'accepted': return CheckCircle
    case 'rejected': return Trash2
    case 'deleted': return Trash2
    default: return Clock
  }
}

const getIconColor = (type) => {
  switch (type) {
    case 'created': return 'bg-blue-500'
    case 'sent': return 'bg-purple-500'
    case 'viewed': return 'bg-indigo-500'
    case 'accepted': return 'bg-green-500'
    case 'rejected': return 'bg-red-500'
    case 'deleted': return 'bg-gray-500'
    default: return 'bg-gray-400'
  }
}
</script>

<template>
  <BaseCard title="Actividad Reciente" no-padding>
    <div class="flow-root p-6">
      <ul role="list" class="-mb-8">
        <li v-if="activities.length === 0" class="text-center py-4 text-gray-500 text-sm">
          No hay actividad reciente.
        </li>
        <li v-for="(activity, activityIdx) in activities" :key="activity.id">
          <div class="relative pb-8">
            <span v-if="activityIdx !== activities.length - 1" class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
            <div class="relative flex space-x-3">
              <div>
                <span :class="[getIconColor(activity.type), 'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white']">
                  <component :is="getIcon(activity.type)" class="h-5 w-5 text-white" aria-hidden="true" />
                </span>
              </div>
              <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                <div>
                  <p class="text-sm text-gray-500">
                    {{ activity.message }}
                  </p>
                </div>
                <div class="whitespace-nowrap text-right text-sm text-gray-500">
                  <time :datetime="activity.date">{{ formatShortDate(activity.date) }}</time>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </BaseCard>
</template>
