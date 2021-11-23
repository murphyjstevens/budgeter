import { createStore } from 'vuex'

import accounts from './modules/accounts'
import categories from './modules/categories'
import categoryGroups from './modules/category-groups'
import recipients from './modules/recipients'
import transactions from './modules/transactions'

export default createStore({
  strict: true,
  modules: {
    accounts,
    categories,
    categoryGroups,
    recipients,
    transactions
  },
  state: () => ({
    isLoading: false
  }),
  mutations: {
    setIsLoading(state, isLoading) {
      state.isLoading = isLoading
    }
  }
})