import * as d3 from 'd3'
import store from '@/store.js'

export default class Network {
  nodes = []
  links = []
  simulation = null
  node = null
  linkGroup = null
  svg = null
  editMode = false
  created = false
  hoverTarget = null
  unnamed = 1
  selected = null

  constructor (parent, o) {
    console.log('constructor called');
    o = o || {}

    let width = this.width = o.width || parent.scrollWidth
    let height = this.height = o.height || parent.scrollHeight
    let radius = this.radius = o.radius || 1

    let data = store.state.network

    this.color = d3.scaleOrdinal(d3.schemeCategory10)


    this.simulation = d3.forceSimulation()

    this.svg = d3.create('svg')
      .attr('width', width)
      .attr('height', height)

    this.linkGroup = this.svg.append('g')
      .attr('stroke', '#aaa')
      .attr('stroke-opacity', 0.6)

    this.nodeGroup = this.svg.append('g')
    this.node = this.nodeGroup.selectAll('g')

    // this.svg.on('click', () => {
    //   if (!this.editMode) return
    //   // TODO: Fix
    //   let newNode = Object.create({ id: 'Unnamed ' + this.unnamed++, group: 2, size: 2 })
    //   self.nodes.push(Object.assign(newNode, {
    //     fx: d3.event.layerX,
    //     fy: d3.event.layerY
    //   }))
    //
    //   this.update(true)
    // })

    this.created = true
  }

  update (userUpdate) {
    console.log('graph updated', store.state.network.nodes[0]);
    let node = this.node
    let link = this.link
    let color = this.color
    let radius = this.radius

    let data = store.state.network
    if (store.state.data) this.selected = store.state.data.id || null

    link = this.linkGroup
      .selectAll('line')
      .data(data.links, d => d.source.id + '_' + d.target.id)

    link.exit().remove()

    link.enter()
      .append('line')
        .attr('stroke', this.colorLink)
      .merge(link)
        .attr('stroke-width', d => Math.sqrt(d.value))

    node = this.nodeGroup.selectAll('g')
      .data(data.nodes, d => d.id)
    node.exit().remove()

    let newNodes = node.enter()
      .append('g')
        .classed('node', true)
        .classed('selected', d => d.id === self.selected)
        .call(this.drag(this.simulation, this))
        .on('mouseover', d => { self.hoverTarget = d })
        .on('mouseout', d => { self.hoverTarget = self.hoverTarget === d ? null : self.hoverTarget })

    newNodes.append('circle')
      .attr('r', d => (+d.size || 2) * radius + 4)
      .attr('fill', '#222')
      .attr('stroke', '#0000')
      .attr('stroke-width', 10)

    newNodes.append('circle')
      .classed('face', true)
      .append('title')
      .text(d => d.id)

    let allnodes = node.merge(node).selectAll('.face')
        .attr('r', d => (+d.size || 2) * radius + 2)
        .attr('fill', d => d.color || color(d.group))

    // if (this.created && !userUpdate) {
    //   // FIXME: doesn't work ..
    //   newNodes.selectAll('circle')
    //     .call(d => {
    //       d.fx = d.x
    //       d.fy = d.y
    //     })
    // }

    this.simulation.nodes(data.nodes)
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force('charge', d3.forceManyBody()
        .strength(-1e2)
        .distanceMax(200))
      .force('link', d3.forceLink(data.links)
            .strength(d => d.value * 1e-1 + 1e-1)
            .id(d => d.id))

    this.simulation.on('tick', () => this.ticked())
  }

  ticked () {
    this.linkGroup.selectAll('line')
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)

    this.nodeGroup.selectAll('g')
      .attr("transform", d => `translate(${d.x}, ${d.y})`)
  }

  colorLink (d) {
    switch (d.type) {
      case -2: return '#F53F18'
      case -1: return '#D39E35'
      case  0: return '#B2B2B2'
      case  1: return '#4CC1E5'
      case  2: return '#4E6CFF'
    }
  }

  drag (simulation, self) {
    let newline
    let anchor

    function dragStarted (d) {
      if (!d3.event.active) simulation.alphaTarget(0.5).restart()
      if (!self.editMode) {
        d.fx = d.x
        d.fy = d.y

        self.nodeGroup.selectAll('.selected').classed('selected', false)
        d3.select(this).classed('selected', true)
        store.commit('data', d)
        
      } else {
        anchor = d
        newline = self.linkGroup.append('line')
          .attr('x1', anchor.x)
          .attr('y1', anchor.y)
          .attr('x2', d3.event.x)
          .attr('y2', d3.event.y)
          .attr('stroke', 'white')
          .attr('stroke-width', 2)
      }
    }

    function dragged (d) {
      if (!self.editMode) {
        d.fx = d3.event.x
        d.fy = d3.event.y
      } else {
        newline
          .attr('x1', anchor.x)
          .attr('y1', anchor.y)
          .attr('x2', d3.event.x)
          .attr('y2', d3.event.y)
      }
    }

    function dragEnded (d) {
      if (!d3.event.active) simulation.alphaTarget(0)

      d.fx = null
      d.fy = null

      if (self.editMode) {
        newline.remove()
        if (!self.hoverTarget) return
        if (self.links.some(link =>
          (link.source.id === self.hoverTarget.id &&
          link.target.id === d.id) ||
          (link.source.id === d.id &&
          link.target.id === self.hoverTarget.id)
        )) return

        self.links.push(Object.create({
          source: d.id,
          target: self.hoverTarget.id,
          type: 'neutral',
          value: 2
        }))
        self.update()
      }
    }

    return d3.drag()
      .on('start', dragStarted)
      .on('drag', dragged)
      .on('end', dragEnded)
  }

  setEditMode (editMode) {
    this.editMode = editMode
    console.log(editMode ? 'Entering' : 'Exiting', 'edit mode')
  }
}
