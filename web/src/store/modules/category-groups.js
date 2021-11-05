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
  },
  async reorder ({ commit }, request) {
    try {
      if (!request.item1 || !request.item2) {
        console.error('The parameters are invalid')
        return
      }
      const response = await axios.patch(baseUrl + '/category-groups/reorder', request)
      commit('reorderCategoryGroups', response.data)
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
  },
  reorderCategoryGroups (state, response) {
    const ids = [response.item1.id, response.item2.id]
    state.all = [
      ...state.all.filter(group => !ids.includes(group.id)),
      response.item1,
      response.item2
    ].sort((a, b) => a.sortOrder - b.sortOrder)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}