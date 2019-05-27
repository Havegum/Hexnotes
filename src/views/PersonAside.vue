<template>
  <aside>
    <img v-if="person.image">
    <swatches v-model="person.color"
      class="d-inline-block"
      background-color="#222"
      row-length="8"
      popover-to="left"
      shapes="circles"
      swatch-size="30"
      :trigger-style="{ width: '2em', height: '2em' , marginRight: '0.5em', border: '3px solid darkgrey', position: 'relative', top: '2px'}"
      show-fallback
      @input="updateColor">
    </swatches>
    <h1 contenteditable="true" spellcheck="false" style="display: inline">{{ person.name }}</h1>
    <ul v-if="person.data" class="person-data">
      <li v-for="(value, key) in person.data" v-bind:key="key">
        {{ key }}:<span contenteditable="true" spellcheck="false" :class="{ unknown: !value }">{{
          value || 'unknown'
        }}</span>
      </li>
    </ul>



    <p>{{ person.description }}</p>

    <label for="relation">Relation: {{ relType_txt }}</label>
    <input id="relation"
      v-model="relType"
      type="range"
      min="-2"
      max="2"
      step="1"
      list='relation-list'>
    <datalist id="relation-list">
      <option>-2</option>
      <option>-1</option>
      <option>0</option>
      <option>1</option>
      <option>2</option>
    </datalist>
    <!-- TODO: Koordinatsystem ??? -->
    <label for="strength">Relation strength: {{ relStrength_txt }}</label>
    <input id="strength"
      v-model="relStrength"
      type="range"
      min="0"
      max="3"
      step="1"
      list='strength-list'>
    <datalist id="strength-list">
      <option>0</option>
      <option>1</option>
      <option>2</option>
      <option>3</option>
    </datalist>

    <label for="strength">Plot importance: {{ plotImportance_txt }}</label>
    <input id="strength"
      v-model="plotImportance"
      type="range"
      min="0"
      max="2"
      step="1"
      list='strength-list'>
    <datalist id="strength-list">
      <option>0</option>
      <option>1</option>
      <option>2</option>
    </datalist>
  </aside>
</template>

<script>
import Vue from 'vue'
import store from '@/store.js'
import Person from '@/classes/Person.js'
import Swatches from 'vue-swatches'
import "vue-swatches/dist/vue-swatches.min.css"

export default {
  name: 'PersonAside',
  components: { Swatches },
  data: function () {
    return {
      relType: 0,
      relStrength: 1,
      plotImportance: 2,
      person: new Person(store.state.data)
    }
  },
  computed: {
    personObserver: () => new Person(store.state.data),
    relStrength_txt () {
      switch (+this.relStrength) {
        case 0: return 'Stranger'
        case 1: return 'Aquaintance'
        case 2: return 'Familiar'
        case 3: return 'Close'
      }
    },
    relType_txt () {
      switch (+this.relType) {
        case -2: return 'Hostile'
        case -1: return 'Guarded'
        case  0: return 'Neutral'
        case  1: return 'Cordial'
        case  2: return 'Allied'
      }
    },
    plotImportance_txt () {
      switch (+this.plotImportance) {
        case 0: return 'Peripheral'
        case 1: return 'Unknown'
        case 2: return 'Central'
      }
    }
  },
  watch: {
    personObserver (newPerson) { this.person = newPerson }
  },
  methods: {
    updateColor(newColor) {
      let person = store.state.data
      person.color = newColor
      store.dispatch('updatePerson', person)
      // store.state.data.color = newColor;
      // let networkNode = store.state.network.nodes.find(d => d.id === store.state.data.id)

    }
  }
}
</script>

<style lang="scss">
aside {
  position: relative;
}
input[type="range"] {
    width: 100%;
    margin: 0;
    box-sizing: border-box;
    z-index: 1;
}

datalist {
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin-top: -0.5em;
    padding: 0 7px;
}

.vue-swatches__wrapper {
  box-sizing: content-box;
}
option {
    display: flex;
    justify-content: center;
    align-items: end;
    user-select: none;
    font-size: .8em;
    width: 0;
    color: var(--gray);
}

.person-data {
  padding: 1em 0;

  border-top:    1px solid lightgrey;
  border-bottom: 1px solid lightgrey;

  li {
    display: inline-block;
    margin-right: 1em;
    font-size: .9em;
    list-style-type: none;
    color: var(--gray);
    text-transform: capitalize;
    user-select: none;

    span {
      user-select: text;
      margin-left: .25em;

      &:not(.unknown) {
        font-weight: 600;
        color: var(--dark);
      }

      &.unknown {
        font-style: italic;
      }
    }
  }
}
</style>
