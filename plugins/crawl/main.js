const fs = require('fs');
const {err} = require('../../lib/shared.js');
const path = require('path');

async function init(lg) {
    log = lg
}
function writeCrawlSync(json) {
    validate(json)
    return fs.writeCrawlSync(json.path, json.data)
}

const { execSync } = require('child_process');

function getCrawlContent(json) {
    try {
        let bashCommand = `curl -s "${json.url}"`;
        let content = execSync(bashCommand, { encoding: 'utf8' });
        console.log(content);
        return content;
    } catch (error) {
        console.error(error);
        return error.stack;
    }
}




exports.getCrawlContent = getCrawlContent

exports.init = init
