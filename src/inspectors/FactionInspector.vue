<template lang="html">
  <aside>
    <swatches v-model="faction.color"
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
    <h1>{{ faction.name }}</h1>
    <hr>
    <p>{{ faction.description }}</p>
  </aside>
</template>

<script>
import store from '@/store.js';
import Faction from '@/classes/Faction.js';
import Swatches from 'vue-swatches';
import 'vue-swatches/dist/vue-swatches.min.css';

export default {
  name: 'factioninspector',
  components: {
    Swatches
  },
  data: function () {
    return {
      faction: new Faction(store.state.inspected)
    };
  },
  computed: {
    factionObserver: () => new Faction(store.state.inspected)
  },
  watch: {
    factionObserver: function (newFaction) {
      this.faction = newFaction;
    }
  },
  methods: {
    updateColor (newColor) {
      let faction = store.state.inspected;
      faction.color = newColor;
      store.dispatch('updateFaction', faction);
    }
  }
};
</script>

<style lang="scss">

h1 {
  display: inline-block;
}
</style>
