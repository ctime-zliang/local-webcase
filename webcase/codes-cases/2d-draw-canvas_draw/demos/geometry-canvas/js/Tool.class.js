const drawDashLine = (ctx, [x1, y1], [x2, y2], step = 5) => {
    const x = x2 - x1
    const y = y2 - y1
    const count = Math.floor(Math.sqrt(x * x + y * y) / step)
    const xv = x / count
    const yv = y / count
    ctx.beginPath()
    for (let i = 0; i < count; i ++) {
        if (i % 2 === 0) {
            ctx.moveTo(x1, y1)
        } else {
            ctx.lineTo(x1, y1)
        }
        x1 += xv
        y1 += yv
    }
    ctx.lineTo(x2, y2)
}

class BoxSelectTool {
    constructor(x, y, w, h) {
        this.brushConfig = {
            fillStyle: 'rgba(255, 255, 255, 0)',
            lineWidth: 1,
            linDash: [3],
            strokeStyle: 'rgba(0, 0, 0, 1)'
        }
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }

    setStartCoordinate(x, y) {
        this.x = x + this.brushConfig.lineWidth
        this.y = y + this.brushConfig.lineWidth
    }

    restoreStatus() {
        this.x = 0
        this.y = 0
        this.w = 0
        this.h = 0
    }

    setShapeParameter(x, y) {
        this.w = x - this.x
        this.h = y - this.y
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.fillStyle = this.brushConfig.fillStyle
        ctx.strokeStyle = this.brushConfig.strokeStyle
        ctx.lineWidth = this.brushConfig.lineWidth
        ctx.linDash = this.brushConfig.linDash
        this.drawDashRect(ctx, this.x, this.y, this.w, this.h)
        ctx.closePath()
    }

    drawDashRect(ctx, left, top, width, height, step = 5) {
        drawDashLine(ctx, [left, top], [left + width, top], step)
        ctx.stroke()
        drawDashLine(ctx, [left + width, top], [left + width, top + height], step)
        ctx.stroke()
        drawDashLine(ctx, [left + width, top + height], [left, top + height], step)
        ctx.stroke()
        drawDashLine(ctx, [left, top + height], [left, top], step)
        ctx.stroke()
    }
}