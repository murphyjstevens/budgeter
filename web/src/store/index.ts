import { createStore } from 'vuex'

import accounts from './modules/accounts'
import budgets from './modules/budgets'
import categories from './modules/categories'
import categoryGroups from './modules/category-groups'
import recipients from './modules/recipients'
import transactions from './modules/transactions'

export default createStore({
  strict: true,
  modules: {
    accounts,
    budgets,
    categories,
    categoryGroups,
    recipients,
    transactions
  },
  state: () => ({
    isLoading: false,
    toast: null,
    date: null
  }),
  mutations: {
    setIsLoading(state, isLoading) {
      state.isLoading = isLoading
    },
    setToast(state, toast) {
      state.toast = toast
    },
    changeDate(state, isIncrement) {
      if (isIncrement) {
        state.date = new Date(state.date.setMonth(state.date.getMonth()+1))
      } else {
        state.date = new Date(state.date.setMonth(state.date.getMonth()-1))
      }
    },
    initializeDate(state) {
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth()
      state.date = new Date(year, month, 1)
    }
  }
})