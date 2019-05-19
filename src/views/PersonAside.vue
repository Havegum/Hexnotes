<template>
  <aside>
    <img v-if="person.image">
    <h1 contenteditable="true" spellcheck="false">{{ person.id }}</h1>
    <ul v-if="person.data" class="person-data">
      <li v-for="(value, key) in person.data" v-bind:key="key">
        {{ key }}:<span contenteditable="true" spellcheck="false">{{ value }}</span>
      </li>
    </ul>
    <p>{{ person.description }}</p>
  </aside>
</template>

<script>
import store from '@/store.js'
export default {
  name: 'PersonAside',
  computed: {
    person: () => store.state.data || undefined
  }
}
</script>

<style lang="scss">
.person-data {
  padding: 0;
  li {
    display: inline-block;
    margin-right: 1em;
    font-size: .9em;
    list-style-type: none;
    color: var(--gray);
    text-transform: capitalize;
    user-select: none;

    span {
      font-weight: 600;
      color: var(--dark);
      margin-left: .25em;
      user-select: text;
    }
  }
}
</style>
