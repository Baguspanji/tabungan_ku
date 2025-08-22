<template>
  <div class="min-h-screen bg-gray-50">
    <AppNavigation />

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <slot />
    </main>

    <!-- Toast Notifications -->
    <ToastNotification />
  </div>
</template>

<script setup lang="ts">
import AppNavigation from '@/components/AppNavigation.vue'
import ToastNotification from '@/components/ToastNotification.vue'
</script>
