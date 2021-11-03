import axios from 'axios'

const baseUrl = process.env.VUE_APP_ROOT_API

const state = () => ({
  all: []
})

const actions = {
  async get ({ commit }) {
    try {
      const response = await axios.get(baseUrl + '/CategoryGroups')
      commit('setCategoryGroups', response.data)
    } catch (error) {
      console.error(error)
    }
  },
  async create ({ commit }, categoryGroup) {
    try {
      const response = await axios.get(baseUrl + '/CategoryGroups', categoryGroup)
      commit('addCategoryGroup', response.data)
    } catch (error) {
      console.error(error)
    }
  }
}

const mutations = {
  setCategoryGroups (state, categoryGroups) {
    state.all = categoryGroups
  },
  addCategoryGroup (state, categoryGroup) {
    state.all.push(categoryGroup)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}