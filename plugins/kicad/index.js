class Kicad extends Plugin {
    constructor(arg) {
        super(arg)
        this.imp('parser')
        this.imp('render')
        this.imp('kicadMod')
        this.imp('fragment')
    }

    config() {
        return {
            name: 'Kicad',
            id: 'kcd',
            description: 'Kicad',
            role: 'worker',
            active: true,
            url: "../plugins/kicad/index.html"
        }
    }

    exec(message) {
        message.content = getBoard({
            path: 'test.kicad_pcb',
        });
        const code = message.content;

        const inputText = code;
        const kicadMod = parse({code:inputText,zoom:10});

        console.log(JSON.stringify(kicadMod,null,4))
        message.content = drawComponentsOnCanvas(kicadMod);
        message.content = message.content.outerHTML;
      
        return message.content;
    }

}

function makeBoard(json) {
    return doInMain(arguments, 'kicad')
}

function getBoard(json) {
    return doInMain(arguments, 'kicad')
}

Plugin.kcd = new Kicad()
