<template>
  <div ref='container' class='network h-100'>
    <h1 v-on:click="increment">Counter: {{ count }}</h1>
    <!-- <h1>Network here</h1> -->
  </div>
</template>

<script type="text/javascript">
import store from '@/store.js'
import Network from '@/classes/Network.js'
let lesmis = require('@/assets/network.json')

export default {
  computed: {
    count () {
      return this.$store.state.count || 0
    }
  },
  methods: {
    test: function () {
      console.log('test')
    },

    increment: function () {
      store.commit('increment')
      this.counter = store.state.count
    }
  },

  mounted: function () {
    let chart = new Network(lesmis, this.$refs.container)
    this.counter = store.state.count
    console.log(store.state.count)
  }
}
</script>

<style lang="scss">
.network {
  svg { background-color: #222; }
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
</style>
