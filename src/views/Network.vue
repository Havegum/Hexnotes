<template>
  <div ref='container' class='h-100'>
    <h1>Network here</h1>
    <!-- <svg ref='svg' width=200 height=200></svg> -->
  </div>
</template>
<script type="text/javascript">
import Network from '@/classes/Network.js'
let lesmis = require('@/assets/miserables.json')

export default {
  name: 'network',
  methods: {
    test: function () {
      console.log('test')
    }
  },

  mounted: function () {
    let chart = new Network(lesmis, this.$refs.container)

    console.log(lesmis)
  }
}
</script>
<style media="screen">
svg {background-color: #222}
</style>
