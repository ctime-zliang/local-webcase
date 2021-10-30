const KEYCODE_DELETE = 46
const KEYCODE_CTRL = 17

class CanvasContoller extends Scene {
    constructor(canvasElement) {
        super(canvasElement)
        this.variablesPool = { /* ... */ }
        this.eventsHandler = new Events()
    }

    init() {
        this._initScene()
        this._initCanvasContoller()
    }

    _initCanvasContoller() {
        this._bindRightClickEvent()
        this._bindMousedownEvent()
        this._bindMousemoveEvent()
        this._bindMouseupEvent()
        this._bindKeydownEvent()
        this._bindKeyupEvent()
        this._bindBlurEvent()
    }

    _isOnlyCtrlKeydown() {
        return this.keyboardState.keys.length === 1 && this.keyboardState.keys[0] === KEYCODE_CTRL
    }

    _bindRightClickEvent() {
        this.canvasElement.addEventListener('contextmenu', (evte) => {
            // evte.preventDefault()
        })
    }    

    _bindMousedownEvent() {
        this.canvasElement.addEventListener('mousedown', (evte) => {
            evte.stopPropagation()
            this.mouseState.down = true
            this.mouseState.x = evte.offsetX
            this.mouseState.y = evte.offsetY
            Promise.resolve().then(() => {
                if (evte.button !== 0) {
                    return
                }                
                /* 绘制模式 */
                if (this.config.state === CANVAS_STATE.DRAWING) {
                    this.mouseState.selectedIndexs = []
                    /* 创建图形实例 */
                    if (this.geometryConstructor) {
                        this.variablesPool.geometryTarget = new this.geometryConstructor(this.mouseState.x, this.mouseState.y)
                        this.variablesPool.geometryTarget.setPaintStyle(this.toolState.paintBrushState)
                        this.variablesPool.geometryTarget.setAssistSetting({ smooth: this.toolState.smooth })
                    }
                    /* 将新创建的实例标注为鼠标动态跟踪对象  */  
                    this.mouseState.pointTarget = this.variablesPool.geometryTarget
                    this.variablesPool.geometryTarget = null
                    /* 重绘离屏画布 */
                    this._clearCanvas(this.offScreen.cacheCanvasCtx)
                    for (let i = 0; i < this.geometries.length; i++) {
                        this.geometries[i].cancelHighlight()
                        this.geometries[i].cancelChecked()
                        this.geometries[i].draw(this.offScreen.cacheCanvasCtx)
                    }
                    /* ... */
                    this.config.dirty = true
                    return
                }
                /* 选择模式 */
                if (this.config.state === CANVAS_STATE.SELECT) {
                    this.variablesPool.targetResult = this._findClickedTarget(this.mouseState.x, this.mouseState.y)
                    if (!this.variablesPool.targetResult.geometryTarget) {
                        this.mouseState.selectedIndexs = []
                        for (let i = 0; i < this.geometries.length; i++) {
                            this.geometries[i].cancelChecked()
                            this.geometries[i].cancelHighlight()
                        }
                        this.mouseState.toolTarget = this.tools.boxSelector
                        this.mouseState.toolTarget.setStartCoordinate(this.mouseState.x, this.mouseState.y)
                    } else {
                        const inIndex = this.mouseState.selectedIndexs.indexOf(this.variablesPool.targetResult.geometryTargetIndex)
                        if (this.mouseState.selectedIndexs.length >= 2 && inIndex >= 0) {
                            if (this._isOnlyCtrlKeydown()) {
                                if (inIndex >= 0) {
                                    this.mouseState.selectedIndexs.splice(inIndex, 1)
                                    this.variablesPool.targetResult.geometryTarget.cancelChecked()
                                    this.variablesPool.targetResult.geometryTarget.cancelHighlight()
                                } else {
                                    this.mouseState.selectedIndexs.push(this.variablesPool.targetResult.geometryTargetIndex)
                                    this.variablesPool.targetResult.geometryTarget.setChecked()
                                    this.variablesPool.targetResult.geometryTarget.setHighlight()
                                }
                            }
                        } else {
                            if (this._isOnlyCtrlKeydown()) {
                                if (inIndex >= 0) {
                                    this.mouseState.selectedIndexs.splice(inIndex, 1)
                                    this.variablesPool.targetResult.geometryTarget.cancelChecked()
                                    this.variablesPool.targetResult.geometryTarget.cancelHighlight()
                                } else {
                                    this.mouseState.selectedIndexs.push(this.variablesPool.targetResult.geometryTargetIndex)
                                    this.variablesPool.targetResult.geometryTarget.setChecked()
                                    this.variablesPool.targetResult.geometryTarget.setHighlight()
                                }
                            } else {
                                this.mouseState.selectedIndexs = [this.variablesPool.targetResult.geometryTargetIndex]
                                for (let i = 0; i < this.geometries.length; i++) {
                                    if (this.mouseState.selectedIndexs.includes(i)) {
                                        continue
                                    }
                                    this.geometries[i].cancelChecked()
                                    this.geometries[i].cancelHighlight()
                                }
                                this.variablesPool.targetResult.geometryTarget.setChecked()
                                this.variablesPool.targetResult.geometryTarget.setHighlight()
                            }
                        }
                    }
                    /* 重绘离屏画布 */
                    this._clearCanvas(this.offScreen.cacheCanvasCtx)
                    for (let i = 0; i < this.geometries.length; i++) {
                        if (this.mouseState.selectedIndexs.includes(i)) {
                            continue
                        }
                        this.geometries[i].draw(this.offScreen.cacheCanvasCtx)
                    }
                    /* ... */
                    this.config.dirty = true
                }
            })
        })
    }

    _bindMousemoveEvent() {
        document.addEventListener('mousemove', (evte) => {
            evte.stopPropagation()
            if (!this.mouseState.down || this._isOnlyCtrlKeydown()) {
                return
            }
            if (
                evte.clientX - this.config.canvasRect.left <= 0 
                || evte.clientY - this.config.canvasRect.top <= 0
                || evte.clientX >= this.config.canvasRect.right
                || evte.clientY >= this.config.canvasRect.bottom
            ) {
                return
            }
            this.variablesPool.moveDistX = evte.offsetX - this.mouseState.x
            this.variablesPool.moveDistY = evte.offsetY - this.mouseState.y
            this.mouseState.x = evte.offsetX
            this.mouseState.y = evte.offsetY
            this.mouseState.isMove = true
            /* 绘制模式 */
            if (this.config.state === CANVAS_STATE.DRAWING && this.mouseState.pointTarget) {
                this.mouseState.pointTarget.setShapeParameter(this.mouseState.x, this.mouseState.y)
            }
            /* 选择模式 */
            if (this.config.state === CANVAS_STATE.SELECT) {
                if (this.mouseState.toolTarget) {
                    this.mouseState.toolTarget.setShapeParameter(this.mouseState.x, this.mouseState.y)
                }
                for (let i = this.mouseState.selectedIndexs.length - 1; i >= 0; i--) {
                    const geometry = this.geometries[this.mouseState.selectedIndexs[i]]
                    geometry.moveDist(this.variablesPool.moveDistX, this.variablesPool.moveDistY)
                }
            }
        })
    }

    _bindMouseupEvent() {
        document.addEventListener('mouseup', (evte) => {
            evte.stopPropagation()            
            if (this.mouseState.down) {
                this.mouseState.isMove = false
                this.mouseState.down = false  
                /* 绘制模式 */
                if (this.config.state === CANVAS_STATE.DRAWING && this.mouseState.pointTarget) {
                    /* 将当前图形推入存储队列 */
                    if (this.mouseState.pointTarget.validate()) {
                        this.mouseState.pointTarget.setIndex(this.geometries.length)
                        this.geometries.push(this.mouseState.pointTarget)
                    }
                    this.mouseState.pointTarget = null 
                    /* 重绘离屏画布 */
                    this._clearCanvas(this.offScreen.cacheCanvasCtx)
                    for (let i = 0; i < this.geometries.length; i++) {
                        this.geometries[i].draw(this.offScreen.cacheCanvasCtx)
                    }
                    /* ... */
                    this.config.dirty = false
                    return
                }
                /* 选择模式 */
                if (this.config.state === CANVAS_STATE.SELECT) {
                    if (this.mouseState.toolTarget) {
                        this.mouseState.toolTarget.restoreStatus()
                        this.mouseState.toolTarget = null
                        this._clearCanvas(this.canvasCtx) 
                        /* 读取缓存画布图像并绘制输出 */
                        this._paintWith(this.canvasCtx, this.offScreen.cacheCanvasElement)
                    }
                    this.mouseState.pointTarget = null 
                    /* ... */
                    this.config.dirty = false
                }
            }
        })
    }

    _bindBlurEvent() {
        window.addEventListener('blur', (evte) => {
            this.keyboardState.keys = []
            this.config.dirty = false
        })
    }

    _bindKeydownEvent() {
        document.addEventListener('keydown', (evte) => {
            if (!this.keyboardState.keys.includes(evte.keyCode)) {
                this.keyboardState.keys.push(evte.keyCode)
            }
            /* 删除图形对象 */
            if (evte.keyCode === KEYCODE_DELETE && this.mouseState.selectedIndexs.length) {
                const geometries = []
                for (let i = 0; i < this.geometries.length; i++) {
                    if (!this.mouseState.selectedIndexs.includes(i)) {
                        geometries.push(this.geometries[i])
                    }
                }
                this.geometries = geometries
                this._clearCanvas(this.offScreen.cacheCanvasCtx)
                for (let i = 0; i < this.geometries.length; i++) {
                    this.geometries[i].draw(this.offScreen.cacheCanvasCtx)
                }
                this.config.dirty = true
                this.mouseState.selectedIndexs = []
            }        
        })
    }

    _bindKeyupEvent() {
        document.addEventListener('keyup', (evte) => {
            const opKeyIndex = this.keyboardState.keys.indexOf(evte.keyCode)
            if (opKeyIndex >= 0) {
                this.keyboardState.keys.splice(opKeyIndex, 1)
            }
            if (!this.mouseState.down && !this.keyboardState.keys.length) {
                this.config.dirty = false
            }
        })
    }
}