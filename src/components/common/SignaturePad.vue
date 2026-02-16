<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'save'])

const canvas = ref(null)
const isDrawing = ref(false)
const context = ref(null)

const startDrawing = (e) => {
  isDrawing.value = true
  const rect = canvas.value.getBoundingClientRect()
  const x = (e.clientX || e.touches[0].clientX) - rect.left
  const y = (e.clientY || e.touches[0].clientY) - rect.top
  
  context.value.beginPath()
  context.value.moveTo(x, y)
}

const stopDrawing = () => {
  if (isDrawing.value) {
    context.value.stroke()
    context.value.closePath()
    isDrawing.value = false
    saveSignature()
  }
}

const draw = (e) => {
  if (!isDrawing.value) return

  const rect = canvas.value.getBoundingClientRect()
  const x = (e.clientX || e.touches[0].clientX) - rect.left
  const y = (e.clientY || e.touches[0].clientY) - rect.top

  context.value.lineTo(x, y)
  context.value.stroke()
  
  // Keep the path continuous for smoother lines, 
  // but since we want to see it as we draw, stroke is called.
  // To avoid accumulating points in a single path that gets restroked:
  context.value.beginPath()
  context.value.moveTo(x, y)
}

const clear = () => {
  context.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
  emit('update:modelValue', null)
}

const saveSignature = () => {
  const dataUrl = canvas.value.toDataURL('image/png')
  emit('update:modelValue', dataUrl)
  emit('save', dataUrl)
}

const resizeCanvas = () => {
  const parent = canvas.value.parentElement
  canvas.value.width = parent.clientWidth
  canvas.value.height = 200 // Fixed height
}

onMounted(() => {
  context.value = canvas.value.getContext('2d')
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas)
})
</script>

<template>
  <div class="w-full">
    <div class="border-2 border-dashed border-gray-300 rounded-lg bg-white overflow-hidden touch-none relative">
      <canvas
        ref="canvas"
        @mousedown="startDrawing"
        @mouseup="stopDrawing"
        @mousemove="draw"
        @touchstart.prevent="startDrawing"
        @touchend.prevent="stopDrawing"
        @touchmove.prevent="draw"
        class="w-full h-[200px] cursor-crosshair"
      ></canvas>
      
      <div class="absolute bottom-2 right-2 flex gap-2">
        <button 
          @click="clear"
          class="text-xs px-2 py-1 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 text-gray-600"
        >
          Limpiar
        </button>
      </div>
    </div>
    <p class="mt-2 text-xs text-center text-gray-400">Dibuja tu firma en el recuadro de arriba</p>
  </div>
</template>
