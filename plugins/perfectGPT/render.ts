 
var implAst
fetch('http://127.0.0.1:3000/api.ts')/////////////////////////////////API
.then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return response.text()
})
.then(data => {
    // Process the retrieved data
    currentElem = document.getElementById('editor');
    parseApi(data)
})
.catch(error => {
    // Handle any errors that occurred during the fetch request
    console.error('Error:', error);
});

fetch('http://127.0.0.1:3000/impl.js')//////////////////////////////IMP
.then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return response.text()
})
.then(data => {
    // Process the retrieved data
    implAst = esprima.parse(data)
})
.catch(error => {
    // Handle any errors that occurred during the fetch request
    console.error('Error:', error);
});




// Get the editor container element
var currentElem
function parseApi(code) {

    try {

        let enter = new AstCallBack()
        let rootView = null
        enter.onProgram = (node)=>{
            node.body.sort((a,b)=>{
                if (a.id.name.charAt(0)=='I' && b.id.name.charAt(0)!='I'  ) {
                    return -1
                }  
                if (a.id.name.charAt(0)!='I' && b.id.name.charAt(0)=='I'  ) {
                    return 1
                }  
                return a.id.name.localeCompare(b.id.name, undefined, { sensitivity: 'base' });

            })
            currentElem = div(currentElem)

            currentElem.className = 'ast-node ' + node.type
            rootView = currentElem
            rootView.ast = node
        }


        enter.onClassDeclaration = (clssNode)=>{
            currentElem = div(currentElem)
            currentElem.innerHTML = clssNode.id.name
            currentElem.className = 'ast-node ' + clssNode.type
            currentElem.onclick = (event) => {


                let implClassNode = getImpl(clssNode.id.name+'_1')

                if (implClassNode) {
                    createInstance(implClassNode,event,rootView)
                }else{
                    createInstance(clssNode,event,rootView)
                }
              
            }
        }

        let leave = new AstCallBack()

        leave.onClassDeclaration = (node)=>{
            currentElem = currentElem.parentNode

        }

        traverse(code, enter, leave)
        
   } catch (error) {
        console.error("Error parsing JavaScript code:", error);
    }
}


function get(id) {
    return document.getElementById(id)
}

function element(parent, tag) {
    try {
        let element = document.createElement(tag)
        if (parent && parent.tagName) {
            parent.appendChild(element)
        } else if (parent) {
            get(parent).appendChild(element)
        }
        return element
    } catch (error) {
        err(error)
    }
}
function script(parent) {
    return element(parent, 'script')
}
function div(parent) {
    return element(parent, 'div')
}
 function span(parent) {
    return element(parent, 'span')
}
function pre(parent) {
    return element(parent, 'pre')
}
function td(parent) {
    return element(parent, 'td')
}

function tr(parent) {
    return element(parent, 'tr')
}
function button(parent) {
    return element(parent, 'button')
}
function select(parent) {
    return element(parent, 'select')
}
function option(parent) {
    return element(parent, 'option')
}
function input(parent) {
    return element(parent, 'input')
}
function textarea(parent) {
    return element(parent, 'textarea')
}
