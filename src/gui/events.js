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

  /**
   * Events
   */
  const shrinkExpand = (evt) => {
    console.log('SHRINK/EXPAND');

    // Hide body, footer
    let id = evt.target.parentNode.id.match(/\d+/)[0];
    let node = document.getElementById(`node_${id}`);
    console.log(evt.target.parentNode.id,id);
    console.log(node);
    node.classList.toggle('shrink');

    // Shrink mode is true
    TWIP.graph.updateEdges(node,node.classList.contains('shrink'));
    console.log(node);
    evt.preventDefault();

  }

  const displayLayer = (evt) => {
    console.log(evt.target.value,evt.target.id);
    let id = evt.target.id.match(/\d+/)[0];
    console.log(id);
    // Pass #1
    let layers = document.querySelectorAll(`#body_${id} .layer`);
    layers.forEach( (layer) => layer.style.display = (layer.id === `layer_${evt.target.value}`) ?  "table-row-group" : "none");
    // Pass #2
    layers = document.querySelectorAll(`#body_${id} .outputs .layer`);
    layers.forEach( (layer) => layer.style.display = (layer.id === `layer_${evt.target.value}`) ?  "block" : "none");
    console.log(layers);
  }

  /*
   * Functions used for drag and drop of `node`
   *
   * @author Jean-Christophe Taveau
   */
  const dragStartNode = (event) => {
    let dragged = document.getElementById(`node_${event.target.dataset.nodeid}`);
    DRAG.node = dragged;
    dragged.style.zIndex = 1000;
    let isShrinked = dragged.classList.contains('shrink');
    console.log(event.target.dataset.nodeid,dragged);
    // Update Edges
    TWIP.graph.updateEdges(dragged,isShrinked);
    return dragged;
  }

  const dragOverNode = (event) => {
    let dragged = DRAG.node;
    // Update Node(s)
    console.info('-----------\n   DRAG\n-----------');
    console.info('TRANSF. ',window.getComputedStyle(document.getElementById('board'),null).transform);
    console.info(dragged.getBoundingClientRect().x,dragged.getBoundingClientRect().y);

    console.info(DRAG);
    console.info(TWIP);

    // Apply the inverse of transform matrix of `board`
    DRAG.node.style.left = ((DRAG.BBox.x - TWIP.tx)/TWIP.zoom + DRAG.newDX/TWIP.zoom)  + 'px';
    DRAG.node.style.top  = ((DRAG.BBox.y - TWIP.ty)/TWIP.zoom + DRAG.newDY/TWIP.zoom)  + 'px';

    // Update Edges
    let isShrinked = dragged.classList.contains('shrink');
    TWIP.graph.updateEdges(dragged,isShrinked);
  }

  const dragEndNode = (event) => {
    // Update Edges
    let dragged = DRAG.node;
    dragged.style.zIndex = 1;
    TWIP.graph.updateEdges(dragged,dragged.classList.contains('shrink'));
  }

  const DRAG = {
    orgX: 0,
    orgY: 0,
    dx: 0,
    dy: 0,
    newDX: 0,
    newDY: 0
  }
  
  /**
   * Generic version of draggable
   */
  const draggable = (element,funcStart,funcOver,funcEnd) => {

    const dragstart = (event) => {

      // centers the tile at (pageX, pageY) coordinates
      const moveAt = (pageX, pageY) => {
        // console.log(orgX,orgY,pageX,pageY,dx,dy,' = ',pageX - orgX + dx,pageY - orgY + dy);
        DRAG.newDX = (pageX  - DRAG.orgX); ///TWIP.zoom; // WRONG
        DRAG.newDY = (pageY  - DRAG.orgY); ///TWIP.zoom;
      }

      const drag_over = (event) => {
        moveAt(event.pageX, event.pageY);
        // Run function
        funcOver(event);

        event.preventDefault();
        return false;
      }
      
      const drag_end = (event) => {
        window.removeEventListener('mousemove', drag_over,false);
        window.removeEventListener('mouseup', drag_end,false);
        // Update Edges
        funcEnd(event);
      }
      
      /*
       * Parse matrix of css transform
      */
      const parseMatrix = (transform) => transform.split(/\(|,|\)/).slice(1,-1).map( v => parseFloat(v) );


      // M A I N of `dragstart`
      console.log(event);
      // Init
      DRAG.button = event.which;
      let matrix = parseMatrix(window.getComputedStyle(document.getElementById('board'),null).transform);
      console.info(matrix);
      TWIP.tx = matrix[4];
      TWIP.ty = matrix[5];

      // Step #1
      let dragged = funcStart(event);

      if (dragged === false) {
        return;
      }
      /*
      let dragged = document.getElementById(`node_${event.target.dataset.nodeid}`);
      dragged.style.zIndex = 1000;
      let isShrinked = dragged.classList.contains('shrink');
      console.log(event.target.dataset.nodeid,dragged);
      */
      DRAG.orgX = event.pageX; // * TWIP.zoom + TWIP.tx;
      DRAG.orgY = event.pageY; // * TWIP.zoom + TWIP.ty;
      // TODO Must be improved - All the parents up to `game`

      DRAG.cx = document.documentElement.clientWidth/2.0;
      DRAG.cy = document.documentElement.clientHeight/2.0;
      let tx = matrix[4];
      let ty = matrix[5];

      console.info(tx,ty);
      DRAG.BBox = dragged.getBoundingClientRect(); // - cx )/TWIP.zoom + cx; // Take into account the zoom?
      DRAG.offsetX = dragged.getBoundingClientRect().left; // - cx )/TWIP.zoom + cx; // Take into account the zoom?
      DRAG.offsetY = dragged.getBoundingClientRect().top; //  - cy )/TWIP.zoom + cy;// Take into account the zoom?

      console.log('OFFSETS2 ',event.offsetX,event.offsetY,dragged.style.top,dragged.style.left);
      console.log('COORDS2 ',
        event.clientX,event.clientY,
        DRAG.orgX,DRAG.orgY,
        DRAG.offsetX,DRAG.offsetY,
        dragged.style.left,dragged.style.top,
        dragged.getBoundingClientRect().left,dragged.getBoundingClientRect().top
      );
      console.info('NODE2 ',window.getComputedStyle(dragged,null).transform);

      console.log('CENTER2 ',document.documentElement.clientWidth/2.0, document.documentElement.clientHeight/2.0);

      // moveAt(event.pageX, event.pageY);

      // Move the tile on mousemove
      window.addEventListener('mousemove', drag_over);

      // Drop the tile, remove unneeded handlers
      window.addEventListener('mouseup', drag_end);
      event.preventDefault();
    };

    // M A I N
    if (element.classList) {
      element.classList.add('movable');
    }
    else {
      element.className = 'movable';
    }

    element.addEventListener('mousedown', dragstart,false); 
    element.addEventListener('dragstart', (e) => {e.preventDefault();return false},false); 
    element.addEventListener('dragover', (e) => {return false},false); 
    element.addEventListener('drop', (e) => false,false); 
  }


