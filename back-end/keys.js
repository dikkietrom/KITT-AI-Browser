const fs = require('fs');
const prompt = require('electron-prompt');
const {log,err} = require('../lib/shared.js')
const {mkdirs} = require('../plugins/file/main.js')

function apiKeys(kind) {
  let fileName = 'keys/'
    mkdirs({path:fileName});
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




exports.apiKeys = apiKeys
exports.promptIt = promptIt;
