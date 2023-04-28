class Feed extends Plugin {
    constructor(arg) {
        super(arg)
        this.data = null
        this.part = null
    }

    config() {
        return {
            name: 'Feed',
            id: 'feed',
            description: 'Feed',
            role: 'worker',
            active: true,
        }
    }

    exec(message) {
        if (!this.data) {
            let gpt = pluginByRole['CEO'][0]
            let data = []
            let size = 2
            let content = message.content
            this.parts = content.length / size
    
            if (content.length%size !=0) {
                this.parts = parseInt(this.parts ) + 1
            }
            let ins = []
            for (let i = 0; i < this.parts; i++) {
                data[i] = content.substring(i * size, (i + 1) * size)
                ins.push(gpt)
                if (i != this.parts - 1) {
                    ins.push(this)
                }
            }
            message.to.splice(1, 0, ...ins)
            message.chain.splice(1, 0, ...ins)
            this.data = data
            this.part = 0

        }
        message.content = this.data[this.part++]
        let lft = this.part + 1 - this.parts
        if (this.part >= this.parts) {
            this.data = null
        }
        return "cutting feed : " + this.part + " : " + message.content
    }
}

new Feed()

let pre = `The total length of the content that I want to send you is too large to send in only one piece.
        
For sending you that content, I will follow this rule:
        
[START PART 1/10]
this is the content of the part 1 out of 10 in total
[END PART 1/10]
        
Then you just answer: "Received part 1/10"
        
And when I tell you "ALL PARTS SENT", then you can continue processing the data and answering my requests.`

let chucnk = (part,from)=>`Do not answer yet. This is just another part of the text I want to send you. 
Just receive and acknowledge as 
"Part ${part}/${from} received" and wait for the next part.
[START PART ${part}/${from}]
[END PART ${part}/1${from}]
Remember not answering yet. Just acknowledge you received this part with the message 
"Part ${part}/${from} received" and wait for the next part.`
