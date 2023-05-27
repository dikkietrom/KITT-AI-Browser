class Fragment {
    constructor(type, name, values=[]) {
        this.type = type;
        this.name = name;
        this.values = values;
        this.children = [];
    }

    addChild(fragment) {
        if (fragment.type === "group" && fragment.name !== null) {
            this[fragment.name] = fragment;
        }
        this.children.push(fragment);
    }

    toMarkDownTreeView(indentLevel=0) {
        const indent = "  ".repeat(indentLevel);
        let markdown = `${indent}- ${this.type}: ${this.name}${this.values.length > 0 ? ' (' + this.values.join(', ') + ')' : ''}\n`;

        for (const child of this.children) {
            markdown += child.toMarkDownTreeView(indentLevel + 1);
        }

        return markdown;
    }

    traverse(callback) {
        callback(this);

        for (const child of this.children) {
            child.traverse(callback);
        }
    }
}