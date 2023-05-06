"class NatDev extends Plugin {
  constructor(arg) {
    super(arg);
    this.async = true;
    this.streamer = true;
  }
  config() {
    return {
      name: 'NatDev',
      id: 'natdev',
      description: 'NatDev',
      role: 'worker',
      active: true,
      url: 'https://nat.dev'
    };
  }
  onData(data) {
    console.log(data);  // log the incoming data for now
  }
  exec(message) {
    this.webView.send('execute-task', message.content);
  }
} 
let natDev = new NatDev();"