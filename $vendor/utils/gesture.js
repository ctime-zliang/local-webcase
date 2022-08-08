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

    const DIRECTION_UP = 'UP'
    const DIRECTION_DOWN = 'DOWN'
    const DIRECTION_LEFT = 'LEFT'
    const DIRECTION_RIGHT = 'RIGHT'

    const POINTER_ITEM_UPDATE = 'POINTER_ITEM_UPDATE'
    const POINTER_ITEM_DELETE = 'POINTER_ITEM_DELETE'

    const DEFAULT_GUEST_OPTIONS = {
        /**
         * wheel 放大倍率
         */
        zoomInWheelRatio: 1.1,
        /**
         * wheel 缩小倍率
         */
        zoomOutWheelRatio: 1 / 1.1,
        /**
         * 在长按时是否屏蔽默认行为
         */
        isPreventDefaultInLongDown: false,
        /**
         * 在 wheel 触发时是否屏蔽默认行为
         */
        isPreventDefaultInWheel: true,
        /**
         * onLongTap 触发的延迟时间设置
         */
        delayOfLongTapDispatch: 500
    }

    function createProfile() {
        return {
            singleTapTimeout: null,
            longTapTimeout: null,
            isPointerdown: false,
            tapCount: 0,
            /* ... */
            /**
             * 指针数组
             *      指针事件存储队列
             *      会在指针移动过程中更新指定序列的指针事件对象
             */
            pointers: [],
            /**
             * 指针按下时记录的坐标列表
             *      增量记录每一次 pointer-down 触发时时的指针采样坐标
             *      在 pointer-move 触发时将实时更新列表内指定 pointerId 对应的坐标值
             *      在 pointer-up 触发时将删除对应的坐标项
             */
            dotsRecordInPointerdown: [],
            lastDotsRecordInPointerdown: [],
            /**
             * 单指情形下
             *      增量记录每一次 pointer-move 触发时的指针采样坐标
             *      达到阈值时将触发 swipe 封装手势回调
             */
            dotsRecordInPointermove: [],
            /**
             * 单指情形下
             *      单次记录 pointer-down/pointer-move/pointer-up 触发时的指针采样坐标
             *      在每一次 pointer-move 触发时, 与之前记录的指针坐标做对比计算, 即可计算出指针移动的距离和方向
             */
            pointerPositionCache: { x: 0, y: 0 },
            /**
             * 单指情形下
             *      pointer 移动方位
             *      在任意时刻, 指针坐标相对于 pointer-down 按下时的坐标的方位
             */
            movePositionRange: '',
            /**
             * 单指情形下
             *      pointer 移动方向
             */
             moveDirection: '',
            /**
             * 多指情形下
             *      单次记录 pointer-down/pointer-move 触发时多指的几何中心坐标
             *      在 pointer-up 触发时, 如果当前 pointer 个数不足 2, 直接重置该标记值
             */
            centerPositionCacheOfMultiPointers: { x: 0, y: 0 },
            /**
             * 单指情形下
             *      当前指针的采样坐标与指针按下时记录的坐标的位置偏移量
             */
            offsetRectAtPointerdown: { x: 0, y: 0 },
            lastOffsetRectAtPointerdown: { x: 0, y: 0 },
        }
    }
    function Gesture(host, options) {
        this.containerElements = []
        if (typeof host === 'string') {
            this.containerElements = Array.from(document.querySelectorAll(host))
        } else {
            this.containerElements = Array.from(typeof host.length !== 'undefined' ? host : [host])
        }
        this.options = Object.assign({}, DEFAULT_GUEST_OPTIONS, options)
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
        this.handleContextmenuEvent = this.handleContextmenuEvent.bind(this)
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

    Gesture.prototype.getMovePositionRange = function() {
        const _$profile = this._$profile
        if (Math.abs(_$profile.offsetRectAtPointerdown.x) > Math.abs(_$profile.offsetRectAtPointerdown.y)) {
            if (_$profile.offsetRectAtPointerdown.x > 0) {
                return DIRECTION_RIGHT
            }
            return DIRECTION_LEFT
        }
        if (_$profile.offsetRectAtPointerdown.y > 0) {
            return DIRECTION_DOWN
        }
        return DIRECTION_UP
    }

    Gesture.prototype.getMoveDirection = function() {
        const _$profile = this._$profile
        const pointer1 = _$profile.pointers[0]
        const speedX = pointer1.clientX - _$profile.pointerPositionCache.x
        const speedY = pointer1.clientY - _$profile.pointerPositionCache.y
        if (Math.abs(speedX) > Math.abs(speedY)) {
            if (speedX > 0) {
                return DIRECTION_RIGHT
            }
            return DIRECTION_LEFT
        }
        if (speedY > 0) {
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
        for (let pointDotItem of _$profile.dotsRecordInPointermove) {
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
                    distY: y,
                    releaseX: evte.clientX,
                    releaseY: evte.clientY,
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
            _$profile.dotsRecordInPointerdown[0] = { x: evte.clientX, y: evte.clientY }
            _$profile.lastDotsRecordInPointerdown[0] = { x: evte.clientX, y: evte.clientY }
            /* ... */
            const pointer1 = _$profile.pointers[0]
            const dotRecordInPointerdown1 = _$profile.dotsRecordInPointerdown[0]
            const lastDotRecordInPointerdown1 = _$profile.lastDotsRecordInPointerdown[0] 
            /* ... */
            _$profile.tapCount++
            _$profile.movePositionRange = ''
            _$profile.moveDirection = ''
            /* ... */
            _$profile.dotsRecordInPointermove.length = 0
            /* ... */
            _$profile.offsetRectAtPointerdown.x = 0
            _$profile.offsetRectAtPointerdown.y = 0
            _$profile.lastOffsetRectAtPointerdown.x = 0
            _$profile.lastOffsetRectAtPointerdown.y = 0
            /* ... */
            _$profile.pointerPositionCache.x = pointer1.clientX
            _$profile.pointerPositionCache.y = pointer1.clientY
            /* ... */
            if (_$profile.tapCount > 1) {
                if (
                    Math.abs(dotRecordInPointerdown1.x - lastDotRecordInPointerdown1.x) > 30 
                    || Math.abs(dotRecordInPointerdown1.y - lastDotRecordInPointerdown1.y) > 30
                ) {
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
                            tapX: dotRecordInPointerdown1.x,
                            tapY: dotRecordInPointerdown1.y
                        },
                        this
                    )
                }, this.options.delayOfLongTapDispatch)
            }
            /* ... */
            _$profile.lastDotsRecordInPointerdown[0] = { x: _$profile.pointers[0].clientX, y: _$profile.pointers[0].clientY }
        }
        if (_$profile.pointers.length === 2) {            
            window.clearTimeout(_$profile.longTapTimeout)
            _$profile.dotsRecordInPointerdown[1] = { x: evte.clientX, y: evte.clientY }
            _$profile.lastDotsRecordInPointerdown[1] = { x: evte.clientX, y: evte.clientY }
            /* ... */
            const pointer1 = _$profile.pointers[0]
            const pointer2 = _$profile.pointers[1]
            const dotRecordInPointerdown1 = _$profile.dotsRecordInPointerdown[0]
            const dotRecordInPointerdown2 = _$profile.dotsRecordInPointerdown[1]
            const lastDotRecordInPointerdown1 = _$profile.lastDotsRecordInPointerdown[0]
            const lastDotRecordInPointerdown2 = _$profile.lastDotsRecordInPointerdown[1]
            /* ... */
            _$profile.tapCount = 0
            _$profile.lastOffsetRectAtPointerdown.x = _$profile.offsetRectAtPointerdown.x
            _$profile.lastOffsetRectAtPointerdown.y = _$profile.offsetRectAtPointerdown.y
            /* ... */
            const center = this.getCenter(dotRecordInPointerdown1, dotRecordInPointerdown2)
            _$profile.centerPositionCacheOfMultiPointers.x = center.x
            _$profile.centerPositionCacheOfMultiPointers.y = center.y
            /* ... */
            _$profile.lastDotsRecordInPointerdown[0] = { x: _$profile.pointers[0].clientX, y: _$profile.pointers[0].clientY }
            _$profile.lastDotsRecordInPointerdown[1] = { x: _$profile.pointers[1].clientX, y: _$profile.pointers[1].clientY }
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
            const dotRecordInPointerdown1 = _$profile.dotsRecordInPointerdown[0]
            const lastDotRecordInPointerdown1 = _$profile.lastDotsRecordInPointerdown[0]
            /* ... */
            _$profile.offsetRectAtPointerdown.x = pointer1.clientX - dotRecordInPointerdown1.x + _$profile.lastOffsetRectAtPointerdown.x
            _$profile.offsetRectAtPointerdown.y = pointer1.clientY - dotRecordInPointerdown1.y + _$profile.lastOffsetRectAtPointerdown.y
            /* ... */
            _$profile.dotsRecordInPointermove.unshift({
                x: pointer1.clientX,
                y: pointer1.clientY,
                timeStamp: evte.timeStamp
            })
            if (_$profile.dotsRecordInPointermove.length > 20) {
                _$profile.dotsRecordInPointermove.pop()
            }
            if (Math.abs(_$profile.offsetRectAtPointerdown.x) >= 3 || Math.abs(_$profile.offsetRectAtPointerdown.y) >= 3) {
                window.clearTimeout(this._$profile.longTapTimeout)
                _$profile.tapCount = 0
                _$profile.movePositionRange = this.getMovePositionRange()
            }
            _$profile.moveDirection = this.getMoveDirection()
            /* ... */
            this.options.onDragMove && this.options.onDragMove.call(
                undefined,
                evte, 
                {
                    movePosition: _$profile.movePositionRange,
                    moveDirection: _$profile.moveDirection,
                    distX: _$profile.offsetRectAtPointerdown.x,
                    distY: _$profile.offsetRectAtPointerdown.y,
                    speedX: pointer1.clientX - _$profile.pointerPositionCache.x,
                    speedY: pointer1.clientY - _$profile.pointerPositionCache.y,
                    clientX: pointer1.clientX,
                    clientY: pointer1.clientY
                },
                this
            )
            /* ... */
            _$profile.pointerPositionCache.x = pointer1.clientX
            _$profile.pointerPositionCache.y = pointer1.clientY
        }
        if (_$profile.pointers.length === 2) {
            /* ... */
            const pointer1 = _$profile.pointers[0]
            const pointer2 = _$profile.pointers[1]
            const dotRecordInPointerdown1 = _$profile.dotsRecordInPointerdown[0]
            const dotRecordInPointerdown2 = _$profile.dotsRecordInPointerdown[1]
            const lastDotRecordInPointerdown1 = _$profile.lastDotsRecordInPointerdown[0]
            const lastDotRecordInPointerdown2 = _$profile.lastDotsRecordInPointerdown[1]
            /* ... */
            const center = this.getCenter(
                { x: pointer1.clientX, y: pointer1.clientY }, 
                { x: pointer2.clientX, y: pointer2.clientY }
            )
            const rotate = this.getAngle(
                { x: pointer1.clientX, y: pointer1.clientY }, 
                { x: pointer2.clientX, y: pointer2.clientY }
            ) - this.getAngle(lastDotRecordInPointerdown1, lastDotRecordInPointerdown2)
            this.options.onRotate && this.options.onRotate.call(
                undefined, 
                evte, 
                {
                    rotate,
                    centerX: center.x,
                    centerY: center.y,
                    lastCenterX: _$profile.centerPositionCacheOfMultiPointers.x,
                    lastCenterY: _$profile.centerPositionCacheOfMultiPointers.y,
                    pointA: { x: pointer1.clientX, y: pointer1.clientY },
                    pointB: { x: pointer2.clientX, y: pointer2.clientY }
                },
                this
            )
            const scale = this.getDistance(
                    { x: pointer1.clientX, y: pointer1.clientY }, 
                    { x: pointer2.clientX, y: pointer2.clientY }
                ) - this.getDistance(lastDotRecordInPointerdown1, lastDotRecordInPointerdown2)
            this.options.onPinch && this.options.onPinch.call(
                undefined, 
                evte, 
                {
                    scale,
                    centerX: center.x,
                    centerY: center.y,
                    lastCenterX: _$profile.centerPositionCacheOfMultiPointers.x,
                    lastCenterY: _$profile.centerPositionCacheOfMultiPointers.y,
                    pointA: { x: pointer1.clientX, y: pointer1.clientY },
                    pointB: { x: pointer2.clientX, y: pointer2.clientY }
                },
                this
            )
            _$profile.centerPositionCacheOfMultiPointers.x = center.x
            _$profile.centerPositionCacheOfMultiPointers.y = center.y
            /* ... */
            lastDotRecordInPointerdown1.x = pointer1.clientX
            lastDotRecordInPointerdown1.y = pointer1.clientY
            lastDotRecordInPointerdown2.x = pointer2.clientX
            lastDotRecordInPointerdown2.y = pointer2.clientY
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
            _$profile.movePositionRange = ''
            _$profile.moveDirection = ''
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
            const dotRecordInPointerdown1 = _$profile.dotsRecordInPointerdown[0]
            const lastDotRecordInPointerdown1 = _$profile.lastDotsRecordInPointerdown[0]
            /* ... */
            dotRecordInPointerdown1.x = pointer1.clientX
            dotRecordInPointerdown1.y = pointer1.clientY
           /* ... */
            _$profile.pointerPositionCache.x = pointer1.clientX
            _$profile.pointerPositionCache.y = pointer1.clientY
        }
        if (_$profile.pointers.length <= 1) {
            /**
             * 少于两指的情形下
             *      重置多指几何中心坐标
             */
            _$profile.centerPositionCacheOfMultiPointers.x = 0
            _$profile.centerPositionCacheOfMultiPointers.y = 0
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
        if (this.options.isPreventDefaultInWheel) {
            evte.preventDefault()
        }
        const _$profile = this._$profile
        const scale = evte.deltaY > 0 ? this.options.zoomOutWheelRatio : this.options.zoomInWheelRatio
        this.options.onWheel && this.options.onWheel.call(
            undefined, 
            evte, 
            { 
                scale,
                clientX: evte.clientX,
                clientY: evte.clientY
            }, 
            this
        )
    }

    Gesture.prototype.handleContextmenuEvent = function(evte) {
        if (this.options.isPreventDefaultInLongDown) {
            evte.preventDefault()
        }
        this.options.onContextmenu && this.options.onContextmenu.call(
            undefined, 
            evte, 
            { 
                clientX: evte.clientX,
                clientY: evte.clientY
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
            item.addEventListener('contextmenu', this.handleContextmenuEvent)
        })
    }

    Gesture.prototype.unBindEvent = function() {
        this.containerElements.forEach((item) => {
            item.removeEventListener('pointerdown', this.handlePointerdownEvent)
            item.removeEventListener('pointermove', this.handlePointermoveEvent)
            item.removeEventListener('pointerup', this.handlePointerupEvent)
            item.removeEventListener('pointercancel', this.handlePointercancelEvent)
            item.removeEventListener('wheel', this.handleWheelEvent)
            item.removeEventListener('contextmenu', this.handleContextmenuEvent)
        })
    }

    /****************************** ******************************/
    /****************************** ******************************/
    /****************************** ******************************/
    /****************************** ******************************/

    xGesture.attach = function(host, options) {
        return new Gesture(host, options)
    }

    xGesture.defined = {
        DIRECTION_UP,
        DIRECTION_DOWN,
        DIRECTION_LEFT,
        DIRECTION_RIGHT
    }
}());