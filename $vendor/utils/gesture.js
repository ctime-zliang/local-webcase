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
    const DIRECTION_DOWN = 'DOWN'
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
            tapCount: 0,
            /* ... */
            pointers: [],  // 触摸点数组
            touchDownDots: [],  // 触摸点按下时的位置坐标  
            lastTouchDownDots: [],  // 上一次触摸点按下时的位置坐标
            moveDotsRecord: [],  // 移动位置数组, 用于计算是否触发 swipe
            moveDirection: '',  // 拖拽方向
            lastCenter: { x: 0, y: 0 },  // 上一次中心位置
            distance: { x: 0, y: 0 },  // 移动距离
            lastDistance: { x: 0, y: 0 },  // 上一次移动距离
            lastPointerMove: { x: 0, y: 0 },  // 上一次移动位置
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
        this._$profile = createProfile()

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

    Gesture.prototype.destory = function() {
        this.setTouchAction('initial')
        this.unBindEvent()
    }

    Gesture.prototype.setTouchAction = function(value) {
        this.containerElements.forEach((item) => {
            item.style.touchAction = value
        })
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
        const { pointers } = this._$profile
        let idx = -1
        for (let i = 0; i < pointers.length; i++) {
            if (pointers[i].pointerId === evte.pointerId) {
                idx = i
                break
            }
        }
        if (idx >= 0) {
            if (type === POINTER_ITEM_UPDATE) {
                pointers[idx] = evte
            }
            if (type === POINTER_ITEM_DELETE) {
                pointers.splice(idx, 1)
            }
        }
        return idx
    }

    Gesture.prototype.getMoveDirection = function() {
        const _$profile = this._$profile
        if (Math.abs(_$profile.distance.x) > Math.abs(_$profile.distance.y)) {
            if (_$profile.distance.x > 0) {
                return DIRECTION_RIGHT
            }
            return DIRECTION_LEFT
        }
        if (_$profile.distance.y > 0) {
            return DIRECTION_DOWN
        }
        return DIRECTION_UP
    }

    Gesture.prototype.handleSwipe = function(evte) {
        const _$profile = this._$profile
        const MIN_SWIPE_DISTANCE = 20
        let x = 0
        let y = 0
        let swipeDirection = ''
        for (let pointDotItem of _$profile.moveDotsRecord) {
            if (evte.timeStamp - pointDotItem.timeStamp < 175) {
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
                swipeDirection = y > 0 ? DIRECTION_DOWN : DIRECTION_UP
            }
            this.options.onSwipe && this.options.onSwipe.call(
                undefined, 
                evte, 
                { 
                    direction: swipeDirection,
                    distX: x,
                    distY: y
                }, 
                this
            )
        }
    }

    Gesture.prototype.handlePointerdownEvent = function(evte) {
        const _$profile = this._$profile
        /**
         * 屏蔽鼠标中键和右键
         *      左键 - 0
         *      中键 - 1
         *      右键 - 2
         */
        if (evte.pointerType === 'mouse' && evte.button !== 0) {
            return
        }
        _$profile.pointers.push(evte)
        _$profile.isPointerdown = true
        if (_$profile.pointers.length === 1) {
            window.clearTimeout(_$profile.singleTapTimeout);
            evte.target.setPointerCapture(evte.pointerId)
            _$profile.touchDownDots[0] = { x: evte.clientX, y: evte.clientY }
            _$profile.lastTouchDownDots[0] = { x: evte.clientX, y: evte.clientY }
            /* ... */
            const pointer1 = _$profile.pointers[0]
            const touchDownDot1 = _$profile.touchDownDots[0]
            const lastTouchDownDot1 = _$profile.lastTouchDownDots[0] 
            /* ... */
            _$profile.tapCount++
            _$profile.moveDirection = ''
            _$profile.moveDotsRecord.length = 0
            _$profile.distance.x = 0
            _$profile.distance.y = 0
            _$profile.lastDistance.x = 0
            _$profile.lastDistance.y = 0
            _$profile.lastPointerMove.x = pointer1.clientX
            _$profile.lastPointerMove.y = pointer1.clientY
            /* ... */
            if (_$profile.tapCount > 1) {
                if (Math.abs(touchDownDot1.x - lastTouchDownDot1.x) > 30 || Math.abs(touchDownDot1.y - lastTouchDownDot1.y) > 30) {
                    _$profile.tapCount = 1
                }
            }
            if (_$profile.tapCount === 1) {
                _$profile.longTapTimeout = window.setTimeout(() => {
                    _$profile.tapCount = 0
                    this.options.onLongTap && this.options.onLongTap.call(
                        undefined, 
                        evte, 
                        {
                            tapX: touchDownDot1.x,
                            tapY: touchDownDot1.y
                        },
                        this
                    )
                }, 500)
            }
            /* ... */
            _$profile.lastTouchDownDots[0] = { x: _$profile.pointers[0].clientX, y: _$profile.pointers[0].clientY }
        }
        if (_$profile.pointers.length === 2) {            
            window.clearTimeout(_$profile.longTapTimeout)
            _$profile.touchDownDots[1] = { x: evte.clientX, y: evte.clientY }
            _$profile.lastTouchDownDots[1] = { x: evte.clientX, y: evte.clientY }
            /* ... */
            const pointer1 = _$profile.pointers[0]
            const pointer2 = _$profile.pointers[1]
            const touchDownDot1 = _$profile.touchDownDots[0]
            const touchDownDot2 = _$profile.touchDownDots[1]
            const lastTouchDownDot1 = _$profile.lastTouchDownDots[0]
            const lastTouchDownDot2 = _$profile.lastTouchDownDots[1]
            /* ... */
            _$profile.tapCount = 0
            _$profile.lastDistance.x = _$profile.distance.x
            _$profile.lastDistance.y = _$profile.distance.y
            const center = this.getCenter(touchDownDot1, touchDownDot2)
            _$profile.lastCenter.x = center.x
            _$profile.lastCenter.y = center.y
            /* ... */
            _$profile.lastTouchDownDots[0] = { x: _$profile.pointers[0].clientX, y: _$profile.pointers[0].clientY }
            _$profile.lastTouchDownDots[1] = { x: _$profile.pointers[1].clientX, y: _$profile.pointers[1].clientY }
        }
        this.options.onPointerdown && this.options.onPointerdown.call(
            undefined, 
            evte, 
            {
                clientX: evte.clientX,
                clientY: evte.clientY
            },
            this
        )
    }

    Gesture.prototype.handlePointermoveEvent = function(evte) {
        const _$profile = this._$profile
        if (!_$profile.isPointerdown) {
            return
        }
        const idx = this.updatePointers(evte, POINTER_ITEM_UPDATE)
        if (_$profile.pointers.length === 1) {
            /* ... */
            const pointer1 = _$profile.pointers[0]
            const touchDownDot1 = _$profile.touchDownDots[0]
            const lastTouchDownDot1 = _$profile.lastTouchDownDots[0]
            /* ... */
            _$profile.distance.x = pointer1.clientX - touchDownDot1.x + _$profile.lastDistance.x
            _$profile.distance.y = pointer1.clientX - touchDownDot1.y + _$profile.lastDistance.y
            if (Math.abs(_$profile.distance.x) >= 10 || Math.abs(_$profile.distance.y) >= 10) {
                window.clearTimeout(this._$profile.longTapTimeout)
                _$profile.tapCount = 0
                _$profile.moveDirection = this.getMoveDirection()
            }
            _$profile.moveDotsRecord.unshift({
                x: pointer1.clientX,
                y: pointer1.clientY,
                timeStamp: evte.timeStamp
            })
            if (_$profile.moveDotsRecord.length > 20) {
                _$profile.moveDotsRecord.pop()
            }
            const diffX = pointer1.clientX - _$profile.lastPointerMove.x
            const diffY = pointer1.clientY - _$profile.lastPointerMove.y
            const distX = pointer1.clientX - touchDownDot1.x + _$profile.lastDistance.x
            const distY = pointer1.clientY - touchDownDot1.y + _$profile.lastDistance.y
            this.options.onDragMove && this.options.onDragMove.call(
                undefined,
                evte, 
                {
                    direction: _$profile.moveDirection,
                    distX,
                    distY,
                    diffX,
                    diffY,
                    moveX: pointer1.clientX,
                    moveY: pointer1.clientY
                },
                this
            )
            _$profile.lastPointerMove.x = pointer1.clientX
            _$profile.lastPointerMove.y = pointer1.clientY
        }
        if (_$profile.pointers.length === 2) {
            /* ... */
            const pointer1 = _$profile.pointers[0]
            const pointer2 = _$profile.pointers[1]
            const touchDownDot1 = _$profile.touchDownDots[0]
            const touchDownDot2 = _$profile.touchDownDots[1]
            const lastTouchDownDot1 = _$profile.lastTouchDownDots[0]
            const lastTouchDownDot2 = _$profile.lastTouchDownDots[1]
            /* ... */
            const center = this.getCenter(
                { x: pointer1.clientX, y: pointer1.clientY }, 
                { x: pointer2.clientX, y: pointer2.clientY }
            )
            const rotate = this.getAngle(
                { x: pointer1.clientX, y: pointer1.clientY }, 
                { x: pointer2.clientX, y: pointer2.clientY }
            ) - this.getAngle(lastTouchDownDot1, lastTouchDownDot2)
            this.options.onRotate && this.options.onRotate.call(
                undefined, 
                evte, 
                {
                    rotate,
                    centerX: center.x,
                    centerY: center.y,
                    lastCenterX: _$profile.lastCenter.x,
                    lastCenterY: _$profile.lastCenter.y,
                    pointA: { x: pointer1.clientX, y: pointer1.clientY },
                    pointB: { x: pointer2.clientX, y: pointer2.clientY }
                },
                this
            )
            const scale = this.getDistance(
                    { x: pointer1.clientX, y: pointer1.clientY }, 
                    { x: pointer2.clientX, y: pointer2.clientY }
                ) - this.getDistance(lastTouchDownDot1, lastTouchDownDot2)
            this.options.onPinch && this.options.onPinch.call(
                undefined, 
                evte, 
                {
                    scale,
                    centerX: center.x,
                    centerY: center.y,
                    pointA: { x: pointer1.clientX, y: pointer1.clientY },
                    pointB: { x: pointer2.clientX, y: pointer2.clientY }
                },
                this
            )
            _$profile.lastCenter.x = center.x
            _$profile.lastCenter.y = center.y
            /* ... */
            lastTouchDownDot1.x = pointer1.clientX
            lastTouchDownDot1.y = pointer1.clientY
            lastTouchDownDot2.x = pointer2.clientX
            lastTouchDownDot2.y = pointer2.clientY
        }
        this.options.onPointermove && this.options.onPointermove.call(
            undefined, 
            evte, 
            {
                clientX: evte.clientX,
                clientY: evte.clientY
            },
            this
        )
    }

    Gesture.prototype.handlePointerupEvent = function(evte) {
        const _$profile = this._$profile
        if (!_$profile.isPointerdown) {
            return;
        }
        const idx = this.updatePointers(evte, POINTER_ITEM_DELETE)
        if (_$profile.pointers.length === 0) {
            window.clearTimeout(this._$profile.longTapTimeout)
            _$profile.isPointerdown = false
            if (_$profile.tapCount === 0) {
                this.handleSwipe(evte)
            } else {
                this.options.onTap && this.options.onTap.call(
                    undefined, 
                    evte,
                    {
                        tapX: evte.clientX,
                        tapY: evte.clientY
                    },
                    this
                )
                if (_$profile.tapCount === 1) {
                    _$profile.singleTapTimeout = window.setTimeout(() => {
                        _$profile.tapCount = 0
                        this.options.onSingleTap && this.options.onSingleTap.call(
                            undefined, 
                            evte, 
                            {
                                tapX: evte.clientX,
                                tapY: evte.clientY
                            },
                            this
                        )
                    }, 250)
                } else if (_$profile.tapCount >= 2) {
                    _$profile.tapCount = 0
                    this.options.onDoubleTap && this.options.onDoubleTap.call(
                        undefined, 
                        evte, 
                        {
                            tapX: evte.clientX,
                            tapY: evte.clientY
                        },
                        this
                    )
                }
            }
        } else if (_$profile.pointers.length === 1) {
            /* ... */
            const pointer1 = _$profile.pointers[0]
            const touchDownDot1 = _$profile.touchDownDots[0]
            const lastTouchDownDot1 = _$profile.lastTouchDownDots[0]
            /* ... */
            touchDownDot1.x = pointer1.clientX
            touchDownDot1.y = pointer1.clientY
            _$profile.lastPointerMove.x = pointer1.clientX
            _$profile.lastPointerMove.y = pointer1.clientY
        }
        this.options.onPointerup && this.options.onPointerup.call(
            undefined, 
            evte, 
            {
                clientX: evte.clientX,
                clientY: evte.clientY
            },
            this
        )
    }

    Gesture.prototype.handlePointercancelEvent = function(evte) {
        const _$profile = this._$profile
        window.clearTimeout(_$profile.longTapTimeout)
        _$profile.isPointerdown = false
        _$profile.tapCount = 0
        _$profile.pointers.length = 0
        this.options.onPpointercancel && this.options.onPpointercancel.call(
            undefined, 
            evte, 
            {
                clientX: evte.clientX,
                clientY: evte.clientY
            },
            this
        )
    }

    Gesture.prototype.handleWheelEvent = function(evte) {
        const _$profile = this._$profile
        const scale = evte.deltaY > 0 ? this.options.zoomOutWheelRatio : this.options.zoomInWheelRatio
        this.options.onWheel && this.options.onWheel.call(
            undefined, 
            evte, 
            { 
                scale,
            }, 
            this
        )
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