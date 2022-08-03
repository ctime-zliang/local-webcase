;(function() {
    'use strict'
    
    /* define xGesture */
    const xGesture = {
        /* xGesture version */
        version: '1.0.0'
    }
    
    /* export xGesture */
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = xGesture
    } else if (typeof define === 'function' && define.amd) {
        define( function(){ return xGesture } )
    } else {
        (function(){ return this || (0, eval)('this') }()).xGesture = xGesture
    }

    /****************************** ******************************/
    /****************************** ******************************/
    /****************************** ******************************/
    /****************************** ******************************/

    function bindEvent(
        host, 
        eventName, 
        selector = null, 
        callback = null, 
        capture = false
    ) {
        let hostElement = host
        if (typeof host === 'string') {
            hostElement = document.querySelector(host)
        }
        if (!hostElement || !eventName || typeof eventName !== 'string' || typeof arguments[2] == 'undefined') {
            return
        }
        let _capture = !!capture
        let _selector = selector
        let _callback = callback
        if (typeof selector === 'function') {
            _callback = selector
            _capture = !!callback
            _selector = null
        }
        hostElement.addEventListener(eventName, function(e) {
            if (!_selector) {
                _callback && _callback.call(this, e)
                return
            }
            const targetCapture = bindEvent__captureTargetElement(_selector, e.target, hostElement)
            if (targetCapture) {
                _callback && _callback.call(targetCapture, e)
            }
        }, _capture)
    }
    function bindEvent__captureTargetElement(selector, startChildElement, endParentElemet) {
        try {
            const targetElementsArray = Array.from(endParentElemet.querySelectorAll(selector))
            if (!targetElementsArray.length) {
                return null
            }
            let startFindElement = startChildElement
            while (startFindElement) {
                if (startFindElement === endParentElemet.parentElement) {
                    return null
                }
                if (targetElementsArray.includes(startFindElement)) {
                    return startFindElement
                }
                startFindElement = startFindElement.parentElement
            }
            return startFindElement
        } catch (e) {
            console.warn(`[ven$bindEvent]: Error finding Element element.`)
            console.warn(e)
            return null
        }
    }

    /****************************** ******************************/
    /****************************** ******************************/
    /****************************** ******************************/
    /****************************** ******************************/

    const DIRECTION_UP = 'UP'
    const DIRECTION_BOTTOM = 'BOTTOM'
    const DIRECTION_LEFT = 'LEFT'
    const DIRECTION_RIGHT = 'RIGHT'

    const POINTER_ITEM_UPDATE = 'POINTER_ITEM_UPDATE'
    const POINTER_ITEM_DELETE = 'POINTER_ITEM_DELETE'

    const DEFAULT_GUEST_OPTIONS = {
        zoomInWheelRatio: 1.1,  // 放大倍率
        zoomOutWheelRatio: 1 / 1.1  // 缩小倍率
    }

    function createProfile() {
        return {
            singleTapTimeout: null,
            longTapTimeout: null,
            isPointerdown: false,
            tapCount: 0
        }
    }
    function Gesture(host, selector, options) {
        this.containerElements = []
        if (typeof host === 'string') {
            this.containerElements = Array.from(document.querySelectorAll(host))
        }
        this.options = typeof options !== 'object' ? selector : options
        this.options = this.options || {}
        this.options = Object.assign({}, DEFAULT_GUEST_OPTIONS, this.options)
        /* ... */
        this.touchDownDots = []  // 触摸点按下时的位置坐标
        this.lastTouchDownDots = []  // 上一次触摸点按下时的位置坐标
        this.pointDots = []  // 移动位置数组 长度 20 用于计算是否触发 swipe
        this.pointers = []  // 触摸点数组

        this.distance = { x: 0, y: 0 }  // 移动距离
        this.lastDistance = { x: 0, y: 0 }  // 上一次移动距离
        this.lastPointerMove = { x: 0, y: 0 }  // 上一次移动位置
        this.lastCenter = { x: 0, y: 0 }  // 上一次中心位置
        this.moveDirection = ''  // 拖拽方向

        this._profile = createProfile()

        this.init()
    }

    Gesture.prototype.init = function() {
        this.handlePointerdownEvent = this.handlePointerdownEvent.bind(this)
        this.handlePointermoveEvent = this.handlePointermoveEvent.bind(this)
        this.handlePointerupEvent = this.handlePointerupEvent.bind(this)
        this.handlePointercancelEvent = this.handlePointercancelEvent.bind(this)
        this.handleWheelEvent = this.handleWheelEvent.bind(this)
        /* ... */
        this.setTouchAction('none')
        this.bindEvent()
    }

    Gesture.prototype.setTouchAction = function(value) {
        this.containerElements.forEach((item) => {
            item.style.touchAction = value
        })
    }

    Gesture.prototype.destory = function() {
        this.setTouchAction('initial')
        this.unBindEvent()
    }

    Gesture.prototype.getCenter = function(pointA, pointB) {
        return { x: (pointA.x + pointB.x) / 2, y: (pointA.y + pointB.y) / 2 }
    }

    Gesture.prototype.getDistance = function(pointA, pointB) {
        return Math.hypot(pointA.x - pointB.x, pointA.y - pointB.y)
    }

    Gesture.prototype.getAngle = function(pointA, pointB) {
        return Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x) * 180 / Math.PI
    }

    Gesture.prototype.updatePointers = function(evte, type) {
        let idx = -1
        let targetPointer = null
        for (let i = 0; i < this.pointers.length; i++) {
            if (this.pointers[i].pointerId === evte.pointerId) {
                idx = i
                targetPointer = this.pointers[i]
                break
            }
        }
        if (targetPointer) {
            if (type === POINTER_ITEM_UPDATE) {
                this.pointers[idx] = evte
                return
            }
            if (type === POINTER_ITEM_DELETE) {
                this.pointers.splice(idx, 1)
                return
            }
        }
        return idx
    }

    Gesture.prototype.getMoveDirection = function() {
        if (Math.abs(this.distance.x) > Math.abs(this.distance.y)) {
            if (this.distance.x > 0) {
                return DIRECTION_RIGHT
            }
            return DIRECTION_LEFT
        }
        if (this.distance.y > 0) {
            return DIRECTION_BOTTOM
        }
        return DIRECTION_UP
    }

    Gesture.prototype.handleSwipe = function(evte) {
        const MIN_SWIPE_DISTANCE = 20
        let x = 0
        let y = 0
        let swipeDirection = ''
        for (let pointDotItem of this.pointDots) {
            if (evte.timeStamp - pointDotItem.timeStamp < 200) {
                x = evte.clientX - pointDotItem.x
                y = evte.clientY - pointDotItem.y
                continue
            }
            break
        }
        if (Math.abs(x) > MIN_SWIPE_DISTANCE || Math.abs(y) > MIN_SWIPE_DISTANCE) {
            if (Math.abs(x) > Math.abs(y)) {
                swipeDirection = x > 0 ? DIRECTION_RIGHT : DIRECTION_LEFT
            } else {
                swipeDirection = y > 0 ? DIRECTION_UP : DIRECTION_BOTTOM
            }
            evte._swipeDirection = swipeDirection
            this.options.onSwipe && this.options.onSwipe.call(evte.target, evte, this)
        }
    }

    Gesture.prototype.handlePointerdownEvent = function(evte) {
        const targetElement = evte.target
        /**
         * 屏蔽鼠标中键和右键
         *      左键 - 0
         *      中键 - 1
         *      右键 - 2
         */
        if (evte.pointerType === 'mouse' && evte.button !== 0) {
            return
        }
        this.pointers.push(evte)
        this._profile.isPointerdown = true
        if (this.pointers.length === 1) {
            window.clearTimeout(this._profile.singleTapTimeout);
            targetElement.setPointerCapture(evte.pointerId)
            this.touchDownDots[0] = { x: evte.clientX, y: evte.clientY }
            this.lastTouchDownDots[0] = { x: evte.clientX, y: evte.clientY }
            const touchDownDot1 = this.touchDownDots[0]
            const lastTouchDownDot1 = this.lastTouchDownDots[0]
            const pointer1 = this.pointers[0]
            this._profile.tapCount++
            this.moveDirection = ''
            this.pointDots.length = 0
            this.distance.x = 0
            this.distance.y = 0
            this.lastDistance.x = 0
            this.lastDistance.y = 0
            this.lastPointerMove.x = pointer1.clientX
            this.lastPointerMove.y = pointer1.clientY
            if (this._profile.tapCount > 1) {
                if (Math.abs(touchDownDot1.x - lastTouchDownDot1.x) > 30 || Math.abs(touchDownDot1.y - lastTouchDownDot1.y) > 30) {
                    this._profile.tapCount = 1
                }
            }
            if (this._profile.tapCount === 1) {
                this._profile.longTapTimeout = window.setTimeout(() => {
                    this._profile.tapCount = 0
                    this.options.onLongTap && this.options.onLongTap.call(targetElement, evte, this)
                }, 500)
            }
        }
        if (this.pointers.length === 2) {            
            window.clearTimeout(this._profile.longTapTimeout)
            this.touchDownDots[1] = { x: evte.clientX, y: evte.clientY }
            this.lastTouchDownDots[1] = { x: evte.clientX, y: evte.clientY }
            this._profile.tapCount = 0
            this.lastDistance.x = this.distance.x
            this.lastDistance.y = this.distance.y
            const center = this.getCenter(this.touchDownDots[0], this.touchDownDots[1])
            this.lastCenter.x = center.x
            this.lastCenter.y = center.y
        }
        this.lastTouchDownDots[0] = { x: this.pointers[0].clientX, y: this.pointers[0].clientY }
        this.options.onPointerdown && this.options.onPointerdown.call(targetElement, evte, this)
    }

    Gesture.prototype.handlePointermoveEvent = function(evte) {
        const targetElement = evte.target
        if (!this._profile.isPointerdown) {
            return
        }
        const idx = this.updatePointers(evte, POINTER_ITEM_UPDATE)
        if (this.pointers.length === 1) {
            const pointer1 = this.pointers[0]
            const touchDownDot1 = this.touchDownDots[0]
            this.distance.x = pointer1.clientX - touchDownDot1.x + this.lastDistance.x
            this.distance.y = pointer1.clientX - touchDownDot1.y + this.lastDistance.y
            if (Math.abs(this.distance.x) >= 10 || Math.abs(this.distance.y) >= 10) {
                window.clearTimeout(this._profile.longTapTimeout)
                this._profile.tapCount = 0
                this.moveDirection = this.getMoveDirection()
            }
            this.pointDots.unshift({
                x: pointer1.clientX,
                y: pointer1.clientY,
                timeStamp: evte.timeStamp
            })
            if (this.pointDots.length >= 20) {
                this.pointDots.pop()
            }
            evte._moveDirection = this.moveDirection
            evte._diffX = pointer1.clientX - this.lastPointerMove.x
            evte._diffY = pointer1.clientY - this.lastPointerMove.y
            evte._distX = pointer1.clientX - touchDownDot1.x + this.lastDistance.x
            evte._distY = pointer1.clientY - touchDownDot1.y + this.lastDistance.y
            this.options.onDragMove && this.options.onDragMove.call(evte.target, evte, this)
            this.lastPointerMove.x = pointer1.clientX
            this.lastPointerMove.y = pointer1.clientY
        }
        if (this.pointers.length === 2) {
            const pointer1 = this.pointers[0]
            const pointer2 = this.pointers[1]
            const touchDownDot1 = this.touchDownDots[0]
            const touchDownDot2 = this.touchDownDots[1]
            const lastTouchDownDot1 = this.lastTouchDownDots[0]
            const lastTouchDownDot2 = this.lastTouchDownDots[1]
            const center = this.getCenter(
                {x: pointer1.clientX, y: pointer1.clientY}, 
                {x: pointer2.clientX, y: pointer2.clientY}
            )
            evte._centerX = center.x
            evte._centerY = center.y
            evte._lastCenterX = this.lastCenter.x
            evte._lastCenterY = this.lastCenter.y
            evte._rotate 
                = this.getAngle({ x: pointer1.clientX, y: pointer1.clientY }, { x: pointer2.clientX, y: pointer2.clientY }) 
                - this.getAngle(lastTouchDownDot1, lastTouchDownDot2)
            this.options.onRotate && this.options.onRotate.call(evte.target, evte, this)
            evte._scale
                = this.getDistance({ x: pointer1.clientX, y: pointer1.clientY }, { x: pointer2.clientX, y: pointer2.clientY }) 
                - this.getDistance(lastTouchDownDot1, lastTouchDownDot2)
            this.options.onPinch && this.options.onPinch.call(evte.target, evte, this)
            lastTouchDownDot1.x = pointer1.clientX
            lastTouchDownDot1.y = pointer1.clientY
            lastTouchDownDot2.x = pointer2.clientX
            lastTouchDownDot2.y = pointer2.clientY
            this.lastCenter.x = center.x
            this.lastCenter.y = center.y
        }
        this.options.onPointermove && this.options.onPointermove.call(targetElement, evte, this)
    }

    Gesture.prototype.handlePointerupEvent = function(evte) {
        const targetElement = evte.target
        if (!this._profile.isPointerdown) {
            return;
        }
        const idx = this.updatePointers(evte, POINTER_ITEM_DELETE)
        if (this.pointers.length === 0) {
            window.clearTimeout(this._profile.longTapTimeout)
            this._profile.isPointerdown = false
            if (this._profile.tapCount === 0) {
                this.handleSwipe(evte)
            } else {
                this.options.onTap && this.options.onTap.call(targetElement, evte, this)
                if (this._profile.tapCount === 1) {
                    this._profile.singleTapTimeout = window.setTimeout(() => {
                        this._profile.tapCount = 0
                        this.options.onSingleTap && this.options.onSingleTap.call(targetElement, evte, this)
                    }, 250)
                } else if (this._profile.tapCount >= 2) {
                    this._profile.tapCount = 0
                    this.options.onDoubleTap && this.options.onDoubleTap.call(targetElement, evte, this)
                }
            }
        } else if (this.pointers.length === 1) {
            const pointer1 = this.pointers[0]
            const touchDownDot1 = this.touchDownDots[0]
            touchDownDot1.x = pointer1.clientX
            touchDownDot1.y = pointer1.clientY
            this.lastPointerMove.x = pointer1.clientX
            this.lastPointerMove.y = pointer1.clientY
        }
        this.options.onPointerup && this.options.onPointerup.call(targetElement, evte, this)
    }

    Gesture.prototype.handlePointercancelEvent = function(evte) {
        window.clearTimeout(this._profile.longTapTimeout)
        this._profile.isPointerdown = false
        this._profile.tapCount = 0
        this.pointers.length = 0
        this.options.onPpointercancel && this.options.onPpointercancel.call(targetElement, evte, this)
    }

    Gesture.prototype.handleWheelEvent = function(evte) {
        evte._scale = evte.deltaY > 0 ? this.options.zoomOutWheelRatio : this.options.zoomInWheelRatio
        this.options.onWheel && this.options.onWheel.call(evte.target, evte, { scale: evte._scale }, this)
    }

    Gesture.prototype.bindEvent = function() {
        this.containerElements.forEach((item) => {
            item.addEventListener('pointerdown', this.handlePointerdownEvent)
            item.addEventListener('pointermove', this.handlePointermoveEvent)
            item.addEventListener('pointerup', this.handlePointerupEvent)
            item.addEventListener('pointercancel', this.handlePointercancelEvent)
            item.addEventListener('wheel', this.handleWheelEvent)
        })
    }

    Gesture.prototype.unBindEvent = function() {
        this.containerElements.forEach((item) => {
            item.removeEventListener('pointerdown', this.handlePointerdownEvent)
            item.removeEventListener('pointermove', this.handlePointermoveEvent)
            item.removeEventListener('pointerup', this.handlePointerupEvent)
            item.removeEventListener('pointercancel', this.handlePointercancelEvent)
            item.removeEventListener('wheel', this.handleWheelEvent)
        })
    }

    /****************************** ******************************/
    /****************************** ******************************/
    /****************************** ******************************/
    /****************************** ******************************/

    xGesture.run = function(host, selector, options) {
        const guestInstance = new Gesture(host, selector, options)
        return guestInstance
    }
}());