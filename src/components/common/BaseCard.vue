<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  noPadding: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <div v-if="title || $slots.header" class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
      <h3 v-if="title" class="text-base font-semibold leading-6 text-gray-900">{{ title }}</h3>
      <slot name="header"></slot>
    </div>
    <div :class="noPadding ? '' : 'p-6'">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="bg-gray-50 px-6 py-4 border-t border-gray-100">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
