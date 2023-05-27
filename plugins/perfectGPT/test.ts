// Test implementation of GitHubProject
class TestGitHubProject implements IGitHubProject {
  id: string;
  name: string;
  description: string;
  url: string;

  constructor(id: string, name: string, description: string, url: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.url = url;
  }

  install(): Promise<void> {
    console.log(`Installing GitHub project: ${this.name}`);
    return Promise.resolve();
  }

  run(): Promise<void> {
    console.log(`Running GitHub project: ${this.name}`);
    return Promise.resolve();
  }
}

// Test implementation of Task
class TestTask implements ITask {
  id: string;
  name: string;
  description: string;
  subtasks: ITask[];

  constructor(id: string, name: string, description: string, subtasks: ITask[] = []) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.subtasks = subtasks;
  }

  broadcast(message: string): Promise<void> {
    console.log(`Broadcasting message from task (${this.name}): ${message}`);
    return Promise.resolve();
  }
}

// Test implementation of Plugin
class TestPlugin implements IPlugin {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  execute(task: ITask): Promise<void> {
    console.log(`Executing task (${task.name}) with plugin (${this.name})`);
    return Promise.resolve();
  }
}

// Test implementation of LargeLanguageModel
class TestLargeLanguageModel implements ILargeLanguageModel {
  id: string;

  constructor(id: string) {
    this.id = id;
  }

  prompt(input: string): Promise<string> {
    console.log(`Prompting large language model (${this.id}) with input: ${input}`);
    return Promise.resolve(`Output from large language model (${this.id})`);
  }

  output(input: string): Promise<string> {
    console.log(`Outputting from large language model (${this.id}) with input: ${input}`);
    return Promise.resolve(`Output from large language model (${this.id})`);
  }
}

// Test implementation of RootLargeLanguageModel
class TestRootLargeLanguageModel implements IRootLargeLanguageModel {
  id: string;

  constructor(id: string) {
    this.id = id;
  }

  prompt(input: string): Promise<string> {
    console.log(`Prompting root large language model (${this.id}) with input: ${input}`);
    return Promise.resolve(`Output from root large language model (${this.id})`);
  }

  output(input: string): Promise<string> {
    console.log(`Outputting from root large language model (${this.id}) with input: ${input}`);
    return Promise.resolve(`Output from root large language model (${this.id})`);
  }

  splitTask(task: ITask): Promise<ITask[]> {
    console.log(`Splitting task (${task.name}) with root large language model (${this.id})`);
    return Promise.resolve(task.subtasks);
  }
}

// Test implementation of Config
export class TestConfig implements IConfig {
  createGitHubProject(): IGitHubProject {
    return new TestGitHubProject("123", "Test Project", "Test Description", "https://github.com/test");
  }

  createTask(): ITask {
    return new TestTask("456", "Test Task", "Test Description");
  }

  createPlugin(): IPlugin {
    return new TestPlugin("789", "Test Plugin");
  }

  createLargeLanguageModel(): ILargeLanguageModel {
    return new TestLargeLanguageModel("llm-1");
  }

  createRootLargeLanguageModel(): IRootLargeLanguageModel {
    return new TestRootLargeLanguageModel("root-llm-1");
  }
}


