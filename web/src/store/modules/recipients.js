import axios from 'axios'

const baseUrl = process.env.VUE_APP_ROOT_API

const state = () => ({
  all: []
})

const actions = {
  async get ({ commit }) {
    try {
      const response = await axios.get(baseUrl + '/recipients')
      commit('setRecipients', response.data)
    } catch (error) {
      console.error(error)
    }
  },
  async create ({ commit }, recipient) {
    try {
      const response = await axios.post(baseUrl + '/recipients', recipient)
      commit('addRecipient', response.data)
    } catch (error) {
      console.error(error)
    }
  },
  async update ({ commit }, recipient) {
    try {
      if (!recipient) {
        console.error('Empty recipient object')
        return
      }
      const response = await axios.put(baseUrl + '/recipients', recipient)
      commit('updateRecipient', response.data)
    } catch (error) {
      console.error(error)
    }
  },
  async delete ({ commit }, id) {
    try {
      if (!id) {
        console.error('Empty recipientId')
        return
      }
      await axios.delete(`${baseUrl}/recipients/${id}`)
      commit('deleteRecipient', id)
    } catch (error) {
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