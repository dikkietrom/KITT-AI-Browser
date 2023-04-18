class CeoTest extends Plugin {
    constructor(arg) {
        super(arg)
        this.conversation = ''
    }
    listen(message, _container) {
             
        span(_container).innerText = message
    }
    speak(message) { 
         pluginReply(message)   
    }
    config() {
        return {
            name: 'CeoTest',
            description: 'CeoTest',
            role: 'CEO',
            active: true,
            url: "../plugins/ceo-test/index.html"
        }
    } 
}
 
new CeoTest()


