const DEFAULT_BRUSH_CONFIG = {
    strokeStyle: '#000000',
    fillStyle: '#ffff00',
    lineWidth: 10
}

const CANVAS_STATE = {
    DRAWING: 'DRAWING',
    SELECT: 'SELECT'
}

class Scene {
    constructor(canvasElement) {
        if (!canvasElement || canvasElement.nodeName.toUpperCase() !== 'CANVAS') {
            return
        }
        this.geometryConstructor = null
        this.geometries = []
        this.config = {}
        this.toolState = {}
        this.mouseState = {}
        this.offScreen = {}
        this.canvasElement = canvasElement
        this.canvasCtx = this.canvasElement.getContext('2d')
        this._init()
    }

    _init() {
        this.config.canvasRect = this._setCanvasElementRect()
        this.toolState = this._initToolState()       
        this.config.state = CANVAS_STATE.DRAWING
        this.mouseState = this._initMouseState()
        this.offScreen = this._createOffScreenCanvas()
        /* 绑定事件 */
        this._bindWindowResizeEvent()
        this._bindRightClickEvent()
        this._bindMousedownEvent()
        this._bindMousemoveEvent()
        this._bindMouseupEvent()
    }

    setGeometryConstructor(geometryConstructor) {
        this.geometryConstructor = geometryConstructor
    }

    _initToolState() {
        const paintBrushState = { ...DEFAULT_BRUSH_CONFIG }
        return {
            paintBrushState
        }
    }

    _initMouseState() {
        return {
            x: -1,
            y: -1,
            offsetX: 0,
            offsetY: 0,
            down: false,
            target: null
        }
    }

    _setCanvasElementRect() {
        const rect = this.canvasElement.getBoundingClientRect()
        this.canvasElement.width = rect.width
        this.canvasElement.height = rect.height
        return rect
    }

    _createOffScreenCanvas() {
        const canvasRect = this.config.canvasRect
        const offScreen = {
            outCanvasElement: document.createElement('canvas'),
            outCanvasFrontElement: document.createElement('canvas')
        }
        offScreen.outCanvasElement.width = canvasRect.width
        offScreen.outCanvasElement.height = canvasRect.height
        offScreen.outCanvasCtx = offScreen.outCanvasElement.getContext('2d')
        offScreen.outCanvasFrontElement.width = canvasRect.width
        offScreen.outCanvasFrontElement.height = canvasRect.height
        offScreen.outCanvasFrontCtx = offScreen.outCanvasFrontElement.getContext('2d')
        /*
            测试 
         */
        document.getElementById(`t_c_1`).appendChild(offScreen.outCanvasElement)
        document.getElementById(`t_c_2`).appendChild(offScreen.outCanvasFrontElement)
        return offScreen
    }

    _bindWindowResizeEvent() {
        let timer = null
        window.addEventListener('resize', () => {
            window.clearTimeout(timer)
            timer = window.setTimeout(() => {
                this._setCanvasElementRect()
            }, 100)
        })
    } 

    _bindRightClickEvent() {
        this.canvasElement.addEventListener('contextmenu', (evte) => {
            evte.preventDefault()
        })
    }

    _bindMousedownEvent() {
        this.canvasElement.addEventListener('mousedown', (evte) => {
            let geometryTarget = null
            evte.preventDefault()
            if (evte.button !== 0) {
                return
            }
            this.mouseState.down = true
            this.mouseState.x = evte.offsetX
            this.mouseState.y = evte.offsetY
            /* 绘制模式 */
            if (this.config.state === CANVAS_STATE.DRAWING) {
                if (this.geometryConstructor) {
                    geometryTarget = new this.geometryConstructor(this.mouseState.x, this.mouseState.y)
                    geometryTarget.setPaintStyle(this.toolState.paintBrushState)
                }
            }
            /* 选择模式 */
            if (this.config.state === CANVAS_STATE.SELECT) {
                /* ... */
            }
            this.mouseState.target = geometryTarget
            this.offScreen.outCanvasCtx.clearRect(0, 0, this.config.canvasRect.width, this.config.canvasRect.height)
            for (let i = 0; i < this.geometries.length; i++) {
                if (this.geometries[i] === geometryTarget) {
                    break
                }
                this.geometries[i].draw(this.offScreen.outCanvasCtx)
            }
            this.offScreen.outCanvasFrontCtx.clearRect(0, 0, this.config.canvasRect.width, this.config.canvasRect.height)
            for (let i = 0; i < this.geometries.length; i++) {
                this.geometries[i].draw(this.offScreen.outCanvasFrontCtx)
            }
            if (geometryTarget) {
                this._render()
            }
        })
    }

    _bindMousemoveEvent() {
        this.canvasElement.addEventListener('mousemove', (evte) => {
            evte.preventDefault()
            this.mouseState.x = evte.offsetX
            this.mouseState.y = evte.offsetY
            if (this.mouseState.down && this.mouseState.target) {
                /* 绘制模式 */
                if (this.config.state === CANVAS_STATE.DRAWING) {
                    this.mouseState.target.setSize(this.mouseState.x, this.mouseState.y)
                }
            }            
        })
    }

    _bindMouseupEvent() {
        this.canvasElement.addEventListener('mouseup', (evte) => {
            evte.preventDefault()
            if (this.mouseState.down) {
                /* 绘制模式 */
                if (this.config.state === CANVAS_STATE.DRAWING) {
                    this.geometries.push(this.mouseState.target)
                }
            }
            this.mouseState.down = false
            this.mouseState.target = null
        })
    }

    _render() {
        window.requestAnimationFrame(() => {
            this.canvasCtx.clearRect(0, 0, this.config.canvasRect.width, this.config.canvasRect.height)
            this._paint(this.offScreen.outCanvasElement)
            if (this.mouseState.target) {
                this.mouseState.target.draw(this.canvasCtx)
            }            
            this._paint(this.offScreen.outCanvasFrontElement)
            if (this.mouseState.down) {
                this._render()
            } else {
                this._reset()
            }
        })
    }

    _clear() {
        this.canvasCtx.clearRect(0, 0, this.config.canvasRect.width, this.config.canvasRect.height)
    }

    _reset() {
        this.canvasCtx.clearRect(0, 0, this.config.canvasRect.width, this.config.canvasRect.height)
        for (let i = 0; i < this.geometries.length; i++) {
            this.geometries[i].draw(this.canvasCtx)
        }
    }

    _paint(canvas, x = 0, y = 0) {
        this.canvasCtx.drawImage(canvas, x, y, this.config.canvasRect.width, this.config.canvasRect.height)
    }

    _appendGeometryItem(geometry) {
        this.geometries.push(geometry)
        geometry.draw(this.canvasCtx)
    }

    _removeGeometryItem(index) {
        this.geometries.splice(index, 1)
        this._reset()
    }
}