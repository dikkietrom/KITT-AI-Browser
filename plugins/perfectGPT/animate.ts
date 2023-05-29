

startWire.wires=[]
function startWire(elem, event) {
  if (startWire.start) {
    startWire.start.classList.remove('pulse')
    if(startWire.start.className != elem.className){//end connect

        execFlow(startWire.start,elem)
        
    }else if (startWire.start!=elem) {//start connect
      startWire.start=elem
      startWire.start.classList.add('pulse')
      return
    }else if( startWire.start==elem ){//disconnet
      let t = startWire.wires
      startWire.wires=[]
      t.forEach( (w) => {
        if(w.start!=elem && w.end!=elem) {
            startWire.wires.push(w)
        } else{
            if (w.start.textBox) {
               w.start.textBox.removeAttribute( 'readonly')
           
            } else {
               w.end.textBox.removeAttribute( 'readonly')
            }
        }
      })
    }
    startWire.start=null
    return
  }
  startWire.start=elem
  
  elem.classList.add('pulse')
  const canvas = document.getElementById('wires');
  document.addEventListener('mouseup',(e)=>{

      //startWire.start=null
  })
  startWire.x = event.clientX
  startWire.y = event.clientY
  document.addEventListener('mousemove', (e)=>{
      startWire.x = e.clientX
      startWire.y = e.clientY     
     
  })
    
  // Get the canvas and div elements


  const rect = canvas.getBoundingClientRect();
  // Get the canvas context
  const ctx = canvas.getContext('2d');

  // Calculate the positions of the div and mouse
  const divPos = getCenterPosition(elem);


  // Variables for animation loop
  let animationId;
  let progress = 0;

  // Start the animation loop
  function animate() {
    canvas.height=document.body.scrollHeight
    canvas.width=document.body.scrollWidth
    // Clear the canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1

    // if(startWire.start){
    //   // Draw a smooth line from the div to the current position
    //   ctx.beginPath()
    //   ctx.moveTo(divPos.x,divPos.y);
    
    //   ctx.quadraticCurveTo( startWire.x -10,  startWire.y-10, startWire.x ,  startWire.y);
      
      
    // }
    startWire.wires.forEach((w)=>{
        ctx.beginPath()
        let c = getCenterPosition(w.start)
        let c2 = getCenterPosition(w.end)

        drawSmoothWire(ctx,c.x,c.y,c2.x,c2.y,-0.2)
      
    })
    requestAnimationFrame(animate)

 
  }

  // Start the animation loop
  
  animate();

  // Helper function to get the center position of an element
  function getCenterPosition(element) {
    const rect = element.getBoundingClientRect();
    if(element.classList.contains('propHeaderCon')){
    return {
      x: rect.left  ,
      y: rect.top + rect.height / 2
    };
    }else{
          return {
      x: rect.left + rect.width ,
      y: rect.top + rect.height / 2
    };
    }
  }
}
function drawSmoothWire(ctx, startX, startY, endX, endY, controlFactor) {
  // Calculate the control point based on the control factor
  var controlX = (startX + endX) / 2;
  var controlY = (startY + endY) / 2 - controlFactor * Math.abs(startX - endX);

  // Move the pen to the starting point
  ctx.moveTo(startX + document.body.scrollLeft, startY + document.body.scrollLeft );

  // Draw the curve
  ctx.quadraticCurveTo(controlX, controlY, endX+ document.body.scrollLeft, endY+ document.body.scrollTop);

  // Set the line style
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'black';

  // Stroke the curve
  ctx.stroke();
}


function detectAndResolveCollisions(className, draggingElement) {
  const objects = document.getElementsByClassName(className);
  
  for (const obj1 of objects) {
    if (obj1 === draggingElement) continue;
    
    const rect1 = obj1.getBoundingClientRect();
    
    for (const obj2 of objects) {      
      if ( obj1 == obj2) continue;
      
      const rect2 = obj2.getBoundingClientRect();
      
      if (checkCollision(rect1, rect2)) {
        resolveCollision(rect1, rect2,obj1,obj2);
        return;  
      }   
    } 
  }
}

function checkCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&  
    rect1.bottom > rect2.top
  );
}

function resolveCollision(rect1, rect2,obj1,obj2) {
  const overlapX = Math.min(rect1.right, rect2.right) - Math.max(rect1.left, rect2.left);  
  const overlapY = Math.min(rect1.bottom, rect2.bottom) - Math.max(rect1.top, rect2.top);

  if (overlapX < overlapY) {
     // Adjust horizontally
     if (rect1.left < rect2.left) {
       obj1.style.left = `${rect1.left - overlapX}px`;  
       obj2.style.left = `${rect2.left + overlapX}px`;
     } else {
       obj1.style.left = `${rect1.left + overlapX}px`; 
       obj2.style.left = `${rect2.left - overlapX}px`; 
     }    
  } else {
    // Adjust vertically
    if (rect1.top < rect2.top) {
      obj1.style.top = `${rect1.top - overlapY}px`;
      obj2.style.top = `${rect2.top + overlapY}px`;
    } else {
      obj1.style.top = `${rect1.top + overlapY}px`;
      obj2.style.top = `${rect2.top - overlapY}px`;
    }
  }

}



// Function to start dragging a copy of the node
function startDragging(event) {
  const node = event.currentTarget;
  const nodeCopy = node
  startDragging.node=node
  startDragging.x = parseInt( node.style.left  )
  startDragging.y = parseInt( node.style.top  )
  startDragging.ex = event.clientX
  startDragging.ey = event.clientY
  // Add the "dragging" class to the copied node
  

 
  // Append the copied node to the container

  // Add event listeners for dragging and dropping
  document.addEventListener('mousemove', dragNode);
  document.addEventListener('mouseup', stopDragging);
}

// Function to drag the node
function dragNode(event) {
  const nodeCopy = startDragging.node
  if (startDragging.node.className.indexOf('draggable')>-1) {
    nodeCopy.style.left = (startDragging.x  +( event.clientX-startDragging.ex  )) + 'px';
    nodeCopy.style.top = (startDragging.y  +(event.clientY - startDragging.ey  )) + 'px';
    detectAndResolveCollisions('collidable', nodeCopy);

  }
}

// Function to stop dragging the node
function stopDragging() {
 

  // Remove event listeners for dragging and dropping
  document.removeEventListener('mousemove', dragNode);
  document.removeEventListener('mouseup', stopDragging);
}


document.addEventListener('mousedown', (e)=>{
  e.target.classList.add('mousedown')
 // e.target.classList.remove('mouseup')
})
document.addEventListener('mouseup', (e)=>{
 // e.target.classList.add('mouseup')
  e.target.classList.remove('mousedown')

})