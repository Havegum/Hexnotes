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
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('charge', d3.forceManyBody()
        .strength(-50)
        .distanceMax(100))

    this.svg = d3.create('svg')
      .attr('width', width)
      .attr('height', height)

    this.linkGroup = this.svg.append('g')
      .attr('stroke', '#aaa')
      .attr('stroke-opacity', 0.6)

    this.nodeGroup = this.svg.append('g')
    this.node = this.nodeGroup.selectAll('g')

    this.created = true
  }

  update (userUpdate, updates) {
    let links = this.links

    let data = store.state.network
    if (store.state.data && store.state.data.isPeson)
        this.selected = store.state.data.id || null

    this.nodes = data.nodes
    this.links = data.links

    console.log('Graph update triggered' + (updates ? ': ' + updates : ''), this.nodes[0]);

    if (typeof updates === 'string') {
      this.links = this.links.map(l => {
        if (l.source.id && l.source.id === updates) {
          l.source = l.source.id
        } else if (l.target.id && l.target.id === updates) {
          l.target = l.target.id
        }
        return l
      })
    }

    this.simulation
      .nodes(this.nodes)
      .force('link', d3.forceLink(this.links)
        .strength(d => d.value * .1 + 1e-3)
        .id(d => d.id))
      .on('tick', () => this.ticked())

    console.log('first link', this.links[0]);

    this.link = this.linkGroup.selectAll('line').data(this.links)
    this.link.exit().remove()
    this.link.enter().append('line')
      .attr('stroke-linejoin', 'round')
    this.linkGroup.selectAll('line')
      .attr('stroke-width', d => Math.min(d.value, 3) ** 2 / 3 + 1)
      .attr('stroke', this.colorLink)
      .filter(d => d.value === 0)
      .attr('stroke-dasharray', '1,2')

    this.node = this.nodeGroup.selectAll('g').data(this.nodes, d => d.id)
    this.node.exit().remove()
    this.node.enter().append('g')
      .call(this.drag(this.simulation, this))
      .classed('node', true)
      .append('circle')

    this.nodeGroup.selectAll('circle')
      .attr('fill', d => {
        if(d.id === 'The Party') console.log('Color:', d)
        return d.color || this.color(d.group)
      })
      .attr('r', d => (+d.size || 2) * this.radius + 4)
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
