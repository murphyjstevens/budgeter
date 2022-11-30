import { type Ref, ref } from 'vue'
import { defineStore } from 'pinia'

export const useDateStore = defineStore('date', () => {
  const date: Ref<Date> = ref(initializeDate())

  function changeDate(isIncrement: boolean) {
    if (isIncrement) {
      date.value = new Date(date.value.setMonth(date.value.getMonth() + 1))
    } else {
      date.value = new Date(date.value.setMonth(date.value.getMonth() - 1))
    }
  }

  function initializeDate(): Date {
    const newDate = new Date()
    const year = newDate.getFullYear()
    const month = newDate.getMonth()
    return new Date(year, month, 1)
  }

  return { date, changeDate }
})
