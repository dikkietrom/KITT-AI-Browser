class HtmlView {
    constructor() {
        this.model = null;
        this.template = '<style>\n.test{\nbackground:#fff8;\ncolor:red;\n}\n</style>\n<div class="test">${this.model.title}</div>\n ';
    }
    _update() {
        this._html.lastElementChild.innerHTML = eval('`' + this.template + '`');
    }
}
class ICssVar {
    constructor() {
        this.root = document.documentElement.style;
        this.bg = '#fff';
    }
    background() {
        this.root.background = this.bg;
    }
}
class IFile {
    constructor() {
        this.path = '.';
    }
    data() {
        this.content = [];
        streamContent(this);
    }
}
class ITokenizer {
    constructor() {
        this.id = 'ddd';
    }
    exec() {
    }
}
class IFlowView {
    constructor() {
        this.code = '#fff';
    }
    html() {
        return this.code;
    }
}
class IHtmlModel {
    constructor() {
        this.title = 'Test Pag';
    }
    set() {
        return this;
    }
}
class HtmlModel {
    constructor() {
        this.title = 'Test page';
    }
    set() {
        return this;
    }
}
class IValue {
    constructor() {
        this.value = '<style>\n.test{\nbackground:#fff8;\ncolor:red;\npadding:1em;\n}\n</style>\n<div class="test">\n${this.model.title}\n</div>';
    }
    set() {
        return this.value;
    }
}