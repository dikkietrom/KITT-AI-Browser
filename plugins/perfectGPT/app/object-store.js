class HtmlModel {
    constructor() {
        this.title = 'Tests Page2';
    }
    set() {
        return this;
    }
}
class HtmlView {
    constructor() {
        this.model = null;
        this.template = null;
    }
    _update() {
        this._html.log(this.model.title);
    }
}
class IStorage {
    constructor() {
        this.id = null;
    }
    store() {
    }
    get() {
    }
}
class IValue {
    constructor() {
        this.value = null;
    }
    set() {
        return this.value;
    }
}
class AppModel {
    constructor() {
        this.wires = null;
        this.aaaaa = 'aaa';
    }
    store() {
    }
}
class IApp {
    constructor() {
        this.id = null;
        this.name = null;
        this.description = null;
    }
    init() {
    }
}
class IAaaaaa {
    constructor() {
        this.aaaaa = null;
    }
}
class IBbbbbbbb {
    constructor() {
        this.ccccc = null;
    }
}
class ICccccccc {
    constructor() {
        this.aaaa = 'cccc';
    }
}
class IAaaaaaa {
    constructor() {
    }
}