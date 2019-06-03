import * as d3 from 'd3';
import store from '@/store.js';

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

  polygon = null
  centroid = null

  constructor (parent, o) {
    o = o || {};

    let width = this.width = o.width || parent.scrollWidth;
    let height = this.height = o.height || parent.scrollHeight;
    this.radius = o.radius || 2;

    this.color = d3.scaleOrdinal(d3.schemeCategory10);

    this.simulation = d3.forceSimulation()
      .force('pos_x', d3.forceX(width / 2).strength(0.05))
      .force('pos_y', d3.forceY(height / 2).strength(0.05))
      .force('radial', d3.forceRadial(d => d.inParty ? 15 : 0, width / 2, height / 2).strength(d => d.inParty || d.isParty ? 1 : 0))
      .force('charge', d3.forceManyBody()
        .strength(d => d.isParty || d.isFaction ? 0 : -150)
        .distanceMax(200));

    let svg = this.svg = d3.create('svg')
      .attr('width', width)
      .attr('height', height);

    this.factionLinkContainer = svg.append('g');

    this.factionContainer = svg.append('g')
      .classed('faction-container', true);

    this.linkContainer = svg.append('g')
      .attr('stroke', '#aaa')
      .classed('node-container', true)
      .attr('stroke-opacity', 0.6);

    this.nodeContainer = svg.append('g')
      .classed('node-container', true);

    this.errorContainer = svg.append('g')
      .classed('error', true);

    this.created = true;
  }

  update (userUpdate, updates) {
    let svg = this.svg;
    let state = store.state;
    let network = state.network;
    if (state.inspected.isPerson) { this.selected = state.inspected.id || null }

    let errorMessages = [];
    if (network.loading) errorMessages.push('Loading network ...');
    if (network.loadError) errorMessages.push('Server connection failed');

    let error = this.errorContainer.selectAll('g').data(errorMessages, d => d);
    error.exit().remove();
    error.enter()
      .append('g')
      .merge(error)
      .append('rect')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('opacity', 0.4)
      .select(function () { return this.parentNode })
      .append('text')
      .attr('x', '50%')
      .attr('y', '50%')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .text(d => d);

    if (errorMessages.length > 0) return;

    this.nodes = state.persons;
    this.factions = state.factions; // .filter(faction => faction.members.length >= 3);

    this.links = state.links.filter(d => !d.factionSource && !d.factionTarget);
    this.factionLinks = state.links.filter(d => d.factionSource || d.factionTarget);

    if (typeof updates === 'string') {
      let toID = l => {
        if (l.source.id && l.source.id === updates) {
          l.source = l.source.id;
        } else if (l.target.id && l.target.id === updates) {
          l.target = l.target.id;
        }
        return l;
      };

      this.links = this.links.map(toID);
      this.factionLinks = this.factionLinks.map(toID);
    } else if (updates instanceof Array) {
      console.error('Array updates not implemented yet.');
    }

    let randomWidth = d3.randomNormal(this.width / 2, this.width / 100);
    let randomHeight = d3.randomNormal(this.height / 2, this.height / 100);

    this.nodes = this.nodes.map(d => {
      d.x = d.x || randomWidth();
      d.y = d.y || randomHeight();
      return d;
    });

    this.simulation
      .nodes(this.nodes.concat(this.factions))
      .force('link', d3.forceLink(this.links)
        .strength(d => d.isParty || d.inParty ? 0 : d.value * 0.1 + 1e-3)
        .id(d => d.id))
      .force('factionLink', d3.forceLink(this.factionLinks).strength(0).id(d => d.id))
      .on('tick', () => this.ticked());

    this.link = this.linkContainer.selectAll('line').data(this.links);
    this.link.exit().remove();
    this.link.enter().append('line')
      .merge(this.link)
      .attr('stroke-width', d => Math.min(d.value, 3) ** 2 / 3 + 2)
      .attr('stroke', this.colorLink)
      .attr('stroke-dasharray', d => d.value === 0 ? '2,2' : '');

    let nodeContainer = this.nodeContainer;
    this.node = this.nodeContainer
      .selectAll('g')
      .data(this.nodes, d => d.id);

    this.node.exit().remove();

    let update = this.node.enter()
      .append('g')
      .classed('node', true)
      .call(this.drag(this.simulation, this))
      .append('circle')
      .attr('stroke', '#222')
      .attr('stroke-width', '1.5')
      .attr('fill', d => d.color || this.color(d.faction))
      .attr('r', d => (d.plotImportance !== undefined ? d.plotImportance : 2) * this.radius + 4)
      .merge(this.node);

    update
      .select('circle')
      .filter(d => !d.isParty)
      .transition(500)
      .attr('fill', d => d.color || this.color(d.faction))
      .attr('r', d => (d.plotImportance !== undefined ? d.plotImportance : 2) * this.radius + 4);

    this.faction = this.factionContainer.selectAll('g')
      .data(this.factions, d => d.id);

    this.faction.exit().remove();
    this.faction.enter()
      .append('g')
      .append('path')
      .classed('faction', true)
      .on('click', function (d) {
        svg.selectAll('.selected').classed('selected', false);
        d3.select(this).classed('selected', true);
        nodeContainer.selectAll('g').filter(p => p.faction === d.id).classed('selected', true);
        store.commit('data', d);
      })
      .merge(this.faction)
      .select('path')
      .attr('fill', d => this.colorGradient(d.color || this.color(d), 0.3))
      .attr('stroke', d => this.colorGradient(d.color || this.color(d), 0.3));

    this.factionLink = this.factionLinkContainer.selectAll('line')
      .data(this.factionLinks);

    this.factionLink.exit().remove();
    this.factionLink.enter()
      .append('line')
      .attr('stroke-width', 5)
      .attr('stroke', '#fff')
      .merge(this.factionLink)
      .attr('stroke-width', d => Math.min(d.value, 3) ** 2 / 3 + 2)
      .attr('stroke', this.colorLink)
      .attr('stroke-dasharray', d => d.value === 0 ? '2,2' : '');
  }

  ticked () {
    this.linkContainer.selectAll('line')
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    this.nodeContainer.selectAll('g')
      .attr('transform', d => `translate(${d.x}, ${d.y})`);

    this.updateGroups();

    this.factionLinkContainer.selectAll('line')
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
  }

  valueLine = d3.line().x(d => d[0]).y(d => d[1]).curve(d3.curveCatmullRomClosed)

  updateGroups () {
    this.faction
      .attr('transform', 'translate(0,0)')
      .select('path')
      .attr('d', d => {
        let polygon = this.polygonGenerator(d.id);
        let centroid = d3.polygonCentroid(polygon);

        d.x = centroid[0];
        d.y = centroid[1];

        return this.valueLine(
          polygon.map(xy => [ xy[0] - centroid[0], xy[1] - centroid[1] ])
        );
      })
      .select(function () { return this.parentNode })
      .attr('transform', d => `translate(${d.x},${d.y})`);
  }

  polygonGenerator (id) {
    let nodeCoordinates = this.node
      .filter(d => d.faction === id)
      .data()
      .map(d => [d.x, d.y]);

    while (nodeCoordinates.length < 3) {
      let fakeCoords = nodeCoordinates[nodeCoordinates.length - 1];
      nodeCoordinates.push(fakeCoords.map(d => ++d));
    }
    return d3.polygonHull(nodeCoordinates);
  }

  hexToRGB (hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : null;
  }

  colorGradient (color1, alpha) {
    let color2 = [34, 34, 34];

    color1 = this.hexToRGB(color1);
    let w1 = alpha;
    let w2 = 1 - w1;
    return 'rgb(' +
      Math.round(color1[0] * w1 + color2[0] * w2) + ',' +
      Math.round(color1[1] * w1 + color2[1] * w2) + ',' +
      Math.round(color1[2] * w1 + color2[2] * w2) + ')';
  }

  colorLink (d) {
    switch (d.type) {
      case -2: return '#F53F18';
      case -1: return '#D39E35';
      case 0: return '#B2B2B2';
      case 1: return '#4CC1E5';
      case 2: return '#4E6CFF';
    }
  }

  drag (simulation, self) {
    let newline;
    let anchor;

    function dragStarted (d) {
      if (!d3.event.active) simulation.alphaTarget(0.5).restart();
      if (!self.editMode) {
        d.fx = d.x;
        d.fy = d.y;

        self.svg.selectAll('.selected').classed('selected', false);
        d3.select(this).classed('selected', true);

        store.commit('data', d);
      } else {
        anchor = d;
        newline = self.linkGroup.append('line')
          .attr('x1', anchor.x)
          .attr('y1', anchor.y)
          .attr('x2', d3.event.x)
          .attr('y2', d3.event.y)
          .attr('stroke', 'white')
          .attr('stroke-width', 2);
      }
    }

    function dragged (d) {
      if (!self.editMode) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      } else {
        newline
          .attr('x1', anchor.x)
          .attr('y1', anchor.y)
          .attr('x2', d3.event.x)
          .attr('y2', d3.event.y);
      }
    }

    function dragEnded (d) {
      if (!d3.event.active) simulation.alphaTarget(0);

      d.fx = null;
      d.fy = null;

      if (self.editMode) {
        newline.remove();
        if (!self.hoverTarget) return;
        if (self.links.some(link =>
          (link.source.id === self.hoverTarget.id &&
          link.target.id === d.id) ||
          (link.source.id === d.id &&
          link.target.id === self.hoverTarget.id)
        )) return;

        self.links.push(Object.create({
          source: d.id,
          target: self.hoverTarget.id,
          type: 'neutral',
          value: 2
        }));
        self.update();
      }
    }

    return d3.drag()
      .on('start', dragStarted)
      .on('drag', dragged)
      .on('end', dragEnded);
  }

  setEditMode (editMode) {
    this.editMode = editMode;
    console.log(editMode ? 'Entering' : 'Exiting', 'edit mode');
  }
}
