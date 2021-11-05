import axios from 'axios'

const baseUrl = process.env.VUE_APP_ROOT_API

const state = () => ({
  all: []
})

const actions = {
  async get ({ commit }) {
    try {
      const response = await axios.get(baseUrl + '/categories')
      commit('setCategories', response.data)
    } catch (error) {
      console.error(error)
    }
  },
  async create ({ commit }, category) {
    try {
      if (!category) {
        console.error('Empty category object')
        return
      }
      const response = await axios.post(baseUrl + '/categories', category)
      commit('addCategory', response.data)
    } catch (error) {
      console.error(error)
    }
  },
  async update ({ commit }, category) {
    try {
      if (!category) {
        console.error('Empty category object')
        return
      }
      const response = await axios.put(baseUrl + '/categories', category)
      commit('updateCategory', response.data)
    } catch (error) {
      console.error(error)
    }
  },
  async delete ({ commit }, categoryId) {
    try {
      if (!categoryId) {
        console.error('Empty categoryId')
        return
      }
      await axios.delete(baseUrl + '/categories/' + categoryId)
      commit('deleteCategory', categoryId)
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
      const response = await axios.patch(baseUrl + '/categories/reorder', request)
      commit('reorderCategories', response.data)
    } catch (error) {
      console.error(error)
    }
  }
}

const mutations = {
  setCategories (state, categories) {
    state.all = categories.sort((a, b) => a.sortOrder - b.sortOrder)
  },
  addCategory (state, category) {
    state.all = [ ...state.all, category ].sort((a, b) => a.sortOrder - b.sortOrder)
  },
  updateCategory (state, category) {
    state.all = [
      ...state.all.filter(c => c.id !== category.id),
      category
   ].sort((a, b) => a.sortOrder - b.sortOrder)
  },
  deleteCategory (state, categoryId) {
    state.all = state.all
      .filter(category => category.id !== categoryId)
  },
  reorderCategories (state, response) {
    const ids = [response.item1.id, response.item2.id]
    state.all = [
      ...state.all.filter(category => !ids.includes(category.id)),
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