import { type Ref, ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import type { Budget } from '@/models'
import { useLoadingStore } from './loading'
import { useToastStore } from './toast'
import { useDateStore } from './date'
import { useCategoryStore } from './category'

export const useBudgetStore = defineStore('budget', () => {
  const baseUrl = import.meta.env.VITE_API_API_URL

  const categoryStore = useCategoryStore()
  const dateStore = useDateStore()
  const loadingStore = useLoadingStore()
  const toastStore = useToastStore()

  const all: Ref<Array<Budget>> = ref([])
  const readyToBudget: Ref<number> = ref(0)

  async function get() {
    try {
      loadingStore.setIsLoading(true)
      const response = await axios.get(baseUrl + '/budgets', {
        params: { date: dateStore.date },
      })
      all.value = response.data.map((budget: Budget) => ({
        ...budget,
        date: new Date(budget.date),
      }))
    } catch (error: any) {
      toastStore.setToast(error.message, true)
      console.error(error)
    } finally {
      loadingStore.setIsLoading(false)
    }
  }

  async function getReadyToBudget() {
    try {
      loadingStore.setIsLoading(true)
      const response = await axios.get(`${baseUrl}/budgets/ready-to-budget`)
      readyToBudget.value = response.data
    } catch (error: any) {
      toastStore.setToast(error.message, true)
      console.error(error)
    } finally {
      loadingStore.setIsLoading(false)
    }
  }

  async function save(budget: Budget) {
    try {
      if (!budget) {
        console.error('Empty budget object')
        return
      }
      loadingStore.setIsLoading(true)
      const response = await axios.post(baseUrl + '/budgets', budget)
      const newBudget: Budget = response.data

      all.value = [
        ...all.value.filter((b: Budget) => b.id !== newBudget.id),
        { ...newBudget, date: new Date(newBudget.date) },
      ]

      await categoryStore.get()
      await getReadyToBudget()
    } catch (error: any) {
      toastStore.setToast(error.message, true)
      console.error(error)
    } finally {
      loadingStore.setIsLoading(false)
    }
  }

  async function remove(budgetId: number) {
    try {
      if (!budgetId) {
        console.error('Empty budgetId')
        return
      }
      loadingStore.setIsLoading(true)
      await axios.delete(`${baseUrl}/budgets/${budgetId}`)

      all.value = all.value.filter((budget: Budget) => budget.id !== budgetId)
    } catch (error: any) {
      toastStore.setToast(error.message, true)
      console.error(error)
    } finally {
      loadingStore.setIsLoading(false)
    }
  }

  return { all, readyToBudget, get, getReadyToBudget, save, remove }
})
