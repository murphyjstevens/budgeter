import { ref, type Ref } from 'vue'
import axios from 'axios'
import { defineStore } from 'pinia'
import type { CategoryGroup } from '@/models'
import { useLoadingStore, useToastStore } from '@/store'

export const useCategoryGroupStore = defineStore('categoryGroup', () => {
  const baseUrl = import.meta.env.VITE_API_API_URL

  const loadingStore = useLoadingStore()
  const toastStore = useToastStore()

  const all: Ref<Array<CategoryGroup>> = ref([])

  async function get() {
    try {
      loadingStore.setIsLoading(true)
      const response = await axios.get(`${baseUrl}/category-groups`)
      const categoryGroups: Array<CategoryGroup> = response.data
      all.value = categoryGroups.sort((a, b) => a.sortOrder - b.sortOrder)
    } catch (error: any) {
      toastStore.setToast(error.message, true)
      console.error(error)
    } finally {
      loadingStore.setIsLoading(false)
    }
  }

  async function create(categoryGroup: CategoryGroup) {
    try {
      loadingStore.setIsLoading(true)
      const response = await axios.post(
        `${baseUrl}/category-groups`,
        categoryGroup
      )

      const newCategoryGroup: CategoryGroup = response.data
      all.value = [...all.value, newCategoryGroup].sort(
        (a, b) => a.sortOrder - b.sortOrder
      )
    } catch (error: any) {
      toastStore.setToast(error.message, true)
      console.error(error)
    } finally {
      loadingStore.setIsLoading(false)
    }
  }

  async function update(categoryGroup: CategoryGroup) {
    try {
      if (!categoryGroup) {
        console.error('Empty categoryGroup object')
        return
      }
      loadingStore.setIsLoading(true)
      const response = await axios.put(
        `${baseUrl}/category-groups`,
        categoryGroup
      )

      const newCategoryGroup: CategoryGroup = response.data
      all.value = [
        ...all.value.filter((c) => c.id !== categoryGroup.id),
        newCategoryGroup,
      ].sort((a, b) => a.sortOrder - b.sortOrder)
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
        `${baseUrl}/category-groups/reorder`,
        request
      )

      const ids = [response.data.item1.id, response.data.item2.id]
      all.value = [
        ...all.value.filter((group) => !ids.includes(group.id)),
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

  async function remove(id: number) {
    try {
      if (!id) {
        console.error('Empty groupId')
        return
      }
      loadingStore.setIsLoading(true)
      await axios.delete(`${baseUrl}/category-groups/${id}`)
      all.value = all.value.filter((group) => group.id !== id)
    } catch (error: any) {
      toastStore.setToast(error.message, true)
      console.error(error)
    } finally {
      loadingStore.setIsLoading(false)
    }
  }

  return { all, get, create, update, reorder, remove }
})
