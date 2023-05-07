class Kicad extends Plugin {
    constructor(arg) {
        super(arg)
    }

    config() {
        return {
            name: 'Kicad',
            id: 'kcd',
            description: 'Kicad',
            role: 'worker',
            active: true,
            url: "../plugins/kicad/index.html"
        }
    }

    exec(message) {
        message.content = getBoard({path:'test.kicad_pcb'})
        let pcb = kicadToJSON(message.content)
        return message.content
    }
}
 
function makeBoard(json){
    return doInMain(arguments, 'kicad')
}

 
function getBoard(json){
    return doInMain(arguments, 'kicad')
}
 
function kicadToJSON(kicadCode) {
  const lines = kicadCode.split('\n');
  const json = {};
  let currentKey = '';

  lines.forEach(line => {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('(')) {
      const key = trimmedLine.split(' ')[0].slice(1);
      currentKey = key;
      json[key] = [];
    } else if (trimmedLine.startsWith(')')) {
      currentKey = '';
    } else if (currentKey) {
      const keyValue = trimmedLine.split(' ');
      const obj = {};
      keyValue.forEach((value, index) => {
        if (index % 2 === 0) {
          obj[value] = keyValue[index + 1];
        }
      });
      json[currentKey].push(obj);
    }
  });

  return json;
}

 

Plugin.kcd = new Kicad()
