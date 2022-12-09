<template>
  <button
    type="button"
    class="rounded-full px-3 py-1 disabled:opacity-30 disabled:cursor-not-allowed"
    :class="{
      'bg-indigo-700 hover:bg-indigo-600 active:bg-indigo-800':
        type === 'primary',
      'bg-gray-400 hover:bg-gray-500 active:bg-gray-300 text-gray-900':
        type === 'default',
      'border-2 border-indigo-700 text-indigo-400 hover:bg-indigo-700 hover:text-white active:bg-indigo-800':
        type === 'primary-outline',
      'border-2 border-gray-400 hover:bg-gray-400 hover:text-gray-900 active:bg-gray-300 disabled:bg-transparent disabled:text-white':
        type === 'default-outline',
      'border-2 border-red-600 text-red-500 hover:bg-red-600 hover:text-white active:bg-red-800':
        type === 'danger-outline',
    }"
  >
    <i v-if="icon" class="bi" :class="[`bi-${icon}`, { 'mr-2': text }]"></i>
    <span v-if="text">{{ text }}</span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  icon?: string
  text?: string
  type: string
}>()
</script>
