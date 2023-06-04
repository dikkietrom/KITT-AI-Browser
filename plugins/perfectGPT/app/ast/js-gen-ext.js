function addOrUpdate(clssNode){//added to Program
    const tmp = this.body
    this.body.forEach( (element, index) => {
        // statements
    })
}
function removeClassNode(clssNode){//added to Program
    let index = -1
    let i = 0
    this.body.forEach((cn)=>{
      console.log( cn.id )
     // console.log( cn.id.name )
      if (cn.id && cn.id.name == clssNode.id.name) {    
          index=i
      }
      i++

    })
    if (index !== -1) {
        this.body.splice(index, 1)
        storeAsJsFile({ast:rootView.ast,path:"api.ts"})
        clssNode._html.className+= ' removed'
    }
}    
  