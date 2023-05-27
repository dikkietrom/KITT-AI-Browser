class Shape {
    constructor(json) {
        this.svg = json.svg;
        this.x = json.x;
        this.y = json.y;
        this.color = json.color;
        this.children = [];

        this.draggable = json.draggable === false ? false : true
        // Default to not draggable

        if (this.draggable) {
            // Define drag behavior
            this.drag = d3.drag().on("start", (event,d)=>this.dragstarted(event, d)).on("drag", (event,d)=>this.dragged(event, d)).on("end", (event,d)=>this.dragended(event, d));

            // Create group for this shape and its children
            this.group = this.svg.append("g").datum(this)// Pass this to the drag function
            .call(this.drag);
        } else {
            this.group = this.svg.append("g");
        }
    }

    // Define drag event handlers
    dragstarted(event, d) {
        d.x = parseFloat(this.element.attr("x"));
        d.y = parseFloat(this.element.attr("y"));
        this.group.raise().classed("active", true);
    }

    dragged(event) {
        this.traverse((child)=>{
            child.x += event.dx;
            child.y += event.dy;
            child.setXY()
          
        }
        )

    }

    dragended(event) {
        this.group.classed("active", false);
    }

    setXY() {
        this.element.attr("x", this.x).attr("y", this.y);
    }
    addChild(shape) {
        if (this.x && this.y) {
            shape.group.attr("transform", `translate(${this.x},${this.y})`);
        }
        this.children.push(shape);
    }

    createCircle(json) {
        const circle = new Circle({
            ...json,
            svg: this.svg
        });
        this.addChild(circle);
        return circle;
    }

    createRectangle (json) {
        const rect = new Rectangle({
            ...json,
            svg: this.svg
        });
        this.addChild(rect);
        return rect;
    }

    createSquare(json) {
        const square = new Square({
            ...json,
            svg: this.svg
        });
        this.addChild(square);
        return square;
    }
    traverse(callback) {
        callback(this);
        this.children.forEach(child=>{
            child.traverse(callback);
        }
        )
    }
}
class Circle extends Shape {
    constructor(json) {
        super(json);
        this.radius = json.radius;

        // Create the circle
        this.element = this.group.append("circle").attr("r", this.radius).attr("cx", this.x).attr("cy", this.y).style("fill", this.color);
    }

    setXY(x, y) {
        this.element.attr("cx", this.x).attr("cy", this.y)
    }
    // Override dragstarted for Circle
    dragstarted(event, d) {
        d.x = parseFloat(this.element.attr("cx"));
        d.y = parseFloat(this.element.attr("cy"));
        this.group.raise().classed("active", true);
    }
}

class Square extends Shape {
    constructor(json) {
        super(json);
        this.sideLength = json.sideLength;
        // Create the square
        this.element = this.group.append("rect").attr("x", this.x).attr("y", this.y).attr("width", this.sideLength).attr("height", this.sideLength).style("fill", this.color);
    }

}
class Rectangle extends Shape {
    constructor(json) {
        super(json);
        this.width = json.width;
        this.height = json.height;

        // Create the rectangle
        this.element = this.group.append("rect")
            .attr("x", this.x)
            .attr("y", this.y)
            .attr("width", this.width)
            .attr("height", this.height)
            .style("fill", this.color);
    }

 
    // // Override dragstarted for Rectangle
    // dragstarted(event, d) {
    //     d.x = parseFloat(this.element.attr("x"));
    //     d.y = parseFloat(this.element.attr("y"));
    //     this.group.raise().classed("active", true);
    // }
}

class Layout extends Shape {
    constructor(json) {
        super(json);
        // Create an SVG container

    }
}
