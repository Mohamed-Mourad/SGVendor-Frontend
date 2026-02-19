<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative" :dir="currentLang === 'AR' ? 'rtl' : 'ltr'">
    <!-- Language Switch -->
    <div class="absolute top-4 right-4">
      <button @click="toggleLanguage" class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-[#a5b43d] transition-colors">
        <i class="pi pi-globe text-lg"></i>
        <span>{{ currentLang }}</span>
      </button>
    </div>

    <div class="max-w-md w-full space-y-8 flex flex-col items-center">
      <div>
        <img :src="logoHorizontal" alt="SGMart" class="h-16 w-auto mx-auto mb-6" />
        <h2 class="mt-2 text-center text-3xl font-extrabold text-[#a5b43d]">
          {{ t.title }}
        </h2>
      </div>
      <form class="mt-8 space-y-6 w-full" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">{{ t.emailLabel }}</label>
            <input id="email-address" name="email" type="email" autocomplete="email" required v-model="email"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#a5b43d] focus:border-[#a5b43d] focus:z-10 sm:text-sm"
              :placeholder="t.emailPlaceholder">
          </div>
          <div>
            <label for="password" class="sr-only">{{ t.passwordLabel }}</label>
            <input id="password" name="password" type="password" autocomplete="current-password" required v-model="password"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#a5b43d] focus:border-[#a5b43d] focus:z-10 sm:text-sm"
              :placeholder="t.passwordPlaceholder">
          </div>
        </div>

        <div v-if="error" class="text-red-500 text-sm text-center">
            {{ error }}
        </div>

        <div>
          <button type="submit" :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#a5b43d] hover:bg-[#8e9b34] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a5b43d]">
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <i class="pi pi-lock" :class="{'pi-spin pi-spinner': loading}"></i>
            </span>
            {{ t.signInButton }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import logoHorizontal from '@/assets/logo_horizontal.png';

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const currentLang = ref(localStorage.getItem('locale') ? localStorage.getItem('locale').toUpperCase() : 'EN');

const router = useRouter();
const authStore = useAuthStore();

const translations = {
  EN: {
    title: 'Sign in to Vendor Dashboard',
    emailLabel: 'Email address',
    emailPlaceholder: 'Email address',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Password',
    signInButton: 'Sign in',
    invalidCreds: 'Invalid email or password'
  },
  AR: {
    title: 'تسجيل الدخول إلى لوحة البائع',
    emailLabel: 'البريد الإلكتروني',
    emailPlaceholder: 'البريد الإلكتروني',
    passwordLabel: 'كلمة المرور',
    passwordPlaceholder: 'كلمة المرور',
    signInButton: 'تسجيل الدخول',
    invalidCreds: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
  }
};

const t = computed(() => translations[currentLang.value]);

const toggleLanguage = () => {
  currentLang.value = currentLang.value === 'EN' ? 'AR' : 'EN';
  localStorage.setItem('locale', currentLang.value.toLowerCase());
};

const handleLogin = async () => {
    loading.value = true;
    error.value = '';
    try {
        await authStore.login(email.value, password.value);
        router.push('/');
    } catch (err) {
        error.value = t.value.invalidCreds;
    } finally {
        loading.value = false;
    }
};
</script>
