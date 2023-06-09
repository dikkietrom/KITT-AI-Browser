to prevent

<pre>
Error: The module <your dir>\KITT\node_modules\robotjs\build\Release\robotjs.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION 108. This version of Node.js requires
NODE_MODULE_VERSION 113. Please try re-compiling or re-installing
the module (for instance, using npm rebuild or npm install).
</pre>
first do once
<pre>
rm -rf node_modules
rm package-lock.json
npm install
./node_modules/.bin/electron-rebuild
</pre>
then every time you want to start
<pre>
npm start
</pre>
to make binary apps for win mac & lin do
<pre>
npm run build
</pre>

whereafter generated binaries can be found in ./dist





# KITT AI Browser
"KITT In Twenty Three"

Introducing the new KITT on the block for all your AI browsing, developments and execution. 
An advanced path based AI plugin system that focuses on easily chaining
AI IO to improve efficiency, accuracy, and overall performance. A powerful AI-driven frontend app built on 
the Electron framework, 
designed to give you seamless control over local and online AI based services and 
websites without the obligation for API keys. 
KITT utilizes Electron's WebView feature, enabling full remote control of any 
hosted service. For additional flexibility, API key integration 
is available when required.

KITT currently includes the following plugins 
<pre>
- agent-gpt
- bark
- bash
- broker
- ceo-test
- coder
- dall-e
- elevenlabs
- feed
- file
- google
- gpt
- gpt-api-hack
- gpt-edit
- midjourney
- open-assistant
- summariser
- user
- whisper
- youtube
</pre>


Harness the power of open-source Chromium and experience the unparalleled control offered by KITT for all your web-based projects. With KITT, the possibilities are endless.

Video's

https://www.youtube.com/@dik9091/videos

KITT features a user-friendly plugin architecture that makes extending its capabilities a breeze. By simply adding files to the dedicated plugin directory, you can effortlessly integrate new functionalities and enhancements.

This modular approach allows developers to create, share, and implement custom plugins tailored to specific needs. Each plugin file is automatically detected and loaded by KITT, eliminating the need for manual configuration or setup.

The plugin system fosters a collaborative environment, encouraging the community to contribute to KITT's ever-expanding capabilities. With this straightforward architecture, KITT becomes a versatile and adaptable tool, ready to tackle any challenge you throw its way.

The project structure :
<pre>
├── README.md
├── back-end
│   ├── ipcMain.js
│   ├── keys.js
│   └── main.js
├── front-end
│   ├── class.css
│   ├── front-log.js
│   ├── id.css
│   ├── index.html
│   ├── index.js
│   ├── ipcRenderer.js
│   ├── main-log.js
│   ├── plugin-preload.js
│   ├── plugin.js
│   ├── preload-log.js
│   ├── preload.js
│   ├── tag.css
│   └── webgl.js
├── lib
│   └── shared.js
├── package-lock.json
├── package.json
├── plugins
│   ├── agent-gpt
│   │   ├── index.js
│   │   ├── main.js
│   │   └── preload.js
│   ├── bark
│   │   ├── index.js
│   │   └── main.js
│   ├── bash
│   │   ├── index.js
│   │   └── main.js
│   ├── broker
│   │   └── index.js
│   ├── ceo-test
│   │   ├── index.html
│   │   ├── index.js
│   │   ├── main.js
│   │   └── preload.js
│   ├── coder
│   │   ├── code.js
│   │   ├── index.html
│   │   ├── index.js
│   │   └── main.js
│   ├── dall-e
│   │   ├── index.js
│   │   └── main.js
│   ├── elevenlabs
│   │   ├── index.js
│   │   ├── main.js
│   │   └── speak.py
│   ├── feed
│   │   ├── index.js
│   │   └── main.js
│   ├── file
│   │   ├── index.js
│   │   └── main.js
│   ├── google
│   │   ├── index.js
│   │   ├── main.js
│   │   └── preload.js
│   ├── gpt
│   │   ├── index.js
│   │   └── main.js
│   ├── gpt-api-hack
│   │   ├── index.js
│   │   └── main.js
│   ├── gpt-edit
│   │   ├── index.js
│   │   └── main.js
│   ├── midjourney
│   │   ├── index.js
│   │   ├── main.js
│   │   └── preload.js
│   ├── open-assistant
│   │   ├── index.js
│   │   ├── main.js
│   │   └── preload.js
│   ├── summariser
│   │   ├── index.js
│   │   └── main.js
│   ├── user
│   │   └── index.js
│   ├── whisper
│   │   ├── index.js
│   │   └── main.js
│   └── youtube
│       ├── index.js
│       ├── main.js
│       └── preload.js
└── wintel-builder-config.json
</pre>


The main components of the system include:

Back-end: Contains the main process of the Electron app, with files like ipcMain.js and main.js to handle inter-process communication and the main application window management.

Front-end: This part consists of the renderer process of the Electron app, with files like index.html, index.js, and various CSS files for styling. It also contains the IPC renderer files and the webGL for audio visualization.

Plugins: The system features multiple plugins, each providing specific functionality. Some of the plugins include agent-gpt, bark, bash, broker, coder, dall-e, elevenlabs, feed, file, google, gpt, gpt-api-hack, gpt-edit, midjourney, open-assistant, summariser, user, whisper, and youtube.

Shared Library: The lib folder contains shared.js, which presumably contains shared code or utility functions that can be used across the system.

Configuration and Package Files: The system has package.json, package-lock.json, and wintel-builder-config.json files for managing dependencies, build configurations, and application settings.

In summary, this system is a desktop application built on Electron, designed to accommodate various plugins and functionalities, primarily focused on AI models, multimedia processing, and web services.

---

**Overview Summary** 
<pre>
└── back-end
    ├── ipcMain.js
    ├── keys.js
    └── main.js
</pre>
This project is an Electron application that consists of multiple JavaScript files handling different aspects of the application. The application uses Electron's IPC communication for message passing between the main and renderer processes. The application also has a plugin system that allows for extensibility.

1. **ipcMain.js** - Handles IPC communication, plugin initialization, and other miscellaneous functions.
2. **keys.js** - Manages API keys, prompts user for input and handles key storage.
3. **main.js** - Initializes the main Electron window, handles auto-updating, and other app-related events.

---

**Detailed API Documentation**
<pre>
└── back-end
    ├── ipcMain.js
    ├── keys.js
    └── main.js
</pre>
1. **ipcMain.js**

   Functions:

    - `init(lg)`: Initializes the ipcMain module with a given logger function.
    - `initPlugins()`: Scans the plugins folder, initializes each plugin's main and preload script if they exist, and sends a message to the renderer process with information about the plugins.

   IPC Events:

    - `plugin-request`: Triggers the plugin initialization process.
    - `debug`: Opens the developer tools for the renderer process.
    - `debug-stop`: Closes the developer tools for the renderer process.
    - `debug-main`: Opens the Chrome DevTools for the main process.
    - `debug-main-stop`: Closes the Chrome DevTools for the main process.
    - `preload-log`: Logs messages from the preload script.
    - `doInPreload`: Executes a function in the preload script.
    - `doInMain`: Executes a function in the main process.

2. **keys.js**

   Functions:

    - `apiKeys(kind)`: Retrieves the API key for a specified service from the keys folder.
    - `promptIt(title, kind)`: Prompts the user to enter an API key and saves it to the keys folder.
    - `mkdirs(dirPath)`: Creates the necessary directories for a given path if they don't exist.

3. **main.js**

   Functions:

    - `createWindow()`: Creates the main browser window for the application and sets up required event listeners.
    - `initMainScript(script)`: Initializes the main script for the application with the given script path.

   Electron App Events:

    - `ready`: Triggers the `createWindow()` function.
    - `web-contents-created`: Sets up the `will-attach-webview` event listener.
    - `window-all-closed`: Quits the app when all windows are closed.
    - `before-quit`, `quit`, `will-quit`: Closes any open Chrome instances before quitting the app.
    - `activate`: Recreates the main window if it was closed and the app is reactivated.



## Overview Summary

<pre>

└── front-end
    ├── class.css
    ├── front-log.js
    ├── id.css
    ├── index.html
    ├── index.js
    ├── ipcRenderer.js
    ├── main-log.js
    ├── plugin-preload.js
    ├── plugin.js
    ├── preload-log.js
    ├── preload.js
    ├── tag.css
    └── webgl.js

</pre>

The front-end consists of several JavaScript files that handle different aspects of the application. It includes:

1. `front-log.js`: Handles logging and error reporting in the front-end.
2. `index.js`: Main entry point for the application's front-end. It initializes and sets up event listeners.
3. `ipcRenderer.js`: Handles inter-process communication between the front-end and the main process.
4. `main-log.js`: Handles logging and error reporting in the main process.
5. `plugin-preload.js`: Preloads plugins and manages plugin-related operations.
6. `plugin.js`: Implements the core plugin functionality and provides an API for plugin management.
7. `preload-log.js`: Handles logging and error reporting during the preload phase.
8. `preload.js`: Sets up the Electron environment and makes necessary modules available for the front-end.
9. `webgl.js`: Implements audio visualization using WebGL and manages audio input from the user's microphone.

## Detailed API Documentation
<pre>

└── front-end
    ├── class.css
    ├── front-log.js
    ├── id.css
    ├── index.html
    ├── index.js
    ├── ipcRenderer.js
    ├── main-log.js
    ├── plugin-preload.js
    ├── plugin.js
    ├── preload-log.js
    ├── preload.js
    ├── tag.css
    └── webgl.js

</pre>

### `front-log.js`

- `addLog(logData)`: Adds a log entry with the specified data.
- `err(error)`: Logs an error message with the provided error object.

### `index.js`

- `init()`: Initializes the application and sets up event listeners.

### `ipcRenderer.js`

- No specific API functions, but it makes use of Electron's `ipcRenderer` module for inter-process communication.

### `main-log.js`

- `addLog(logData)`: Adds a log entry with the specified data.
- `err(error)`: Logs an error message with the provided error object.

### `plugin-preload.js`

- `loadPlugins()`: Loads and initializes all available plugins.
- `registerPlugin(plugin)`: Registers a plugin with the system.



###  `plugin.js` 

`plugin.js` defines and implements the Plugin class, which represents the core functionality for plugins in the application. Each plugin derives from this class and must override the `config()` and `exec()` methods. The Plugin class also manages plugin instances and categorizes them by name, directory, ID, and role.

### `Plugin Class`

##### Properties `Plugin Class`

- `async`: A boolean indicating if the plugin is asynchronous.
- `streamer`: A boolean indicating if the plugin is a streamer.
- `dir`: The plugin's directory.

##### Constructor

The constructor initializes a new instance of the Plugin class, setting its `async` and `streamer` properties to `false`. It also registers the plugin in various global objects by its name, directory, ID, and role.

##### Methods

- `onReplied(message)`: Called when a reply is received. Can be overridden by subclasses to implement custom behavior.
- `config()`: Should be overridden by subclasses to provide a configuration object with information about the plugin (e.g., name, id, role).
- `exec(message)`: Should be overridden by subclasses to implement the main functionality of the plugin.
- `onData(json)`: Called when data is received. Can be overridden by subclasses to implement custom behavior.
- `onTimeOut()`: Called when the plugin times out. Cleans up any pending tasks or resources.
- `startTimer()`: Starts a timer that will trigger `onTimeOut()` after 2000 ms.
- `stopTimer()`: Stops the timer started by `startTimer()`.
- `send(key, message)`: Sends a message with the specified key to the plugin's associated webView.

#### Functions

- `run()`: Starts the plugin execution process.
- `pluginReply(message)`: Handles a plugin's reply to a message.
- `newPluginReplyRow(plugin, cls)`: Creates a new table row for a plugin reply.
- `newInp(container)`: Creates a new input element for user interaction.
- `extractPluginDirFromAsar(path)`: Extracts the plugin directory from the given path.

### `preload-log.js`

- `preloadLog(event, mes)`: Logs a message with the provided event and message data.

### `preload.js`

- No specific API functions, but it sets up the Electron environment and makes necessary modules available for the front-end.

### `webgl.js`

- `animate()`: Updates the audio visualization based on the current audio input.
- `toHex(c)`: Converts a decimal number to its hexadecimal equivalent.
- `lerp(a, b, t)`: Linearly interpolates between two values based on a parameter t.
- `gradientToHex(t)`: Converts a gradient value to a corresponding RGB color in hexadecimal format.

Please note that this API documentation is based on the provided code snippets and might not cover all possible functionalities.