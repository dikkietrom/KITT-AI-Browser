function parseCode(code) {
  const tokens = code.match(/\S+/g);
  const tree = [];
  let currentNode = tree;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    switch (token) {
      case "{":
        const newNode = [];
        currentNode.push(newNode);
        currentNode = newNode;
        break;
      case "}":
        currentNode = tree;
        break;
      default:
        currentNode.push(token);
        break;
    }
  }

  return tree;
}

function renderCode(tree) {
  let html = "";

  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];

    if (Array.isArray(node)) {
      html += "<div style='padding-left: 20px;'>";
      html += renderCode(node);
      html += "</div>";
    } else {
      const className = `token-${node}`;
      const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      html += `<span class='${className}' style='color: white; background-color: ${color}; padding: 2px 4px; border-radius: 4px;'>${node}</span>`;
    }
  }

  return html;
}

function test() {
  const code = `
    function factorial(n) {
      if (n === 0) {
        return 1;
      } else {
        return n * factorial(n - 1);
      }
    }
  `;
  const tree = parseCode(code);
  const html = renderCode(tree);
  const container = document.getElementById("container");
  container.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", test);
