

var implAst
var rootView 
var currentElem
function init(){
    fetch('http://127.0.0.1:3000/api.ts')/////////////////////////////////API
    .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        return response.text()
    })
    .then(data => {
        // Process the retrieved data        
        parseApi(data)
    })
    .catch(error => {
        // Handle any errors that occurred during the fetch request
        console.error('Error:', error);
    });

    fetch('http://127.0.0.1:3000/object-store.js')//////////////////////////////IMP
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
}
init()


function parseApi(code) {

    try {

        currentElem = document.getElementById('editor');
        
        currentElem = div(currentElem)
        currentElem.className = 'ast-node-container' 

        const addClss = div(currentElem)
        addClss.className='addClass fa-solid fa-square-plus'
        addClss.onclick = ()=>{
            let name = 
                prompt('name').toLowerCase()
            if(name.charAt(0)!=='i'){
                name = 'i' + name
            }
            name = name.substring(0,2).toUpperCase() + name.substring(2)
            const js = `class ${name} {}`
            let enter = new AstCallBack()
            let leave = new AstCallBack()
            currentElem = rootView
            onClassDeclaration(enter,leave)
            let newClassAst = traverse(js, enter, leave)
            rootView.ast.body.push(newClassAst.body[0])
            sortChildren( rootView , (a, b) => a.textContent.localeCompare(b.textContent))
            storeAsJsFilel(rootView.ast,"api.ts")
        }  

        let enter = new AstCallBack()
        let leave = new AstCallBack()



        onProgram(enter,leave)
        onClassDeclaration(enter,leave)
        traverse(code, enter, leave)
         
        
   } catch (error) {
        console.error("Error parsing JavaScript code:", error);
    }
}
function onProgram(enter,leave){
    enter.onProgram = (programNode)=>{
        programNode.body.sort((a,b)=>{
            if (a.id.name.charAt(0)=='I' && b.id.name.charAt(0)!='I'  ) {
                return -1
            }  
            if (a.id.name.charAt(0)!='I' && b.id.name.charAt(0)=='I'  ) {
                return 1
            }  
            return a.id.name.localeCompare(b.id.name, undefined, { sensitivity: 'base' });

        })
         
        programNode.body.remove = function(clssNode) {
          let index = -1
          let i = 0
          this.forEach((cn)=>{
              console.log( cn.id )
             // console.log( cn.id.name )
              if (cn.id && cn.id.name == clssNode.id.name) {    
                  index=i
              }
              i++
              
          })
          if (index !== -1) {
            this.splice(index, 1)
            storeAsJsFilel(rootView.ast,"api.ts")
            clssNode._html.className+= ' removed'
          }
          
        };
        
        currentElem = div(currentElem)

        currentElem.className = 'ast-node ' + programNode.type
        rootView = currentElem
        rootView.ast = programNode
    }
    leave.onProgram = (programNode)=>{
        currentElem = rootView

    }

}

function onClassDeclaration(enter,leave){
 

    enter.onClassDeclaration = (clssNode)=>{
        currentElem = div(currentElem)

        currentElem.className = 'onClassDeclaration'
        clssNode._html = currentElem
        let header = div(currentElem)
        header.className = 'ClassHeader level1'

        let tpe = div(header)   
        tpe.className = 'js-type'
    
        let tpe1 = div(tpe)
        tpe1.className = 'iface fa-solid fa-i'

        let tpe2 = div(tpe)
        tpe2.className = 'iface fa-solid fa-face-smile'
        
        let label = div(header)
        label.innerHTML =  clssNode.id.name
        label.className = 'headerLabel'            
        label.className = 'ast-node ' + clssNode.type

		let dlt = button(header)///////////but DELETE 
		dlt.className = 'headerButton dlt fa-solid fa-trash'
		dlt.onclick = (e) =>
		{ 
            e.stopPropagation()
			rootView.ast.body.remove( clssNode  )
              
		}        
        currentElem.onclick = (event) => {
            let implClassNode = getImpl(clssNode.id.name)

            if (implClassNode) {
                createInstance(implClassNode,event,rootView)
            }else{  
                createInstance(clssNode,event,rootView)
            }
        }
    }

    leave.onClassDeclaration = (node)=>{
        currentElem = currentElem.parentNode

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
