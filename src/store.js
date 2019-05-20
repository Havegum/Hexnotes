import Vue from 'vue'
import Vuex from 'vuex'
import Api from '@/Api.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    data: {},
    network: { nodes: [], links: [] }
  },
  mutations: {
    increment (state) {
      state.count++
    },

    data (state, d) {
      state.data = d
    },

    setNetwork (state, network) {
      state.network = network
    }
  },
  actions: {
    async getNetwork ({ commit }) {
      const network = await Api().get('/network')
      commit('setNetwork', network.data)
      return network.data
    }
  }
})
