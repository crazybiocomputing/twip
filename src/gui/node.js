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


class Node {

  constructor(id,template,metadata) {
    this.id = id;
    this.template = template;
    this.element = document.createElement('section');

    this.hasLayers = template.properties.some( (p) => p.layer !== undefined);
    this.hasOutputs = template.properties.some( (p) => (p.layer !== undefined && p.layer.type === 'output') || p.output !== undefined);
    this.hasInputs  = template.properties.some( (p) => (p.layer !== undefined && p.layer.type === 'input')  || p.input !== undefined);

    this.createNode(template,id,metadata);
  }

  /**
   *
   * @author Jean-Christophe Taveau
   */
  createNode(node,id,metadata) {

    // Main
    console.log('CREATE ' + node.description);
    let nodeH = this.element;
    nodeH.id = 'node_'+id;
    nodeH.style.left = `${Math.floor(Math.random() * 1000)}px`;
    nodeH.style.top = `${Math.floor(Math.random() * 600)}px`;

    // Head
    let head = this.createHeader(node,id,metadata);

    // Shrink
    let shrink = this.createShrinkArea(node,id,metadata);

    // Body
    let body = this.createBody(node,id,metadata);
    
    // Footer
    let foot = this.createFooter(node,id,metadata);

    // Append all the parts
    nodeH.appendChild(head);
    nodeH.appendChild(shrink);
    nodeH.appendChild(body);
    nodeH.appendChild(foot);

    // Add draggable feature
    draggable(nodeH);

  }

  // Header
  createHeader(node,id,metadata) {
    let nodeH = this.element;

    // Header
    let head = document.createElement('div'); head.className = 'header'; head.classList.add(node.class.replace('.','_').toLowerCase());
    let preview = node.preview ? '<a href="#"><span class="preview"><i class="far fa-eye"></i></span></a>' : '';
    let desc =  node.description;
    head.innerHTML = `
      <p title="${node.help ? node.help : "No Help"}" data-nodeid="${id}">
        <a href="#" id="expand_${id}" onclick="shrinkExpand(event)">
          <span class="expandB">&#9662;</span>
          <span class="shrinkB">&#9656;</span>
        </a>
        &nbsp;&nbsp;#${node.id} - ${desc} &nbsp;${preview}
      </p>`;
    return head;
  }

  // Shrinkable View of node
  createShrinkArea(node,id,metadata) {

    let shrink = document.createElement('div');
    shrink.className = 'shrinkdiv'; shrink.classList.add(node.class.replace('.','_').toLowerCase());
    shrink.innerHTML = (this.hasInputs) ? '<span class="input_connector"><i class="fas fa-chevron-circle-right"></i></span>': '';
    shrink.innerHTML += '<p>&nbsp;</p>';
    shrink.innerHTML += (this.hasOutputs) ? '<span class="output_connector"><i class="fas fa-chevron-circle-right"></i></span>' : '';
    return shrink;
  }

  // Sub-content Outputs of <div> `content`
  createOutputs(id,headLayer,isLayered) {
    let node = this.template;

    let layers;
    if (isLayered) {
      layers = node.properties.filter( p => p.layer !== undefined);
    }
    let outputLayers = (isLayered) ? layers.filter( (lay) => lay.type === 'output') : [];

    let outputs = document.createElement('div'); 
    outputs.id = 'outputs_' + id; 
    outputs.className = 'outputs';

    if (outputLayers.length > 0) {
      outputs.innerHTML = headLayer.select.reduce ( (html,desc,index) => {
        console.log('CHOICE ', index,desc);
        let one = outputLayers.filter( layer => layer.layer === desc)[0];
        return html + `<div id="layer_${index}" class="layer"> ${this.createRow(one.properties)} </div>`;
      },'');
    }
    else {
      outputs.innerHTML = this.createRow( node.properties.filter( (prop) => prop.output !== undefined) );
    }

    return outputs;
  }

  createContent() {
  }

  createInputs() {
  }

  createBody(node,id,metadata) {

    // Body
    let body = document.createElement('div');
    body.id = 'body_'+id;
    body.className = 'body';
    // Main content
    let content = document.createElement('div'); content.id = 'content_' + id; content.className = 'content';
    let inputs = document.createElement('div'); inputs.id   = 'inputs_' + id; inputs.className = 'inputs';
    let action = document.createElement('div'); action.className = 'action';
    let popup = document.createElement('div'); popup.className = 'popup';

    
    // Parameters
    let outputLayers = [];
    let contentLayers = [];
    let inputLayers = [];
    let headLayer;

    if (this.hasLayers) {
      // Sort layers according to types: <output>, <content>, <input>
      headLayer = node.properties.filter( p => p.layerselect !== undefined)[0];
      let layers = node.properties.filter( p => p.layer !== undefined);
      outputLayers = layers.filter( (lay) => lay.type === 'output');
      contentLayers = layers.filter( (lay) => lay.type === 'content');
      inputLayers = layers.filter( (lay) => lay.type === 'input');
    }

    // Outputs
    let outputs = this.createOutputs(id,this.hasLayers,headLayer);

    // Content
    if (this.hasLayers) {
      // Selector
      let options = headLayer.select.reduce( (html,item,index) => html + `<option value="${index}">${item}</option>`,'');
      content.innerHTML = `<div class="row"><label>${headLayer.label}</label><select id='layerselect_${id}' onchange = "displayLayer(event)">${options}</select></div>`;
    }

    if (contentLayers.length > 0) {
      content.innerHTML += headLayer.select.reduce ( (html,desc,index) => {
        console.log('CHOICE '+desc);
        let one = contentLayers.filter( lay => lay.layer === desc)[0];
        console.log(one);
        return html + `<div id="layer_${index}" class="layer"> ${this.createRow(one.properties)} </div>`;
      },'');
    }
    else {
      content.innerHTML += this.createRow( node.properties.filter( (prop) => prop.layer === undefined && prop.layerselect === undefined && prop.input === undefined && prop.output === undefined) );
    }


    // Inputs
    if (inputLayers.length > 0) {
      inputs.innerHTML = headLayer.select.reduce ( (html,desc,index) => {
        let one = inputLayers.filter( layer => layer.layer === desc)[0];
        return html + `<div id="layer_${index}" class="layer"> ${this.createRow(one.properties)} </div>`;
      },'');
    }
    else {
      inputs.innerHTML = this.createRow( node.properties.filter( (prop) => prop.input !== undefined) );
    }

    body.appendChild(outputs);
    body.appendChild(content);
    body.appendChild(inputs);
    body.appendChild(action);
    body.appendChild(popup);

    return body;
  }


  createFooter(node,id,metadata) {
    let foot = document.createElement('div');
    foot.className = 'footer';
    foot.innerHTML = `<span style="align:right;margin:2px">${node.class}</span>`; // <button class="resize"><i class="fas fa-signal"></i></button>
    return foot;
  }

  createRow(props) {
    return props.reduce( (accu,prop,index) => {
      let label = prop.label;

      if (label === '_nodisplay_') {
        return accu;
      }
      accu += (prop.output) ? `<div id="o_${index}" class="output">` : ((prop.input) ? `<div id="i_${index}" class="input">`:`<div class="row">`);
      if (prop.output !== undefined || prop.input !== undefined) {
        accu += `<button><i class="fas fa-chevron-circle-right"></i></button><label>${prop.label}</label>`;
      }

      if (prop.select !== undefined) {
        let options = prop.select.reduce( (html,item,index) => html + `<option value="${index}">${item}</option>`,'');
        accu += `<label>${prop.label}</label><select>${options}</select>`;
      }
      else if (prop.checkbox !== undefined) {
         accu += `<label>${prop.label}</label><input class="checkbox" type="checkbox" value="${prop.checkbox}" ${prop.checkbox ? 'checked': ''}></input>`;
      }
      else if (prop.file !== undefined) {
         accu += `<label for="file" class="file-label"><i class=\"far fa-folder-open\"></i></label><input id="file" class="file-input" type="file"></input>`;
      }
      else if (prop.numerical !== undefined){
        // Label
         accu += `<label>${prop.label}</label><input type="text" class="numerical" minlength="4" maxlength="8" size="10" value="${prop.numerical}"></input>`;
      }
      else if (prop.text !== undefined){
        // Label
         accu += `<label>${prop.label}</label><input type="text" class="text" minlength="4" maxlength="8" size="10" value="${prop.text}"></input>`;
      }
      accu += '</div>';
      return accu;
    },
      ''
    );
  }

} // End of class Node


