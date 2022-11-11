<template>
  <input
    ref="inputRef"
    type="text"
    :value="formattedValue"
    class="form-control text-right"
  />
</template>

<script setup lang="ts">
import { useCurrencyInput } from 'vue-currency-input'

const props = defineProps<{
  modelValue?: number
  options: any
}>()

const { formattedValue, inputRef } = useCurrencyInput(props.options)
</script>
