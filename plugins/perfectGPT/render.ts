let data
fetch('http://127.0.0.1:3000/api.ts')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.text()
  })
  .then(data => {
    // Process the retrieved data
    currentElem = document.getElementById('editor');
    let model = parseJavaScript(data)
    
  })
  .catch(error => {
    // Handle any errors that occurred during the fetch request
    console.error('Error:', error);
  });
// Get the editor container element
var currentElem
function parseJavaScript(code) {

    try {

        let enter = new AstCallBack()

        enter.onProgram = (node)=>{
            currentElem = div(currentElem)

            currentElem.className = 'ast-node ' + node.type
        }


        enter.onClassDeclaration = (node)=>{
            currentElem = div(currentElem)
            currentElem.innerHTML = node.id.name
            currentElem.className = 'ast-node ' + node.type
            currentElem.onclick = (e) => {
                createInstance(node,e)
              
            }
        }

        let leave = new AstCallBack()

        leave.onClassDeclaration = (node)=>{
            currentElem = currentElem.parentNode

        }

        traverse(code, enter, leave);


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
