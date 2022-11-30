import { ref, type Ref } from 'vue'
import axios from 'axios'
import { defineStore } from 'pinia'
import type { Category } from '@/models'
import { useDateStore, useLoadingStore, useToastStore } from '@/store'

export const useCategoryStore = defineStore('category', () => {
  const baseUrl = import.meta.env.VITE_API_API_URL

  const dateStore = useDateStore()
  const loadingStore = useLoadingStore()
  const toastStore = useToastStore()

  const all: Ref<Array<Category>> = ref([])

  async function get() {
    try {
      loadingStore.setIsLoading(true)
      const response = await axios.get(`${baseUrl}/categories`, {
        params: { date: dateStore.date },
      })
      all.value = response.data.sort(
        (a: Category, b: Category) => a.sortOrder - b.sortOrder
      )
    } catch (error: any) {
      toastStore.setToast(error.message, true)
      console.error(error)
    } finally {
      loadingStore.setIsLoading(false)
    }
  }

  async function create(category: Category) {
    try {
      if (!category) {
        console.error('Empty category object')
        return
      }
      loadingStore.setIsLoading(true)
      const response = await axios.post(`${baseUrl}/categories`, category)
      const newCategory: Category = response.data
      all.value = [...all.value, newCategory].sort(
        (a, b) => a.sortOrder - b.sortOrder
      )
      return response.data
    } catch (error: any) {
      toastStore.setToast(error.message, true)
      console.error(error)
      return
    } finally {
      loadingStore.setIsLoading(false)
    }
  }

  async function update(category: Category) {
    try {
      if (!category) {
        console.error('Empty category object')
        return
      }
      loadingStore.setIsLoading(true)
      const response = await axios.put(`${baseUrl}/categories`, category)

      const newCategory: Category = response.data
      all.value = [
        ...all.value.filter((c) => c.id !== newCategory.id),
        newCategory,
      ].sort((a, b) => a.sortOrder - b.sortOrder)
    } catch (error: any) {
      toastStore.setToast(error.message, true)
      console.error(error)
    } finally {
      loadingStore.setIsLoading(false)
    }
  }

  async function remove(categoryId: number) {
    try {
      if (!categoryId) {
        console.error('Empty categoryId')
        return
      }

      loadingStore.setIsLoading(true)

      await axios.delete(`${baseUrl}/categories/${categoryId}`)

      all.value = all.value.filter((category) => category.id !== categoryId)
    } catch (error: any) {
      toastStore.setToast(error.message, true)
      console.error(error)
    } finally {
      loadingStore.setIsLoading(false)
    }
  }

  async function reorder(request: any) {
    try {
      if (!request.item1 || !request.item2) {
        console.error('The parameters are invalid')
        return
      }
      loadingStore.setIsLoading(true)
      const response = await axios.patch(
        `${baseUrl}/categories/reorder`,
        request
      )

      const ids = [response.data.item1.id, response.data.item2.id]
      all.value = [
        ...all.value.filter((category) => !ids.includes(category.id)),
        response.data.item1,
        response.data.item2,
      ].sort((a, b) => a.sortOrder - b.sortOrder)
    } catch (error: any) {
      toastStore.setToast(error.message, true)
      console.error(error)
    } finally {
      loadingStore.setIsLoading(false)
    }
  }

  return { all, get, create, update, remove, reorder }
})
