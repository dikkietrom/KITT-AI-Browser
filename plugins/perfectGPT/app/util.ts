function WAIT() {
}
async function fetchTextStream(cllr) {
    const content = []

    const response = await fetch(cllr.path);

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const reader = response.body.getReader();

    return new ReadableStream({
        start(controller) {
            function read() {
                reader.read().then(({done, value})=>{
                    if (done) {
                        cllr.PROCEED(content)
                        controller.close();
                        return;
                    }

                    controller.enqueue(value);
                    read();
                    content.push(value)
                }
                ).catch((error)=>{
                    controller.error(error);
                }
                );
            }

            read();
        },
        cancel() {
            reader.cancel();
        }
    });
}
 function traverse(code, enter, leave) {
    let ast = code.indexOf ? esprima.parse(code) : code

    let traverser = new Controller()

    traverser.traverse(ast, {
        enter: function(node, parent) {
            node._parent = parent
            enter.call(node, traverser);
        },
        leave: function(node, parent) {
            leave.call(node, traverser);
        }
    });
    return ast
}

class AstCallBack {

    call(node, traverser) {
        console.log(node)
        let fn = this['on' + node.type]
        if (fn) {
            fn(node, traverser)
        }
    }
}


function updateProp(propInst,prop,val,propTextBox){
    propInst[prop] = val//////exec flow
    propTextBox.value = propInst[prop]   
    propTextBox.title = propInst[prop]   
    if(propInst._update){
        propInst._update()
    }

}
function updateFlow(start,end){

    const prop = end.jsProperty        
    const propInst = end.jsInst        
    const method = start.jsMethod         
    const methodInst = start.jsInst   

    const propTextBox = end.textBox        

    updateProp(propInst,prop,methodInst[method](),propTextBox)

    if (propInst[prop] === WAIT) {
      start.jsInst.PROCEED = (data) => {
        const textChunk=[]
        data.forEach((d)=>{
            textChunk.push(new TextDecoder('utf-8').decode(d));
          
        })

        updateProp(propInst,prop,textChunk.join(''),propTextBox)

      }
    }
    propTextBox.setAttribute( 'readonly','readonly')    

}
function updateFlows(jsInst){
    startWire.wires.forEach((w)=>{
        if(w.start.jsInst===jsInst){
            updateFlow(w.start,w.end)  
        }
    })
   
}

function execFlow(elem1,elem2){
    const start  = elem1.jsMethod ? elem1 : elem2
    const end  = elem1.jsMethod ? elem2 : elem1

    startWire.wires.push( {start : start , end : end })
    updateFlow(start,end)

}

function storeCode(classNode,methodNode,jsInst) {
 
    


    storeAsJsFile()
    const nwNm = newName()
    const funcJs = `function ${nwNm} ()  ${generate(methodNode.value.body)}`
    const methodName = methodNode.key.name
    const scrpt = document.createElement('script')
    scrpt.innerHTML = funcJs
    document.body.appendChild(scrpt)
    jsInst[methodName] = window[nwNm]

}
function storeProperty(classNode,propertyNode,jsInst) {
   
    let found = -1
    const propertyName = propertyNode.property.name
    const propertyValue = jsInst[propertyNode.property.name]
    propertyNode._parent.right.raw = "'"+propertyValue+"'"
    propertyNode._parent.right.value = propertyValue

    storeAsJsFile()

}

function newName() {
    return 'a' + Date.now() 
}
function storeImpl(data,path){

  const url = 'http://localhost:3000/store';  
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/text',
      'Content-Path': path
    },
    body: data
  };
  
  fetch(url, options)
    .then(response => response.text())
    .then(data => {
      // Handle the response data
      console.log(data);
    })
    .catch(error => {
      // Handle any errors
      console.error(error);
    });

}


function getImpl(name){
    let ret=null
    implAst.body.forEach((clssNode)=>{
        if (clssNode.id && clssNode.id.name===name) {
            ret=clssNode
            return
        }
    })
    return ret
}

function injectObject(clssNode){
    const js = generate(clssNode)
    const jsClass = eval(`(function() { ${js} return ${clssNode.id.name}})()`) 
    return new jsClass()
    //return newObject(clssNode.id.name)
}
function newObject(className){
    return eval(`
        (function() { 
            return new ${className}() 
        })()
    `) 
    
}
function findClass(className){
    let ret = null
    this.body.forEach((c)=>{
        if(c.name.id===className){
            ret = c
        }
    })
    return ret
}

function sortChildren(elem,calback){
    const container = elem
    const children = Array.from(container.children);

    // Sort the children based on text content
    children.sort(calback);

    // Clear the container
    container.innerHTML = "";

    // Append the sorted children back to the container
    children.forEach(child => {
      container.appendChild(child);
    });    
}

function storeAsJsFile(json = {}){
    if (!json.path) {
        json.path='app/object-store.js'
    }
    if (!json.ast) {
        json.ast=implAst
    }
        
    storeImpl(generate(json.ast),json.path)    
    json.path='app/flow/a1.ts'
    
    
    storeImpl(wiresToJson(),json.path)
}

function wiresToJson(){
    const wires = []
    startWire.wires.forEach((w)=>{
        wires.push({
            start : {
                jsInst : w.start.jsInst.constructor.name,
                jsMethod : w.start.jsMethod,
                x: w.start.jsInst._html.offsetLeft,
                y: w.start.jsInst._html.offsetTop,
            },            
            end : {
                jsInst : w.end.jsInst.constructor.name,
                jsProperty: w.end.jsProperty,
                x: w.end.jsInst._html.offsetLeft,
                y: w.end.jsInst._html.offsetTop,
            }
        })
    })
    return JSON.stringify(wires,null,4)
}

function deleteProperty(propertyNode){
    const chld = propertyNode._parent
    const prnt = chld._parent
    const ind = prnt.body.indexOf(chld)
    prnt.body.splice(ind,1)
    storeAsJsFile()
}
function findAllChains(wires) {
  const graph = buildGraph(wires); // Build the graph representation

  const chains = []; // Array to store the found chains
  const visited = new Set(); // Set to keep track of visited nodes

  // Recursive DFS function to find chains
  function dfs(node, chain) {
    visited.add(node);
    chain.push(node);

    if (graph[node]) {
      for (const neighbor of graph[node]) {
        if (!visited.has(neighbor)) {
          dfs(neighbor, chain);
        }
      }
    }

    visited.delete(node);

    // If the chain ends, push a copy of it to the chains array
    if (!graph[node]) {
      chains.push([...chain]);
    }

  }

  // Perform DFS starting from each node in the graph
  for (const node in graph) {
    if (!visited.has(node)) {
      dfs(node, []);
    }
  }

  return chains;
}
 
// Helper function to build the graph representation
function buildGraph(wires) {
  const graph = {}

  for (const w of wires) {
    
    const from = w.start.jsInst.constructor.name
    const to = w.end.jsInst.constructor.name
    if (!graph[from]) {
      graph[from] = [];
    }

    graph[from].push(to);
  }

  return graph;
}
 
