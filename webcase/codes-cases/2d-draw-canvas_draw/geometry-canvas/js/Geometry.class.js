const DEFAULT_ELEMENT_CONFIG = {
    fillStyle: 'rgba(255, 255, 0, 1)',
    lineWidth: 1,
    strokeStyle: 'rgba(0, 0, 0, 1)'
}
const DEFAULT_HIGHLIGHT_CONFIG = {
    strokeStyle: 'rgba(255, 0, 0, 255)',
    lineWidth: 5,
    fillStyle: 'rgba(255, 255, 255, 1)',
}

class GeometryBase {
    constructor() {
        this.config = {
            normal: { ...DEFAULT_ELEMENT_CONFIG },
            hightlight: { ...DEFAULT_ELEMENT_CONFIG, ...DEFAULT_HIGHLIGHT_CONFIG }
        }
        this.highlight = false
        this.checked = false
        this.index = -1
    }

    setPaintStyle(options) {
        this.config.normal = { ...this.config.normal, ...options }
    }

    setAssistSetting() { /* ... */ }

    moveDist(distX, distY) { /* ... */ }

    setIndex(index = -1) {
        this.index = index
    }

    getIndex() {
        return this.index
    }

    setChecked() {
        this.checked = true
    }

    cancelChecked() {
        this.checked = false
    }

    isChecked() {
        return this.checked
    }

    getOffset(x, y) {
        return {
            distX: x - this.x,
            distY: y - this.y
        }
    }

    setHighlight() {
        this.highlight = true
    }

    cancelHighlight() {
        this.highlight = false
    }

    isHighlight() {
        return this.highlight
    }
}

class Circle extends GeometryBase {
    constructor(x, y, r = 0) {
        super()
        this.x = x
        this.y = y
        this.r = r
    }

    setShapeParameter(x, y) {
        this.r = Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2))
    }

    moveDist(distX, distY) {
        this.x += distX
        this.y += distY
    }

    choose(x, y) {
        return Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2) < Math.pow(this.r, 2)
    }

    draw(ctx) {
        const brushConfig = this.highlight ? this.config.hightlight : this.config.normal
        ctx.beginPath()
        ctx.fillStyle = brushConfig.fillStyle
        ctx.strokeStyle = brushConfig.strokeStyle
        ctx.lineWidth = brushConfig.lineWidth
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.fill()
        ctx.closePath()
    }    

    validate() {
        return this.r >= 5
    }
}

class Rect extends GeometryBase {
    constructor(x, y, w, h) {
        super()
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }

    setShapeParameter(x, y) {
        this.w = x - this.x
        this.h = y - this.y
    }

    moveDist(distX, distY) {
        this.x += distX
        this.y += distY
    }

    choose(x, y) {
        const absoluteMiddleX = this.x + this.w / 2
        const absoluteMiddleY = this.y + this.h / 2
        return (Math.abs(x - absoluteMiddleX) < Math.abs(this.w / 2)) && (Math.abs(y - absoluteMiddleY) < Math.abs(this.h / 2))
    }

    draw(ctx) {
        const brushConfig = this.highlight ? this.config.hightlight : this.config.normal
        ctx.beginPath()
        ctx.fillStyle = brushConfig.fillStyle
        ctx.strokeStyle = brushConfig.strokeStyle
        ctx.lineWidth = brushConfig.lineWidth
        ctx.rect(this.x, this.y, this.w, this.h)
        ctx.stroke()
        ctx.fill()
        ctx.closePath()
    }

    validate() {
        return Math.abs(this.w) >= 5 && Math.abs(this.h) >= 5
    }
}

class Line extends GeometryBase {
    constructor(x, y) {
        super()
        this.path = [{x, y}]
        this.smooth = false
        this.samplingIntervalNumber = 2
    }

    setShapeParameter(x, y) {
        const lastPoint = this.path[this.path.length - 1]
        if ((Math.abs(lastPoint.x - x) > 1) || (Math.abs(lastPoint.y - y) > 1)) {
            this.path.push({ x, y })
        }
    }

    setAssistSetting({ smooth }) {
        this.smooth = smooth
    }

    moveTo(x, y) {
        const startPoint = this.path[0]
        const startPointOffsetX = x - startPoint.x
        const startPointOffsetY = y - startPoint.y
        for (let i = 0; i < this.path.length; i++) {
            this.path[i].x += startPointOffsetX
            this.path[i].y += startPointOffsetY
        }
    }

    moveDist(distX, distY) {
        for (let i = 0; i < this.path.length; i++) {
            this.path[i].x += distX
            this.path[i].y += distY
        }
    }

    choose(x, y) {
        const round = this.lineWidth > 10 ? Math.pow(this.lineWidth, 2) : 30
        for (let i = 0; i < this.path.length; i++) {
            if ((Math.pow(this.path[i].x - x, 2) + Math.pow(this.path[i].y - y, 2)) < round) {
                return true
            }
        }
        return false
    }
    
    getOffset(x, y) {
        return {
            distX: x - this.path[0].x,
            distY: y - this.path[0].y
        }
    }
      
    draw(ctx) {
        const brushConfig = this.highlight ? this.config.hightlight : this.config.normal
        ctx.fillStyle = `rgba(0, 0, 0, 0)`
        ctx.strokeStyle = brushConfig.strokeStyle
        ctx.lineWidth = brushConfig.lineWidth
        ctx.lineJoin = 'round' 
        /* 
            非平滑曲线
         */
        if (!this.smooth) {
            ctx.beginPath()
            for (let i = 0; i < this.path.length; i++) {
                ctx.lineTo(this.path[i].x, this.path[i].y)
            } 
            ctx.stroke()
            ctx.closePath()
            return
        }
        if (this.path.length > 3) {
            ctx.beginPath()
            ctx.moveTo(this.path[0].x, this.path[0].y)
            let i = 1
            // let samplingIntervalNumber = this.path.length >= this.samplingIntervalNumber ? this.samplingIntervalNumber : 1
            for (i = 1; i < this.path.length - 2; i += this.samplingIntervalNumber) {
                if (this.path[i] && this.path[i + 1]) {
                    const xc = (this.path[i].x + this.path[i + 1].x) / 2
                    const yc = (this.path[i].y + this.path[i + 1].y) / 2
                    ctx.quadraticCurveTo(this.path[i].x, this.path[i].y, xc, yc)
                }
            }
            if (i >= this.path.length - 2) {
                i = this.path.length - 2
            }
            ctx.quadraticCurveTo(this.path[i].x, this.path[i].y, this.path[i + 1].x, this.path[i + 1].y)
            ctx.stroke()
            ctx.closePath()
            return
        }
    }
      
    validate() {
        return this.path.length >= 5
    }
}