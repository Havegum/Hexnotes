<template>
  <div id="hexmap"><canvas ref="hexcanvas" width="300" height="300"></canvas></div>
</template>

<script>
import Hexmap from '@/scripts/hexmap.js'
let worldmap = require('@/assets/worldmap_tall.jpg')
// let worldmap = require('@/assets/worldmap.png')

export default {
  data: function () {
    return {
      hexmap: undefined
    }
  },

  mounted: function () {
    let img = new Image()
    img.src = worldmap
    img.addEventListener('load', () => {
      let c = this.$refs.hexcanvas
      let isWide = (img.height / img.width) / (this.$el.scrollHeight / this.$el.scrollWidth) < 1

      let ctx = c.getContext('2d')
      let scalar = (isWide ? this.$el.scrollHeight / img.height : this.$el.scrollWidth / img.width)
      c.height = Math.floor(img.height * scalar)
      c.width = Math.floor(img.width * scalar)
      ctx.drawImage(img, 0, 0, c.width, c.height)

      let hCount = 20
      let size = c.width / (hCount * Math.sqrt(3))
      let height = size * 3 / 2
      let vCount = Math.floor((c.height - 1 * height) / height)
      let yOffset = (c.height - vCount * height) / 2
      let hexmap = this.hexmap = new Hexmap(0, yOffset, size, hCount, vCount)

      ctx.strokeStyle = '#FFFFFF' + '44'
      ctx.beginPath()
      for (let hex of hexmap.hexes) {
        ctx.moveTo(hex[0].x, hex[0].y)
        for (let i = 0; i < 6; i++) ctx.lineTo(hex[i].x, hex[i].y)
        ctx.closePath()
      }
      ctx.stroke()
    })
  }
}
</script>

<style lang="scss">
#hexmap {
  background-color: #204971;
  color: white;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow: scroll;
  canvas {
    margin-bottom: -7px;
  }
}
</style>
