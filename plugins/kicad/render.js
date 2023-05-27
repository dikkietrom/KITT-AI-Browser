 

function drawComponentsOnCanvas(kicadMod) {

    const container = div();
    container.style.position = "relative";
    container.style.background = "#dddd";
    container.style.height = "2000px";
    container.style.width = "2000px";

    const boardWidth = 2000 * kicadMod.zoom
    const boardHeight = 2000 * kicadMod.zoom

    const rulerWidth = 0
    const pcbDiv = div(container)
    pcbDiv.id = "pcb";
    pcbDiv.style.position = "relative";
    pcbDiv.style.width = "100%";
    pcbDiv.style.height = "100%";

    const gridSpacing = 100 * kicadMod.zoom;

    // for (let i = 0; i < boardWidth / gridSpacing; i++) {
    //     const verticalLine = document.createElement("div");
    //     verticalLine.style.position = "absolute";
    //     verticalLine.style.left = i * gridSpacing + "px";
    //     verticalLine.style.top = "0";
    //     verticalLine.style.width = "1px";
    //     verticalLine.style.height = "100%";
    //     verticalLine.style.backgroundColor = "#000";
    //     pcbDiv.appendChild(verticalLine);
    // }

    // for (let i = 0; i < boardHeight / gridSpacing; i++) {
    //     const horizontalLine = document.createElement("div");
    //     horizontalLine.style.position = "absolute";
    //     horizontalLine.style.left = "0";
    //     horizontalLine.style.top = i * gridSpacing + "px";
    //     horizontalLine.style.width = "100%";
    //     horizontalLine.style.height = "1px";
    //     horizontalLine.style.backgroundColor = "#000";
    //     pcbDiv.appendChild(horizontalLine);
    // }

    for (const kicadModule of kicadMod.moduleList) {
        const x = rulerWidth + parseFloat(kicadModule.zx);
        const y = rulerWidth + parseFloat(kicadModule.zy);
        const width = kicadModule.zwidth;
        const height = kicadModule.zheight;

        const componentDiv = document.createElement("div");
        componentDiv.style.position = "absolute";
        componentDiv.style.left = x + "px";
        componentDiv.style.top = y + "px";
        componentDiv.style.width = width + "px";
        componentDiv.style.height = height + "px";
        componentDiv.style.border = "1px solid black";
        componentDiv.style.textAlign = "center";
        componentDiv.style.lineHeight = height + "px";
        componentDiv.style.fontFamily = "Arial";
        componentDiv.style.fontSize = "14px";
        componentDiv.textContent = kicadModule.ref;

        for (const pad of kicadModule.padList) {
            const padX = parseFloat(pad.zx);
            const padY = parseFloat(pad.zy);
            const padWidth = pad.zwidth;
            const padHeight = pad.zheight;

            const padDiv = div(componentDiv)
            padDiv.style.position = "absolute";
            padDiv.style.left = padX + "px";
            padDiv.style.top = padY + "px";
            padDiv.style.width = padWidth + "px";
            padDiv.style.height = padHeight + "px";
            padDiv.style.backgroundColor = "#00f";
        }

        pcbDiv.appendChild(componentDiv);
    }

    const outlineDiv = document.createElement("div");
    outlineDiv.style.position = "absolute";
    outlineDiv.style.left = kicadMod.zx + "px";
    outlineDiv.style.top = kicadMod.zy + "px";
    outlineDiv.style.width = kicadMod.zwidth + "px";
    outlineDiv.style.height = kicadMod.zheight + "px";
    outlineDiv.style.border = "1px solid black";
    pcbDiv.appendChild(outlineDiv);


    container.style.margin='100px'
    container.style.border='1px solid black'
    //container.parent.style.background='yellow'
    
    return container

}

 