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


class NodeFactory {

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static createOutputs(rows,nodeid) {
    let element;
  }

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static createBody(rows,nodeid) {
    let element = document.createElement('div');
    element.id = `body_${id}`;
    element.className = `body`;
    rows.forEach( row => element.appendChild(NodeFactory.createRow(row),nodeid) );
    return element;
  }

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static createInputs(rows,nodeid) {
    let element;
  }


  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static createRow(row,id) {
    let container = document.createElement('div');
    container.className = 'row';
    // Extract widget type
    let type = Object.keys(row).filter( prop => ['input','label','layerselect','output','var'].indexOf(prop) === -1)[0];
    let isLabelled = (Object.keys(row).indexOf('label') !== -1);
    console.log(type);
    let element;
    switch (type) {
      case 'button': element = NodeFactory.button(row,id); break;
      case 'canvas': element = NodeFactory.canvas(row,id); break;
      case 'checkbox': element = NodeFactory.checkbox(row,id); break;
      case 'flowcontrols': element = NodeFactory.flowcontrols(row,id); break;
      case 'numerical': element = NodeFactory.numerical(row,id); break;
      case 'readonly': element = NodeFactory.readonly(row,id); break;
      case 'select': element = NodeFactory.select(row,id); break;
      case 'text': element = NodeFactory.text(row,id); break;
      default: 
        alert(`Unknown widget ${type}`);
    }
    container.appendChild(element);
    console.log(container);
    return container;
  }

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static button(row,id) {
  }

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static canvas(row,id) {
    // <div class="graphics"><canvas></canvas></div>
    let container = document.createElement('div');
    container.className = 'graphics';
    container.appendChild(document.createElement('canvas'));
    return container;
  }

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static checkbox(row,id) {
    let container;
    let input = document.createElement('input');
    input.className = "numerical";
    input.setAttribute("type", "checkbox");
    input.setAttribute('name',row.var || 'unknown');
    input.setAttribute('value',row.checkbox);
    input.checked = row.checkbox;


    if (row.label) {
      let label = NodeFactory.label(row.label);
      // Wrap in `div`
      container = document.createElement('div');
      container.className = 'wrap';
      container.appendChild(label);
      container.appendChild(input);
    }
    else {
      container = input;
    }

    // TODO Add event onchanged
    return container;
  }

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static flowcontrols(row,id) {
    let buttons = row.flowcontrols.toString(2);
    let container = document.createElement('div');
    container.className = 'flowcontrols';
    buttons.forEach ( (b,index) => {
      if (b === 1) {
        let button = document.createElement('button');
        switch (index) {
          case 0: 
            // Fast Backward (Go to start)
            button.className = 'fastbckwrd';
            button.innerHTML = '<i class="fas fa-fast-backward"></i>';break;
          case 1:
            // Step backward
            button.className = 'stepbckwrd';
            button.innerHTML = '<i class="fas fa-step-backward"></i>';break;
          case 2:
            // Play/Pause
            button.className = 'play';
            button.innerHTML = '<i class="fas fa-play"></i>'; break;
          case 3:
            // Step Forward
            button.className = 'stepfrwrd';
            button.innerHTML = '<i class="fas fa-step-forward"></i>';break;
          case 4:
            // Fast Forward (Go to end)
            button.className = 'fastfrwrd';
            button.innerHTML = '<i class="fas fa-fast-forward"></i>';break;
          default:
            alert('Unknown Flow Controls');
        }
      }
      container.appendChild(button);
    });

    return container;
  }

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static numerical(row,id) {
    let container;
    let input = document.createElement('input');
    input.className = "numerical";
    input.setAttribute("type", "text");
    input.setAttribute('name',row.var || 'unknown');
    input.setAttribute('minlength',4);
    input.setAttribute('maxlength',8);
    input.setAttribute('size',10);
    input.setAttribute('value',row.numerical);


    if (row.label) {
      let label = NodeFactory.label(row.label);
      // Wrap in `div`
      container = document.createElement('div');
      container.className = 'wrap';
      container.appendChild(label);
      container.appendChild(input);
    }
    else {
      container = input;
    }

    // TODO Add event onchanged
    return container;
  }

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static readonly(row,id) {
  }

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static select(row,id) {
    let container = document.createElement('div');
    container.className = "select-container";
    let select = document.createElement('select');
    let options = row.select.reduce( (html,item,index) => html + `<option value="${index}">${item}</option>`,'');
    select.innerHTML = options;
    container.appendChild(select);
    return container;
  }

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static text(row,id) {
    // TODO
    return NodeFactory.numerical(row,id);
  }

  /*
   * 
   * @author Jean-Christophe Taveau
   */
  static label(title) {
    let e = document.createElement('label');
    e.innerText = title;
    return e;
  }

} // End of class NodeFactory



