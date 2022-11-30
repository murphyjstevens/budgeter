import { ref, type Ref } from 'vue'
import axios from 'axios'
import { defineStore } from 'pinia'
import type { Recipient } from '@/models'
import { useLoadingStore, useToastStore } from '@/store'

export const useRecipientStore = defineStore('recipient', () => {
  const baseUrl = import.meta.env.VITE_API_API_URL

  const loadingStore = useLoadingStore()
  const toastStore = useToastStore()

  const all: Ref<Array<Recipient>> = ref([])

  async function get() {
    try {
      loadingStore.setIsLoading(true)
      const response = await axios.get(`${baseUrl}/recipients`)
      all.value = response.data.sort((a: Recipient, b: Recipient) =>
        a.name.localeCompare(b.name)
      )
    } catch (error: any) {
      toastStore.setToast(error.message, true)
      console.error(error)
    } finally {
      loadingStore.setIsLoading(false)
    }
  }

  async function create(recipient: Recipient) {
    try {
      loadingStore.setIsLoading(true)
      const response = await axios.post(`${baseUrl}/recipients`, recipient)
      all.value = [...all.value, response.data].sort((a, b) =>
        a.name.localeCompare(b.name)
      )
    } catch (error: any) {
      toastStore.setToast(error.message, true)
      console.error(error)
    } finally {
      loadingStore.setIsLoading(false)
    }
  }

  async function update(recipient: Recipient) {
    try {
      if (!recipient) {
        console.error('Empty recipient object')
        return
      }
      loadingStore.setIsLoading(true)
      const response = await axios.put(`${baseUrl}/recipients`, recipient)
      all.value = [
        ...all.value.filter((c) => c.id !== response.data.id),
        response.data,
      ].sort((a, b) => a.name.localeCompare(b.name))
    } catch (error: any) {
      toastStore.setToast(error.message, true)
      console.error(error)
    } finally {
      loadingStore.setIsLoading(false)
    }
  }

  async function remove(id: number) {
    try {
      if (!id) {
        console.error('Empty recipientId')
        return
      }
      loadingStore.setIsLoading(true)
      await axios.delete(`${baseUrl}/recipients/${id}`)
      all.value = all.value.filter((recipient) => recipient.id !== id)
    } catch (error: any) {
      toastStore.setToast(error.message, true)
      console.error(error)
    } finally {
      loadingStore.setIsLoading(false)
    }
  }

  function setRecipientIsEditing(recipient: Recipient) {
    const index = all.value.findIndex((p) => p.id === recipient.id)
    all.value[index].isEditing = recipient.isEditing
  }

  return { all, get, create, update, remove, setRecipientIsEditing }
})
