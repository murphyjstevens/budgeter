<template>
  <input ref="inputRef" type="text" class="form-control text-right" />
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useCurrencyInput } from 'vue-currency-input'

const props = defineProps<{
  modelValue?: number
  options: any
}>()

const { inputRef, setValue } = useCurrencyInput(props.options)

watch(
  () => props.modelValue,
  (value: number | undefined) => {
    setValue(value ?? null)
  }
)
</script>
