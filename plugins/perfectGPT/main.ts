import { IGitHubProject, ITask, IPlugin, ILargeLanguageModel, IRootLargeLanguageModel, IConfig } from './api.ts';
import * as readline from 'readline';

// Import the test implementations
import { TestConfig } from './test.ts';

// Create an instance of TestConfig
const config: IConfig = new TestConfig();

// Create a root large language model from TestConfig
const rootLlm: IRootLargeLanguageModel = config.createRootLargeLanguageModel();

// Create a readline interface for reading user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Run in a loop
while (true) {
  // Prompt the root large language model
  const input = await getInputFromUser('Enter your input: ');
  const output = await rootLlm.prompt(input);
  console.log(output);

  // Rest of your code here...
}

// Function to get user input from the console
function getInputFromUser(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (input) => {
      resolve(input);
    });
  });
}
