<template>
  <input
    :value="modelValue"
    @input="
      $emit('update:modelValue', ($event?.target as HTMLInputElement)?.value)
    "
    class="bg-slate-600 text-white border border-gray-700 rounded-md px-3 py-1 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
    @onfocus="onFocus($event)"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue?: any
}>()

defineEmits(['update:modelValue'])

function onFocus(el: any) {
  el.select()
}
</script>
