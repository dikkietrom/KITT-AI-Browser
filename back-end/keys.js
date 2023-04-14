const fs = require('fs');
const path = require('path');
const prompt = require('electron-prompt');
const {log,err} = require(path.join(__dirname, '..','lib/shared.js'));

function apiKeys(kind) {
  let fileName = 'keys/'
    mkdirs(fileName);
   fileName +=  kind + '.api';

  if (!fs.existsSync(fileName)) {
    // Create the file with a default value if it does not exist
    fs.writeFileSync(fileName, '');
  }

  // Read the API key from the file and return it
  const api = fs.readFileSync(fileName, 'utf8');
  return api.trim();
}

async function promptIt(title, kind) {
    try {
        const r = await prompt({
            title: title,
            label: 'key:',
            value: '',
            alwaysOnTop: true,
            inputAttrs: {
                type: 'key'
            },
            type: 'input'
        });
        if (r === null) {
            return null;
        } else {
            const fileName = 'keys/' + kind + '.api';
            fs.writeFileSync(fileName, r);
            return r;
        }
    } catch (err) {
        err(err);
    }
}


function mkdirs(dirPath) {
  const parts = dirPath.split(path.sep);
  for (let i = 1; i <= parts.length; i++) {
    const subPath = path.join.apply(null, parts.slice(0, i));
    if (!fs.existsSync(subPath)) {
      fs.mkdirSync(subPath);
    }
  }
}



exports.apiKeys = apiKeys
exports.promptIt = promptIt;