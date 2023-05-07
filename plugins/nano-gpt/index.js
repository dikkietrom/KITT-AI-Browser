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
            active: true,
            url: "http://localhost:3000",
        }
    }
}


Plugin.nano = new NanoGPT()
