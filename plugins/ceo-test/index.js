class CeoTest extends Plugin {
    constructor(arg) {
        super(arg)
        this.async=true
    }

    config() {
        return {
            name: 'CeoTest',
            description: 'CeoTest',
            id:'test',
            role: 'CEOx',
            active: false,
            url: "../plugins/ceo-test/index.html"
        }
    } 
     exec(message){
        
         
         setTimeout(  () => {
             message.content = 'ceo result : ' + message.content
             message.send() 
         }  ,100 )
         return 'ceo is working on   : ' + message.content 
     }
}
 
new CeoTest()


