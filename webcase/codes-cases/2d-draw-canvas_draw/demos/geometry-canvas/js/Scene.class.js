const DEFAULT_BRUSH_CONFIG = {
    strokeStyle: '#000000',
    fillStyle: '#ffff00',
    lineWidth: 4
}

const CANVAS_STATE = {
    DRAWING: 'DRAWING',
    SELECT: 'SELECT'
}

class Scene extends Events {
    constructor(canvasElement) {
        super()
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
        this.offScreen = this._createOffScreenCanvas()
        this.config.state = CANVAS_STATE.DRAWING
        this.config.canvasRect = this._createCanvasRect()
        this.toolState = this._initToolState()
        this.mouseState = this._initMouseState()
        this.setCanvasElementRect()
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

    setCanvasElementRect(rect = {}) {
        const canvasRect = { ...this.config.canvasRect, ...rect }
        const offScreen = this.offScreen
        this.canvasElement.width = canvasRect.width
        this.canvasElement.height = canvasRect.height
        offScreen.cacheCanvasElement.width = canvasRect.width
        offScreen.cacheCanvasElement.height = canvasRect.height
        offScreen.outCanvasFrontElement.width = canvasRect.width
        offScreen.outCanvasFrontElement.height = canvasRect.height
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

    _createCanvasRect() {
        const domRect = this.canvasElement.getBoundingClientRect()
        const rect = {}
        for (let attr in domRect) {
            rect[attr] = domRect[attr]
        }
        return rect
    }

    _createOffScreenCanvas() {
        const offScreen = {
            cacheCanvasElement: document.createElement('canvas'),
            outCanvasFrontElement: document.createElement('canvas')
        }
        offScreen.cacheCanvasCtx = offScreen.cacheCanvasElement.getContext('2d')
        offScreen.outCanvasFrontCtx = offScreen.outCanvasFrontElement.getContext('2d')
        /*
            测试 
         */
        document.getElementById(`t_c_1`).appendChild(offScreen.cacheCanvasElement)
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
            evte.preventDefault()            
            let geometryTarget = null
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
            // this.offScreen.cacheCanvasCtx.clearRect(0, 0, this.config.canvasRect.width, this.config.canvasRect.height)
            // for (let i = 0; i < this.geometries.length; i++) {
            //     if (this.geometries[i] === geometryTarget) {
            //         console.log(`pass render of cache canvas.`)
            //         continue
            //     }
            //     this.geometries[i].draw(this.offScreen.cacheCanvasCtx)
            // }
            // this.offScreen.outCanvasFrontCtx.clearRect(0, 0, this.config.canvasRect.width, this.config.canvasRect.height)
            // for (let i = 0; i < this.geometries.length; i++) {
            //     this.geometries[i].draw(this.offScreen.outCanvasFrontCtx)
            // }
            this._continuedRender()
            this.emit(EVENT_NS.DRAW_START, { action: EVENT_NS.DRAW_START })
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
                    if (this.mouseState.target.validate(10)) {
                        this.geometries.push(this.mouseState.target)
                    }                    
                }
            }
            this.mouseState.down = false
            this.mouseState.target = null
            /*
                在绘制结束(鼠标抬起)时
                    1. 需要清空输出画布
                    2. 将所有几何图元重新绘制到输出画布中
                    3. 将所有几何图元重新绘制到缓存画布中
             */
            this.canvasCtx.clearRect(0, 0, this.config.canvasRect.width, this.config.canvasRect.height)
            for (let i = 0; i < this.geometries.length; i++) {
                this.geometries[i].draw(this.canvasCtx)
            }
            this.offScreen.cacheCanvasCtx.clearRect(0, 0, this.config.canvasRect.width, this.config.canvasRect.height)
            for (let i = 0; i < this.geometries.length; i++) {
                this.geometries[i].draw(this.offScreen.cacheCanvasCtx)
            }
            if (evte.button !== 0) {
                return
            }
            this.emit(EVENT_NS.DRAW_FINISHED, { action: EVENT_NS.DRAW_FINISHED })
        })
    }

    _continuedRender() {
        window.requestAnimationFrame(() => {
            this.canvasCtx.clearRect(0, 0, this.config.canvasRect.width, this.config.canvasRect.height)
            /* 
                1. 将缓存画布中的图像数据绘制到输出画布中
                2. 在输出画布中绘制当前正在绘制的几何图形
             */
            this._paintWith(this.offScreen.cacheCanvasElement)
            if (this.mouseState.target) {
                this.mouseState.target.draw(this.canvasCtx)
            }
            // this._paintWith(this.offScreen.outCanvasFrontElement)
            if (this.mouseState.down) {
                this._continuedRender()
                return
            }             
        })
    }

    _clear() {
        this.canvasCtx.clearRect(0, 0, this.config.canvasRect.width, this.config.canvasRect.height)
    }

    _paintWith(canvas, x = 0, y = 0) {
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