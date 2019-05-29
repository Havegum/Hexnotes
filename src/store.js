import Vue from 'vue'
import Vuex from 'vuex'
import Api from '@/Api.js'
import Person from '@/classes/Person.js'
import Faction from '@/classes/Faction.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    data: {},
    network: { nodes: [], links: [], factions: [], loading: true, loadError: false }
  },
  mutations: {
    data (state, d) {
      state.data = d
    },

    setNetwork (state, network) {
      state.network = network
    },

    flagNetwork (state, payload) {
      if (payload.flag === 'loading' || payload.flag === 'loadError')
        state.network[payload.flag] = !!payload.value
    },

    updatePerson (state, person) {
      let i = state.network.nodes.findIndex(d => d.id === state.data.id)
      state.network.nodes[i] = person
      if (state.data.isPerson && state.data.id === person.id) {
        this.commit('data', person);
      }
    }
  },
  actions: {
    async getNetwork ({ commit, state }) {
      try {
        commit('flagNetwork', { flag: 'loading', value: true })

        const network = (await Api().get('/network')).data
        network.nodes = network.nodes.map(d => new Person(d))
        network.factions = network.factions.map(d => new Faction(d))
        network.initiated = true

        commit('setNetwork', network)
        commit('flagNetwork', { flag: 'loading', value: false })
        return network

      } catch (e) {
        console.log('Network request failed', e);
        // TODO: Try again in (5 ** attemps) seconds
        commit('flagNetwork', { flag: 'loadError', value: true })
        commit('flagNetwork', { flag: 'loading', value: false })
        return state.network
      }
    },
    async updatePerson ({ commit, state }, person) {
      let clean_person = {
        id: person.id,
        group: person.group,
        color: person.color,
        isParty: person.isParty,
        inParty: person.inParty,
        plotImportance: person.plotImportance || person.size,
        description: person.description,
        x: person.x,
        y: person.y,
        isPerson: true
      }
      commit('updatePerson', clean_person)
      // await
        Api().post('/network/person', clean_person)
          // .then(console.log)
          // .catch(console.log)

    }
  }
})
