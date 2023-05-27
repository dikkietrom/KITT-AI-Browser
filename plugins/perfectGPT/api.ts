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
  }
}

class IRootLLM extends ILLM {
  constructor() {
    super();
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
  }

  splitTask(task) {
    // Implementation
  }

  rootTask() {
    // Implementation
  }
}

class ILargeTokenlLLM extends ILLM {
  constructor() {
    super();
    this.id = null;
  }

  splitTask(task) {
    // Implementation
  }

  rootTask() {
    // Implementation
  }
}

class ISmallTokenlLLM extends ILLM {
  constructor() {
    super();
    this.id = null;
  }

  splitTask(task) {
    // Implementation
  }

  rootTask() {
    // Implementation
  }
}

class IStorage {
  constructor() {
    this.id = null;
  }

  splitTask(task) {
    // Implementation
  }

  rootTask() {
    // Implementation
  }
}

class ITokenizer {
  constructor() {
    this.id = null;
  }

  exec(tokens) {
    // Implementation
  }
}

class IPrompt {
  constructor() {
    this.id = null;
    this.response = null;
    this.request = null;
    this.data = null;
  }

  doRequest() {
    return this.request;
  }

  doResponse() {
    return this.response;
  }
}

class IValue {
  constructor() {
    this.value = null;
  }

  get() {
     return this.value
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
