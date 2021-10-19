const KEYCODE_DELETE = 46
const KEYCODE_CTRL = 17

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
        this._bindKeydownEvent()
        this._bindKeyupEvent()
        this._bindBlurEvent()
    }

    _bindRightClickEvent() {
        this.canvasElement.addEventListener('contextmenu', (evte) => {
            evte.preventDefault()      
        })
    }

    _bindMousedownEvent() {
        this.canvasElement.addEventListener('mousedown', (evte) => {
            evte.stopPropagation()
            this.mouseState.down = true
            this.mouseState.x = evte.offsetX
            this.mouseState.y = evte.offsetY
            window.setTimeout(() => {
                let geometryTarget = null 
                if (this.mouseState.isMove) {
                    console.log(`moving...`)
                    return
                }               
                if (evte.button !== 0) {
                    return
                }                
                /* 绘制模式 */
                if (this.config.state === CANVAS_STATE.DRAWING) {
                    /* 创建几何图形实例 */
                    if (this.geometryConstructor) {
                        geometryTarget = new this.geometryConstructor(this.mouseState.x, this.mouseState.y)
                        geometryTarget.setPaintStyle(this.toolState.paintBrushState)
                        geometryTarget.setAssistSetting({ smoooth: this.toolState.smooth })
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
                    this.config.dirty = true
                    if (this.config.state === CANVAS_STATE.DRAWING) {
                        this.emit(EVENT_NS.DRAW_START, { action: EVENT_NS.DRAW_START })
                    }
                    return
                }
                /* 选择模式 */
                if (this.config.state === CANVAS_STATE.SELECT) {                     
                    if (this.keyboardState.keys.length !== 1 && this.keyboardState.keys[0] !== KEYCODE_CTRL) {
                        this.mouseState.selectedIndexs = []  
                    }                                     
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
                            if (!this.mouseState.selectedIndexs.includes(i)) {
                                this.geometries[i].cancelHighlight()
                            }                            
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
                    for (let i = this.geometries.length - 1; i >= 0; i--) {
                        // if (this.mouseState.selectedIndexs.includes(i)) {
                        //     continue
                        // }
                        if (this.geometries[i] === this.mouseState.target) {
                            continue
                        }
                        this.geometries[i].draw(this.offScreen.cacheCanvasCtx)
                    }  
                    this.config.dirty = true
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
            evte.stopPropagation()
            const moveDistX = evte.offsetX - this.mouseState.x
            const moveDistY = evte.offsetY - this.mouseState.y
            if (!this.mouseState.down) {
                return
            }
            this.mouseState.x = evte.offsetX
            this.mouseState.y = evte.offsetY
            this.mouseState.isMove = true
            /* 绘制模式 */
            if (this.config.state === CANVAS_STATE.DRAWING && this.mouseState.target) {
                this.mouseState.target.setShapeParameter(this.mouseState.x, this.mouseState.y)
            }
            /* 选择模式 */
            if (this.config.state === CANVAS_STATE.SELECT) {
                if (this.mouseState.target) {
                    this.mouseState.target.moveTo(this.mouseState.x - this.mouseState.targetOffsetX, this.mouseState.y - this.mouseState.targetOffsetY)
                }
                // for (let i = this.geometries.length - 1; i >= 0; i--) {
                //     if (this.mouseState.target === this.geometries[i]) {
                //         continue
                //     }
                //     if (this.mouseState.selectedIndexs.includes(i)) {
                //         this.geometries[i].moveDist(moveDistX, moveDistY)
                //     }
                // }
            }
        })
    }

    _bindMouseupEvent() {
        document.addEventListener('mouseup', (evte) => {
            evte.stopPropagation()
            this.mouseState.isMove = false
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
            for (let i = this.geometries.length - 1; i >= 0; i--) {
                this.geometries[i].draw(this.offScreen.cacheCanvasCtx)
            }
            this.config.dirty = false
            if (this.config.state === CANVAS_STATE.DRAWING) {
                this.emit(EVENT_NS.DRAW_FINISHED, { action: EVENT_NS.DRAW_FINISHED })
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
            if (evte.keyCode === KEYCODE_DELETE && this.mouseState.selectedIndexs.length) {
                for (let i = this.geometries.length - 1; i >= 0; i--) {
                    if (this.mouseState.selectedIndexs.includes(i)) {
                        this.geometries.splice(i, 1)
                    }
                }
                this._clearCanvas(this.offScreen.cacheCanvasCtx)
                for (let i = this.geometries.length - 1; i >= 0; i--) {
                    this.geometries[i].draw(this.offScreen.cacheCanvasCtx)
                }
                this.config.dirty = true
                this.emit(EVENT_NS.DELETE_ONE, { action: EVENT_NS.DELETE_ONE })
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
            if (!this.keyboardState.keys.length) {
                this.config.dirty = false
            }            
        })
    }
}