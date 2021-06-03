class Ven$DragElement {
    constructor(element, options = {}) {
        this.element = element
        this.options = options
        this._cache = {}

        this._cache.handleMouseDownEvent = this._bindMouseDownEvent.bind(this)
        this._cache.handleMouseMoveEvent = this._bindMouseMoveEvent.bind(this)
        this._cache.handleMouseUpEvent = this._bindMouseUpEvenet.bind(this)
        this.addDragEvenet()
    }

    addDragEvenet() {
        this.element.addEventListener('mousedown', this._cache.handleMouseDownEvent, false)        
    }

    removeDragEvenet() {
        this.element.removeEventListener('mousedown', this._cache.handleMouseDownEvent)
    }

    _bindMouseDownEvent(evte) {
        if (!this.element) {
            return
        }
        this._cache['distX'] = evte.clientX - evte.target.offsetLeft
        this._cache['distY'] = evte.clientY - evte.target.offsetTop
        this.options.mouseDownCallback && this.options.mouseDownCallback.call(this)
        document.body.addEventListener('mousemove', this._cache.handleMouseMoveEvent, false)
        document.body.addEventListener('mouseup', this._cache.handleMouseUpEvent, false)
    }

    _bindMouseMoveEvent(evte) {
        this._cache['moveX'] = evte.clientX - this._cache['distX']
        this._cache['moveY'] = evte.clientY - this._cache['distY']
        this.element.style.left = `${this._cache['moveX']}px`
        this.element.style.top = `${this._cache['moveY']}px`
        this.options.mouseMoveCallback && this.options.mouseMoveCallback.call(this)
    }

    _bindMouseUpEvenet(evte) {
        document.body.removeEventListener('mousemove', this._cache.handleMouseMoveEvent)
        document.body.removeEventListener('mouseup', this._cache.handleMouseUpEvent)
        this.options.mouseUpCallback && this.options.mouseUpCallback.call(this)
    }
}