 
function parse(json) {
    const stack = [new Fragment('group',null)];
    let currentFragment = stack[0];

    const regex = /\s*([\(\)])\s*|\s*([^()\s]+)/g;

    let match;
    while ((match = regex.exec(json.code)) !== null) {
        const [_,delimiter,word] = match;

        if (delimiter === "(") {
            const newFragment = new Fragment(null,null,[]);
            currentFragment.addChild(newFragment);
            stack.push(newFragment);
            currentFragment = newFragment;
        } else if (delimiter === ")") {
            stack.pop();
            currentFragment = stack[stack.length - 1];
        } else {
            if (currentFragment.name === null) {
                currentFragment.name = word;
            } else {
                currentFragment.values.push(word);
            }

            if (currentFragment.children.length > 0) {
                currentFragment.type = 'group';
            } else {
                currentFragment.type = 'text';
            }
        }
    }
    currentFragment.children[0].traverse((fr)=>{
        fr.children.forEach((child)=>{
            if (fr[child.name]) {
                // If the property already exists and is an array, push the child into it
                if (Array.isArray(fr[child.name])) {
                    fr[child.name].push(child);
                } else {
                    // If the property exists but is not an array, convert it to an array and add the new child
                    const existingChild = fr[child.name];
                    fr[child.name] = [existingChild, child];
                }
            } else {
                // If the property doesn't exist, initialize it with the child
                fr[child.name] = child;
            }
        }
        );
    }
    );
    currentFragment.children[0].traverse((fr)=>{
        for (let p in fr) {
            let child = fr[p];
            if (child instanceof Fragment) {
                // Check if there are no children
                if (!child.children || child.children.length === 0) {
                    // Set the property based on the length of values
                    if (child.values && child.values.length === 1) {
                        fr[p] = child.values[0];
                    } else if (child.values && child.values.length > 1) {
                        fr[p] = child.values;
                    } else {
                        fr[p] = null;
                    }
                }
            }
        }
    }
    );
    json.root = currentFragment.children[0]
    return toKicadPcb(json)
}


function toKicadPcb(json) {
    const {root, zoom} = json;
    const kicad = new KicadMod();
    kicad.moduleList = [];
    kicad.netList = [];
    kicad.zoom = zoom

    let lines = []
    root.gr_line.forEach((line)=>{
        if (line.layer == "Edge.Cuts") {

            lines.push(extractXY(line))
        }
    }
    );
    kicad.calculateDimensions({
        lines: lines
    })
    const originX = 0
    //kicadMod.outlines.x;
    const originY = 0
    //kicadMod.outlines.y;

    root.module.forEach((m)=>{
        let mod = new KicadMod();
        mod.ref = m.fp_text[0].values[1];
        mod.x = m.at[0]
        mod.y = m.at[1]

        mod.rot = m.at[2];
        lines = []
        m.fp_line.forEach((line)=>{
            if (line.layer == 'F.CrtYd') {
                lines.push(extractXY(line))
            }
        }
        );
        mod.calculateDimensions({
            lines: lines
        });
        m.pad.forEach((p)=>{
            let pad = new KicadMod();
            pad.x = parseFloat( p.at[0]) + parseFloat( p.size[0] / 2)
            pad.y = parseFloat( p.at[1]) + parseFloat( p.size[1] / 2)
            pad.width = p.size[0];
            pad.height = p.size[1];
            mod.padList = mod.padList ? mod.padList : []
            mod.padList.push(pad);

            pad.net = parseInt( p.net.values[0])

        }
        );

        kicad.moduleList.push(mod);

    }
    );

    kicad.traverse((instance)=>{

        instance.applyZoom(zoom)
    }
    );

    return kicad;
}

function extractXY(line) {
    line.x1 = line.start[0]
    line.x2 = line.end[0]
    line.y1 = line.start[1]
    line.y2 = line.end[1]
    return line
}

 