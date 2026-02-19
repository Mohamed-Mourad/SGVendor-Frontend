<template>
  <div class="min-h-screen bg-[#f8f9fa] p-4 lg:p-8">
    <!-- Header -->
    <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <h1 class="text-3xl font-semibold text-[#a5b43d] mb-2">Dashboard</h1>
      
      <!-- Date Range Picker -->
      <div class="w-full md:w-auto">
        <DatePicker v-model="dateRange" selectionMode="range" :manualInput="false" placeholder="Select Date Range" showIcon class="w-full md:w-64" />
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
       <i class="pi pi-spin pi-spinner text-4xl text-[#a5b43d]"></i>
    </div>

    <div v-else-if="error" class="bg-red-50 text-red-600 p-4 rounded-lg mb-8">
        {{ error }}
        <button @click="fetchDashboardData" class="ml-2 underline hover:no-underline">Retry</button>
    </div>

    <div v-else>
        <!-- Metric Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div v-for="metric in metrics" :key="metric.label" class="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-40">
            <div class="flex justify-between items-start">
            <span class="text-[0.7rem] uppercase font-bold text-gray-400 tracking-wider">{{ metric.label }}</span>
            <div :class="['w-8 h-8 rounded-lg flex items-center justify-center', metric.iconBg]">
                <i :class="[metric.icon, metric.iconColor, 'text-sm']"></i>
            </div>
            </div>
            <div>
            <h2 class="text-3xl font-bold text-gray-900 mb-2">{{ metric.formattedValue }}</h2>
            <div class="flex items-center gap-1">
                <i :class="['pi text-[0.7rem]', metric.growth >= 0 ? 'pi-arrow-up-right text-[#a5b43d]' : 'pi-arrow-down-right text-red-400']"></i>
                <span :class="[metric.growth >= 0 ? 'text-[#a5b43d]' : 'text-red-400', 'text-[0.8rem] font-bold']">
                {{ metric.growth >= 0 ? '+' : '' }}{{ metric.growth }}%
                </span>
                <span class="text-gray-400 text-[0.8rem] ml-1">vs last period</span>
            </div>
            </div>
        </div>
        </div>

        <!-- Middle Section: Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 items-stretch">
        <!-- Sales Performance Area Chart -->
        <div class="lg:col-span-2 bg-white rounded-[1.5rem] p-8 shadow-sm border border-gray-100 flex flex-col">
            <h3 class="text-xl font-semibold text-[#a5b43d] mb-6">Sales Performance</h3>
            <p class="text-gray-600 text-sm mb-4">Sales Amount (EGP)</p>
            <div class="flex-grow min-h-[350px] relative">
            <Chart type="line" :data="lineChartData" :options="lineChartOptions" class="h-full w-full" />
            </div>
        </div>

        <!-- Sales by Category Doughnut -->
        <div class="bg-white rounded-[1.5rem] p-8 shadow-sm border border-gray-100 flex flex-col">
            <div class="flex items-center justify-between mb-2">
            <h3 class="text-xl font-semibold text-[#a5b43d]">Sales by Category</h3>
            </div>
            <div class="flex-grow flex items-center justify-center relative min-h-[250px]">
             <Chart type="doughnut" :data="pieChartData" :options="pieChartOptions" class="w-full" />
            </div>
        </div>
        </div>

        <!-- Bottom Section: Top Sold Products Table -->
        <div class="bg-white rounded-[1.5rem] p-8 shadow-sm border border-gray-100">
        <h3 class="text-xl font-semibold text-[#a5b43d] mb-6">Top Sold Products</h3>
        
        <DataTable :value="topProducts" tableStyle="min-width: 50rem">
            <Column field="id" header="ID"></Column>
            <Column field="name" header="Product Name"></Column>
            <Column field="sold" header="Units Sold"></Column>
        </DataTable>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import DashboardService from '@/services/DashboardService';
import Chart from 'primevue/chart';
import DatePicker from 'primevue/datepicker';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const dateRange = ref(null);
const loading = ref(false);
const error = ref(null);

const metrics = ref([]);
const lineChartData = ref(null);
const pieChartData = ref(null);
const topProducts = ref([]);

// Helper to format currency
const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP' }).format(value);
};

// Default Chart Options
const lineChartOptions = ref({
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true }
  },
  scales: {
    y: {
      border: { display: false },
      grid: {
        color: '#f0f0f0',
        drawTicks: false,
        borderDash: [5, 5]
      },
      ticks: {
        color: '#999',
        font: { size: 12 },
        callback: (value) => value === 0 ? '0' : value / 1000 + 'k'
      }
    },
    x: {
      border: { display: false },
      grid: { display: false },
      ticks: { color: '#666', font: { size: 12 } }
    }
  }
});

const pieChartOptions = ref({
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: {
      position: 'right',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 15,
        color: '#666',
        font: { size: 12 }
      }
    }
  }
});

const fetchDashboardData = async () => {
  loading.value = true;
  error.value = null;
  try {
    let fromDate = null;
    let toDate = null;

    if (dateRange.value && dateRange.value[0]) {
        fromDate = dateRange.value[0].toISOString().split('T')[0];
    }
    if (dateRange.value && dateRange.value[1]) {
        toDate = dateRange.value[1].toISOString().split('T')[0];
    }

    const data = await DashboardService.getDashboardStats(fromDate, toDate);
    
    // Process Metrics
    metrics.value = [
        { 
            label: 'Total Sales', 
            formattedValue: formatCurrency(data.totalSales.value), 
            growth: data.totalSales.growth, 
            icon: 'pi pi-euro', 
            iconBg: 'bg-[#e9f5ed]', 
            iconColor: 'text-[#52c41a]' 
        },
        { 
            label: 'Total Orders', 
            formattedValue: data.totalOrders.value, 
            growth: data.totalOrders.growth, 
            icon: 'pi pi-file', 
            iconBg: 'bg-[#e6f4ff]', 
            iconColor: 'text-[#1890ff]' 
        },
        { 
            label: 'Products Sold', 
            formattedValue: data.productsSold.value, 
            growth: data.productsSold.growth, 
            icon: 'pi pi-shopping-bag', 
            iconBg: 'bg-[#fffbe6]', 
            iconColor: 'text-[#faad14]' 
        },
        { 
            label: 'Growth', 
            formattedValue: data.growth.value + '%', 
            growth: data.growth.growth, 
            icon: 'pi pi-chart-line', 
            iconBg: 'bg-[#fff2e8]', 
            iconColor: 'text-[#fa541c]' 
        }
    ];

    // Process Line Chart
    lineChartData.value = {
        labels: data.salesPerformance.labels,
        datasets: [
            {
                label: 'Sales Amount (EGP)',
                data: data.salesPerformance.data,
                fill: true,
                borderColor: '#a3e4eb',
                backgroundColor: 'rgba(163, 228, 235, 0.2)',
                tension: 0.4,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#a3e4eb',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }
        ]
    };

    // Process Pie Chart
    const categories = data.salesByCategory.map(item => item.category);
    const categoryValues = data.salesByCategory.map(item => item.percentage);
    // Dynamic colors could be better, simplified for now
    const bgColors = ['#8b8df2', '#f28b8b', '#8be5f2', '#f2c18b', '#8baff2', '#8bf2a5', '#b68bf2'];

    pieChartData.value = {
        labels: categories,
        datasets: [
            {
                data: categoryValues,
                backgroundColor: bgColors.slice(0, categories.length), // Ensure we have enough colors or repeat
                borderWidth: 0,
                hoverOffset: 4
            }
        ]
    };

    // Process Top Products
    topProducts.value = data.topSoldProducts;

  } catch (err) {
    console.error('Failed to fetch dashboard data:', err);
    error.value = 'Failed to load dashboard data. Please try again.';
  } finally {
    loading.value = false;
  }
};

watch(dateRange, () => {
    // Debounce or just fetch? PrimeVue DatePicker range might trigger on first date select.
    // Usually best to wait for both dates or use a button, but let's try auto-fetch if both dates are present or cleared
    if (!dateRange.value || (dateRange.value[0] && dateRange.value[1])) {
        fetchDashboardData();
    }
});

onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
/* Custom fonts or specific adjustments if needed */
</style>
