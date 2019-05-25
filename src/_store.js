import Vue from 'vue'
import Vuex from 'vuex'
import Api from '@/Api.js'
import Person from '@/classes/Person.js'

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

    setNetwork (state,  network) {
      state.network = network
    },

    updatePerson (state, person) {
      let i = state.network.nodes.findIndex(d => d.id === state.data.id)
      state.network.nodes[i] = person
      if (state.data.isPerson && state.data.id === person.id) {
        this.commit('data', person);
        console.log('store updated focus');
      }
    }
  },
  actions: {
    async getNetwork ({ commit, state }) {
      try {
        const network = (await Api().get('/network')).data

        network.nodes = network.nodes
          .map(d => new Person(d))
          // .map(Object.create)

        commit('setNetwork', network)
        return network
      } catch (e) { return state.network }
    },
    async updatePerson ({ commit, state }, person) {
      let clean_person = Object.create({
        id:          person.id          || state.data.id,
        group:       person.group       || state.data.group,
        color:       person.color       || state.data.color,
        isParty:     person.isParty     || state.data.isParty,
        size:        person.size        || state.data.size,
        description: person.description || state.data.description,
        x:           person.x           || state.data.x,
        y:           person.y           || state.data.y,
        isPerson: true
      })
      console.log('store -> clean_person');
      commit('updatePerson', clean_person)
      console.log(clean_person);

      Api().post('/network/person', clean_person)

    }
  }
})
