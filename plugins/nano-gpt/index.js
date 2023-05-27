class NanoGPT extends Plugin {
    constructor(arg) {
        super(arg)
     }
 
    config() {
        return {
            name: 'nanoGPT',
            description: 'nanoGPT',
            id: 'nano',
            role: 'worker',
            active: false,
            url: "../plugins/nano-gpt/index.html",
        }
    }
}


Plugin.nano = new NanoGPT()
