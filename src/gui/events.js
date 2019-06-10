  /**
   * Events
   */
  const shrinkExpand = (evt) => {
    console.log(evt);
    console.log(evt.target.value,evt.target.parentNode.id);
    // Hide body, footer
    let id = evt.target.parentNode.id.match(/\d+/)[0];
    let node = document.getElementById(`node_${id}`);
    node.classList.toggle('shrink');

    // Shrink mode is true
    updateEdges([id],true);
    console.log(node);

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

  const draggable = (element) => {
    
    const dragstart = (event) => {
      // centers the tile at (pageX, pageY) coordinates
      const moveAt = (pageX, pageY) => {
        // console.log(orgX,orgY,pageX,pageY,dx,dy,' = ',pageX - orgX + dx,pageY - orgY + dy);
        dragged.style.left = pageX - orgX  + dx + window.scrollX + 'px';
        dragged.style.top = pageY - orgY + dy  + window.scrollY + 'px';
      }

      const drag_over = (event) => {
        moveAt(event.pageX, event.pageY);
        // Update Edges
        // TODO HACK 
        TWIP.graph.updateEdges([dragged]);

        event.preventDefault();
        return false;
      }
      
      const drag_end = (event) => {
        let node = document.getElementById(`node_${event.target.dataset.nodeid}`);
        node.style.zIndex = 1;
        window.removeEventListener('mousemove', drag_over,false);
        dragged.removeEventListener('mouseup', drag_end,false);
        // Update Edges
        TWIP.graph.updateEdges([node]);
      }
      
      // Main of `dragstart`
      console.log(event);
      let dragged = document.getElementById(`node_${event.target.dataset.nodeid}`);
      console.log(event.target.dataset.nodeid,dragged);
      let orgX = event.pageX;
      let orgY = event.pageY;
      // TODO Must be improved - All the parents up to `game`
      let dx = dragged.getBoundingClientRect().left;
      let dy = dragged.getBoundingClientRect().top;
      dragged.style.zIndex = 1000;

      moveAt(event.pageX, event.pageY);

      // Move the tile on mousemove
      window.addEventListener('mousemove', drag_over);

      // Drop the tile, remove unneeded handlers
      window.addEventListener('mouseup', drag_end);
      event.preventDefault();
    };

    // M A I N
    let header = element.firstChild;
    header.classList.add('movable');
    header.addEventListener('mousedown', dragstart,false); 
    header.addEventListener('dragstart', (e) => {e.preventDefault();return false},false); 
    header.addEventListener('dragover', (e) => {return false},false); 
    header.addEventListener('drop', (e) => false,false); 
  }
