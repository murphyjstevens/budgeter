<template>
  <input
    :value="modelValue"
    @input="
      $emit('update:modelValue', ($event?.target as HTMLInputElement)?.value)
    "
    class="text-white border rounded-md w-full h-9 px-3 py-1 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 invalid:border-red-500 invalid:text-red-400 invalid:focus:border-red-400"
    :class="{
      'bg-slate-600 border-gray-700': backgroundType === 'default',
      'bg-transparent border-transparent': backgroundType === 'none',
    }"
    @focus="onFocus($event)"
  />
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: any
    backgroundType?: string
  }>(),
  {
    backgroundType: 'default',
  }
)

defineEmits(['update:modelValue'])

function onFocus(el: any) {
  el.target.select()
}
</script>
