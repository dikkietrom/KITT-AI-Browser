document.addEventListener('DOMContentLoaded', ()=>{

    let svg = d3.select("body").append("svg").attr("width", "100%").attr("height", "100%");

    // // Usage
    let layout = new Layout({
        width: "100%",
        height: "100%",
        svg: svg
    });
// layout.createRectangle({
//             x: 100,
//             y: 20,
//             width: 50,
//             height: 200,
//             color: "red"
//         });
    // let square = layout.createSquare({
    //     x: 200,
    //     y: 200,
    //     sideLength: 50,
    //     color: "red"
    // });
    // let circle = square.createCircle({
    //     draggable: false,
    //     x: 10,
    //     y: 10,
    //     radius: 20,
    //     color: "blue"
    // });
    drawComponents(data, layout)
}
, false);

function drawComponents(data, layout) {
    for (let module of data.moduleList) {
        let moduleSquare = layout.createRectangle({
            x: module.zx,
            y: module.zy,
            width: module.zwidth,
            height: module.zheight,
            color: "red"
        });

        for (let pad of module.padList) {
            let padCircle = moduleSquare.createCircle({
                draggable: false,
                x: pad.zx,
                y: pad.zy,
                radius: Math.max(pad.zwidth, pad.zheight) / 2,
                color: "blue"
            });
        }
    }
}
