class Youtube extends Plugin {
    constructor(arg) {
        super(arg)
     }
 
    config() {
        return {
            name: 'Youtube',
            description: 'Youtube',
            role: 'worker',
            active: false,
            url: "https://youtube.com"
        }
    }
}


new Youtube()
