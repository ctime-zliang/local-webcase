console.log(xGesture)


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
        static swipeStart = 0
        static swipeEnd = -100

        static init(swipeContainerElement) {
            this.swipeContainerElement = swipeContainerElement
            this.swipeItemElements = this.swipeContainerElement.querySelectorAll('.swiper-item')
            if (this.swipeItemElements[0]) {
                const listExtendElement = this.swipeItemElements[0].querySelector('.list-extend')
                if (listExtendElement) {
                    this.swipeEnd = -1 * listExtendElement.getBoundingClientRect().width
                }
            }
            Array.from(this.swipeItemElements).forEach((itemElement) => {
                this.initItemElement(itemElement)
            })
        }

        static initItemElement(itemElement) {
            const id = `list${Math.random()}`
            itemElement.setAttribute('id', id)
            itemElement.id = id
            this.swipeItemTranlsteXMap[id] = { setting: 0, start: this.swipeStart, end: this.swipeEnd, last: 0 }
            this.applyStyle(itemElement)
            this.bindEvent(itemElement)
        }

        static updateStyle(itemElement, attr, value) {
            itemElement.style[attr] = value
        }

        static applyStyle(itemElement) {
            const tranlsteXItemData = this.swipeItemTranlsteXMap[itemElement.id]
            if (!tranlsteXItemData) {
                return
            }
            itemElement.style.transform = `translate3d(${tranlsteXItemData.setting}px, 0, 5px)`
        }

        static bindEvent(itemElement) {
            const self = this
            xGesture.attach(itemElement, {
                cssTouchAction: 'none',
                onDragMove(evte, { movePosition, moveDirection, distX, distY, diffX, diffY, clientX, clientY }, gesture) {
                    console.log({ movePosition, moveDirection, distX, distY, diffX, diffY, clientX, clientY })
                    const currentTarget = evte.currentTarget
                    const tranlsteXItemData = self.swipeItemTranlsteXMap[currentTarget.id]
                    tranlsteXItemData.setting += diffX
                    if (tranlsteXItemData.setting > tranlsteXItemData.start) {
                        tranlsteXItemData.setting = tranlsteXItemData.start
                    } else if (tranlsteXItemData.setting < tranlsteXItemData.end) {
                        tranlsteXItemData.setting = tranlsteXItemData.end
                    }
                    self.updateStyle(currentTarget, 'transition', 'none')
                    self.applyStyle(currentTarget)
                },
                onSwipe(evte, { direction, distX, distY, releaseX, releaseY }, gesture) {
                    console.log({ direction, distX, distY, releaseX, releaseY })
                    const currentTarget = evte.currentTarget
                    const tranlsteXItemData = self.swipeItemTranlsteXMap[currentTarget.id]
                    if (direction === xGesture.defined.DIRECTION_RIGHT) {
                        tranlsteXItemData.setting = tranlsteXItemData.start
                    } else if (direction === xGesture.defined.DIRECTION_LEFT) {
                        tranlsteXItemData.setting = tranlsteXItemData.end
                    }
                    self.updateStyle(currentTarget, 'transition', 'transform .2s ease')
                    self.applyStyle(currentTarget)
                },
                onPointerup(evte, { clientX, clientY }, gesture) {
                    console.log({ clientX, clientY })
                    const currentTarget = evte.currentTarget
                    const tranlsteXItemData = self.swipeItemTranlsteXMap[currentTarget.id]
                    if (tranlsteXItemData.setting === tranlsteXItemData.start || tranlsteXItemData.setting === tranlsteXItemData.end) {
                        return
                    }
                    if (tranlsteXItemData.last === tranlsteXItemData.start) {
                        tranlsteXItemData.setting = tranlsteXItemData.setting < tranlsteXItemData.start - 40 ? tranlsteXItemData.end : tranlsteXItemData.start;
                    } else if (tranlsteXItemData.last === tranlsteXItemData.end) {
                        tranlsteXItemData.setting = tranlsteXItemData.setting > tranlsteXItemData.end + 40 ? tranlsteXItemData.start : tranlsteXItemData.end;
                    }
                    tranlsteXItemData.last = tranlsteXItemData.setting
                    self.updateStyle(currentTarget, 'transition', 'transform .2s ease')
                    self.applyStyle(currentTarget)
                }
            })
        }
    }

    SwipeManager.init(sectionElement.querySelector('.swiper-container'))
})(globalContainerElement.querySelector('[data-tagitem="swipe"]'));

