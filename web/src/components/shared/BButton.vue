<template>
  <button
    type="button"
    class="rounded-full px-4 py-1"
    :class="{
      'bg-indigo-700 hover:bg-indigo-600 active:bg-indigo-800':
        type === 'primary',
      'bg-gray-400 hover:bg-gray-500 active:bg-gray-300 text-gray-900':
        type === 'default',
      'border-2 border-indigo-700 text-indigo-400 hover:bg-indigo-700 hover:text-white active:bg-indigo-800':
        type === 'primary-outline',
      'border-2 border-gray-400 hover:bg-gray-400 hover:text-gray-900 active:bg-gray-300':
        type === 'default-outline',
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
