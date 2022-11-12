<template>
  <div
    class="toast align-items-center text-white bg-primary border-0 mt-3"
    :class="{ show: showToast, 'bg-primary': !isError, 'bg-danger': isError }"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    <div class="d-flex">
      <div class="toast-body">
        {{ toastMessage }}
      </div>
      <button
        type="button"
        class="btn-close btn-close-white me-2 m-auto"
        data-bs-dismiss="toast"
        aria-label="Close"
      ></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type ComputedRef, computed, type Ref, ref, watch } from 'vue'
import type { Toast } from '@/models'
import { useToastStore } from '@/store'

const toastStore = useToastStore()

let timeout: number | undefined = undefined

const toastMessage: Ref<string> = ref('')
const showToast: Ref<boolean> = ref(false)
const isError: Ref<boolean> = ref(false)

const toast: ComputedRef<Toast | null> = computed(() => toastStore.toast)

watch(
  () => toast.value,
  () => {
    toastMessage.value = toast.value?.toastMessage ?? ''
    isError.value = toast.value?.isError ?? false
    showToast.value = true

    clearTimeout(timeout)

    timeout = setTimeout(() => {
      showToast.value = false
    }, 5000)
  }
)
</script>

<style scoped>
.toast {
  width: auto;
  min-width: 350px;

  position: fixed;
  left: 50%;
  transform: translateX(calc(-50% + 120px));
}
</style>
