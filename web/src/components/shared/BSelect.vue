<template>
  <select
    :value="modelValue"
    @input="
      $emit('update:modelValue', ($event?.target as HTMLInputElement)?.value)
    "
    class="bg-slate-600 text-white border border-gray-700 rounded-md w-full h-9 px-3 py-1 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
  >
    <slot></slot>
  </select>
</template>

<script setup lang="ts">
defineProps<{
  modelValue?: any
}>()

defineEmits(['update:modelValue'])
</script>
