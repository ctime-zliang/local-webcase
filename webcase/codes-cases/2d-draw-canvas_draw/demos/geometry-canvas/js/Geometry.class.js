const DEFAULT_ELEMENT_CONFIG = {
    fillStyle: 'rgba(0, 0, 0, 0)',
    lineWidth: 1,
    strokeStyle: 'rgba(0, 0, 0, 255)'
}
const DEFAULT_HIGHLIGHT_CONFIG = {
    strokeStyle: 'rgba(255, 0, 0, 255)'
}

class Element {
    constructor() {
        this.config = {
            normal: { ...DEFAULT_ELEMENT_CONFIG },
            hightlight: { ...DEFAULT_ELEMENT_CONFIG, ...DEFAULT_HIGHLIGHT_CONFIG }
        }
        this.isHighlight = false
    }

    setPaintStyle(options) {
        this.config.normal = { ...this.config.normal, ...options }
    }
}

class Circle extends Element {
    constructor(x, y, r = 0) {
        super()
        this.x = x
        this.y = y
        this.r = r
    }

    setSize(x, y) {
        this.r = Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2))
    }

    moveDist(x, y) {
        this.x += x
        this.y += y 
    }

    moveTo(x, y) {
        this.x = x
        this.y = y
    }

    choose(x, y) {
        return Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2) < Math.pow(this.r, 2)
    }

    getOffset(x, y) {
        return {
            distX: x - this.x,
            distY: y - this.y
        }
    }

    draw(ctx) {
        const brushConfig = this.isHighlight ? this.config.hightlight : this.config.normal
        ctx.beginPath()
        ctx.fillStyle = brushConfig.fillStyle
        ctx.strokeStyle = brushConfig.strokeStyle
        ctx.lineWidth = brushConfig.lineWidth
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.fill()
    }

    setHighlight() {
        this.isHighlight = true
    }

    cancelHighlight() {
        this.isHighlight = false
    }

    validate(minRadius = 2) {
        return this.r >= minRadius
    }
}