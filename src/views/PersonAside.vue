<template>
  <aside>
    <h1>{{ person.id }}</h1>
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

<style>
</style>
