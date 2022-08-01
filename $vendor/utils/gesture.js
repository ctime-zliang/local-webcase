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

    const DEFAULT_NS = `stname`
    
    function EventBus() {
        this.handlers = {}
    }

    EventBus.prototype.on = function(eventName, callback, spaceName = DEFAULT_NS) {
        const handlers = this.handlers
		const sn = spaceName || DEFAULT_NS
		if (!eventName || typeof eventName !== 'string' || typeof callback !== 'function') {
			return
		}
		if (!handlers[sn]) {
			handlers[sn] = {}
		}
		if (!handlers[sn][eventName] || !handlers[sn][eventName].length) {
			handlers[sn][eventName] = []
		}
		handlers[sn][eventName].push(callback)
    }

    EventBus.prototype.emit = function(eventName, params = null, spaceName = DEFAULT_NS) {
        const handlers = this.handlers
		const sn = spaceName || DEFAULT_NS
		if (!eventName || typeof eventName !== 'string' || !handlers[sn]) {
			return
		}
		const length = (handlers[sn][eventName] || []).length
		for (let i = 0; i < length; i++) {
			handlers[sn][eventName][i](params)
		}
    }

    EventBus.prototype.clearEvent = function(eventName, spaceName = DEFAULT_NS) {
        const handlers = this.handlers
		const sn = spaceName || DEFAULT_NS
		if (!eventName || typeof eventName !== 'string' || !handlers[sn]) {
			return
		}
		delete handlers[sn][eventName]
    }

    EventBus.prototype.clearNameSpace = function(spaceName = DEFAULT_NS) {
        const handlers = this.handlers
		const sn = spaceName || DEFAULT_NS
		if (!handlers[sn]) {
			return
		}
		handlers[sn] = {}
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

    function Gesture(host, selector, options) {
        this.containerElements = []
        if (typeof host === 'string') {
            this.containerElements = Array.from(document.querySelectorAll(host))
        }
        this.options = typeof options !== 'object' ? selector : options
        this.options = this.options || {}
        /* ... */
        this.pointerPostions = []
        this.lastPointerPostions = []

        // this.point1 = { x: 0, y: 0 }  // 第一个触摸点位置
        // this.point2 = { x: 0, y: 0 }  // 第二个触摸点位置
        // this.lastPoint1 = { x: 0, y: 0 }  // 上一次第一个触摸点位置
        // this.lastPoint2 = { x: 0, y: 0 }  // 上一次第二个触摸点位置
        this.distance = { x: 0, y: 0 }  // 移动距离
        this.lastDistance = { x: 0, y: 0 }  // 上一次移动距离
        this.lastPointerMove = { x: 0, y: 0 }  // 上一次移动位置
        this.lastCenter = { x: 0, y: 0 }  // 上一次中心位置
        this.tapCount = 0  // 点击计数器
        this.points = []  // 移动位置数组 长度 20 用于计算是否触发 swipe
        this.pointers = []  // 触摸点数组
        this.moveDirection = ''  // 拖拽方向
        this.isPointerdown = false  // 按下标识
        this.singleTapTimeout = null  // 单击延时器
        this.longTapTimeout = null  // 长按延时器

        this.init()
    }

    Gesture.prototype.init = function() {
        this.handlePointerdownEvent = this.handlePointerdownEvent.bind(this)
        // this.handlePointermoveEvent = this.handlePointermoveEvent.bind(this)
        // this.handlePointerupEvent = this.handlePointerupEvent.bind(this)
        this.handlePointercancelEvent = this.handlePointercancelEvent.bind(this)
        // this.handleWheelEvent = this.handleWheelEvent.bind(this)
        /* ... */
        this.bindEvent()
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

    Gesture.prototype.handlePointerdownEvent = function(evte) {
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
        this.pointerPostions.push({
            x: evte.clientX,
            y: evte.clientY
        })
        const targetElement = evte.target
        targetElement.setPointerCapture(evte.pointerId)
        const newEvte = this.pointers[this.pointers.length - 1]
        const firstEvte = this.pointers[0]
        if (this.pointers.length === 1) {
            window.clearTimeout(this.singleTapTimeout);
            const pointerPostions1 = this.pointerPostions[0]
            const lastPointerPostions1 = this.lastPointerPostions[0]
            this.isPointerdown = true
            this.tapCount++
            this.moveDirection = ''
            this.points.length = 0
            this.distance.x = 0
            this.distance.y = 0
            this.lastDistance.x = 0
            this.lastDistance.y = 0
            this.lastPointerMove.x = newEvte.clientX
            this.lastPointerMove.y = newEvte.clientY
            if (this.tapCount > 1) {
                if (
                    Math.abs(pointerPostions1.x - lastPointerPostions1.x) > 30 
                    || Math.abs(pointerPostions1.y - lastPointerPostions1.y) > 30
                ) {
                    this.tapCount = 1
                }
            }
            if (this.tapCount === 1) {
                this.longTapTimeout = window.setTimeout(() => {
                    this.tapCount = 0
                    this.options.longTap && this.options.longTap.call(targetElement, evte, this)
                }, 500)
            }
        }
        if (this.pointers.length === 2) {            
            window.clearTimeout(this.longTapTimeout)
            this.tapCount = 0
            this.lastDistance.x = this.distance.x
            this.lastDistance.y = this.distance.y
            const center = this.getCenter(this.pointerPostions[0], this.pointerPostions[1])
            this.lastCenter.x = center.x
            this.lastCenter.y = center.y
        }
        this.lastPointerPostions.push({ 
            x: firstEvte.clientX, 
            y: firstEvte.clientY 
        })
        this.options.pointerdown && this.options.pointerdown.call(targetElement, evte, this)
    }

    Gesture.prototype.handlePointercancelEvent = function(evte) {
        window.clearTimeout(this.longTapTimeout)
        this.isPointerdown = false
        this.tapCount = 0
        this.pointers.length = 0
        this.pointerPostions.length = 0
        this.lastPointerPostions.length = 0
        this.options.pointercancel && this.options.pointercancel.call(targetElement, evte, this)
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

    xGesture.run = function(host, selector, options) {
        return new Gesture(host, selector, options)
    }
}());