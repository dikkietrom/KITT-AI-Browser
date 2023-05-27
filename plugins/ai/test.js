function createNetworkSvg(x, y) {
    const svgNS = "http://www.w3.org/2000/svg";
    let svgElem = document.createElementNS(svgNS, "svg");

    svgElem.setAttributeNS(null, "width", "400");
    svgElem.setAttributeNS(null, "height", "200");

    let nodes = [
        {x: x + 50, y: y + 50},
        {x: x + 50, y: y + 150},
        {x: x + 350, y: y + 50},
        {x: x + 350, y: y + 150}
    ];

    let connections = [
        {from: nodes[0], to: nodes[2]},
        {from: nodes[0], to: nodes[3]},
        {from: nodes[1], to: nodes[2]},
        {from: nodes[1], to: nodes[3]}
    ];

    // Draw nodes
    for (let node of nodes) {
        let circle = document.createElementNS(svgNS, "circle");

        circle.setAttributeNS(null, "cx", node.x);
        circle.setAttributeNS(null, "cy", node.y);
        circle.setAttributeNS(null, "r", 10);
        circle.setAttributeNS(null, "stroke", "black");
        circle.setAttributeNS(null, "stroke-width", 1);
        circle.setAttributeNS(null, "fill", "black");

        svgElem.appendChild(circle);
    }

    // Draw connections
    for (let connection of connections) {
        let line = document.createElementNS(svgNS, "line");

        line.setAttributeNS(null, "x1", connection.from.x);
        line.setAttributeNS(null, "y1", connection.from.y);
        line.setAttributeNS(null, "x2", connection.to.x);
        line.setAttributeNS(null, "y2", connection.to.y);
        line.setAttributeNS(null, "stroke", "black");
        line.setAttributeNS(null, "stroke-width", 1);

        svgElem.appendChild(line);
    }

    // Add the SVG to the document
    document.body.appendChild(svgElem);
}

// Example usage: createNetworkSvg(100, 100);

document.body.onload= ()=>{
    createNetworkSvg(100, 100);
}
