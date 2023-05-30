function createInstance(clssNode, event,rootView)
{
	try
	{
		const className = clssNode.id.name
		const exists = (()=>{
				try{
					return new (eval(className))()				
				}catch(e){
					return null
				}
			})()
		const cnst = exists
			? exists
			: injectObject(clssNode)

		// Creating a Proxy for the target object
		let jsInst = cnst
 
		currentElem = document.getElementById('editor');
		let enter = new AstCallBack()
		currentElem = div(currentElem) //////////////////////////CLASS
		let inst = currentElem

		jsInst._html = inst
		
		inst.propCons = []
		currentElem.className = 'ast-node createInstance collidable draggable'
		let header = div(currentElem)
		header.className = 'ClassHeader'

		let dlt = button(header)///////////but DELETE 
		dlt.className = 'headerButton fa-solid fa-trash'
		dlt.onclick = (e) =>
		{ 
			deleteFunction(inst)
		}
		let prp = button(header)///////////but ADD PROPERTY
		prp.className = 'headerButton fa-solid fa-house'
		prp.onclick = (e) =>
		{ 
			 
			addProperty();
			 
		}
            
		let mthd = button(header)//////////////but ADD METHOD
		mthd.className = 'headerButton fa-solid fa-barcode'
		mthd.onclick = (e) =>
		{ 
			 
			addMethod();
			 
		}
		
		let label = div(currentElem)
		label.innerHTML = clssNode.id.name
		label.className = 'headerLabel'
			
		currentElem.style.top = event.clientY + 'px'
		currentElem.style.left = event.clientX + 'px'
		currentElem.style.position = 'absolute'
		currentElem.onmousedown = (e) =>
		{
			if (e.target.tagName == 'TEXTAREA' || e.currentTarget.className.indexOf('propHeaderCon') > -1)
			{
				return
			}
			else
			{
				startDragging(e)
			}
		}
		let prnt = currentElem
		enter.onAssignmentExpression = (propertyNode) =>
		{ 											////////////////PROPERTY
			const propertyName = propertyNode.left.property.name
			currentElem = div(prnt)
			let header = div(currentElem)
			header.className = 'PropHeader'
			let con = div(header)
			con.className = 'propHeaderCon fa-solid fa-arrow-right-to-bracket fa-rotate-180'
			con.onclick = (e) =>
			{
				startWire(con, e, jsInst)
			}
			con.jsProperty = propertyName
			con.jsInst = jsInst
			inst.propCons.push(con)
			let text = textarea(header)
			text.wrap = "off"
			text.onkeyup = () =>
			{
				jsInst[propertyName] = text.value
				updateFlows(jsInst)
				storeProperty(clssNode,propertyNode.left,jsInst)
				if (jsInst._update) {
					jsInst._update()
				}
			}
			text.onclick = function()
			{
				text.style.overflow = 'auto'
			}
			text.value = jsInst[propertyName]
			text.className = 'propHeaderText'
			let label = div(header)
			label.innerHTML = propertyName
			label.className = 'propHeaderLabel'
			con.textBox = text
			currentElem.className = 'ast-node ' + propertyNode.left.type
		}
		enter.onMethodDefinition = (methodNode, traverser) =>
		{ 													//////////////METHOD
			if (methodNode.kind == 'constructor')
			{
				//traverser.skip()
				return
			}
			
			currentElem = div(prnt)
			currentElem.className = 'ast-node ' + methodNode.type
			let header = div(currentElem)
			header.className = 'MethodHeader'
			let cd = button(header)
			cd.className = 'headerButton fa-solid fa-code'
			let label = div(header)
			label.innerHTML = methodNode.key.name
			label.className = 'methodHeaderLabel'

			let rtrnFound = false
			methodNode.value.body.body.forEach((line)=>{
				if (line.type === "ReturnStatement") {
					rtrnFound = true
				}
			})
			
			if (rtrnFound) {
				let con = div(header)
				con.jsInst = jsInst
				con.className = 'methodHeaderCon fa-solid fa-arrow-right-to-bracket'
				con.onclick = (e) =>
				{
					startWire(con, e)
				}
				con.jsMethod = methodNode.key.name
			}
			
			traverser.skip()
			
			cd.onclick = (e) =>
			{ 		//////////////////////////////////but CODE
				viewCode(cd,label,methodNode,inst,rootView,clssNode,jsInst)
			}
		}
		let leave = new AstCallBack()
		leave.onMethodDefinition = () =>
		{
			currentElem = currentElem.parentNode
		}
		leave.onAssignmentExpression = () => currentElem = currentElem.parentNode
		
			
	
		traverse(clssNode, enter, leave)
		let logWin = pre(inst)
		logWin.className = 'logWin'
		inst.logWin = logWin
	}
	catch (error)
	{
		console.error("Error parsing JavaScript code:", error);
	}
}

function deleteFunction(inst)
{
	let t = startWire.wires;
	startWire.wires = [];
	t.forEach((w) =>
	{
		if (inst.propCons.indexOf(w.start) == -1 && inst.propCons.indexOf(w.end) == -1)
		{
			startWire.wires.push(w);
		}
		else
		{
			if (w.start.textBox)
			{
				w.start.textBox.disabled = false;
			}
			else
			{
				w.end.textBox.disabled = false;
			}
		}
	});
	inst.remove();
}
function viewCode(cd,label,node,inst,rootView,clssNode,jsInst){
	if (cd.area)
	{
		cd.area.remove()
		cd.area = null
		return
	}
	const area = textarea(label)
	cd.area = area
	area.wrap = "off"
	area.className = 'code-win'
	const codes = []
	node.value.body.body.forEach((c) =>
	{
		codes.push(generate(c))
	})
	area.value = codes.join('\n')
	area.onkeydown = (event) =>
	{
		if (event.key === "Tab")
		{
			// Prevent the default behavior of the Tab key
			event.preventDefault();
			// Insert a tab character at the current cursor position
			var start = area.selectionStart;
			var end = area.selectionEnd;
			area.value = area.value.substring(0, start) + "\t" + area.value.substring(end);
			// Move the cursor position after the inserted tab character
			area.selectionStart = area.selectionEnd = start + 1;
		}
	}		
	area.onkeyup = (event) =>
	{
	    
		try {
			let ast = esprima.parse('function dummy(){'+area.value+'}') 
			inst.logWin.innerHTML = ''
			node.value.body = ast.body[0].body
			storeCode(clssNode,node,jsInst)
		} catch (error) {
			console.error(error)
			inst.logWin.innerText = error.stack
		}
		
	}	
}