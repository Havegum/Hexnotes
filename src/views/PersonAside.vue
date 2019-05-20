<template>
  <aside>
    <img v-if="person.image">
    <h1 contenteditable="true" spellcheck="false">{{ person.name }}</h1>
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
  </aside>
</template>

<script>
import store from '@/store.js'
import Person from '@/classes/Person.js'

export default {
  name: 'PersonAside',
  data: function () {
    return {
      relType: 0,
      relStrength: 1
    }
  },
  computed: {
    person: () => new Person(store.state.data),
    relStrength_txt () {
      switch (+this.relStrength) {
        case 0: return 'Strangers'
        case 1: return 'Know about'
        case 2: return 'Familiar'
        case 3: return 'Know closely'
      }
    },
    relType_txt () {
      switch (+this.relType) {
        case -2: return 'Enemies'
        case -1: return 'Guarded'
        case  0: return 'Neutral'
        case  1: return 'Cordial'
        case  2: return 'Allied'
      }
    }
  }
}
</script>

<style lang="scss">
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
