import axios from 'axios'

const baseUrl = process.env.VUE_APP_ROOT_API

const state = () => ({
  all: []
})

const actions = {
  async getByAccount ({ commit }, accountId) {
    try {
      commit('setIsLoading', true, { root: true })
      const response = await axios.get(baseUrl + '/transactions/' + accountId)
      commit('setTransactions', response.data)
      commit('setIsLoading', false, { root: true })
    } catch (error) {
      commit('setIsLoading', false, { root: true })
      console.error(error)
    }
  },
  async getByCategory ({ commit }, categoryId) {
    try {
      commit('setIsLoading', true, { root: true })
      const response = await axios.get(baseUrl + '/transactions/' + categoryId)
      commit('setTransactions', response.data)
      commit('setIsLoading', false, { root: true })
    } catch (error) {
      commit('setIsLoading', false, { root: true })
      console.error(error)
    }
  },
  async create ({ commit }, transaction) {
    try {
      if (!transaction) {
        console.error('Empty transaction object')
        return
      }
      commit('setIsLoading', true, { root: true })
      const response = await axios.post(baseUrl + '/transactions', transaction)
      commit('addTransaction', response.data)
      commit('setIsLoading', false, { root: true })
    } catch (error) {
      commit('setIsLoading', false, { root: true })
      console.error(error)
    }
  },
  async update ({ commit }, transaction) {
    try {
      if (!transaction) {
        console.error('Empty transaction object')
        return
      }
      commit('setIsLoading', true, { root: true })
      const response = await axios.put(baseUrl + '/transactions', transaction)
      commit('updateTransaction', response.data)
      commit('setIsLoading', false, { root: true })
    } catch (error) {
      commit('setIsLoading', false, { root: true })
      console.error(error)
    }
  },
  async delete ({ commit }, id) {
    try {
      if (!id) {
        console.error('Empty transactionId')
        return
      }
      commit('setIsLoading', true, { root: true })
      await axios.delete(baseUrl + '/transaction/' + id)
      commit('deleteTransaction', id)
      commit('setIsLoading', false, { root: true })
    } catch (error) {
      commit('setIsLoading', false, { root: true })
      console.error(error)
    }
  }
}

const mutations = {
  setTransactions (state, transactions) {
    state.all = transactions
    this.commit('transactions/sortTransactions')
  },
  addTransaction (state, transaction) {
    state.all.push(transaction)
    this.commit('transactions/sortTransactions')
  },
  updateTransaction (state, transaction) {
    const index = state.all.findIndex(p => p.id === transaction.id)
    state.all[index] = transaction
    this.commit('transactions/sortTransactions')
  },
  deleteTransaction (state, transactionId) {
    state.all = state.all
      .filter(transaction => transaction.id !== transactionId)
  },
  sortTransactions (state) {
    state.all.sort((a, b) => b.date.getTime() - a.date.getTime())
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}