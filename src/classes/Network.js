import * as d3 from 'd3'

export default class Network {
  nodes = []
  links = []
  simulation = null
  node = null
  link = null
  svg = null

  constructor (data, parent, width, height) {
    width = width || parent.scrollWidth
    height = height || parent.scrollHeight
    let nodes = this.nodes = data.nodes.map(d => Object.create(d))
    let links = this.links = data.links.map(d => Object.create(d))

    let simulation = this.simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id))
      .force('charge', d3.forceManyBody())
      // .force('center', d3.forceCenter(width / 2, height / 2))

    let svg = this.svg = d3.create('svg')
      .attr('width', width)
      .attr('height', height)

    let link = this.link = svg.append('g')
      .attr('stroke', '#aaa')
        .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
        .attr('stroke-width', d => Math.sqrt(d.value))

    let node = this.node = svg.append('g')
        .attr('stroke', '#222')
        .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes)
      .join('circle')
        .attr('r', 5)
        .attr('fill', 'lightblue')
        .call(this.drag(simulation))

    node.append('title')
      .text(d => d.id)

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
    })

    d3.select(parent).append(() => svg.node())
    // TODO: return element and do this in vue instead ...
  }

  drag (simulation) {
    function dragStarted (d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart()
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
