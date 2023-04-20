class CeoTest extends Plugin {
    constructor(arg) {
        super(arg)
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
     exec(){
         return "got message"
     }
}
 
new CeoTest()


