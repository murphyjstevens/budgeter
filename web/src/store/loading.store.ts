import { type Ref, ref } from 'vue'
import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', () => {
  const isLoading: Ref<boolean> = ref(false)

  function setIsLoading(loading: boolean) {
    isLoading.value = loading
  }

  return { isLoading, setIsLoading }
})
