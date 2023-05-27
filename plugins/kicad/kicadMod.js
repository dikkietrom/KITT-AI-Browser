class KicadMod {
    constructor() {
        this.ref = ""
        this.x
        this.y
        this.width = 0
        this.height = 0

    }
    applyZoom(zoom) {
        this.zx = this.x * zoom;
        this.zy = this.y * zoom;
        this.zwidth = this.width * zoom;
        this.zheight = this.height * zoom;
    }
    traverse(callback) {
        callback(this);

        if (this.moduleList)
            this.moduleList.forEach((obj)=>{
                if (obj instanceof KicadMod) {
                    obj.traverse(callback);
                }
            }
            );
        if (this.padList)
            this.padList.forEach((obj)=>{
                if (obj instanceof KicadMod) {
                    obj.traverse(callback);
                }
            }
            );

    }
    calculateDimensions(json) {
        if (json.lines.length === 0) {
            return;
        }
        const {lines} = json

        let line = lines.pop()
        let minX = Math.min(line.x1, line.x2);
        let maxX = Math.max(line.x1, line.x2);
        let minY = Math.min(line.y1, line.y2);
        let maxY = Math.max(line.y1, line.y2);

        for (const line of json.lines) {
            minX = Math.min(minX, line.x1, line.x2);
            maxX = Math.max(maxX, line.x1, line.x2);
            minY = Math.min(minY, line.y1, line.y2);
            maxY = Math.max(maxY, line.y1, line.y2);
        }
        if (!this.x && this.x != 0) {
            this.x = minX;
            this.y = minY;
        } else {
             this.x = parseFloat(this.x) + minX
             this.y = parseFloat(this.y) + minY
        }
        this.width = Math.abs(maxX - minX);
        this.height = Math.abs(maxY - minY);
    }

}
