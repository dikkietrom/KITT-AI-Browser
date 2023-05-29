function createInstance(node, e)
{
	try
	{
		const className = node.id.name
		const classConstructor = new Function(`return ${className}`)();
		let cnst = new classConstructor();


		// Creating a Proxy for the target object
		let jsInst = new Proxy(cnst, {
		  get(target, property) {
		    return target[property]
		  },

		  set(target, property, value) {
		    target[property] = value
		    
		  },
		});

 
		
		currentElem = document.getElementById('editor');
		let enter = new AstCallBack()
		currentElem = div(currentElem) //////////////////////////CLASS
		let inst = currentElem

		jsInst.html = inst
		
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
		let label = div(header)
		label.innerHTML = node.id.name
		label.className = 'headerLabel'
		currentElem.style.top = e.clientY + 'px'
		currentElem.style.left = e.clientX + 'px'
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
		enter.onMemberExpression = (node) =>
		{ 											////////////////PROPERTY
			currentElem = div(prnt)
			let header = div(currentElem)
			header.className = 'PropHeader'
			let con = div(header)
			con.className = 'propHeaderCon fa-solid fa-arrow-right-to-bracket fa-rotate-180'
			con.onclick = (e) =>
			{
				startWire(con, e, jsInst)
			}
			con.jsProperty = node.property.name
			con.jsInst = jsInst
			inst.propCons.push(con)
			let text = textarea(header)
			text.wrap = "off"
			text.onkeyup = () =>
			{
				jsInst[node.property.name] = text.value
				updateFlows(jsInst)
			}
			text.onclick = function()
			{
				text.style.overflow = 'auto'
			}
			text.value = jsInst[node.property.name]
			text.className = 'propHeaderText'
			let label = div(header)
			label.innerHTML = node.property.name
			label.className = 'propHeaderLabel'
			con.textBox = text
			currentElem.className = 'ast-node ' + node.type
		}
		enter.onMethodDefinition = (node, traverser) =>
		{ 													//////////////METHOD
			if (node.kind == 'constructor')
			{
				//traverser.skip()
				return
			}


			
			currentElem = div(prnt)
			currentElem.className = 'ast-node ' + node.type
			let header = div(currentElem)
			header.className = 'MethodHeader'
			let cd = button(header)
			cd.className = 'headerButton fa-solid fa-code'
			let label = div(header)
			label.innerHTML = node.key.name
			label.className = 'methodHeaderLabel'

			let rtrnFound = false
			node.value.body.body.forEach((line)=>{
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
				con.jsMethod = node.key.name
			}
			
			traverser.skip()
			
			cd.onclick = (e) =>
			{ 		//////////////////////////////////but CODE
				viewCode(cd,label,node,inst)
			}
		}
		let leave = new AstCallBack()
		leave.onMethodDefinition = (node) =>
		{
			currentElem = currentElem.parentNode
		}
		leave.onMemberExpression = (node) =>
		{
			currentElem = currentElem.parentNode
		}
		traverse(node, enter, leave)
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
function viewCode(cd,label,node,inst){
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
			let ast = esprima.parse('{'+area.value+'}') 
			inst.logWin.innerHTML = ''
		} catch (error) {
			console.error(error)
			inst.logWin.innerText = error.stack
		}
		
	}	
}