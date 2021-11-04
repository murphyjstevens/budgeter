import axios from 'axios'

const baseUrl = process.env.VUE_APP_ROOT_API

const state = () => ({
  all: []
})

const actions = {
  async get ({ commit }) {
    try {
      const response = await axios.get(baseUrl + '/category-groups')
      commit('setCategoryGroups', response.data)
    } catch (error) {
      console.error(error)
    }
  },
  async create ({ commit }, categoryGroup) {
    try {
      const response = await axios.post(baseUrl + '/category-groups', categoryGroup)
      commit('addCategoryGroup', response.data)
    } catch (error) {
      console.error(error)
    }
  }
}

const mutations = {
  setCategoryGroups (state, categoryGroups) {
    state.all = categoryGroups.sort((a, b) => a.sortOrder - b.sortOrder)
  },
  addCategoryGroup (state, categoryGroup) {
    state.all = [ ...state.all, categoryGroup ].sort((a, b) => a.sortOrder - b.sortOrder)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}