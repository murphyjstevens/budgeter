import axios from 'axios'

const baseUrl = process.env.VUE_APP_ROOT_API

const state = () => ({
  all: [],
  account: null
})

const actions = {
  async get ({ commit }) {
    try {
      commit('setIsLoading', true, { root: true })
      const response = await axios.get(baseUrl + '/accounts')
      commit('setAccounts', response.data)
      commit('setIsLoading', false, { root: true })
    } catch (error) {
      commit('setIsLoading', false, { root: true })
      console.error(error)
    }
  },
  async find ({ commit }, url) {
    try {
      if (!url) {
        console.error('Empty URL')
        return
      }
      commit('setIsLoading', true, { root: true })
      const response = await axios.get(baseUrl + '/accounts/url/' + url)
      commit('setAccount', response.data)
      commit('setIsLoading', false, { root: true })
    } catch (error) {
      commit('setIsLoading', false, { root: true })
      console.error(error)
    }
  }
}

const mutations = {
  setAccounts (state, accounts) {
    state.all = accounts
  },
  setAccount (state, account) {
    state.account = account
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}