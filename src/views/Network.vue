<template>
  <div ref='container' class='network h-100' :class="{ edit: editMode }">
    <!-- <h1 v-on:click="increment">Counter: {{ count }}</h1> -->
    <button class="btn btn-primary mode-btn" :class="{'btn-success': editMode}" type="button" v-on:click="modeChange">{{
      editMode ? 'Exit Edit Mode' : 'Edit Mode'
    }}</button>
  </div>
</template>

<script type="text/javascript">
import store from '@/store.js'
import Network from '@/classes/Network.js'
let network = require('@/assets/network.json') // TODO: Call to database

export default {
  data: function () {
    return {
      editMode: false,
      chart: {}
    }
  },
  computed: {
    count: () => store.state.count || 0
  },
  methods: {
    increment: () => store.commit('increment'),

    modeChange: function () {
      this.editMode = !this.editMode
      this.chart.setEditMode(this.editMode)
      // console.log(this.editMode ? 'entering' : 'exiting', 'edit mode')
      // console.log(this.chart)
    }
  },

  mounted: function () {
    let chart = this.chart = new Network(network, this.$refs.container)
  }
}
</script>

<style lang="scss">
.network {
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
