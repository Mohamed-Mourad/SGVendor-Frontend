<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar v-if="!$route.meta.hideSidebar" :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />

    <!-- Main Content Wrapper -->
    <div class="flex-1 flex flex-col overflow-hidden relative">
      <!-- Mobile Header -->
      <header v-if="!$route.meta.hideSidebar" class="bg-white border-b border-gray-200 p-4 flex items-center justify-between md:hidden z-10">
        <button @click="isSidebarOpen = true" class="text-gray-500 focus:outline-none">
          <i class="pi pi-bars text-xl"></i>
        </button>
        <span class="font-bold text-gray-700">Vendor Dashboard</span>
        <div class="w-6"></div> <!-- Spacer for centering -->
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50" :class="{ 'p-4 md:p-8': !$route.meta.hideSidebar }">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Sidebar from '@/components/Sidebar.vue';

const isSidebarOpen = ref(false);
</script>
