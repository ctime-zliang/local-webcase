const DEFAULT_BRUSH_CONFIG = {
    strokeStyle: '#000000',
    fillStyle: '#ffff00',
    lineWidth: 4
}
const DEFAULT_SMOOTH_CURVE = false
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
        this.tools = {}
        this.toolState = {}
        this.mouseState = {}
        this.keyboardState = {}
        this.offScreen = {}
        this.canvasElement = canvasElement
        this.canvasCtx = this.canvasElement.getContext('2d')
    }

    _initScene() {
        this._bindWindowResizeEvent()
        this.offScreen = this._createOffScreenCanvas()
        this.config.state = CANVAS_STATE.DRAWING
        this.config.canvasRect = this._createCanvasRect()
        this.config.dirty = false
        this.config.reDrawByResizeTimer = null
        this.toolState = this._initToolState()
        this.tools = this._initTools()
        this.mouseState = this._initMouseState()
        this.keyboardState = this._initKeyboardState()
        this._setCanvasElementRect()
        this._continuedRender()
    }

    /**
     * 重新绘制输画布系统
     * @return {undefined}
     */
    rerender() {
        this._rerenderWith(this.offScreen.cacheCanvasCtx)
        this._rerenderWith(this.canvasCtx)        
    }

    /**
     * 获取工具设置
     * @return {object}
     */
    getToolState() {
        return JSON.parse(JSON.stringify(this.toolState))
    }

    /**
     * 设置工具
     * @param {object} paintBrushState 笔刷设置
     * @return {object}
     */
     setToolState(toolState) {
        this.toolState = JSON.parse(JSON.stringify(toolState))
    }

    /**
     * 设置当前需要绘制的图形
     * @param {constructor} geometryConstructor 图形(类)
     * @return {undefined}
     */
    setGeometryConstructor(geometryConstructor) {
        this.geometryConstructor = geometryConstructor
    }

    /**
     * 设置画布模式为绘制模式
     * @return {undefined}
     */
    toggleStateToDrawing() {
        this.config.state = CANVAS_STATE.DRAWING
    }

    /**
     * 设置画布模式为选择模式
     * @return {undefined}
     */
    toggleStateToSelect() {
        this.config.state = CANVAS_STATE.SELECT
    }

    /**
     * 清除全部图形
     * @return {undefined}
     */
    clearAllGeometries() {
        this.geometries = []
    }

    /**
     * 预设图形
     * @param {array<geometryConstructor>} geometries 图形(类)列表
     * @return {undefined}
     */
    pushGeometries(geometries) {
        geometries.forEach(item => {
            this.geometries.push(item)
        })
    }

    _setCanvasElementRect(rect = {}) {
        const canvasRect = { ...this.config.canvasRect, ...rect }
        const offScreen = this.offScreen
        this.canvasElement.tabIndex = 0
        this.canvasElement.width = canvasRect.width
        this.canvasElement.height = canvasRect.height
        offScreen.cacheCanvasElement.width = canvasRect.width
        offScreen.cacheCanvasElement.height = canvasRect.height
    }

    _initToolState() {
        const paintBrushState = { ...DEFAULT_BRUSH_CONFIG }
        return {
            paintBrushState,
            smooth: DEFAULT_SMOOTH_CURVE
        }
    }

    _initTools() {
        const boxSelector = new BoxSelectTool(0, 0, 0, 0)
        return {
            boxSelector
        }
    }

    _initMouseState() {
        return {
            x: -1,
            y: -1,
            targetOffsetX: 0,
            targetOffsetY: 0,
            selectedIndexs: [],
            down: false,
            pointTarget: null,
            toolTarget: null,
            isMove: false
        }
    }

    _initKeyboardState() {
        return {
            keys: []
        }
    }

    _createCanvasRect() {
        const domRect = this.canvasElement.getBoundingClientRect()
        return domRect.toJSON()
    }

    _createOffScreenCanvas() {
        const offScreen = {
            cacheCanvasElement: document.createElement('canvas'),
            outCanvasFrontElement: document.createElement('canvas')
        }
        offScreen.cacheCanvasCtx = offScreen.cacheCanvasElement.getContext('2d')
        /*
            测试 
         */
        document.getElementById(`t_c_1`).appendChild(offScreen.cacheCanvasElement)
        return offScreen
    }

    _continuedRender() {
        window.requestAnimationFrame(() => { 
            if (!this.config.dirty) {
                this._continuedRender()
                return
            }
            this._clearCanvas(this.canvasCtx) 
            /* 读取缓存画布图像并绘制输出 */
            this._paintWith(this.canvasCtx, this.offScreen.cacheCanvasElement)
            if (this.mouseState.toolTarget) {
                this.mouseState.toolTarget.draw(this.canvasCtx)
            }
            if (this.mouseState.pointTarget) {
                this.mouseState.pointTarget.draw(this.canvasCtx)
            }
            for (let i = this.mouseState.selectedIndexs.length - 1; i >= 0; i--) {
                const geometry = this.geometries[this.mouseState.selectedIndexs[i]]
                // if (geometry === this.mouseState.pointTarget) {
                //     continue
                // }
                geometry.draw(this.canvasCtx)
            }
            this._continuedRender()
        })
    }

    _clearCanvas(ctx) {
        ctx.clearRect(0, 0, this.config.canvasRect.width, this.config.canvasRect.height)
    }

    _paintWith(ctx, sourceCanvas, x = 0, y = 0) {
        ctx.drawImage(sourceCanvas, x, y, this.config.canvasRect.width, this.config.canvasRect.height)
    }

    _rerenderWith(ctx, geometries) {
        const _geometries = geometries || this.geometries
        this._clearCanvas(ctx)
        for (let i = 0; i < _geometries.length; i++) {
            _geometries[i].draw(ctx)
        }
    }

    _findClickedTarget(x, y) {
        let geometryTarget = null
        let geometryTargetIndex = -1
        for (let i = this.geometries.length - 1; i >= 0; i--) {
            if (this.geometries[i].choose(x, y) && !geometryTarget) {
                geometryTarget = this.geometries[i]
                geometryTargetIndex = i
                break
            }
        }
        return {
            geometryTarget,
            geometryTargetIndex
        }
    }

    _bindWindowResizeEvent() {
        window.addEventListener('resize', (evte) => {
            window.clearTimeout(this.config.reDrawByResizeTimer)          
            this.config.reDrawByResizeTimer = window.setTimeout(() => {
                this.config.canvasRect = this._createCanvasRect()
                this._setCanvasElementRect()
                /* 重绘输出画布 */
                this._clearCanvas(this.canvasCtx)
                for (let i = this.geometries.length - 1; i >= 0; i--) {
                    this.geometries[i].draw(this.canvasCtx)
                }
            }, 300)
        })
    }
}