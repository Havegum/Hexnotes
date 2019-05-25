<template>
  <div ref='container' class='network h-100' :class="{ edit: editMode }">
    <button class="btn btn-primary mode-btn" :class="{'btn-success': editMode}" type="button" v-on:click="modeChange">{{
      editMode ? 'Exit Edit Mode' : 'Edit Mode'
    }}</button>
  </div>
</template>

<script type="text/javascript">
import store from '@/store.js'
import Network from '@/classes/Network.js'

export default {
  data: function () {
    return {
      editMode: false,
      graph: {}
    }
  },
  computed: {
    count: () => store.state.count || 0,
    network: function () { return store.state.network || { nodes: [], links: [] } },
    selectedPerson: function () { if (store.state.data && store.state.data.isPerson) return store.state.data; else return null }
  },
  watch: {
    selectedPerson: function (newPerson, oldPerson) {
      if (!oldPerson) return
      if (newPerson.id !== oldPerson.id) {
        console.log('selected new person');
        console.log('old',oldPerson);
        console.log('new',newPerson);
        console.log();
      } else {
        console.log('didn\'t select new person:', newPerson.id);
        console.log('old',oldPerson);
        console.log('new',newPerson);
        console.log();
        this.graph.update(true, newPerson.id)
        // may call for redundant updates
        // OPTIMIZE: reduce update calls
      }
    },
    network: function () {
      console.log('network updated', store.state.network.nodes[0]);
      this.graph.update(true) }
  },
  methods: {
    increment: () => store.commit('increment'),

    modeChange: function () {
      this.editMode = !this.editMode
      this.graph.setEditMode(this.editMode)
    },

    fetchNetwork: function () {
      store.dispatch('getNetwork').then(() =>
        this.graph.update(true)
      )
    }
  },

  mounted: function () {
    this.graph = new Network(this.$refs.container)
    this.$refs.container.appendChild(this.graph.svg.node())
    this.fetchNetwork()
  }
}
</script>

<style lang="scss">
.network {
  background-color: #222;

  .node {
    cursor: grab;

    &:active {
      cursor: grabbing;
    }

    &:hover circle:last-child {
      stroke: yellow;
      stroke-width: 3;
    }
    &.selected circle:last-child {
      stroke: yellow;
      stroke-width: 3;
    }
  }

  svg { background-color: #222; }
  &.edit {
    svg {
      background-image: url("../assets/whitegrid.png");
      background-size: 12.5%;
      background-position: center center;
      background-color: #293540;
    }

    cursor: pointer;
    .node {
      cursor: crosshair;
    }
  }
  h1 {
    background-color: #222;
    margin: 0;
    color: lightgrey;
    position: absolute;
    user-select: none;
  }

  h1:hover, h1:active { color: var(--primary) }
  h1:active { top: 1px; }
}
.mode-btn {
  position: absolute;
  bottom: 1em;
  right: 1em;
}
</style>
