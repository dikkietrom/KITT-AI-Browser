class Dalle extends Plugin {
    constructor(arg) {
        super(arg)
    }

    config() {
        return {
            name: 'Dall-e API',
            role: 'worker',
            skill: 'tti',
            description: 'Dall-e API'

        }
    }
}
new Dalle() 
