class ElevenLabs extends Plugin {
    constructor(arg) {
        super(arg)
    }

    config() {
        return {
            name: 'ElevenLabs',
            description: 'ElevenLabs',
            id:'11',
            role: 'worker',
            active: true
        }
    } 
     exec(message){
        

         return 'ElevenLabs is working on   : ' + message.content 
     }
}
 
new ElevenLabs()


