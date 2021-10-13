const utils = {
    /* ... */
}

const EVENT_NS = {
    WINDOW_RESIZE: 'WINDOW_RESIZE'
}

class Events {
    constructor() {
        this.events = {}
    }

    on(name, callback) {
        if (typeof name !== 'string' || !name || typeof callback !== 'function') {
            return
        }
        if (!this.events[name]) {
            this.events[name] = []
        }
        this.events[name].push(callback)
    }

    emit(name) {
        if (!arguments.length || typeof name !== 'string' || !this.events[name]) {
            return
        }
        const params = arguments.splice(1)
        this.events[name].forEach((item, index) => {
            item(params)
        })
    }
}

class Scene {
    constructor(canvasElement) {
        if (!canvasElement || canvasElement.nodeName.toUpperCase() !== 'CANVAS') {
            return
        }
        // this.eventHandler = new Events()
        this.currentGeometryConstructor = null
        this.geometry = []
        this.options = {}
        this.toolState = {}
        this.mouseState = {}
        this.offScreen = {}
        this.canvasElement = canvasElement
        this.canvasCtx = this.canvasElement.getContext('2d')
        this._init()
    }

    _init() {
        this.options.canvasRect = this._setCanvasElementRect()
        this.toolState = this._initToolState()
        this.options.state = this.toolState.canvasState.drawing
        this.mouseState = this._initMouseState()
        this.offScreen = this._createOffScreenCanvas()
        this._bindWindowResizeEvent()
        this._bindRightClickEvent()
        this._bindMousedownEvent()
    }

    _initToolState() {
        const paintBrushState = {
            strokeStyle: '#000000',
            fillStyle: '#ffff00',
            lineWidth: 10
        }
        const canvasState = {
            drawing: 'drawing',
            moving: 'moving'
        }
        return {
            paintBrushState,
            canvasState
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
        const canvasRect = this.options.canvasRect
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
            console.log(this)
        })
    }

    _bindMousedownEvent() {
        this.canvasElement.addEventListener('mousedown', (evte) => {
            evte.preventDefault()
            if (evte.button !== 0) {
                return
            }
            this.mouseState.down = true
            if (this.options.state === this.toolState.canvasState.drawing) {}
        })
    }
}

window.onload = function() {
    const scene = new Scene(document.querySelector('canvas'))
    console.log(scene)
}