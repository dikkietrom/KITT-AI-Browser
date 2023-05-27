function createInstance(node,e){

    try {
        const className = node.id.name
        const classConstructor = new Function(`return ${className}`)();
        let jsInst =  new classConstructor();

        currentElem = document.getElementById('editor');
        let enter = new AstCallBack()
        currentElem = div(currentElem)////////////////CLASS
        let inst = currentElem

 
        currentElem.className = 'ast-node createInstance collidable draggable'



        let header = div(currentElem)
        header.className='ClassHeader'


        let dlt = button(header)
        dlt.className='headerButton fa-solid fa-trash'
        dlt.onclick = (e)=>{
          inst.remove()
        }

        let label = div(header)
        label.innerHTML = node.id.name
        label.className = 'headerLabel'

      
        currentElem.style.top=e.clientY+'px'
        currentElem.style.left=e.clientX+'px'
        currentElem.style.position='absolute' 
        currentElem.onmousedown = (e)=>{
              if (e.currentTarget.className.indexOf('propHeaderCon')>-1) {
                return
              }
              startDragging(e)
        }
        let prnt = currentElem

        enter.onMemberExpression = (node)=>{////////////////PROPERTY

            currentElem = div(prnt)
            let header = div(currentElem)
            header.className='PropHeader'
    
    
            let con = div(header)
            con.className='propHeaderCon fa-solid fa-arrow-right-to-bracket fa-rotate-180'
            con.onclick = (e) => {
              startWire(con,e,jsInst)
            }
            con.jsProperty = node.property.name
            con.jsInst = jsInst   
                
            let text = input(header)
            text.onkeyup=()=>{
                jsInst[node.property.name] = text.value
            }    
            text.className = 'propHeaderText'

            let label = div(header)
            label.innerHTML =node.property.name
            label.className = 'propHeaderLabel'
    
            con.textBox = text

            
            currentElem.className = 'ast-node ' + node.type
            
            
        }
        
        enter.onMethodDefinition = (node,traverser)=>{//////////////METHOD
            if (node.kind=='constructor') {
              return
            }
            currentElem = div(prnt)
            
            currentElem.className = 'ast-node ' + node.type
          

          
            let header = div(currentElem)
            header.className='MethodHeader'
       
            let label = div(header)
            label.innerHTML =node.key.name
            label.className = 'methodHeaderLabel' 
    
            let con = div(header)
            con.jsInst = jsInst
            con.className='methodHeaderCon fa-solid fa-arrow-right-to-bracket'
            con.onclick = (e) => {
              startWire(con,e)
            }
            con.jsMethod = node.key.name
    
            traverser.skip()   
        
        }        


        let leave = new AstCallBack()

        leave.onMethodDefinition = (node)=>{
            currentElem = currentElem.parentNode

        }
        leave.onMemberExpression = (node)=>{
            currentElem = currentElem.parentNode

        }

        traverse(node, enter, leave)
 
 


    } catch (error) {
        console.error("Error parsing JavaScript code:", error);
    }  
  
}

