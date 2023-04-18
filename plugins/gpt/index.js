class Gpt extends Plugin {
    constructor(arg) {
        super(arg)
        this.conversation = ''
    }
    listen(message, container) {    

        container.innerHTML += message.error?message.error.message: message.choices[0].message.content
    }
    speak() {   
        
        try {
            let arg = {}
            arg.txt = this.conversation + ' ' + currentInp.value
            arg.model = selVal('models')
            ipcRenderer.send('plugin-gpt',  arg);

        } catch (error) {
            let m = `gpt Error: ${error.message}`
             
            err(error) 
        }
    }
    config() {
        return {
            name: 'Gpt API',
            role: 'manager',
            active: true,
            description: 'Gpt API'
        }
    }
}

ipcRenderer.on('gpt-models-reply', (event,data)=>{

    log('models : ', data)
    if(data==null){//on app reload get it from memory, give it some time
        setTimeout( function  () {
            event.sender.send('gpt-models') 
        } , 100)
        return
    }
    let models = document.getElementById('models')
    models.innerHTML=''
    for (let index = 0; index < data.length; index++) {
        //let data = response[index]
        // log(data.id)
        //log(data[index].id)
        let d = data[index]
        let option = document.createElement('option') 
        models.appendChild(option)
        option.innerHTML = d.id
        option.modeldata = d
    }
    

    sortSelectOptions(models)

    models.value = "gpt-3.5-turbo" 

}
);
function sortSelectOptions(select) {
   
  Array.from(select.options)
    .sort((a, b) => a.text.localeCompare(b.text))
    .forEach(option => select.add(option));
}

// Usage:
// sortSelectOptions('my-select');

new Gpt()
