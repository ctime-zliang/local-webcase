/* 参考引用 Github 源码 */

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

    const POINTER_ITEM_ADD = 'POINTER_ITEM_ADD'
    const POINTER_ITEM_UPDATE = 'POINTER_ITEM_UPDATE'
    const POINTER_ITEM_DELETE = 'POINTER_ITEM_DELETE'

    function NonameGesture(element, options) {
        this.element = element; // 绑定事件的元素
        this.options = options || {}; // 配置项
        this.point1 = { x: 0, y: 0 }; // 第一个触摸点位置
        this.point2 = { x: 0, y: 0 }; // 第二个触摸点位置
        this.lastPoint1 = { x: 0, y: 0 }; // 上一次第一个触摸点位置
        this.lastPoint2 = { x: 0, y: 0 }; // 上一次第二个触摸点位置
        this.distance = { x: 0, y: 0 }; // 移动距离
        this.lastDistance = { x: 0, y: 0 }; // 上一次移动距离
        this.lastPointermove = { x: 0, y: 0 }; // 上一次移动位置
        this.lastCenter = { x: 0, y: 0 }; // 上一次中心位置
        this.tapCount = 0; // 点击计数器
        this.points = []; // 移动位置数组 长度20 用于计算是否触发swipe
        this.pointers = []; // 触摸点数组
        this.dragDirection = ''; // 拖拽方向
        this.isPointerdown = false; // 按下标识
        this.singleTapTimeout = null; // 单击延时器
        this.longTapTimeout = null; // 长按延时器
        // 绑定事件
        this.bindEventListener();
    }
    /**
     * 处理pointerdown
     * @param {PointerEvent} e 
     */
    NonameGesture.prototype.handlePointerdown = function (e) {
        // 如果是鼠标点击，只响应左键
        if (e.pointerType === 'mouse' && e.button !== 0) {
            return;
        }
        this.pointers.push(e);
        this.point1.x = this.pointers[0].clientX;
        this.point1.y = this.pointers[0].clientY;
        if (this.pointers.length === 1) {
            this.isPointerdown = true;
            this.element.setPointerCapture(e.pointerId);
            this.tapCount++;
            this.dragDirection = '';
            this.points.length = 0;
            clearTimeout(this.singleTapTimeout);
            this.distance.x = 0;
            this.distance.y = 0;
            this.lastDistance.x = 0;
            this.lastDistance.y = 0;
            this.lastPointermove.x = this.pointers[0].clientX;
            this.lastPointermove.y = this.pointers[0].clientY;
            // 双击两次距离不超过30
            if (this.tapCount > 1) {
                if (Math.abs(this.point1.x - this.lastPoint1.x) > 30 || Math.abs(this.point1.y - this.lastPoint1.y) > 30) {
                    this.tapCount = 1;
                }
            }
            if (this.tapCount === 1) {
                // 按住500ms触发长按事件
                this.longTapTimeout = setTimeout(() => {
                    this.tapCount = 0;
                    this.options.onLongTap && this.options.onLongTap.call(
                        undefined, 
                        e, 
                        {
                            clientX: this.point1.x,
                            clientY: this.point1.y
                        },
                        this
                    )
                }, 500);
            }
        } else if (this.pointers.length === 2) {
            this.tapCount = 0;
            clearTimeout(this.longTapTimeout);
            this.point2.x = this.pointers[1].clientX;
            this.point2.y = this.pointers[1].clientY;
            this.lastPoint2.x = this.pointers[1].clientX;
            this.lastPoint2.y = this.pointers[1].clientY;
            this.lastDistance.x = this.distance.x;
            this.lastDistance.y = this.distance.y;
            const center = this.getCenter(this.point1, this.point2);
            this.lastCenter.x = center.x;
            this.lastCenter.y = center.y;
        }
        this.lastPoint1 = { x: this.pointers[0].clientX, y: this.pointers[0].clientY };
        this.options.onPointerdown && this.options.onPointerdown.call(
            undefined, 
            e, 
            {
                clientX: e.clientX,
                clientY: e.clientY
            },
            this
        )
    }
    /**
     * 处理pointermove
     * @param {PointerEvent} e
     */
    NonameGesture.prototype.handlePointermove = function (e) {
        if (!this.isPointerdown) {
            return;
        }
        this.handlePointers(e, 'update');
        const current1 = { x: this.pointers[0].clientX, y: this.pointers[0].clientY };
        if (this.pointers.length === 1) {
            this.distance.x = current1.x - this.point1.x + this.lastDistance.x;
            this.distance.y = current1.y - this.point1.y + this.lastDistance.y;
            // 偏移量大于10表示移动
            if (Math.abs(this.distance.x) > 10 || Math.abs(this.distance.y) > 10) {
                this.tapCount = 0;
                clearTimeout(this.longTapTimeout);
                if (this.dragDirection === '') {
                    this.dragDirection = this.getDragDirection();
                }
            }
            this.points.unshift({ x: current1.x, y: current1.y, timeStamp: e.timeStamp });
            if (this.points.length > 30) {
                this.points.pop();
            }
            // drag
            this.handleDrag(e, current1);
            this.lastPointermove.x = current1.x;
            this.lastPointermove.y = current1.y;
        } else if (this.pointers.length === 2) {
            const current2 = { x: this.pointers[1].clientX, y: this.pointers[1].clientY };
            const center = this.getCenter(current1, current2);
            e._centerX = center.x;
            e._centerY = center.y;
            e._lastCenterX = this.lastCenter.x;
            e._lastCenterY = this.lastCenter.y;
            // rotate
            this.handleRotate(e, current1, current2);
            // pinch
            this.handlePinch(e, current1, current2);
            this.lastPoint1.x = current1.x;
            this.lastPoint1.y = current1.y;
            this.lastPoint2.x = current2.x;
            this.lastPoint2.y = current2.y;
            this.lastCenter.x = center.x;
            this.lastCenter.y = center.y;
        }
        this.options.onPointermove && this.options.onPointermove.call(
            undefined, 
            e, 
            {
                clientX: e.clientX,
                clientY: e.clientY
            },
            this
        )
        // 阻止默认行为，例如图片拖拽
        e.preventDefault();
    }
    /**
     * 处理pointerup
     * @param {PointerEvent} e
     */
    NonameGesture.prototype.handlePointerup = function (e) {
        if (!this.isPointerdown) {
            return;
        }
        this.handlePointers(e, 'delete');
        if (this.pointers.length === 0) {
            this.isPointerdown = false;
            clearTimeout(this.longTapTimeout);
            if (this.tapCount === 0) {
                this.handleSwipe(e);
            } else {
                this.options.onTap && this.options.onTap.call(
                    undefined, 
                    e,
                    {
                        clientX: e.clientX,
                        clientY: e.clientY
                    },
                    this
                )
                if (this.tapCount === 1) {
                    this.singleTapTimeout = setTimeout(() => {
                        this.tapCount = 0;
                        this.options.onSingleTap && this.options.onSingleTap.call(
                            undefined, 
                            e, 
                            {
                                e: e.clientX,
                                e: e.clientY
                            },
                            this
                        )
                    }, 250);
                } else if (this.tapCount > 1) {
                    this.tapCount = 0;
                    this.options.onDoubleTap && this.options.onDoubleTap.call(
                        undefined, 
                        e, 
                        {
                            clientX: e.clientX,
                            clientY: e.clientY
                        },
                        this
                    )
                }
            }
        } else if (this.pointers.length === 1) {
            this.point1.x = this.pointers[0].clientX;
            this.point1.y = this.pointers[0].clientY;
            this.lastPointermove.x = this.pointers[0].clientX;
            this.lastPointermove.y = this.pointers[0].clientY;
        }
        this.options.onPointerup && this.options.onPointerup.call(
            undefined, 
            e, 
            {
                clientX: e.clientX,
                clientY: e.clientY
            },
            this
        )
    }
    /**
     * 处理pointercancel
     * @param {PointerEvent} e
     */
    NonameGesture.prototype.handlePointercancel = function (e) {
        this.isPointerdown = false;
        this.tapCount = 0;
        clearTimeout(this.longTapTimeout);
        this.pointers.length = 0;
        this.options.onPpointercancel && this.options.onPpointercancel.call(
            undefined, 
            e, 
            {
                clientX: e.clientX,
                clientY: e.clientY
            },
            this
        )
    }
    /**
     * 更新或删除指针
     * @param {PointerEvent} e
     * @param {string} type update delete
     */
    NonameGesture.prototype.handlePointers = function (e, type) {
        for (let i = 0; i < this.pointers.length; i++) {
            if (this.pointers[i].pointerId === e.pointerId) {
                if (type === 'update') {
                    this.pointers[i] = e;
                } else if (type === 'delete') {
                    this.pointers.splice(i, 1);
                }
            }
        }
    }
    /**
     * 获取拖拽方向
     * @returns 
     */
    NonameGesture.prototype.getDragDirection = function () {
        let dragDirection = '';
        if (Math.abs(this.distance.x) > Math.abs(this.distance.y)) {
            dragDirection = this.distance.x > 0 ? 'right' : 'left';
        } else {
            dragDirection = this.distance.y > 0 ? 'down' : 'up';
        }
        return dragDirection;
    }
    /**
     * 处理拖拽
     * @param {PointerEvent} e
     * @param {object} a 第一个点的位置
     */
    NonameGesture.prototype.handleDrag = function (e, a) {
        e._dragDirection = this.dragDirection;
        e._diffX = a.x - this.lastPointermove.x;
        e._diffY = a.y - this.lastPointermove.y;
        e._distanceX = a.x - this.point1.x + this.lastDistance.x;
        e._distanceY = a.y - this.point1.y + this.lastDistance.y;
        if (this.options.drag) {
            this.options.drag(e);
        }
        this.options.onDragMove && this.options.onDragMove.call(
            undefined,
            e, 
            {
                movePosition: null,
                moveDirection: e._dragDirection,
                distX: e._distanceX,
                distY: e._distanceY,
                diffX: e._diffX,
                diffY: e._diffY,
                clientX: e.clientX,
                clientY: e.clientY
            },
            this
        )
    }
    /**
     * 处理swipe
     * @param {PointerEvent} e
     */
    NonameGesture.prototype.handleSwipe = function (e) {
        const MIN_SWIPE_DISTANCE = 20;
        let x = 0, y = 0;
        // 如果200ms内移动距离大于20
        for (const item of this.points) {
            if (e.timeStamp - item.timeStamp < 200) {
                x = e.clientX - item.x;
                y = e.clientY - item.y;
            } else {
                break;
            };
        }
        if (Math.abs(x) > MIN_SWIPE_DISTANCE || Math.abs(y) > MIN_SWIPE_DISTANCE) {
            if (Math.abs(x) > Math.abs(y)) {
                e._swipeDirection = x > 0 ? 'right' : 'left';
            } else {
                e._swipeDirection = y > 0 ? 'down' : 'up';
            }
            this.options.onSwipe && this.options.onSwipe.call(
                undefined, 
                e, 
                { 
                    direction: e._swipeDirection,
                    distX: x,
                    distY: y,
                    releaseX: e.clientX,
                    releaseY: e.clientY,
                }, 
                this
            )
        }
    }
    /**
     * 处理rotate
     * @param {PointerEvent} e
     * @param {object} a 第一个点的位置
     * @param {object} b 第二个点的位置
     */
    NonameGesture.prototype.handleRotate = function (e, a, b) {
        e._rotate = this.getAngle(a, b) - this.getAngle(this.lastPoint1, this.lastPoint2);
        this.options.onRotate && this.options.onRotate.call(
            undefined, 
            e, 
            {
                rotate: e._rotate,
                centerX: e._centerX,
                centerY: e._centerY,
                lastCenterX: e._lastCenterX,
                lastCenterY: e._lastCenterY,
                pointA: { x: this.pointers[0].clientX, y: this.pointers[0].clientY },
                pointB: { x: this.pointers[1].clientX, y: this.pointers[1].clientY }
            },
            this
        )
    }
    /**
     * 处理pinch
     * @param {PointerEvent} e
     * @param {object} a 第一个点的位置
     * @param {object} b 第二个点的位置
     */
    NonameGesture.prototype.handlePinch = function (e, a, b) {
        e._scale = this.getDistance(a, b) / this.getDistance(this.lastPoint1, this.lastPoint2);
        this.options.onPinch && this.options.onPinch.call(
            undefined, 
            e, 
            {
                scale: e._scale,
                centerX: e._centerX,
                centerY: e._centerY,
                lastCenterX: e._lastCenterX,
                lastCenterY: e._lastCenterY,
                pointA: { x: this.pointers[0].clientX, y: this.pointers[0].clientY },
                pointB: { x: this.pointers[1].clientX, y: this.pointers[1].clientY }
            },
            this
        )
    }
    /**
     * 鼠标滚轮缩放
     * @param {WheelEvent} e 
     */
    NonameGesture.prototype.handleWheel = function (e) {
        e._scale = 1.1;
        if (e.deltaY > 0) {
            e._scale = 1 / 1.1;
        }
        this.options.onWheel && this.options.onWheel.call(
            undefined, 
            e, 
            { 
                scale: e._scale,
                clientX: e.clientX,
                clientY: e.clientY
            }, 
            this
        )
    }
    /**
     * 绑定事件
     */
    NonameGesture.prototype.bindEventListener = function () {
        this.handlePointerdown = this.handlePointerdown.bind(this);
        this.handlePointermove = this.handlePointermove.bind(this);
        this.handlePointerup = this.handlePointerup.bind(this);
        this.handlePointercancel = this.handlePointercancel.bind(this);
        this.handleWheel = this.handleWheel.bind(this);
        this.element.addEventListener('pointerdown', this.handlePointerdown);
        this.element.addEventListener('pointermove', this.handlePointermove);
        this.element.addEventListener('pointerup', this.handlePointerup);
        this.element.addEventListener('pointercancel', this.handlePointercancel);
        this.element.addEventListener('wheel', this.handleWheel);
    }
    /**
     * 解绑事件
     */
    NonameGesture.prototype.unbindEventListener = function () {
        this.element.removeEventListener('pointerdown', this.handlePointerdown);
        this.element.removeEventListener('pointermove', this.handlePointermove);
        this.element.removeEventListener('pointerup', this.handlePointerup);
        this.element.removeEventListener('pointercancel', this.handlePointercancel);
        this.element.removeEventListener('wheel', this.handleWheel);
    }
    /**
     * 销毁
     */
    NonameGesture.prototype.destroy = function () {
        this.unbindEventListener();
    }
    /**
     * 获取旋转角度
     * @param {object} a 第一个点的位置
     * @param {object} b 第二个点的位置
     * @returns 
     */
    NonameGesture.prototype.getAngle = function (a, b) {
        const x = a.x - b.x;
        const y = a.y - b.y;
        return Math.atan2(y, x) * 180 / Math.PI;
    }
    /**
     * 获取两点距离
     * @param {object} a 第一个点的位置
     * @param {object} b 第二个点的位置
     * @returns
     */
    NonameGesture.prototype.getDistance = function (a, b) {
        const x = a.x - b.x;
        const y = a.y - b.y;
        return Math.hypot(x, y); // Math.sqrt(x * x + y * y);
    }
    /**
     * 获取两点中心点
     * @param {object} a 第一个点的位置
     * @param {object} b 第二个点的位置
     * @returns
     */
    NonameGesture.prototype.getCenter = function (a, b) {
        const x = (a.x + b.x) / 2;
        const y = (a.y + b.y) / 2;
        return { x: x, y: y };
    }
    /**
     * 获取图片缩放尺寸
     * @param {number} naturalWidth 图片自然宽度
     * @param {number} naturalHeight 图片自然高度
     * @param {number} maxWidth 最大显示宽度
     * @param {number} maxHeight 最大显示高度
     * @returns 
     */
    NonameGesture.prototype.getImgSize = function (naturalWidth, naturalHeight, maxWidth, maxHeight) {
        const imgRatio = naturalWidth / naturalHeight;
        const maxRatio = maxWidth / maxHeight;
        let width, height;
        // 如果图片实际宽高比例 >= 显示宽高比例
        if (imgRatio >= maxRatio) {
            if (naturalWidth > maxWidth) {
                width = maxWidth;
                height = maxWidth / naturalWidth * naturalHeight;
            } else {
                width = naturalWidth;
                height = naturalHeight;
            }
        } else {
            if (naturalHeight > maxHeight) {
                width = maxHeight / naturalHeight * naturalWidth;
                height = maxHeight;
            } else {
                width = naturalWidth;
                height = naturalHeight;
            }
        }
        return { width: width, height: height };
    }

    NonameGesture.prototype.getAllPointers = function() {
        return this.pointers
    }

    NonameGesture.prototype.onPointerdown = function(callback) {
        this.options.onPointerdown = callback
        return this
    }

    NonameGesture.prototype.onPointerup = function(callback) {
        this.options.onPointerup = callback
        return this
    }
    
    NonameGesture.prototype.onPointermove = function(callback) {
        this.options.onPointermove = callback
        return this
    }

    NonameGesture.prototype.onPpointercancel = function(callback) {
        this.options.onPpointercancel = callback
        return this
    }

    NonameGesture.prototype.onTap = function(callback) {
        this.options.onTap = callback
        return this
    }

    NonameGesture.prototype.onLongTap = function(callback) {
        this.options.onLongTap = callback
        return this
    }

    NonameGesture.prototype.onSingleTap = function(callback) {
        this.options.onSingleTap = callback
        return this
    }

    NonameGesture.prototype.onDoubleTap = function(callback) {
        this.options.onDoubleTap = callback
        return this
    }

    NonameGesture.prototype.onDragMove = function(callback) {
        this.options.onDragMove = callback
        return this
    }

    NonameGesture.prototype.onWheel = function(callback) {
        this.options.onWheel = callback
        return this
    }

    NonameGesture.prototype.onClick = function(callback) {
        this.options.onClick = callback
        return this
    }

    /****************************** ******************************/
    /****************************** ******************************/
    /****************************** ******************************/
    /****************************** ******************************/

    xGesture.attach = function(host, options) {
        host.style.touchAction = 'none'
        return new NonameGesture(host, options)
    }

    xGesture.defined = {
        DIRECTION_UP,
        DIRECTION_DOWN,
        DIRECTION_LEFT,
        DIRECTION_RIGHT
    }
}());