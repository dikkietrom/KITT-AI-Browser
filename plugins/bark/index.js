class Bark extends Plugin {
    constructor(arg) {
        super(arg)
    }

    config() {
        return {
            name: 'Bark API',
            role: 'CEOx',
            active: true,
            id: 'brk',
            description: 'Bark API',
            url: 'https://huggingface.co/spaces/DB2323/bark'
        }
    }

    exec(message) {
        //fetch().then(response=>response.json()).then(data=>console.log(data)).catch(error=>console.error(error));
        return send(message)
    }
}
async function send(message) {
    const response = await fetch("https://db2323-bark.hf.space/run/predict", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            data: [`Hello, my name is Suno. And, uh — and I like pizza. [laughs]
                    But I also have other interests such as playing tic tac toe.`, "Unconditional", ]
        })
    });
    
    const jsonData = await response.json();
    return jsonData

}
new Bark()
