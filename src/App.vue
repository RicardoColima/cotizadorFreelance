<script setup>
import { RouterView } from 'vue-router'
import ToastNotification from './components/common/ToastNotification.vue'
</script>

<template>
  <RouterView />
  <ToastNotification />
</template>

<style>
/* Global styles if needed, but Tailwind handles most */
</style>
