class GptEdit extends Plugin {
    constructor(arg) {
        super(arg)
     }
 
    config() {
        return {
            name: 'Gpt Edit API',
            role: 'worker',
            description: 'Gpt Edit API'
        }
    }
}
 
new GptEdit()
