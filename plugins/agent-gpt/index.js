class AgentGPT extends Plugin {
    constructor(arg) {
        super(arg)
     }
 
    config() {
        return {
            name: 'AgentGPT',
            description: 'AgentGPT',
            id: 'agpt',
            role: 'worker',
            active: false,
            url: "http://localhost:3000",
        }
    }
}


new AgentGPT()
