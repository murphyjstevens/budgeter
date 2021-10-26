import { createStore } from 'vuex'

import accounts from './modules/accounts'
import categories from './modules/categories'
import categoryGroups from './modules/category-groups'
import transactions from './modules/transactions'

export default createStore({
  strict: true,
  modules: {
    accounts,
    categories,
    categoryGroups,
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