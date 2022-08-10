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
        onPointermove(evte, { clientX, clientY }, guesture) {
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
        onPointerdown(evte, { clientX, clientY }, guesture) {
            evte.preventDefault()
            evte.currentTarget.style.touchAction = 'none'
        },
        onDragMove(evte, { movePosition, moveDirection, distX, distY, speedX, speedY, clientX, clientY }, gesture) {
            evte.preventDefault()
            window.clearTimeout(styleUpdateTimer)
            guestureElement.classList.add(interactiveSelectedClassname)
            guestureElementRect = guestureElement.getBoundingClientRect()
            xAbsoluteElement.textContent = clientX
            yAbsoluteElement.textContent = clientY
            xRelativeElement.textContent = clientX - guestureElementRect.left
            yRelativeElement.textContent = clientY - guestureElementRect.top
            xSpeedElement.textContent = speedX
            ySpeedElement.textContent = speedY
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
 * Double Tap
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

