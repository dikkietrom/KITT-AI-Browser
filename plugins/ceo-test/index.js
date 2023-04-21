class CeoTest extends Plugin {
    constructor(arg) {
        super(arg)
        this.async=true
    }

    config() {
        return {
            name: 'CeoTest',
            description: 'CeoTest',
            id:'ceo',
            role: 'CEO',
            active: true,
            url: "../plugins/ceo-test/index.html"
        }
    } 
     exec(message){
        
         
         setTimeout(  () => {
             message.content = 'ceo result'
             message.send() 
         }  ,1000 )
         return 'ceo is working on   : ' + message.content 
     }
}
 
new CeoTest()


