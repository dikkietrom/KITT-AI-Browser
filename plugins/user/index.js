class User extends Plugin {
    constructor(arg) {
        super(arg)
        this.conversation = ''
    }
    listen(message, _container) {
             
       
    }
    speak(message) { 
         pluginReply(message)   
    }
    config() {
        return {
            name: 'User',
            id: 'user',
            description: 'you',
            role: 'user',
            active: true,
        }
    } 
    exec(message){
        this.speak(message.content)
    }
}
 
new User()


