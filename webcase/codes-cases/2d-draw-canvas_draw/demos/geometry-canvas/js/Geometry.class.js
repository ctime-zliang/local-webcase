const DEFAULT_ELEMENT_CONFIG = {
    fillStyle: 'rgba(0, 0, 0, 0)',
    lineWidth: 1,
    strokeStyle: 'rgba(0, 0, 0, 255)'
}

class Element {
    constructor(options) {
        this.config = { ...DEFAULT_ELEMENT_CONFIG, ...options }
    }

    setPaintStyle(options) {
        this.config = { ...this.config, ...options }
    }
}

class Circle extends Element {
    constructor(x, y, r = 0, options = {}) {
        super(options)
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
        const drawConfig = this.config
        ctx.beginPath()
        ctx.fillStyle = drawConfig.fillStyle
        ctx.strokeStyle = drawConfig.strokeStyle
        ctx.lineWidth = drawConfig.lineWidth
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.fill()
    }
}