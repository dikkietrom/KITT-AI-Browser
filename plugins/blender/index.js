class Blender extends Plugin {
    constructor(arg) {
        super(arg)
    }

    config() {
        return {
            name: 'Blender',
            id: 'blender',
            description: 'The message blender',
            role: 'blender',
            active: true,
        }
    }

    exec(message) {
        
    }
}
 

var blender = new Blender()
