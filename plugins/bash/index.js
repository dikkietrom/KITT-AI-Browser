class Bash extends Plugin {
    constructor(arg) {
        super(arg)
        this.async=true
    }

    config() {
        return {
            name: 'Bash',
            description: 'Bash',
            id:'bsh',
            role: 'worker',
            active: true
        }
    } 
     exec(message){
        

         return 'Bash is working on   : ' + message.content 
     }
}
 
new Bash()


