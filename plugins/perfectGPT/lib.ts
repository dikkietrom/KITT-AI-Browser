
class Model  {
    constructor() {
    }
    intercept(props,callback) {
        // for (let p in json.properties) {
        //     let v
        //     let that = this
        //     Object.defineProperty(this, p, {
        //         get: function() {
        //             return v

        //         },
        //         set: function(value) {
        //             v = value
        //             json.fn({
        //                 property: p,
        //                 value: value,
        //             })

        //         }
        //     })
        // }
    }
}
class View extends HTMLElement {
    constructor(arg) {
        super(arg)
        
    }
}

class CssVar extends Model {
    constructor(json) {
        super(json)
        this.root = document.documentElement.style
        let that = this
        this.intercept({
            properties: json,
            fn: function(json) {
                that.root.setProperty(
                    '--' + json.property,
                    json.value)
            }
        })
    }
    
}

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
            enter.call(node, traverser);
        },
        leave: function(node, parent) {
            leave.call(node, traverser);
        }
    });
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

function storeImpl(data){

const url = 'http://localhost:3000/store'; // Replace with your API endpoint

 
const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
};

fetch(url, options)
  .then(response => response.json())
  .then(data => {
    // Handle the response data
    console.log(data);
  })
  .catch(error => {
    // Handle any errors
    console.error(error);
  });

}
function updateProp(propInst,propTextBox,val){
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

    updateProp(propInst,propTextBox,methodInst[method]())

    if (propInst[prop] === WAIT) {
      start.jsInst.PROCEED = (data) => {
        const textChunk=[]
        data.forEach((d)=>{
            textChunk.push(new TextDecoder('utf-8').decode(d));
          
        })

        updateProp(propInst,propTextBox,textChunk.join(''))

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


