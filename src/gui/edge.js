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

class Edge {

  constructor(edge_id,source_id,target_id,input_connector = 0, output_connector = 0) {
    this.eid = edge_id;
    this.source = source_id;
    this.out = output_connector;
    this.target = target_id;
    this.in = input_connector;
    this.line = this.createEdge(edge_id,source_id,target_id,input_connector, output_connector);
  }

  createEdge(idE,idS,idT,input,output) {
    let nodeS = document.querySelector(`#node_${idS} #o_${output} button`);
    if (nodeS.dataset.edge !== undefined) {
      console.log(nodeS.dataset.edge);
      let tmp = JSON.parse(nodeS.dataset.edge);
      tmp.push( `e_${idE}`);
      nodeS.dataset.edge = JSON.stringify(tmp);
    }
    else {
      nodeS.dataset.edge = `["e_${idE}"]`;
    }
    let nodeT = document.querySelector(`#node_${idT} #i_${input} button`);
    nodeT.dataset.edge = `e_${idE}`;

    console.log(nodeS.id + '--> ' + nodeT.id);
    let start = this.getCoords(nodeS);
    let end = this.getCoords(nodeT);
    let line = document.createElementNS(xmlns,'line');
    line.dataset.source = `node_${idS}`;
    line.dataset.target = `node_${idT}`;
    line.setAttribute('id',`e_${idE}`);
    line.setAttribute('stroke-width',2.0);
    line.setAttribute('x1',start.x);
    line.setAttribute('y1',start.y);
    line.setAttribute('x2',end.x);
    line.setAttribute('y2',end.y);
    line.setAttribute("stroke", "#dfdfdf")
    return line;
  }


  /**
   *
   */
  getCoords(node) {
    let rect = node.getBoundingClientRect();
    // console.log(rect);
    return {
      x: rect.left + rect.width / 2.0 + window.scrollX,
      y: rect.top  + rect.height / 2.0 + window.scrollY
    }
  }

} // End of class Edge

