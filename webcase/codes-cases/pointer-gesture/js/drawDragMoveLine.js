class DrawDragMoveLine {
    static canvasElement = null
    static path = []    
    static lineWidth = 1.0
    static samplingIntervalNumber = 2
    static fillStyle = `rgba(0, 0, 0, 0)`
    static strokeStyle = `red`
    static ctx = null

    static init(canvasElement) {
        const parentElement = canvasElement.parentElement
        this.canvasElement = canvasElement
        this.canvasElement.width = parentElement.getBoundingClientRect().width
        this.canvasElement.height = parentElement.getBoundingClientRect().height
        this.ctx = this.canvasElement.getContext('2d')
    }

    static addPath(dot) {
        this.path.push({ x: dot.x, y: dot.y })
    }

    static drawStart() {
        this.path.length = 0
        this.ctx.strokeStyle = this.strokeStyle
        this.ctx.fillStyle = this.fillStyle
        this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height)
    }

    static drawMove() {
        if (this.path.length > 3) {
			this.ctx.beginPath()
			this.ctx.moveTo(this.path[0].x, this.path[0].y)
			let i = 1
			for (i = 1; i < this.path.length - 2; i += this.samplingIntervalNumber) {
				if (this.path[i] && this.path[i + 1]) {
					const xc = (this.path[i].x + this.path[i + 1].x) / 2
					const yc = (this.path[i].y + this.path[i + 1].y) / 2
					this.ctx.quadraticCurveTo(this.path[i].x, this.path[i].y, xc, yc)
				}
			}
			if (i >= this.path.length - 2) {
				i = this.path.length - 2
			}
			this.ctx.quadraticCurveTo(this.path[i].x, this.path[i].y, this.path[i + 1].x, this.path[i + 1].y)
			this.ctx.stroke()
			this.ctx.closePath()
			return
		}
    }
}