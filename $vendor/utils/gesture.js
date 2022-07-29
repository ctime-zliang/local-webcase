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
			await handlers[sn][eventName][i](params)
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
        this.options = arguments.length <= 2 ? selector : options
        this.options = this.options || {}
        /* ... */
        this.points = []
        this.lastPoints = []

        // this.point1 = { x: 0, y: 0 }  // 第一个触摸点位置
        // this.point2 = { x: 0, y: 0 }  // 第二个触摸点位置
        // this.lastPoint1 = { x: 0, y: 0 }  // 上一次第一个触摸点位置
        // this.lastPoint2 = { x: 0, y: 0 }  // 上一次第二个触摸点位置
        this.distance = { x: 0, y: 0 }  // 移动距离
        this.lastDistance = { x: 0, y: 0 }  // 上一次移动距离
        this.lastPointermove = { x: 0, y: 0 }  // 上一次移动位置
        this.lastCenter = { x: 0, y: 0 }  // 上一次中心位置
        this.tapCount = 0  // 点击计数器
        this.points = []  // 移动位置数组 长度20 用于计算是否触发swipe
        this.pointers = []  // 触摸点数组
        this.dragDirection = ''  // 拖拽方向
        this.isPointerdown = false  // 按下标识
        this.singleTapTimeout = null  // 单击延时器
        this.longTapTimeout = null  // 长按延时器
    }

    Gesture.prototype.init = function() {
        
    }
}());