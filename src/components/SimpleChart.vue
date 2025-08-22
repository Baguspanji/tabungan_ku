<template>
  <div class="bg-white shadow rounded-lg">
    <div class="px-4 py-5 sm:p-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">{{ title }}</h3>
      <div class="relative">
        <!-- Simple bar chart using CSS -->
        <div class="space-y-3">
          <div v-for="(item, index) in chartData" :key="index" class="flex items-center">
            <div class="w-20 text-sm text-gray-600 truncate">{{ item.label }}</div>
            <div class="flex-1 mx-3">
              <div class="h-6 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full transition-all duration-500 ease-out rounded-full" :class="item.color"
                  :style="{ width: `${item.percentage}%` }"></div>
              </div>
            </div>
            <div class="w-24 text-sm text-gray-900 text-right">{{ formatValue(item.value) }}</div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="chartData.length === 0" class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
            </path>
          </svg>
          <p class="mt-2 text-sm text-gray-500">{{ emptyMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface ChartDataItem {
  label: string
  value: number
  percentage: number
  color: string
}

interface Props {
  title: string
  data: Array<{ label: string; value: number }>
  formatType?: 'currency' | 'number'
  emptyMessage?: string
  colors?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  formatType: 'number',
  emptyMessage: 'Belum ada data untuk ditampilkan',
  colors: () => [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-indigo-500',
    'bg-pink-500',
    'bg-gray-500'
  ]
})

const chartData = computed((): ChartDataItem[] => {
  if (!props.data || props.data.length === 0) return []

  const maxValue = Math.max(...props.data.map(item => item.value))
  if (maxValue === 0) return []

  return props.data.map((item, index) => ({
    label: item.label,
    value: item.value,
    percentage: (item.value / maxValue) * 100,
    color: props.colors[index % props.colors.length]
  }))
})

const formatValue = (value: number): string => {
  if (props.formatType === 'currency') {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  return new Intl.NumberFormat('id-ID').format(value)
}
</script>
