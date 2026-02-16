<script setup>
import { ref } from 'vue'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { X } from 'lucide-vue-next'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
import SidebarContent from './SidebarContent.vue'

const sidebarOpen = ref(false)
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Mobile sidebar -->
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog as="div" class="relative z-50 md:hidden" @close="sidebarOpen = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-900/80" />
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="-translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0" leave-to="-translate-x-full">
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100" leave-to="opacity-0">
                <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                    <span class="sr-only">Cerrar sidebar</span>
                    <X class="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>
              
              <!-- Sidebar component for mobile -->
              <div class="flex flex-col w-full h-full bg-slate-900 overflow-y-auto">
                <SidebarContent @click="sidebarOpen = false" />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <AppSidebar />
    
    <div class="md:pl-64 flex flex-col min-h-screen">
      <AppHeader @open-sidebar="sidebarOpen = true" />
      
      <main class="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <slot></slot>
      </main>
    </div>
  </div>
</template>
