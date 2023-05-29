class HtmlModel_1 {
    constructor(arg) {
        this.title = 'Test Pagex';
    }
    set() {
        return this;
    }
}
class HtmlView_1 {
    constructor() {
        this.model = null;
    }
    _update() {
        alert(this.model.title);
    }
}