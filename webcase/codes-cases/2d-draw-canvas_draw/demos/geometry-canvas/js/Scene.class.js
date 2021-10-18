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
        this._initScene()
    }

    _initScene() {
        this.offScreen = this._createOffScreenCanvas()
        this.config.state = CANVAS_STATE.DRAWING
        this.config.canvasRect = this._createCanvasRect()
        this.config.dirty = false
        this.toolState = this._initToolState()
        this.mouseState = this._initMouseState()
        this._setCanvasElementRect()
        /* 启动持续监测渲染 */
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
     * 设置当前需要绘制的几何图形
     * @param {constructor} geometryConstructor 几何图形(类)
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
     * 预设几何图形
     * @param {array<geometryConstructor>} geometries 几何图形(类)列表
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

    _initMouseState() {
        return {
            x: -1,
            y: -1,
            targetOffsetX: 0,
            targetOffsetY: 0,
            selectedIndexs: [],
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
        /*
            测试 
         */
        // document.getElementById(`t_c_1`).appendChild(offScreen.cacheCanvasElement)
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
            if (this.mouseState.target) {
                this.mouseState.target.draw(this.canvasCtx)
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
}