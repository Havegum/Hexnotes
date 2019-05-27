import * as d3 from 'd3'
import { Delaunay } from 'd3-delaunay'
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
    o = o || {}

    let width = this.width = o.width || parent.scrollWidth
    let height = this.height = o.height || parent.scrollHeight
    let radius = this.radius = o.radius || 1

    let data = store.state.network

    this.color = d3.scaleOrdinal(d3.schemeCategory10)


    this.simulation = d3.forceSimulation()
      // .force('center', d3.forceCenter(width / 2, height / 2))
      .force('pos_x', d3.forceX(width  / 2).strength(0.1))
      .force('pos_y', d3.forceY(height / 2).strength(0.1))
      .force('radial', d3.forceRadial(d => d.inParty ? 15 : 0, width / 2, height / 2).strength(d => d.inParty || d.isParty ? 1 : 0 ))
      .force('charge', d3.forceManyBody()
        .strength(d => d.isParty ? 0 : -150)
        .distanceMax(200))

    this.svg = d3.create('svg')
      .attr('width', width)
      .attr('height', height)

    this.linkGroup = this.svg.append('g')
      .attr('stroke', '#aaa')
      .attr('stroke-opacity', 0.6)

    this.nodeGroup = this.svg.append('g')
    this.node = this.nodeGroup.selectAll('g')

    // this.voronoi = this.svg.append('g').classed('voronoi', true)

    this.created = true
  }

  update (userUpdate, updates) {
    let links = this.links

    let data = store.state.network
    if (store.state.data && store.state.data.isPeson)
        this.selected = store.state.data.id || null

    this.nodes = data.nodes
    this.links = data.links


    if (typeof updates === 'string') {
      this.links = this.links.map(l => {
        if (l.source.id && l.source.id === updates) {
          l.source = l.source.id
        } else if (l.target.id && l.target.id === updates) {
          l.target = l.target.id
        }
        return l
      })
    } else if (updates instanceof Array) {
      console.log('Array updates not implemented');
    }

    let randomWidth  = d3.randomNormal(this.width  / 2, this.width  / 100)
    let randomHeight = d3.randomNormal(this.height / 2, this.height / 100)

    this.nodes = this.nodes.map(d => {
      d.x = d.x || randomWidth();
      d.y = d.y || randomHeight();
      return d
    })

    this.simulation
      .nodes(this.nodes)
      .force('link', d3.forceLink(this.links)
        .strength(d => d.isParty || d.inParty ? 0 : d.value * .1 + 1e-3)
        .id(d => d.id))
      .on('tick', () => this.ticked())


    this.link = this.linkGroup.selectAll('line').data(this.links)
    this.link.exit().remove()
    this.link.enter().append('line')
      .merge(this.link)
      .attr('stroke-width', d => Math.min(d.value, 3) ** 2 / 3 + 2)
      .attr('stroke', this.colorLink)
      .attr('stroke-dasharray', d => d.value === 0 ? '2,2' : '')

    this.node = this.nodeGroup
      .selectAll('g')
      .data(this.nodes, d => d.id)

    this.node.exit().remove()

    let update = this.node.enter()
      .append('g')
      .classed('node', true)
      .call(this.drag(this.simulation, this))
        .append('circle')
        .attr('stroke', '#222')
        .attr('stroke-width', '1.5')
      .merge(this.node)

    update
      .select('circle')
      .attr('fill', d => d.color || this.color(d.group))
      .attr('r', d => (+d.size || 2) * this.radius + 4)

    update
      .select('circle')
      .filter(d => d.isParty)
      .attr('fill', '#0000')
      .attr('r', 40)
      .attr('stroke', d => d.color || this.color(d.group))
      .attr('stroke-width', 2)

    //
    // let voronoiData = Delaunay.from(this.nodes, d => d.x, d => d.y)
    //   .voronoi([0, 0, this.width, this.height])
    //
    //
    // this.voronoi.append('path')
    //   .attr('d', voronoiData.render())
    //   .attr('stroke', '#fff3')
    //   .attr('stroke-width', 1)

    //   .data(voronoiData.render())
    // console.log(voronoiData.render());
    // this.voronoi.exit().remove()
    // this.voronoi.enter().append('path')

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
