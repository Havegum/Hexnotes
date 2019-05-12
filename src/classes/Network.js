import * as d3 from 'd3'
import store from '@/store.js'

export default class Network {
  nodes = []
  links = []
  simulation = null
  node = null
  link = null
  svg = null

  constructor (data, parent, width, height, radius) {
    width = width || parent.scrollWidth
    height = height || parent.scrollHeight
    radius = radius || 6
    let nodes = this.nodes = data.nodes.map(d => Object.create(d))
    let links = this.links = data.links.map(d => Object.create(d))

    let color = this.color = d3.scaleOrdinal(d3.schemeCategory10)

    let simulation = this.simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).strength(.2).id(d => d.id))
      .force('charge', d3.forceManyBody().strength(-50))
      .force('center', d3.forceCenter(width / 2, height / 2))

    let svg = this.svg = d3.create('svg')
      .attr('width', width)
      .attr('height', height)

    let link = this.link = svg.append('g')
      .attr('stroke', '#aaa')
        .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
        .attr('stroke', this.colorLink)
        .attr('stroke-width', d => Math.sqrt(d.value))

    let node = this.node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .on('click', d => store.commit('data', Object.assign(d.__proto__, {isPerson: true})))
      .call(this.drag(simulation))

    node.append('circle')
      .attr('r', radius + 1)
      .attr('fill', '#222')

    node.append('circle')
      .attr('r', radius)
      .attr("fill", d => color(d.group))
      .attr('stroke', '#2223')
      .attr('stroke-width', 15)
      .append('title')
      .text(d => d.id)


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

    d3.select(parent).append(() => svg.node())
    // TODO: return element and do this in vue instead ...
  }

  colorLink (d) {
    switch (d.type) {
      case 'friend': return 'green'
      case 'enemy': return 'red'
      case 'ally': return 'cyan'
      default: return '#aaa'
    }
  }

  drag (simulation) {
    function dragStarted (d) {
      if (!d3.event.active) simulation.alphaTarget(.5).restart()
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged (d) {
      d.fx = d3.event.x
      d.fy = d3.event.y
    }

    function dragEnded (d) {
      if (!d3.event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    return d3.drag()
      .on('start', dragStarted)
      .on('drag', dragged)
      .on('end', dragEnded)
  }

  logger () {
    console.log(this.nodes)
    console.log(this.links)
    console.log(this.simulation)
    console.log(this.node)
    console.log(this.link)
    console.log(this.svg)
  }
}
