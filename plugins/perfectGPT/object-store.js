class HtmlView {
    constructor() {
        this.model = null;
    }
    _update() {
        alert(this.model.title);
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