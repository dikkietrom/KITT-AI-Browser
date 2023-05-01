// Simple token types and their respective regular expressions.
const tokenTypes = [
  { type: 'keyword', regex: /\b(?:if|else|for|while|function|var|let|const|return|switch|case|break|default|continue|do|try|catch|finally|throw|import|export|class)\b/ },
  { type: 'number', regex: /\b\d+(?:\.\d+)?\b/ },
  { type: 'string', regex: /(?:'[^']*'|"[^"]*")/ },
  { type: 'comment', regex: /\/\/.*/ },
  { type: 'whitespace', regex: /\s+/ },
  { type: 'punctuation', regex: /[{}()\[\],.;]/ },
  { type: 'operator', regex: /(?:[+\-*/%|&^<>!=]=?)/ },
  { type: 'identifier', regex: /\b\w+\b/ },
];

function tokenize(code) {
  let tokens = [];
  let remainingCode = code;
  let match;

  while (remainingCode.length > 0) {
    let foundToken = false;
    for (const tokenType of tokenTypes) {
      if ((match = tokenType.regex.exec(remainingCode)) !== null) {
        tokens.push({ type: tokenType.type, value: match[0] });
        remainingCode = remainingCode.slice(match.index + match[0].length);
        foundToken = true;
        break;
      }
    }
    if (!foundToken) {
      throw new Error('Failed to tokenize code');
    }
  }

  return tokens;
}

function renderToken(token) {
  const colors = {
    keyword: 'blue',
    number: 'darkorange',
    string: 'green',
    comment: 'gray',
    whitespace: '',
    punctuation: 'black',
    operator: 'purple',
    identifier: 'black',
  };

  return `<span class="${token.type}" style="color: ${colors[token.type]};">${token.value}</span>`;
}

function render(tokens) {
  return tokens.map(renderToken).join('');
}

function test() {
  const code = `
function sum(a, b) {
  return a + b;
}
console.log(sum(1, 2));
`;
  const tokens = tokenize(code);
  const renderedCode = render(tokens);
  document.getElementById('container').innerHTML = renderedCode;
}

document.addEventListener('DOMContentLoaded', () => {
  test();
});
