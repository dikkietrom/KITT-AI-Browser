class MjApiHack extends Plugin {
    constructor(arg) {
        super(arg)
     }
 
    config() {
        return {
            name: 'MjApiHack',
            description: 'MjApiHack',
            role: 'worker',
            skill: 'tti',
            active:false,    
            url: "https://discord.com/channels/@me/1093057901330968647"
        }
    }
}

ipcRenderer.on('plugin-mj-api-hack-reply', (event,arg)=>{

  
}
);

new MjApiHack()
