class AI extends Plugin {
    constructor(arg) {
        super(arg)
    }

    config() {
        return {
            name: 'AI',
            role: 'worker',
            active: false,
            id: 'ai',
            description: 'AI',
            url: 'plugins/ai/index.html'
        }
    }

 
}
 
Plugin.AI = new AI()
