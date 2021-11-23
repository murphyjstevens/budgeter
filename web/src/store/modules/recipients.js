import axios from 'axios'

const baseUrl = process.env.VUE_APP_ROOT_API

const state = () => ({
  all: []
})

const actions = {
  async get ({ commit }) {
    try {
      commit('setIsLoading', true, { root: true })
      const response = await axios.get(baseUrl + '/recipients')
      commit('setRecipients', response.data)
      commit('setIsLoading', false, { root: true })
    } catch (error) {
      commit('setIsLoading', false, { root: true })
      console.error(error)
    }
  },
  async create ({ commit }, recipient) {
    try {
      commit('setIsLoading', true, { root: true })
      const response = await axios.post(baseUrl + '/recipients', recipient)
      commit('addRecipient', response.data)
      commit('setIsLoading', false, { root: true })
    } catch (error) {
      commit('setIsLoading', false, { root: true })
      console.error(error)
    }
  },
  async update ({ commit }, recipient) {
    try {
      if (!recipient) {
        console.error('Empty recipient object')
        return
      }
      commit('setIsLoading', true, { root: true })
      const response = await axios.put(baseUrl + '/recipients', recipient)
      commit('updateRecipient', response.data)
      commit('setIsLoading', false, { root: true })
    } catch (error) {
      commit('setIsLoading', false, { root: true })
      console.error(error)
    }
  },
  async delete ({ commit }, id) {
    try {
      if (!id) {
        console.error('Empty recipientId')
        return
      }
      commit('setIsLoading', true, { root: true })
      await axios.delete(`${baseUrl}/recipients/${id}`)
      commit('deleteRecipient', id)
      commit('setIsLoading', false, { root: true })
    } catch (error) {
      commit('setIsLoading', false, { root: true })
      console.error(error)
    }
  }
}

const mutations = {
  setRecipients (state, recipients) {
    state.all = recipients.sort((a, b) => b.name - a.name)
  },
  addRecipient (state, recipient) {
    state.all = [ ...state.all, recipient ].sort((a, b) => b.name - a.name)
  },
  updateRecipient (state, recipient) {
    state.all = [
      ...state.all.filter(c => c.id !== recipient.id),
      recipient
   ].sort((a, b) => b.name - a.name)
  },
  setRecipientIsEditing (state, recipient) {
    const index = state.all.findIndex(p => p.id === recipient.id)
    state.all[index].isEditing = recipient.isEditing
  },
  deleteRecipient (state, id) {
    state.all = state.all
      .filter(recipient => recipient.id !== id)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}