class Crawl extends Plugin {
    constructor(arg) {
        super(arg)
    }

    config() {
        return {
            name: 'Crawl',
            id: 'crawl',
            description: 'Crawl',
            role: 'worker',
            active: true,
        }
    }

    exec(message) {
        message.content = getCrawlContent({url:message.content})
    }
}
 
function getCrawlContent(json) {
    return doInMain(arguments, 'crawl')
}

 

new Crawl()
