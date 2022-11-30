import { ref, type Ref } from 'vue'
import axios from 'axios'
import { defineStore } from 'pinia'
import type { Transaction } from '@/models'
import { useLoadingStore, useToastStore } from '@/store'

export const useTransactionStore = defineStore('transaction', () => {
  const baseUrl = import.meta.env.VITE_API_API_URL

  const loadingStore = useLoadingStore()
  const toastStore = useToastStore()

  const all: Ref<Array<Transaction>> = ref([])

  async function get() {
    try {
      loadingStore.setIsLoading(true)
      const response = await axios.get(`${baseUrl}/transactions`)

      const transactions: Array<Transaction> = response.data
      all.value = transactions.map((transaction) => ({
        ...transaction,
        date: new Date(transaction.date),
      }))
      sortTransactions()
    } catch (error: any) {
      toastStore.setToast(error.message, true)
      console.error(error)
    } finally {
      loadingStore.setIsLoading(false)
    }
  }

  async function getByAccount(accountId: number) {
    try {
      loadingStore.setIsLoading(true)
      const response = await axios.get(
        `${baseUrl}/accounts/${accountId}/transactions`
      )
      const transactions: Array<Transaction> = response.data
      all.value = transactions.map((transaction) => ({
        ...transaction,
        date: new Date(transaction.date),
      }))
      sortTransactions()
    } catch (error: any) {
      toastStore.setToast(error.message, true)
      console.error(error)
    } finally {
      loadingStore.setIsLoading(false)
    }
  }

  async function getByCategory(categoryId: number) {
    try {
      loadingStore.setIsLoading(true)
      const response = await axios.get(
        `${baseUrl}/categories/${categoryId}/transactions`
      )
      const transactions: Array<Transaction> = response.data
      all.value = transactions.map((transaction) => ({
        ...transaction,
        date: new Date(transaction.date),
      }))
      sortTransactions()
    } catch (error: any) {
      toastStore.setToast(error.message, true)
      console.error(error)
    } finally {
      loadingStore.setIsLoading(false)
    }
  }

  async function create(transaction: Transaction) {
    try {
      if (!transaction) {
        console.error('Empty transaction object')
        return
      }
      loadingStore.setIsLoading(true)
      const response = await axios.post(`${baseUrl}/transactions`, transaction)
      const newTransaction: Transaction = response.data
      all.value.push({ ...newTransaction, date: new Date(newTransaction.date) })
      sortTransactions()
    } catch (error: any) {
      toastStore.setToast(error.message, true)
      console.error(error)
    } finally {
      loadingStore.setIsLoading(false)
    }
  }

  async function update(transaction: Transaction) {
    try {
      if (!transaction) {
        console.error('Empty transaction object')
        return
      }
      loadingStore.setIsLoading(true)
      const response = await axios.put(`${baseUrl}/transactions`, transaction)
      const newTransaction: Transaction = response.data
      const index = all.value.findIndex((p) => p.id === newTransaction.id)
      all.value[index] = {
        ...newTransaction,
        date: new Date(newTransaction.date),
      }
      sortTransactions()
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
        console.error('Empty transactionId')
        return
      }
      loadingStore.setIsLoading(true)
      await axios.delete(`${baseUrl}/transactions/${id}`)
      all.value = all.value.filter((transaction) => transaction.id !== id)
    } catch (error: any) {
      toastStore.setToast(error.message, true)
      console.error(error)
    } finally {
      loadingStore.setIsLoading(false)
    }
  }

  function sortTransactions() {
    all.value.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }

  function setTransactionIsEditing(transaction: Transaction) {
    const index = all.value.findIndex((p) => p.id === transaction.id)
    all.value[index].isEditing = transaction.isEditing
  }

  return {
    all,
    get,
    getByAccount,
    getByCategory,
    create,
    update,
    remove,
    setTransactionIsEditing,
  }
})
