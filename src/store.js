import Vue from 'vue';
import Vuex from 'vuex';
import Api from '@/Api.js';
import Person from '@/classes/Person.js';
import Faction from '@/classes/Faction.js';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    inspected: {},
    persons: [],
    factions: [],
    links: [],
    network: {}
  },
  mutations: {
    data (state, d) {
      state.inspected = d;
    },

    loadNetwork (state, network) {
      state.network = network.state; // Things break if you remove this line for some reason ...
      state.links = network.links;
      state.persons = network.persons;
      state.factions = network.factions;
    },

    setPersons (state, persons) {
      state.persons = persons;
    },

    setFactions (state, factions) {
      state.factions = factions;
    },

    setLinks (state, links) {
      state.links = links;
    },

    flagNetwork (state, payload) {
      // if (payload.flag === 'loading' || payload.flag === 'loadError') {
      state.network[payload.flag] = !!payload.value;
      // }
    },

    updatePerson (state, person) {
      let i = state.persons.findIndex(d => d.id === state.inspected.id);
      state.persons[i] = person;

      if (state.inspected.isPerson && state.inspected.id === person.id) {
        this.commit('data', person);
      }
    },

    updateFaction (state, faction) {
      state.faction = faction;
    }
  },
  actions: {
    async getNetwork ({ commit, state }) {
      try {
        commit('flagNetwork', { flag: 'loading', value: true });

        const network = (await Api().get('/network')).data;

        commit('loadNetwork', {
          state: { instanciated: true },
          persons: network.nodes.map(d => new Person(d)),
          factions: network.factions.map(d => new Faction(d)),
          links: network.links
        });
        commit('flagNetwork', { flag: 'loading', value: false });
        return;
      } catch (e) {
        console.log('Network request failed', e);
        // TODO: Try again in (5 ** attemps) seconds
        commit('flagNetwork', { flag: 'loadError', value: true });
        commit('flagNetwork', { flag: 'loading', value: false });
      }
    },
    async updatePerson ({ commit, state }, person) {
      person = new Person(person);
      commit('updatePerson', person);
      Api().post('/network/person', person);
    },

    async updateFaction ({ commit, state }, faction) {
      commit('updateFaction', new Faction(faction));
      // Api().post('/') // TODO:
    }
  }
});
