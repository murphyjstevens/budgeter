import { type Ref, ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import type { Account } from '@/models'
import { useLoadingStore } from './loading'
import { useToastStore } from './toast'

export const useAccountStore = defineStore('account', () => {
  const baseUrl = import.meta.env.VITE_API_API_URL

  const loadingStore = useLoadingStore()
  const toastStore = useToastStore()

  const all: Ref<Array<Account>> = ref([])
  const account: Ref<Account | null> = ref(null)

  async function get() {
    try {
      loadingStore.setIsLoading(true)
      const response = await axios.get(`${baseUrl}/accounts`)
      all.value = response.data
    } catch (error: any) {
      toastStore.setToast(error.message, true)
      console.error(error)
    } finally {
      loadingStore.setIsLoading(false)
    }
  }

  async function find(url: string) {
    try {
      if (!url) {
        console.error('Empty URL')
        return
      }
      loadingStore.setIsLoading(true)
      const response = await axios.get(`${baseUrl}/accounts/url/${url}`)
      account.value = response.data
    } catch (error: any) {
      toastStore.setToast(error.message, true)
      console.error(error)
    } finally {
      loadingStore.setIsLoading(false)
    }
  }

  return { all, account, get, find }
})
