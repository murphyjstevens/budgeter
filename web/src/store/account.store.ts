import { type Ref, ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import type { Account } from '@/models'
import { useLoadingStore } from './loading.store'
import { useToastStore } from './toast.store'

export const useAccountStore = defineStore('account', () => {
  const baseUrl = import.meta.env.VITE_API_API_URL

  const loadingStore = useLoadingStore()
  const toastStore = useToastStore()

  const accountNameRegex = /^[a-zA-Z '0-9]+$/

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

  async function create(name: string): Promise<Account | null> {
    try {
      if (!name?.length) {
        throw new Error('Name is required')
      }

      if (!accountNameRegex.test(name)) {
        throw new Error(
          'Name must only container letters, numbers, and hyphens'
        )
      }

      const url = name.replace("'", '').replace(' ', '-')

      if (
        all.value.some(
          (account) =>
            account.name.trim() === name.trim() || account.url === url
        )
      ) {
        throw new Error('Name is already taken by another account')
      }

      const request = {
        name: name,
        url: url,
      }

      const response = await axios.post(`${baseUrl}/accounts`, request)
      all.value = [...all.value, response.data as Account]
      return response.data as Account
    } catch (error: any) {
      toastStore.setToast(error.message, true)
      console.error(error)
      throw error
    }
  }

  return { accountNameRegex, all, account, get, find, create }
})
