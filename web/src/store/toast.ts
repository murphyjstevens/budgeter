import { type Ref, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Toast } from '@/models'

export const useToastStore = defineStore('toast', () => {
  const toast: Ref<Toast | null> = ref(null)

  function setToast(toastMessage: string, isError: boolean) {
    toast.value = {
      toastMessage,
      isError,
    } as Toast
  }

  return { toast, setToast }
})
