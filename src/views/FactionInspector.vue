<template lang="html">
  <aside>
    <h1>{{ faction.name }}</h1>
    <hr>
    <p>{{ faction.description }}</p>
  </aside>
</template>

<script>
import store from '@/store.js';
import Faction from '@/classes/Faction.js';

export default {
  name: 'factioninspector',

  data: function () {
    return {
      faction: new Faction(store.state.data)
    }
  },
  computed: {
    factionObserver: () => new Faction(store.state.data)
  },
  watch: {
    factionObserver: function (newFaction) {
      this.faction = newFaction
    }
  }
};
</script>

<style lang="scss">
</style>
