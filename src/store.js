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
          .map(Object.create)

        commit('setNetwork', network)
        return network
      } catch (e) { return state.network }
    },
    async updatePerson ({ commit, state }, person) {
      let clean_person = {
        id: person.id,
        group: person.group,
        color: person.color,
        isParty: person.isParty,
        size: person.size,
        description: person.description,
        x: person.x,
        y: person.y,
        isPerson: true
      }
      console.log('store -> clean_person');
      commit('updatePerson', Object.create(clean_person))
      console.log(clean_person);
      // await
        Api().post('/network/person', clean_person)
          // .then(console.log)
          // .catch(console.log)

    }
  }
})
