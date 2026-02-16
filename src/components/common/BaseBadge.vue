<script setup>
defineProps({
  variant: {
    type: String,
    default: 'gray',
    validator: (value) => ['gray', 'green', 'blue', 'yellow', 'red', 'purple'].includes(value)
  },
  label: {
    type: String,
    required: true
  }
})
</script>

<template>
  <span
    class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset"
    :class="[
      variant === 'gray' ? 'bg-gray-50 text-gray-600 ring-gray-500/10' : '',
      variant === 'green' ? 'bg-green-50 text-green-700 ring-green-600/20' : '',
      variant === 'blue' ? 'bg-blue-50 text-blue-700 ring-blue-700/10' : '',
      variant === 'yellow' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' : '',
      variant === 'red' ? 'bg-red-50 text-red-700 ring-red-600/10' : '',
      variant === 'purple' ? 'bg-purple-50 text-purple-700 ring-purple-700/10' : ''
    ]"
  >
    {{ label }}
  </span>
</template>
