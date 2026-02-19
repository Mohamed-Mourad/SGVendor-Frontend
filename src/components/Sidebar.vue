<template>
  <aside class="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 transform md:relative md:translate-x-0" :class="{ '-translate-x-full': !isOpen, 'translate-x-0': isOpen }">
    <!-- Vendor Header -->
    <div class="p-6 border-b border-gray-100 flex flex-col items-center">
      <div class="w-20 h-20 rounded-full bg-gray-100 border-2 border-[#a5b43d] flex items-center justify-center overflow-hidden mb-3">
        <img v-if="vendor.imageUrl" :src="vendor.imageUrl" alt="Vendor" class="w-full h-full object-cover" />
        <i v-else class="pi pi-user text-3xl text-gray-400"></i>
      </div>
      <h2 class="text-lg font-bold text-gray-900">{{ vendor.name || 'Vendor' }}</h2>
      <p class="text-xs text-gray-500 uppercase tracking-wider font-semibold">{{ vendor.email }}</p>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-6 px-3 space-y-1">
      <router-link to="/" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors" :class="$route.path === '/' ? 'bg-[#f4f6e7] text-[#8ea028]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Dashboard
      </router-link>
      <!-- Add more links here later -->
    </nav>

    <!-- Footer -->
    <div class="p-4 border-t border-gray-200 space-y-2">
      <!-- Logo -->
      <div class="flex justify-center mb-6">
        <img :src="logoHorizontal" alt="SGMart Logo" class="w-6/12 h-auto object-contain p-2" />
      </div>

      <!-- Language Switcher -->
      <button @click="toggleLanguage" class="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
        <div class="flex items-center gap-3">
          <i class="pi pi-globe text-lg"></i>
          Language
        </div>
        <span class="text-xs font-bold text-[#a5b43d] bg-[#f4f6e7] px-2 py-0.5 rounded">{{ currentLang }}</span>
      </button>

      <!-- Logout -->
      <button @click="logout" class="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
        <i class="pi pi-sign-out text-lg"></i>
        Sign Out
      </button>
    </div>
  </aside>

  <!-- Mobile Overlay -->
  <div v-if="isOpen" @click="$emit('close')" class="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 md:hidden"></div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import logoHorizontal from '@/assets/logo_horizontal.png';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const router = useRouter();
const authStore = useAuthStore();

const vendor = computed(() => authStore.vendor || {});

// Language Toggling (Placeholder for now)
const currentLang = 'EN';
const toggleLanguage = () => {
  // TODO: Implement actual i18n logic
  console.log('Language toggled');
};

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
