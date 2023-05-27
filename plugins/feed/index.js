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
            active: false,
        }
    }

    exec(message) {
        if (!this.data) {
            let nxt = message.to[1]
            let data = []
            let size = 10000
            let content = message.content
            this.parts = content.length / size
    
            if (content.length%size !=0) {
                this.parts = parseInt(this.parts ) + 1
            }
            let ins = []
            ins.push(nxt)
            ins.push(this)
            data.push(prefix)
      
            for (let i = 0; i < this.parts; i++) {
                data.push(content.substring(i * size, (i + 1) * size))
         
                if (i != this.parts - 1) {
                    ins.push(nxt)
                    ins.push(this)
                }
            }
            this.parts ++
            message.to.splice(1, 0, ...ins)
            message.chain.splice(1, 0, ...ins)
            this.data =  data
            this.part = 0

        }
        message.content =  this.part 
            ? chucnk (this.part,this.parts-1, this.data[this.part++]) 
            : this.data[this.part++]
        if (this.part >= this.parts) {
            this.data = null
        }
        return "cutting feed : " + (this.part-1) + " : " + message.content
    }
}

Plugin.feed = new Feed()

let prefix = `The total length of the content that I want to send you is too large to send in only one piece.
        
For sending you that content, I will follow this rule:
        
[START PART 1/...]
this is the content of the part 1 out of ... in total
[END PART 1/...]
        
Then you just answer: "Received part 1/..."
        
And when I tell you "ALL PARTS SENT", then you can continue processing the data and answering my requests.`

let chucnk = (part,from,data)=>`Do not answer yet. This is just another part of the text I want to send you. 
Just receive and acknowledge as 
"Part ${part}/${from} received" and wait for the next part.
[START PART ${part}/${from}]
${data}
[END PART ${part}/${from}]
Remember not answering yet. Just acknowledge you received this part with the message 
"Part ${part}/${from} received" and wait for the next part.`
