import axios from 'axios'

const baseUrl = process.env.VUE_APP_API_URL

const state = () => ({
  all: []
})

const actions = {
  async get ({ commit }) {
    try {
      commit('setIsLoading', true, { root: true })
      const response = await axios.get(baseUrl + '/category-groups')
      commit('setCategoryGroups', response.data)
      commit('setIsLoading', false, { root: true })
    } catch (error) {
      commit('setIsLoading', false, { root: true })
      commit('setToast', { toastMessage: error.message, isError: true }, { root: true })
      console.error(error)
    }
  },
  async create ({ commit }, categoryGroup) {
    try {
      commit('setIsLoading', true, { root: true })
      const response = await axios.post(baseUrl + '/category-groups', categoryGroup)
      commit('addCategoryGroup', response.data)
      commit('setIsLoading', false, { root: true })
    } catch (error) {
      commit('setIsLoading', false, { root: true })
      commit('setToast', { toastMessage: error.message, isError: true }, { root: true })
      console.error(error)
    }
  },
  async update ({ commit }, categoryGroup) {
    try {
      if (!categoryGroup) {
        console.error('Empty categoryGroup object')
        return
      }
      commit('setIsLoading', true, { root: true })
      const response = await axios.put(baseUrl + '/category-groups', categoryGroup)
      commit('updateCategoryGroup', response.data)
      commit('setIsLoading', false, { root: true })
    } catch (error) {
      commit('setIsLoading', false, { root: true })
      commit('setToast', { toastMessage: error.message, isError: true }, { root: true })
      console.error(error)
    }
  },
  async reorder ({ commit }, request) {
    try {
      if (!request.item1 || !request.item2) {
        console.error('The parameters are invalid')
        return
      }
      commit('setIsLoading', true, { root: true })
      const response = await axios.patch(baseUrl + '/category-groups/reorder', request)
      commit('reorderCategoryGroups', response.data)
      commit('setIsLoading', false, { root: true })
    } catch (error) {
      commit('setIsLoading', false, { root: true })
      commit('setToast', { toastMessage: error.message, isError: true }, { root: true })
      console.error(error)
    }
  },
  async delete ({ commit }, id) {
    try {
      if (!id) {
        console.error('Empty groupId')
        return
      }
      commit('setIsLoading', true, { root: true })
      await axios.delete(`${baseUrl}/category-groups/${id}`)
      commit('deleteCategoryGroup', id)
      commit('setIsLoading', false, { root: true })
    } catch (error) {
      commit('setIsLoading', false, { root: true })
      commit('setToast', { toastMessage: error.message, isError: true }, { root: true })
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
  updateCategoryGroup (state, categoryGroup) {
    state.all = [
      ...state.all.filter(c => c.id !== categoryGroup.id),
      categoryGroup
   ].sort((a, b) => a.sortOrder - b.sortOrder)
  },
  reorderCategoryGroups (state, response) {
    const ids = [response.item1.id, response.item2.id]
    state.all = [
      ...state.all.filter(group => !ids.includes(group.id)),
      response.item1,
      response.item2
    ].sort((a, b) => a.sortOrder - b.sortOrder)
  },
  deleteCategoryGroup (state, id) {
    state.all = state.all
      .filter(group => group.id !== id)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}