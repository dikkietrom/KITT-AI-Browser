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