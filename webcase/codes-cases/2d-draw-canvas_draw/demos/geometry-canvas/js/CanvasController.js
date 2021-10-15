class CanvasContoller extends Scene {
    constructor(canvasElement) {
        super(canvasElement)
        this._initCanvasContoller()
    }

    _initCanvasContoller() {
        this._bindRightClickEvent()
        this._bindMousedownEvent()
        this._bindMousemoveEvent()
        this._bindMouseupEvent()
    }

    _bindRightClickEvent() {
        this.canvasElement.addEventListener('contextmenu', (evte) => {
            evte.preventDefault()
            for (let i = this.geometries.length - 1; i >= 0; i--) {
                if (this.geometries[i].choose(evte.offsetX, evte.offsetY)) {
                    this.mouseState.target = this.geometries[i]
                    this.mouseState.target.setHighlight()
                    break
                }
            }
            this._rerenderWith(this.offScreen.cacheCanvasCtx)
            this._rerenderWith(this.canvasCtx)
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
                for (let i = this.geometries.length - 1; i >= 0; i--) {
                    if (this.geometries[i].choose(this.mouseState.x, this.mouseState.y) && !geometryTarget) {
                        geometryTarget = this.geometries[i]
                        geometryTarget.setHighlight()
                    } else {
                        this.geometries[i].cancelHighlight()
                    }
                }
                if (geometryTarget) {
                    const targetOffset = geometryTarget.getOffset(this.mouseState.x, this.mouseState.y)
                    this.mouseState.targetOffsetX = targetOffset.distX
                    this.mouseState.targetOffsetY = targetOffset.distY
                }                
            }
            this.mouseState.target = geometryTarget
            this._continuedRender()
            if (this.config.state === CANVAS_STATE.DRAWING) {
                this.emit(EVENT_NS.DRAW_START, { action: EVENT_NS.DRAW_START })
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
                /* 选择模式 */
                if (this.config.state === CANVAS_STATE.SELECT) {
                    if (this.mouseState.target) {
                        this.mouseState.target.moveTo(this.mouseState.x - this.mouseState.targetOffsetX, this.mouseState.y - this.mouseState.targetOffsetY)
                    }                    
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
            this._rerenderWith(this.offScreen.cacheCanvasCtx)
            if (evte.button !== 0) {
                return
            }
            if (this.config.state === CANVAS_STATE.DRAWING) {
                this.emit(EVENT_NS.DRAW_FINISHED, { action: EVENT_NS.DRAW_FINISHED })
            }            
        })
    }
}