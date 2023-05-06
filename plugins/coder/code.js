
const kicadFile = `
(gr_line (start 240.03 191.135) (end 240.03 231.775) (angle 90) (layer Edge.Cuts) (width 0.15))
(gr_line (start 148.59 231.775) (end 149.86 231.775) (angle 90) (layer Edge.Cuts) (width 0.15))
(gr_line (start 67.31 191.135) (end 67.31 231.775) (angle 90) (layer Edge.Cuts) (width 0.15))
(gr_line (start 67.31 231.775) (end 240.03 231.775) (angle 90) (layer Edge.Cuts) (width 0.15))
(gr_line (start 240.03 191.135) (end 67.31 191.135) (angle 90) (layer Edge.Cuts) (width 0.15))
`;

function parseKiCadFile(kicadFile) {
  const edgeCuts = kicadFile
    .split('\n')
    .filter(line => line.includes('(layer Edge.Cuts)'))
    .map(line => {
      const coords = line.match(/-?\d+(\.\d+)?/g).map(Number);
      return { start: { x: coords[0], y: coords[1] }, end: { x: coords[2], y: coords[3] } };
    });

  return { edgeCuts };
}
 
 function drawPCBModel(canvasId, pcbModel, scaleFactor = 1) {
   let canvas = document.getElementById(canvasId);

   // Create the canvas if it doesn't exist
   if (!canvas) {
     canvas = document.createElement('canvas');
     canvas.id = canvasId;
     canvas.width = 500; // Set the desired canvas width
     canvas.height = 500; // Set the desired canvas height
     canvas.style.border = '1px solid black'; // Add border to the canvas
     document.body.appendChild(canvas);
   }

   const ctx = canvas.getContext('2d');
   ctx.clearRect(0, 0, canvas.width, canvas.height);
   ctx.save();
   ctx.scale(scaleFactor, scaleFactor);
ctx.translate((1 - scaleFactor) * pcbModel.edgeCuts[4].start.x, (1 - scaleFactor) * pcbModel.edgeCuts[4].start.y);
   pcbModel.edgeCuts.forEach((cut, index) => {
     ctx.beginPath();
     ctx.moveTo(cut.start.x, cut.start.y);
     ctx.lineTo(cut.end.x, cut.end.y);
     ctx.stroke();
   });
   ctx.restore();
 }

 // Zoom functions
 let currentZoomFactor = 1;

 function zoomIn(canvasId) {
   currentZoomFactor *= 1.1;
   drawPCBModel(canvasId, pcbModel, currentZoomFactor);
 }

 function zoomOut(canvasId) {
   currentZoomFactor *= 0.9;
   drawPCBModel(canvasId, pcbModel, currentZoomFactor);
 }

 // Create zoom in and zoom out buttons
 const zoomInButton = document.createElement('button');
 zoomInButton.textContent = 'Zoom In';
 zoomInButton.onclick = () => zoomIn('pcbCanvas');
 document.body.appendChild(zoomInButton);

 const zoomOutButton = document.createElement('button');
 zoomOutButton.textContent = 'Zoom Out';
 zoomOutButton.onclick = () => zoomOut('pcbCanvas');
 document.body.appendChild(zoomOutButton);

 // Usage example
 const pcbModel = parseKiCadFile(kicadFile);
 drawPCBModel('pcbCanvas', pcbModel);
