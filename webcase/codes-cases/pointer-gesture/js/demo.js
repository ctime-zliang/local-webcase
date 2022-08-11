console.log(xGesture)


class AlertManager {
    static STATUS_CLOSE = 'close'
    static STATUS_OPEN = 'open'
    static status = 'close'
    static containerElemeent = null
    static contentElement = null
    static btnsWrapperElement = null
    static callback = null

    static template() {
        return `
            <section class="alert-container">
                <div class="alert-position-wrapper">
                    <div class="alert-lock alert-lock-visibility"></div>
                    <div class="alert-wrapper">
                        <div class="alert-message-wrapper">
                            <div class="alert-message-content"></div>
                        </div>
                        <div class="alert-btns-wrapper">
                            <button class="alert-btn alert-confirm-btn" data-tagitem="confirm">确认</button>
                            <button class="alert-btn alert-cancel-btn" data-tagitem="cancel">取消</button>
                        </div>
                    </div>
                </div>
            </section>
        `
    }

    static init() {
        this.tapEventHandler = this.tapEventHandler.bind(this)
        document.body.appendChild(document.createRange().createContextualFragment(this.template()))
        this.containerElemeent = document.querySelector('.alert-container')
        this.contentElement = this.containerElemeent.querySelector('.alert-message-content')
        this.btnsWrapperElement = this.containerElemeent.querySelector('.alert-btns-wrapper')
        this.bindEvent()
    }

    static open(message, callback) {
        this.callback = callback
        this.contentElement.innerHTML = message
        this.containerElemeent.classList.add('alert-container-show')
    }

    static close() {
        this.containerElemeent.classList.remove('alert-container-show')
        this.callback = null
    }

    static bindEvent() {
        this.btnsWrapperElement.addEventListener('touchstart', this.tapEventHandler)
        this.btnsWrapperElement.addEventListener('mousedown', this.tapEventHandler)
    }

    static tapEventHandler(e) {
        if (e.target.classList.contains('alert-btn')) {
            e.target.classList.add('alert-btn-touched')
            window.setTimeout(() => {
                e.target.classList.remove('alert-btn-touched')
            }, 125)
            this.callback && this.callback.call(undefined, e.target.getAttribute('data-tagitem'))
        }
    }
}

AlertManager.init()


const globalContainerElement = document.getElementById('appContainer')
const interactiveSelectedClassname = 'guesture-interactive-selected'


/**
 * Pointer Down
 */
;(function(sectionElement) {
    const guestureElement = sectionElement.querySelector('[data-tagitem="guesture"]')
    const countElement = sectionElement.querySelector('[data-tagitem="event-count"]')
    const xAbsoluteElement = sectionElement.querySelector('[data-tagitem="event-absolute-x"]')
    const yAbsoluteElement = sectionElement.querySelector('[data-tagitem="event-absolute-y"]')

    let eventCount = 0
    let styleUpdateTimer = null

    xGesture.attach(guestureElement, {
        onPointerdown(evte, { clientX, clientY }, guesture) {
            console.log({ clientX, clientY })
            window.clearTimeout(styleUpdateTimer)
            guestureElement.classList.add(interactiveSelectedClassname)
            countElement.textContent = ++eventCount
            xAbsoluteElement.textContent = clientX
            yAbsoluteElement.textContent = clientY
            styleUpdateTimer = window.setTimeout(() => {
                guestureElement.classList.remove(interactiveSelectedClassname)
            }, 85)
        },
    })
})(globalContainerElement.querySelector('[data-tagitem="pointerdown"]'));


/**
 * Pointer Up
 */
 ;(function(sectionElement) {
    const guestureElement = sectionElement.querySelector('[data-tagitem="guesture"]')
    const countElement = sectionElement.querySelector('[data-tagitem="event-count"]')
    const xAbsoluteElement = sectionElement.querySelector('[data-tagitem="event-absolute-x"]')
    const yAbsoluteElement = sectionElement.querySelector('[data-tagitem="event-absolute-y"]')

    let eventCount = 0
    let styleUpdateTimer = null

    xGesture.attach(guestureElement, {
        onPointerup(evte, { clientX, clientY }, guesture) {
            console.log({ clientX, clientY })
            window.clearTimeout(styleUpdateTimer)
            guestureElement.classList.add(interactiveSelectedClassname)
            countElement.textContent = ++eventCount
            xAbsoluteElement.textContent = clientX
            yAbsoluteElement.textContent = clientY
            styleUpdateTimer = window.setTimeout(() => {
                guestureElement.classList.remove(interactiveSelectedClassname)
            }, 85)
        },
    })
})(globalContainerElement.querySelector('[data-tagitem="pointerup"]'));


/**
 * Pointer Move
 */
 ;(function(sectionElement) {
    const guestureElement = sectionElement.querySelector('[data-tagitem="guesture"]')
    const xAbsoluteElement = sectionElement.querySelector('[data-tagitem="absolute-x"]')
    const yAbsoluteElement = sectionElement.querySelector('[data-tagitem="absolute-y"]')
    const xRelativeElement = sectionElement.querySelector('[data-tagitem="relative-x"]')
    const yRelativeElement = sectionElement.querySelector('[data-tagitem="relative-y"]')

    let styleUpdateTimer = null
    let guestureElementRect = null

    xGesture.attach(guestureElement, {
        cssTouchAction: 'none',
        onPointermove(evte, { clientX, clientY }, guesture) {
            console.log({ clientX, clientY })
            window.clearTimeout(styleUpdateTimer)
            guestureElement.classList.add(interactiveSelectedClassname)
            guestureElementRect = guestureElement.getBoundingClientRect()
            xAbsoluteElement.textContent = clientX
            yAbsoluteElement.textContent = clientY
            xRelativeElement.textContent = clientX - guestureElementRect.left
            yRelativeElement.textContent = clientY - guestureElementRect.top
            styleUpdateTimer = window.setTimeout(() => {
                guestureElement.classList.remove(interactiveSelectedClassname)
            }, 150)
        },
        onPpointercancel(evte, { clientX, clientY }, gesture) {
            console.log({ clientX, clientY })
        },
    })
})(globalContainerElement.querySelector('[data-tagitem="pointermove"]'));


/**
 * Tap
 */
 ;(function(sectionElement) {
    const guestureElement = sectionElement.querySelector('[data-tagitem="guesture"]')
    const countElement = sectionElement.querySelector('[data-tagitem="event-count"]')
    const xAbsoluteElement = sectionElement.querySelector('[data-tagitem="event-absolute-x"]')
    const yAbsoluteElement = sectionElement.querySelector('[data-tagitem="event-absolute-y"]')

    let eventCount = 0
    let styleUpdateTimer = null

    xGesture.attach(guestureElement, {
        onTap(evte, { tapX, tapY }, guesture) {
            console.log({ tapX, tapY })
            window.clearTimeout(styleUpdateTimer)
            guestureElement.classList.add(interactiveSelectedClassname)
            countElement.textContent = ++eventCount
            xAbsoluteElement.textContent = tapX
            yAbsoluteElement.textContent = tapY
            styleUpdateTimer = window.setTimeout(() => {
                guestureElement.classList.remove(interactiveSelectedClassname)
            }, 85)
        },
    })
})(globalContainerElement.querySelector('[data-tagitem="tap"]'));


/**
 * Long Tap
 */
 ;(function(sectionElement) {
    const guestureElement = sectionElement.querySelector('[data-tagitem="guesture"]')
    const countElement = sectionElement.querySelector('[data-tagitem="event-count"]')
    const xAbsoluteElement = sectionElement.querySelector('[data-tagitem="event-absolute-x"]')
    const yAbsoluteElement = sectionElement.querySelector('[data-tagitem="event-absolute-y"]')

    let eventCount = 0
    let styleUpdateTimer = null

    xGesture.attach(guestureElement, {
        isPreventDefaultInLongDown: true,
        onLongTap(evte, { tapX, tapY }, guesture) {
            console.log({ tapX, tapY })
            window.clearTimeout(styleUpdateTimer)
            guestureElement.classList.add(interactiveSelectedClassname)
            countElement.textContent = ++eventCount
            xAbsoluteElement.textContent = tapX
            yAbsoluteElement.textContent = tapY
            AlertManager.open(`触发了 longTap 事件.`, (tag) => {
                console.log(tag)
                AlertManager.close()
            })
            // alert(`触发了 longTap 事件.`)
            styleUpdateTimer = window.setTimeout(() => {
                guestureElement.classList.remove(interactiveSelectedClassname)
            }, 85)
        },
    })
})(globalContainerElement.querySelector('[data-tagitem="longtap"]'));


/**
 * Single Tap
 */
 ;(function(sectionElement) {
    const guestureElement = sectionElement.querySelector('[data-tagitem="guesture"]')
    const countElement = sectionElement.querySelector('[data-tagitem="event-count"]')
    const xAbsoluteElement = sectionElement.querySelector('[data-tagitem="event-absolute-x"]')
    const yAbsoluteElement = sectionElement.querySelector('[data-tagitem="event-absolute-y"]')

    let eventCount = 0
    let styleUpdateTimer = null

    xGesture.attach(guestureElement, {
        onSingleTap(evte, { tapX, tapY }, guesture) {
            console.log({ tapX, tapY })
            window.clearTimeout(styleUpdateTimer)
            guestureElement.classList.add(interactiveSelectedClassname)
            countElement.textContent = ++eventCount
            xAbsoluteElement.textContent = tapX
            yAbsoluteElement.textContent = tapY
            styleUpdateTimer = window.setTimeout(() => {
                guestureElement.classList.remove(interactiveSelectedClassname)
            }, 85)
        },
    })
})(globalContainerElement.querySelector('[data-tagitem="singletap"]'));


/**
 * Double Tap
 */
 ;(function(sectionElement) {
    const guestureElement = sectionElement.querySelector('[data-tagitem="guesture"]')
    const countElement = sectionElement.querySelector('[data-tagitem="event-count"]')
    const xAbsoluteElement = sectionElement.querySelector('[data-tagitem="event-absolute-x"]')
    const yAbsoluteElement = sectionElement.querySelector('[data-tagitem="event-absolute-y"]')

    let eventCount = 0
    let styleUpdateTimer = null

    xGesture.attach(guestureElement, {
        onDoubleTap(evte, { tapX, tapY }, guesture) {
            console.log({ tapX, tapY })
            window.clearTimeout(styleUpdateTimer)
            guestureElement.classList.add(interactiveSelectedClassname)
            countElement.textContent = ++eventCount
            xAbsoluteElement.textContent = tapX
            yAbsoluteElement.textContent = tapY
            styleUpdateTimer = window.setTimeout(() => {
                guestureElement.classList.remove(interactiveSelectedClassname)
            }, 85)
        },
    })
})(globalContainerElement.querySelector('[data-tagitem="doubletap"]'));


/**
 * Drag Move
 */
 ;(function(sectionElement) {
    const guestureElement = sectionElement.querySelector('[data-tagitem="guesture"]')
    const xAbsoluteElement = sectionElement.querySelector('[data-tagitem="absolute-x"]')
    const yAbsoluteElement = sectionElement.querySelector('[data-tagitem="absolute-y"]')
    const xRelativeElement = sectionElement.querySelector('[data-tagitem="relative-x"]')
    const yRelativeElement = sectionElement.querySelector('[data-tagitem="relative-y"]')
    const xSpeedElement = sectionElement.querySelector('[data-tagitem="speed-x"]')
    const ySpeedElement = sectionElement.querySelector('[data-tagitem="speed-y"]')
    const positionMoveElement = sectionElement.querySelector('[data-tagitem="move-position"]')
    const directionMoveElement = sectionElement.querySelector('[data-tagitem="move-direction"]')
    const xDistElement = sectionElement.querySelector('[data-tagitem="dist-x"]')
    const yDistElement = sectionElement.querySelector('[data-tagitem="dist-y"]')

    let styleUpdateTimer = null
    let guestureElementRect = null

    xGesture.attach(guestureElement, {
        cssTouchAction: 'none',
        onDragMove(evte, { movePosition, moveDirection, distX, distY, diffX, diffY, clientX, clientY }, gesture) {
            console.log({ movePosition, moveDirection, distX, distY, diffX, diffY, clientX, clientY })
            window.clearTimeout(styleUpdateTimer)
            guestureElement.classList.add(interactiveSelectedClassname)
            guestureElementRect = guestureElement.getBoundingClientRect()
            xAbsoluteElement.textContent = clientX
            yAbsoluteElement.textContent = clientY
            xRelativeElement.textContent = clientX - guestureElementRect.left
            yRelativeElement.textContent = clientY - guestureElementRect.top
            xSpeedElement.textContent = diffX
            ySpeedElement.textContent = diffY
            positionMoveElement.textContent = movePosition
            directionMoveElement.textContent = moveDirection
            xDistElement.textContent = distX
            yDistElement.textContent = distY
            styleUpdateTimer = window.setTimeout(() => {
                guestureElement.classList.remove(interactiveSelectedClassname)
            }, 150)
        },
    })
})(globalContainerElement.querySelector('[data-tagitem="dragmove"]'));


/**
 * Wheel
 */
 ;(function(sectionElement) {
    const guestureElement = sectionElement.querySelector('[data-tagitem="guesture"]')
    const wheelImageElement = sectionElement.querySelector('[data-tagitem="wheel-image"]')
    class TransfromManager {
        static scale = 1

        static setScale(value) {
            this.scale = value
        }

        static getScale() {
            return this.scale
        }

        static getString() {
            return `scale(${this.scale})`
        }
    }

    let wheelScale = 1.0
    let maxWheelScale = 10
    let minWheelScale = 0.1
    xGesture.attach(guestureElement, {
        onWheel(evte, { scale, clientX, clientY }, gesture) {
            console.log({ scale, clientX, clientY })
            wheelScale *= scale
            if (wheelScale > maxWheelScale) {
                wheelScale = maxWheelScale
            } else if (wheelScale < minWheelScale) {
                wheelScale = minWheelScale
            }
            TransfromManager.setScale(wheelScale)
            wheelImageElement.style.transform = TransfromManager.getString()
        },
    })
})(globalContainerElement.querySelector('[data-tagitem="wheel"]'));


/**
 * Swipe
 */
 ;(function(sectionElement) {
    class SwipeManager {
        static translateX = 0
        static swipeContainerElement = null
        static swipeItemElements = []
        static swipeItemTranlsteXMap = {}
        static STATUS_OPEN = 'open'
        static STATUS_CLOSE = 'close'
        static leftEndPoint = -120

        static init(swipeContainerElement) {
            this.swipeContainerElement = swipeContainerElement
            this.swipeItemElements = this.swipeContainerElement.querySelectorAll('.swiper-item')
            Array.from(this.swipeItemElements).forEach((itemElement) => {
                this.initItemElement(itemElement)
            })
        }

        static initItemElement(itemElement) {
            const id = `list${Math.random()}`
            itemElement.setAttribute('id', id)
            itemElement.id = id
            this.swipeItemTranlsteXMap[id] = { 
                setting: 0, 
                rightEndPoint: 0, 
                leftEndPoint: this.leftEndPoint, 
                status: this.STATUS_CLOSE,
            }
            this.applyTransfromStyle(itemElement)
            this.bindEvent(itemElement)
        }

        static updateStyle(itemElement, attr, value) {
            itemElement.style[attr] = value
        }

        static setTransitionStyle(itemElement, use = false) {
            if (!use) {
                itemElement.style.transition = 'none'
                return
            }
            itemElement.style.transition = 'transform .2s ease'
        }

        static applyTransfromStyle(itemElement) {
            const tranlsteXItemData = this.swipeItemTranlsteXMap[itemElement.id]
            if (!tranlsteXItemData) {
                return
            }
            itemElement.style.transform = `translate3d(${tranlsteXItemData.setting}px, 0, 5px)`
        }

        static bindEvent(itemElement) {
            const self = this
            xGesture.attach(itemElement, {
                cssTouchAction: 'pan-y',
                onDragMove(evte, { movePosition, moveDirection, distX, distY, diffX, diffY, clientX, clientY }, gesture) {
                    // console.log({ movePosition, moveDirection, distX, distY, diffX, diffY, clientX, clientY })
                    const currentTarget = evte.currentTarget
                    const tranlsteXItemData = self.swipeItemTranlsteXMap[currentTarget.id]
                    tranlsteXItemData.setting += diffX
                    if (tranlsteXItemData.setting > tranlsteXItemData.rightEndPoint) {
                        tranlsteXItemData.setting = tranlsteXItemData.rightEndPoint
                    } else if (tranlsteXItemData.setting < tranlsteXItemData.leftEndPoint) {
                        tranlsteXItemData.setting = tranlsteXItemData.leftEndPoint
                    }
                    self.setTransitionStyle(currentTarget, false)
                    self.applyTransfromStyle(currentTarget)
                },
                onSwipe(evte, { direction, distX, distY, releaseX, releaseY }, gesture) {
                    console.log({ direction, distX, distY, releaseX, releaseY })
                    const currentTarget = evte.currentTarget
                    const tranlsteXItemData = self.swipeItemTranlsteXMap[currentTarget.id]
                    if (direction === xGesture.defined.DIRECTION_RIGHT) {
                        tranlsteXItemData.setting = tranlsteXItemData.rightEndPoint
                        tranlsteXItemData.status = self.STATUS_CLOSE
                    } else if (direction === xGesture.defined.DIRECTION_LEFT) {
                        tranlsteXItemData.setting = tranlsteXItemData.leftEndPoint
                        tranlsteXItemData.status = self.STATUS_OPEN
                    }
                    self.setTransitionStyle(currentTarget, true)
                    self.applyTransfromStyle(currentTarget)
                },
                onPointerup(evte, { clientX, clientY }, gesture) {
                    console.log({ clientX, clientY })
                    const currentTarget = evte.currentTarget
                    const tranlsteXItemData = self.swipeItemTranlsteXMap[currentTarget.id]
                    if (tranlsteXItemData.setting === tranlsteXItemData.rightEndPoint || tranlsteXItemData.setting === tranlsteXItemData.leftEndPoint) {
                        return
                    }
                    if (tranlsteXItemData.status === self.STATUS_OPEN) {
                        if (tranlsteXItemData.setting < tranlsteXItemData.rightEndPoint - 40) {
                            tranlsteXItemData.setting = tranlsteXItemData.leftEndPoint
                        } else {
                            tranlsteXItemData.setting = tranlsteXItemData.rightEndPoint
                        }
                    } else if (tranlsteXItemData.status === self.STATUS_CLOSE) {
                        if (tranlsteXItemData.setting > tranlsteXItemData.leftEndPoint + 40) {
                            tranlsteXItemData.setting = tranlsteXItemData.rightEndPoint
                        } else {
                            tranlsteXItemData.setting = tranlsteXItemData.leftEndPoint
                        }
                    }
                    self.setTransitionStyle(currentTarget, true)
                    self.applyTransfromStyle(currentTarget)
                },
                onPpointercancel(evte, { clientX, clientY }, gesture) {
                    console.log({ clientX, clientY })
                    const currentTarget = evte.currentTarget
                    const tranlsteXItemData = self.swipeItemTranlsteXMap[currentTarget.id]
                    tranlsteXItemData.setting = tranlsteXItemData.rightEndPoint
                    self.setTransitionStyle(currentTarget, true)
                    self.applyTransfromStyle(currentTarget)
                }
            })
        }
    }

    SwipeManager.init(sectionElement.querySelector('.swiper-container'))
})(globalContainerElement.querySelector('[data-tagitem="swipe"]'));


/**
 * Pinch
 */
 ;(function(sectionElement) {
    const guestureElement = sectionElement.querySelector('[data-tagitem="guesture"]')
    const scaleValueElement = sectionElement.querySelector('[data-tagitem="scale-value"]')
    const xCenterElement = sectionElement.querySelector('[data-tagitem="center-x"]')
    const yCenterElement = sectionElement.querySelector('[data-tagitem="center-y"]')
    const xPoiner1Element = sectionElement.querySelector('[data-tagitem="pointer1-x"]')
    const yPoiner1Element = sectionElement.querySelector('[data-tagitem="pointer1-y"]')
    const xPoiner2Element = sectionElement.querySelector('[data-tagitem="pointer2-x"]')
    const yPoiner2Element = sectionElement.querySelector('[data-tagitem="pointer2-y"]')

    let styleUpdateTimer = null

    xGesture.attach(guestureElement, {
        cssTouchAction: 'none',
        onPinch(evte, { scale, centerX, centerY, lastCenterX, lastCenterY, pointA, pointB }, gesture) {
            console.log({ scale, centerX, centerY, lastCenterX, lastCenterY, pointA, pointB })
            window.clearTimeout(styleUpdateTimer)
            guestureElement.classList.add(interactiveSelectedClassname)
            scaleValueElement.textContent = scale
            xCenterElement.textContent = centerX
            yCenterElement.textContent = centerY
            xPoiner1Element.textContent = pointA.x
            yPoiner1Element.textContent = pointA.x
            xPoiner2Element.textContent = pointB.x
            yPoiner2Element.textContent = pointB.x
            styleUpdateTimer = window.setTimeout(() => {
                guestureElement.classList.remove(interactiveSelectedClassname)
            }, 150)
        },
    })
})(globalContainerElement.querySelector('[data-tagitem="pinch"]'));


/**
 * Rotate
 */
 ;(function(sectionElement) {
    const guestureElement = sectionElement.querySelector('[data-tagitem="guesture"]')
    const rotateValueElement = sectionElement.querySelector('[data-tagitem="rotate-value"]')
    const xCenterElement = sectionElement.querySelector('[data-tagitem="center-x"]')
    const yCenterElement = sectionElement.querySelector('[data-tagitem="center-y"]')
    const xPoiner1Element = sectionElement.querySelector('[data-tagitem="pointer1-x"]')
    const yPoiner1Element = sectionElement.querySelector('[data-tagitem="pointer1-y"]')
    const xPoiner2Element = sectionElement.querySelector('[data-tagitem="pointer2-x"]')
    const yPoiner2Element = sectionElement.querySelector('[data-tagitem="pointer2-y"]')

    let styleUpdateTimer = null

    xGesture.attach(guestureElement, {
        cssTouchAction: 'none',
        onPinch(evte, { rotate, centerX, centerY, lastCenterX, lastCenterY, pointA, pointB }, gesture) {
            console.log({ rotate, centerX, centerY, lastCenterX, lastCenterY, pointA, pointB })
            window.clearTimeout(styleUpdateTimer)
            guestureElement.classList.add(interactiveSelectedClassname)
            rotateValueElement.textContent = rotate
            xCenterElement.textContent = centerX
            yCenterElement.textContent = centerY
            xPoiner1Element.textContent = pointA.x
            yPoiner1Element.textContent = pointA.x
            xPoiner2Element.textContent = pointB.x
            yPoiner2Element.textContent = pointB.x
            styleUpdateTimer = window.setTimeout(() => {
                guestureElement.classList.remove(interactiveSelectedClassname)
            }, 150)
        },
    })
})(globalContainerElement.querySelector('[data-tagitem="rotate"]'));
