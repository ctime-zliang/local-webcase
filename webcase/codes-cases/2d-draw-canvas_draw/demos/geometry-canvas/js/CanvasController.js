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
            let selectedIndex = -1
            this.mouseState.x = evte.offsetX
            this.mouseState.y = evte.offsetY
            /* 
                -. 依据被点击的坐标位置确定被点击的图形
                -. 高亮该被选中的图形
            */
            for (let i = this.geometries.length - 1; i >= 0; i--) {
                if (this.geometries[i].choose(this.mouseState.x, this.mouseState.y) && selectedIndex <= -1) {
                    selectedIndex = i
                    break
                }
            }
            if (selectedIndex >= 0) {
                this._removeGeometryItem(selectedIndex)
                this.emit(EVENT_NS.DELETE_ONE, { action: EVENT_NS.DELETE_ONE })
            }
            this.mouseState.selectedIndexs = []            
        })
    }

    _bindMousedownEvent() {
        this.canvasElement.addEventListener('mousedown', (evte) => {
            evte.preventDefault()
            window.setTimeout(() => {
                let geometryTarget = null
                if (evte.button !== 0) {
                    return
                }
                this.mouseState.down = true
                this.mouseState.x = evte.offsetX
                this.mouseState.y = evte.offsetY
                /* 绘制模式 */
                if (this.config.state === CANVAS_STATE.DRAWING) {
                    /* 创建几何图形实例 */
                    if (this.geometryConstructor) {
                        geometryTarget = new this.geometryConstructor(this.mouseState.x, this.mouseState.y)
                        geometryTarget.setPaintStyle(this.toolState.paintBrushState)
                        if (geometryTarget.setSmooth) {
                            geometryTarget.setSmooth(this.toolState.smooth)
                        }
                    }
                    this.mouseState.target = geometryTarget
                    if (this.mouseState.selectedIndexs.length) {
                        /* 
                            -. 清空缓存画布
                            -. 取消所有图形高亮
                            -. 重新绘制缓存画布
                        */
                        this._clearCanvas(this.offScreen.cacheCanvasCtx)
                        for (let i = 0; i < this.geometries.length; i++) {
                            this.geometries[i].cancelHighlight()
                            this.geometries[i].draw(this.offScreen.cacheCanvasCtx)
                        }
                        this.mouseState.selectedIndexs = []
                    }
                    if (this.config.state === CANVAS_STATE.DRAWING) {
                        this.emit(EVENT_NS.DRAW_START, { action: EVENT_NS.DRAW_START })
                    }
                    return
                }
                /* 选择模式 */
                if (this.config.state === CANVAS_STATE.SELECT) {            
                    this.mouseState.selectedIndexs = []
                    /* 
                        -. 依据被点击的坐标位置确定被点击的图形
                        -. 高亮该被选中的图形
                    */
                    for (let i = this.geometries.length - 1; i >= 0; i--) {
                        if (this.geometries[i].choose(this.mouseState.x, this.mouseState.y) && !geometryTarget) {
                            geometryTarget = this.geometries[i]
                            geometryTarget.setHighlight()
                            this.mouseState.selectedIndexs.push(i)
                        } else {
                            this.geometries[i].cancelHighlight()
                        }
                    }
                    if (geometryTarget) {
                        const targetOffset = geometryTarget.getOffset(this.mouseState.x, this.mouseState.y)
                        this.mouseState.targetOffsetX = targetOffset.distX
                        this.mouseState.targetOffsetY = targetOffset.distY
                        this.emit(EVENT_NS.SELECT_ONE, { action: EVENT_NS.SELECT_ONE })
                    }
                    this.mouseState.target = geometryTarget
                    /*
                        -. 清空缓存画布
                        -. 将除被选中的图形之外的图形重新绘制到缓存画布 
                    */
                    this._clearCanvas(this.offScreen.cacheCanvasCtx)
                    for (let i = 0; i < this.geometries.length; i++) {
                        if (this.mouseState.selectedIndexs.includes(i)) {
                            continue
                        }
                        this.geometries[i].draw(this.offScreen.cacheCanvasCtx)
                    }  
                    if (!this.mouseState.target) {
                        this.emit(EVENT_NS.CANCEL_SELECT, { action: EVENT_NS.CANCEL_SELECT })
                    }
                    return            
                }
            })
        })
    }

    _bindMousemoveEvent() {
        document.addEventListener('mousemove', (evte) => {
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
        document.addEventListener('mouseup', (evte) => {
            evte.preventDefault()
            window.setTimeout(() => {
                if (this.mouseState.down) {
                    /* 绘制模式 */
                    if (this.config.state === CANVAS_STATE.DRAWING && this.mouseState.target) {
                        if (this.mouseState.target.validate()) {
                            this.mouseState.target.setIndex(this.geometries.length)
                            this.geometries.push(this.mouseState.target)
                        }                    
                    }
                }
                this.mouseState.down = false
                this.mouseState.target = null
                /* 
                    -. 清空缓存画布
                    -. 将所有图形重新绘制到缓存画布
                        在 rAF 的回调中, 会不断地将缓存画布中的数据绘制到输出画布中, 因此此处需要刷新缓存画布
                 */
                this._clearCanvas(this.offScreen.cacheCanvasCtx)
                for (let i = 0; i < this.geometries.length; i++) {
                    this.geometries[i].draw(this.offScreen.cacheCanvasCtx)
                }
                if (this.config.state === CANVAS_STATE.DRAWING) {
                    this.emit(EVENT_NS.DRAW_FINISHED, { action: EVENT_NS.DRAW_FINISHED })
                }
            })            
        })
    }
}