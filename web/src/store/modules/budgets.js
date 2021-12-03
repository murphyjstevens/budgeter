import axios from 'axios'

const baseUrl = process.env.VUE_APP_ROOT_API

const state = () => ({
  all: [],
  readyToBudget: 0
})

const actions = {
  async get ({ commit, rootState }) {
    try {
      commit('setIsLoading', true, { root: true })
      const response = await axios.get(baseUrl + '/budgets', { params: { date: rootState.date } })
      commit('setBudgets', response.data)
      commit('setIsLoading', false, { root: true })
    } catch (error) {
      commit('setIsLoading', false, { root: true })
      commit('setToast', { toastMessage: error.message, isError: true }, { root: true })
      console.error(error)
    }
  },
  async getReadyToBudget ({ commit }) {
    try {
      commit('setIsLoading', true, { root: true })
      const response = await axios.get(`${baseUrl}/budgets/ready-to-budget`)
      commit('setReadyToBudget', response.data)
      commit('setIsLoading', false, { root: true })
    } catch (error) {
      commit('setIsLoading', false, { root: true })
      commit('setToast', { toastMessage: error.message, isError: true }, { root: true })
      console.error(error)
    }
  },
  async save ({ commit }, budget) {
    try {
      if (!budget) {
        console.error('Empty budget object')
        return
      }
      commit('setIsLoading', true, { root: true })
      const response = await axios.post(baseUrl + '/budgets', budget)
      commit('setBudget', response.data)
      commit('setIsLoading', false, { root: true })
    } catch (error) {
      commit('setIsLoading', false, { root: true })
      commit('setToast', { toastMessage: error.message, isError: true }, { root: true })
      console.error(error)
    }
  },
  async delete ({ commit }, budgetId) {
    try {
      if (!budgetId) {
        console.error('Empty budgetId')
        return
      }
      commit('setIsLoading', true, { root: true })
      await axios.delete(baseUrl + '/budgets/' + budgetId)
      commit('deleteBudget', budgetId)
      commit('setIsLoading', false, { root: true })
    } catch (error) {
      commit('setIsLoading', false, { root: true })
      commit('setToast', { toastMessage: error.message, isError: true }, { root: true })
      console.error(error)
    }
  }
}

const mutations = {
  setBudgets (state, budgets) {
    state.all = budgets
  },
  setBudget (state, budget) {
    state.all = [
      ...state.all.filter(b => b.id !== budget.id),
      budget
    ]
  },
  setReadyToBudget (state, readyToBudget) {
    state.readyToBudget = readyToBudget
  },
  deleteBudget (state, budgetId) {
    state.all = state.all
      .filter(budget => budget.id !== budgetId)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}