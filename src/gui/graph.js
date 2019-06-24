/*
 *  TWIP: Tiny Web Image Processing Visual Tool
 *  Copyright (C) 2019  Jean-Christophe Taveau.
 *
 *  This file is part of TWIP
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with TWIP.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */

'use strict';

class Graph {

  /**
   * @constructor
   * @author Jean-Christophe Taveau
   */
  constructor() {
    this.templates;
    this.nodes = [];
    this.edges = [];
    this.context; // svg or canvas/webgl?
    this.root; // HTML Parent node for all the nodes
  }

  build(json) {
    this.createNodes(json.nodes);
    this.createEdges(json.edges);
  }

  appendNode(templateID) {
    let newid = 0; // TODO HACK
    let node =  new Node(node.id,this.templates.find( n => n.id === templateID));
    this.nodes.push(node);
  }

  createNodes(nodes) {
    let root = this.root;
    // Create Graph
    nodes.forEach( (node) => {
      // Attach node to <root>
      console.log(node.template,node.id,node.metadata);
      console.log(this.templates.find( n => n.id === node.template));
      let n = new Node(node.id,this.templates.find( n => n.id === node.template),node.metadata);
      this.nodes.push(n);
      root.appendChild(n.element);
    });
  }

  createEdges(edges) {
    let ctx = this.context;
    edges.forEach( (edge) => {
      let e = new Edge(edge.eid,edge.source,edge.target,edge.in,edge.out);
      this.edges.push(e);
      ctx.append(e.line);
    });
  }

  getNode(id) {
  }
  
  getEdge(id) {
  }

  setGraphicsContext(context) {
    this.context = context;
  }

  setRootNode(parentNode) {
    this.root = parentNode;
  }

  setTemplates(nodeTemplates) {
    this.templates = nodeTemplates;
  }

  show() {
  }

  updateAllEdges(nodes) {
    console.log(nodes);
    nodes.forEach( n => {
      this.updateEdges(n, n.classList.contains('shrink') );
    });
  }

  updateEdges(node,shrinkMode = false) {
    console.log('UPDATE ' + shrinkMode);
    // Get Edge ID
    // let src_eid = document.querySelector(`#${node.id} .input button`);
    let sources = (shrinkMode) ? document.querySelectorAll(`#${node.id} .out_socket`) : document.querySelectorAll(`#${node.id} .output button`);
    if (sources !== null) {
      sources.forEach( s => {
        if (s.dataset.edge !== undefined) {
          JSON.parse(s.dataset.edge).forEach( (e) => {
            let line = document.getElementById( `e_${e}`);
            let start = this.getCoords(s);
            line.setAttribute('x1',start.x);
            line.setAttribute('y1',start.y);
          });
        }
      });
    }
    let targets = (shrinkMode) ? document.querySelectorAll(`#${node.id} .in_socket`) : document.querySelectorAll(`#${node.id} .input button`);
    if (targets !== null) {
      if (shrinkMode) {
        targets.forEach( t => {
          if (t.dataset.edge !== undefined) {
            JSON.parse(t.dataset.edge).forEach( (e) => {
              let line = document.getElementById(`e_${e}`);
              let end = this.getCoords(t);
              line.setAttribute('x2',end.x);
              line.setAttribute('y2',end.y);
            });
          }
        });
      }
      else {
        targets.forEach( t => {
          let line = document.getElementById(`e_${t.dataset.edge}`);
          let end = this.getCoords(t);
          line.setAttribute('x2',end.x);
          line.setAttribute('y2',end.y);
        });
      }

    }
  }

  /**
   * Get geometry (x,y,width,height) and Compute absolute position
   */
  getCoords(element) {
    let rect = element.getBoundingClientRect();
    // console.log(rect);
    let cx = document.documentElement.clientWidth/2.0;
    let cy = document.documentElement.clientHeight/2.0;
    return {
      x: (rect.left + rect.width / 2.0 )  + window.scrollX,
      y: (rect.top  + rect.height / 2.0 ) + window.scrollY
    }
  }
} // End of class Graph


