<script setup>
import { Check } from 'lucide-vue-next'
import MainLayout from '../components/layout/MainLayout.vue'
import BaseButton from '../components/common/BaseButton.vue'
import BaseCard from '../components/common/BaseCard.vue'
import { useTemplatesStore } from '../stores/templates'

const templatesStore = useTemplatesStore()

const selectTemplate = (id) => {
  templatesStore.setTemplate(id)
}
</script>

<template>
  <MainLayout>
    <div class="max-w-5xl mx-auto">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Plantillas de Diseño</h1>
        <p class="mt-1 text-sm text-gray-500">Elige el diseño que mejor represente tu marca profesional.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="template in templatesStore.templates" 
          :key="template.id"
          class="relative group cursor-pointer"
          @click="selectTemplate(template.id)"
        >
          <div 
            class="relative aspect-[3/4] w-full overflow-hidden rounded-lg border-2 transition-all duration-200"
            :class="[
              template.active 
                ? 'border-primary-600 ring-2 ring-primary-600 ring-offset-2' 
                : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <!-- Preview Mockup -->
            <div :class="['w-full h-full p-6 flex flex-col', template.preview]">
              <div class="h-4 w-1/3 bg-gray-900/10 rounded mb-8"></div>
              <div class="space-y-3 mb-8">
                <div class="h-2 w-full bg-gray-900/10 rounded"></div>
                <div class="h-2 w-5/6 bg-gray-900/10 rounded"></div>
                <div class="h-2 w-4/6 bg-gray-900/10 rounded"></div>
              </div>
              <div class="mt-auto space-y-2">
                <div class="flex justify-between">
                  <div class="h-2 w-16 bg-gray-900/10 rounded"></div>
                  <div class="h-2 w-8 bg-gray-900/10 rounded"></div>
                </div>
                <div class="flex justify-between">
                  <div class="h-2 w-16 bg-gray-900/10 rounded"></div>
                  <div class="h-2 w-8 bg-gray-900/10 rounded"></div>
                </div>
                <div class="h-px bg-gray-900/10 my-2"></div>
                <div class="flex justify-between">
                  <div class="h-3 w-12 bg-gray-900/20 rounded"></div>
                  <div class="h-3 w-10 bg-gray-900/20 rounded"></div>
                </div>
              </div>
            </div>

            <!-- Active Badge -->
            <div 
              v-if="template.active"
              class="absolute top-2 right-2 bg-primary-600 text-white p-1.5 rounded-full shadow-sm"
            >
              <Check class="w-4 h-4" />
            </div>
          </div>

          <div class="mt-4">
            <h3 class="text-lg font-medium text-gray-900">{{ template.name }}</h3>
            <p class="text-sm text-gray-500">{{ template.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
