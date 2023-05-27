class PerfectGPT extends Plugin {
    constructor(arg) {
        super(arg)
        this.async = true
        this.streamer = true

    }

    config() {
        return {
            name: 'PerfectGPT',
            id: 'pgpt',
            description: 'PerfectGPT',
            role: 'CEO',
            active: true,
            
             
        }
    }
    exec(message) {
        
    } 
}
let perfectGPT = new PerfectGPT()
