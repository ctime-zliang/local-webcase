class Ven$DragElement {
    constructor(element, options = {}) {
        this._element = element
        this._options = options
        this._cache = {}
        this._cache.handleMouseDownEvent = this._bindMouseDownEvent.bind(this)
        this._cache.handleMouseMoveEvent = this._bindMouseMoveEvent.bind(this)
        this._cache.handleMouseUpEvent = this._bindMouseUpEvenet.bind(this)
        this.addDragEvenet()
    }

    addDragEvenet() {
        this._element.addEventListener('mousedown', this._cache.handleMouseDownEvent, false)        
    }

    removeDragEvenet() {
        this._element.removeEventListener('mousedown', this._cache.handleMouseDownEvent)
    }

    _bindMouseDownEvent(evte) {
        if (!this._element) {
            return
        }
        this._cache['distX'] = evte.clientX - evte.target.offsetLeft
        this._cache['distY'] = evte.clientY - evte.target.offsetTop
        this._options.mouseDownCallback && this._options.mouseDownCallback.call(this)
        document.body.addEventListener('mousemove', this._cache.handleMouseMoveEvent, false)
        document.body.addEventListener('mouseup', this._cache.handleMouseUpEvent, false)
    }

    _bindMouseMoveEvent(evte) {
        this._cache['moveX'] = evte.clientX - this._cache['distX']
        this._cache['moveY'] = evte.clientY - this._cache['distY']
        this._element.style.left = `${this._cache['moveX']}px`
        this._element.style.top = `${this._cache['moveY']}px`
        this._options.mouseMoveCallback && this._options.mouseMoveCallback.call(this)
    }

    _bindMouseUpEvenet(evte) {
        document.body.removeEventListener('mousemove', this._cache.handleMouseMoveEvent)
        document.body.removeEventListener('mouseup', this._cache.handleMouseUpEvent)
        this._options.mouseUpCallback && this._options.mouseUpCallback.call(this)
    }
}