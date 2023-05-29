
class IGitHubProject {
    constructor() {
        this.id = null;
        this.name = null;
        this.description = null;
        this.url = null;
    }

    install() {
        // Implementation
    }

    run() {
        // Implementation
    }

    env() {
        // Implementation
    }
}

class IApp {
    constructor() {
        this.id = null;
        this.name = null;
        this.description = null;
    }

    init() {
        // Implementation
    }
}

class AppModel {
    constructor() {
        this.wires = null;
    }

  
    store() {
        // Implementation
    }
}

class ITask {
    constructor() {
        this.id = null;
        this.name = null;
        this.description = null;
        this.subtasks = null;
    }

    broadcast(message) {
        // Implementation
    }
}

class IPlugin {
    constructor() {
        this.id = null;
        this.name = null;
    }

    execute(task) {
        // Implementation
    }
}

class ILLM {
    constructor() {
        this.id = null;
        this.in = null
    }
    out() {
        return "As an AI I ...."
    }
}

class IRootLLM extends ILLM {
    constructor() {
        super();
        this.in = null
    }

    splitTask(task) {
        // Implementation
    }

    rootTask() {
        // Implementation
    }
}

class IControlLLM extends ILLM {
    constructor() {
        super();
        this.result = null
    }

    accept() {

    }

}

class ILargeTokenlLLM extends ILLM {
    constructor() {
        super();
        this.id = null;
        this.data = null;
    }


    summarise() {
        // Implementation
    }
}

class ISmallTokenlLLM extends ILLM {
    constructor() {
        super();
        this.id = null;
    }

    in() {
        // Implementation
    }

    out() {
        // Implementation
    }
}

class IStorage {
    constructor() {
        this.id = null;
    }
    store() {

    }
    get() {

    }

}

class ITokenizer {
    constructor() {
        this.id = null;
    }

    exec() {

    }
}

class IPrompt {
    constructor() {
        this.id = null;
        this.system = null;
        this.role = null;
        this.data = null;
    }

    chat() {
        return this.data;
    }


}

class IValue {
    constructor() {
        this.value = null;
    }

    set() {
        return this.value
    }
}

class ILoop {
    constructor() {
        this.list = null;
    }

    iterate() {
        return this.list
    }
}

class IFile {
    constructor() {
        this.path = null
    }

    data() {
        this.content = []
        streamContent(this)
    }
}

class IFlowView {
    constructor() {
        this.code = null
    }
    html() {
        return this.code
    }
}

class HtmlModel extends Model{
    constructor(arg) {
        super(arg)
        this.title = 'Test Page'
        
    }
    set(){
        return this.html
    }
}

class HtmlView {
    constructor() {
       // super()
        //window.customElements.define('html-view', HtmlView)
        this.model = null
    }
    _update(){
        
    }
}
class AppCss extends CssVar{
    constructor() {
        super()
        this.mainColor = null
    }
}

class TestFile extends IFile {
    constructor() {
        super()
        this.path = 'css.css'
    }
    data() {
        fetchTextStream(this)
        return WAIT
    }
}

class IConfig {
    rootLLM() {
        // Implementation
    }

    qualityControlLLM() {
        // Implementation
    }

    largeTokenLLM() {
        // Implementation
    }

    smallTokenLLM() {
        // Implementation
    }
}

class IFactory {
    createGitHubProject() {
        // Implementation
    }

    createTask() {
        // Implementation
    }

    createPlugin() {
        // Implementation
    }

    createLLM() {
        // Implementation
    }
}
