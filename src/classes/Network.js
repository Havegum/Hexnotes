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

  constructor (parent, width, height, radius) {
    width = this.width = width || parent.scrollWidth
    height = this.height = height || parent.scrollHeight
    radius = this.radius = radius || 1

    let data = store.state.network
    let nodes = this.nodes = data.nodes.map(d => Object.create(d))
    this.links = data.links.map(d => Object.create(d))

    this.color = d3.scaleOrdinal(d3.schemeCategory10)

    let svg = this.svg = d3.create('svg')
      .attr('width', width)
      .attr('height', height)
      .on('click', () => {
        if (!this.editMode) return

        let newNode = Object.create({ id: 'Unnamed ' + this.unnamed++, group: 2, size: 2 })
        nodes.push(Object.assign(newNode, {
          fx: d3.event.layerX,
          fy: d3.event.layerY
        }))

        this.update()
      })

    this.linkGroup = svg.append('g')
      .attr('stroke', '#aaa')
      .attr('stroke-opacity', 0.6)

    this.nodeGroup = svg.append('g')

    this.update()

    d3.select(parent).append(() => svg.node())
    // TODO: return element and do this in vue instead ...
    this.created = true
  }

  update (userUpdate) {
    let self = this
    let node = this.node
    let link = this.link
    let nodes = this.nodes
    let links = this.links
    let color = this.color
    let width = this.width
    let height = this.height
    let radius = this.radius
    let linkGroup = this.linkGroup

    // if (userUpdate) {
    let data = store.state.network
    nodes = this.nodes = data.nodes.map(d => Object.create(d))
    links = this.links = data.links.map(d => Object.create(d))
    // }

    if (store.state.data) this.selected = store.state.data.id || null

    if (!this.simulation) {
      this.simulation = d3.forceSimulation()
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('charge', d3.forceManyBody()
          .strength(-30)
          .distanceMax(100))
    }

    let simulation = this.simulation
      .nodes(nodes)
      .force('link', d3.forceLink(links).strength(d => d.value * .01 + .1).id(d => d.id))

    link = linkGroup
      .selectAll('line')
      .data(this.links)
      .join(enter =>
        enter.append('line')
          .attr('stroke', this.colorLink)
          .attr('stroke-width', d => Math.sqrt(d.value))
      )

    this.nodeGroup.selectAll('g')
      .data(nodes)
      .join(
        enter => {
          let node = enter.append('g')
            .classed('node', true)
            .classed('selected', d => d.id === self.selected)
            .call(this.drag(simulation, this))
            .on('mouseover', d => { self.hoverTarget = d })
            .on('mouseout', d => { self.hoverTarget = self.hoverTarget === d ? null : self.hoverTarget })

          node.append('circle')
            .attr('r', d => d.size * radius + 4)
            .attr('fill', '#222')
            .attr('stroke', '#0000')
            .attr('stroke-width', 10)

          node.append('circle')
            .attr('r', d => d.size * radius + 2)
            .attr('fill', d => color(d.group))
            .append('title')
            .text(d => d.id)

          if (this.created && !userUpdate) {
            node.selectAll('circle')
              .call(d => {
                d.fx = d.x
                d.fy = d.y
              })
          }
        }
      )

    node = this.node = this.nodeGroup.selectAll('g')

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)

      node.selectAll('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
    })
  }

  colorLink (d) {
    switch (d.type) {
      case 'friend': return 'green'
      case 'enemy': return 'red'
      case 'ally': return 'cyan'
      default: return '#aaa'
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

        store.commit('data', Object.assign(d.__proto__, { isPerson: true }))
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
