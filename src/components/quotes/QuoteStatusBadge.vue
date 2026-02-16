<script setup>
import BaseBadge from '../common/BaseBadge.vue'
import { getStatusLabel, getStatusVariant } from '@/utils/quoteStatus'

defineProps({
  status: {
    type: String,
    required: true
  }
})
</script>

<template>
  <BaseBadge 
    :label="getStatusLabel(status)" 
    :variant="getStatusVariant(status)" 
  />
</template>
