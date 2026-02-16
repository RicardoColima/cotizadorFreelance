<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: () => `input-${Math.random().toString(36).substr(2, 9)}`
  },
  rows: {
    type: [String, Number],
    default: 3
  }
})

const emit = defineEmits(['update:modelValue'])

const handleInput = (event, inputType) => {
  let value = event.target.value
  if (inputType === 'number') {
    value = value === '' ? '' : Number(value)
  }
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <div class="relative rounded-md shadow-sm">
      <textarea
        v-if="type === 'textarea'"
        :id="id"
        :value="modelValue"
        @input="handleInput($event, 'textarea')"
        :rows="rows"
        :placeholder="placeholder"
        :class="[
          'block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6',
          error 
            ? 'ring-red-300 placeholder:text-red-300 focus:ring-red-500' 
            : 'ring-gray-300 placeholder:text-gray-400 focus:ring-primary-600'
        ]"
      ></textarea>
      <input
        v-else
        :id="id"
        :type="type"
        :value="modelValue"
        @input="handleInput($event, type)"
        :placeholder="placeholder"
        :class="[
          'block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6',
          error 
            ? 'ring-red-300 placeholder:text-red-300 focus:ring-red-500' 
            : 'ring-gray-300 placeholder:text-gray-400 focus:ring-primary-600'
        ]"
      />
    </div>
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>
