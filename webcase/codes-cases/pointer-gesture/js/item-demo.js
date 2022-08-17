/****************************** ******************************/
/****************************** ******************************/
/** Pointer Down ***/
/****************************** ******************************/
/****************************** ******************************/
;(function(sectionElement) {
    const gestureElement = sectionElement.querySelector('[data-tagitem="gesture"]')
    const countElement = sectionElement.querySelector('[data-tagitem="event-count"]')
    const xAbsoluteElement = sectionElement.querySelector('[data-tagitem="event-absolute-x"]')
    const yAbsoluteElement = sectionElement.querySelector('[data-tagitem="event-absolute-y"]')

    let eventCount = 0
    let styleUpdateTimer = null
    xGesture.attach(gestureElement, {
        onPointerdown(evte, { clientX, clientY }, gesture) {
            console.log({ clientX, clientY })
            window.clearTimeout(styleUpdateTimer)
            gestureElement.classList.add(interactiveSelectedClassname)
            countElement.textContent = ++eventCount
            xAbsoluteElement.textContent = clientX
            yAbsoluteElement.textContent = clientY
            styleUpdateTimer = window.setTimeout(() => {
                gestureElement.classList.remove(interactiveSelectedClassname)
            }, 85)
        },
    })
})(globalContainerElement.querySelector('[data-tagitem="pointerdown"]'));


/****************************** ******************************/
/****************************** ******************************/
/** Pointer Up ***/
/****************************** ******************************/
/****************************** ******************************/
;(function(sectionElement) {
    const gestureElement = sectionElement.querySelector('[data-tagitem="gesture"]')
    const countElement = sectionElement.querySelector('[data-tagitem="event-count"]')
    const xAbsoluteElement = sectionElement.querySelector('[data-tagitem="event-absolute-x"]')
    const yAbsoluteElement = sectionElement.querySelector('[data-tagitem="event-absolute-y"]')

    let eventCount = 0
    let styleUpdateTimer = null
    xGesture.attach(gestureElement, {
        onPointerup(evte, { clientX, clientY }, gesture) {
            console.log({ clientX, clientY })
            window.clearTimeout(styleUpdateTimer)
            gestureElement.classList.add(interactiveSelectedClassname)
            countElement.textContent = ++eventCount
            xAbsoluteElement.textContent = clientX
            yAbsoluteElement.textContent = clientY
            styleUpdateTimer = window.setTimeout(() => {
                gestureElement.classList.remove(interactiveSelectedClassname)
            }, 85)
        },
    })
})(globalContainerElement.querySelector('[data-tagitem="pointerup"]'));


/****************************** ******************************/
/****************************** ******************************/
/** Pointer Move ***/
/****************************** ******************************/
/****************************** ******************************/
;(function(sectionElement) {
    const gestureElement = sectionElement.querySelector('[data-tagitem="gesture"]')
    const xAbsoluteElement = sectionElement.querySelector('[data-tagitem="absolute-x"]')
    const yAbsoluteElement = sectionElement.querySelector('[data-tagitem="absolute-y"]')
    const xRelativeElement = sectionElement.querySelector('[data-tagitem="relative-x"]')
    const yRelativeElement = sectionElement.querySelector('[data-tagitem="relative-y"]')

    let styleUpdateTimer = null
    let gestureElementRect = null
    xGesture.attach(gestureElement, {
        cssTouchAction: 'none',
        onPointermove(evte, { clientX, clientY }, gesture) {
            console.log({ clientX, clientY })
            window.clearTimeout(styleUpdateTimer)
            gestureElement.classList.add(interactiveSelectedClassname)
            gestureElementRect = gestureElement.getBoundingClientRect()
            xAbsoluteElement.textContent = clientX
            yAbsoluteElement.textContent = clientY
            xRelativeElement.textContent = clientX - gestureElementRect.left
            yRelativeElement.textContent = clientY - gestureElementRect.top
            styleUpdateTimer = window.setTimeout(() => {
                gestureElement.classList.remove(interactiveSelectedClassname)
            }, 150)
        },
        onPpointercancel(evte, { clientX, clientY }, gesture) {
            console.log({ clientX, clientY })
        },
    })
})(globalContainerElement.querySelector('[data-tagitem="pointermove"]'));


/****************************** ******************************/
/****************************** ******************************/
/** Tap ***/
/****************************** ******************************/
/****************************** ******************************/
;(function(sectionElement) {
    const gestureElement = sectionElement.querySelector('[data-tagitem="gesture"]')
    const countElement = sectionElement.querySelector('[data-tagitem="event-count"]')
    const xAbsoluteElement = sectionElement.querySelector('[data-tagitem="event-absolute-x"]')
    const yAbsoluteElement = sectionElement.querySelector('[data-tagitem="event-absolute-y"]')

    let eventCount = 0
    let styleUpdateTimer = null
    xGesture.attach(gestureElement, {
        onTap(evte, { tapX, tapY }, gesture) {
            console.log({ tapX, tapY })
            window.clearTimeout(styleUpdateTimer)
            gestureElement.classList.add(interactiveSelectedClassname)
            countElement.textContent = ++eventCount
            xAbsoluteElement.textContent = tapX
            yAbsoluteElement.textContent = tapY
            styleUpdateTimer = window.setTimeout(() => {
                gestureElement.classList.remove(interactiveSelectedClassname)
            }, 85)
        },
    })
})(globalContainerElement.querySelector('[data-tagitem="tap"]'));


/****************************** ******************************/
/****************************** ******************************/
/** Long Tap ***/
/****************************** ******************************/
/****************************** ******************************/
;(function(sectionElement) {
    const gestureElement = sectionElement.querySelector('[data-tagitem="gesture"]')
    const countElement = sectionElement.querySelector('[data-tagitem="event-count"]')
    const xAbsoluteElement = sectionElement.querySelector('[data-tagitem="event-absolute-x"]')
    const yAbsoluteElement = sectionElement.querySelector('[data-tagitem="event-absolute-y"]')

    let eventCount = 0
    let styleUpdateTimer = null

    AlertManager.setBtns([AlertManager.defaultConfirmBtn, AlertManager.defaultCancelBtn])

    xGesture.attach(gestureElement, {
        isPreventDefaultInLongDown: true,
        onLongTap(evte, { tapX, tapY }, gesture) {
            console.log({ tapX, tapY })
            window.clearTimeout(styleUpdateTimer)
            gestureElement.classList.add(interactiveSelectedClassname)
            countElement.textContent = ++eventCount
            xAbsoluteElement.textContent = tapX
            yAbsoluteElement.textContent = tapY
            AlertManager.open(`触发了 longTap 事件`, {
                callback(tag) {
                    console.log(tag)
                    this.close()
                }
            })
            styleUpdateTimer = window.setTimeout(() => {
                gestureElement.classList.remove(interactiveSelectedClassname)
            }, 85)
        },
    })
})(globalContainerElement.querySelector('[data-tagitem="longtap"]'));


/****************************** ******************************/
/****************************** ******************************/
/** Single Tap ***/
/****************************** ******************************/
/****************************** ******************************/
;(function(sectionElement) {
    const gestureElement = sectionElement.querySelector('[data-tagitem="gesture"]')
    const countElement = sectionElement.querySelector('[data-tagitem="event-count"]')
    const xAbsoluteElement = sectionElement.querySelector('[data-tagitem="event-absolute-x"]')
    const yAbsoluteElement = sectionElement.querySelector('[data-tagitem="event-absolute-y"]')

    let eventCount = 0
    let styleUpdateTimer = null
    xGesture.attach(gestureElement, {
        onSingleTap(evte, { tapX, tapY }, gesture) {
            console.log({ tapX, tapY })
            window.clearTimeout(styleUpdateTimer)
            gestureElement.classList.add(interactiveSelectedClassname)
            countElement.textContent = ++eventCount
            xAbsoluteElement.textContent = tapX
            yAbsoluteElement.textContent = tapY
            styleUpdateTimer = window.setTimeout(() => {
                gestureElement.classList.remove(interactiveSelectedClassname)
            }, 85)
        },
    })
})(globalContainerElement.querySelector('[data-tagitem="singletap"]'));


/****************************** ******************************/
/****************************** ******************************/
/** Double Tap ***/
/****************************** ******************************/
/****************************** ******************************/
;(function(sectionElement) {
    const gestureElement = sectionElement.querySelector('[data-tagitem="gesture"]')
    const countElement = sectionElement.querySelector('[data-tagitem="event-count"]')
    const xAbsoluteElement = sectionElement.querySelector('[data-tagitem="event-absolute-x"]')
    const yAbsoluteElement = sectionElement.querySelector('[data-tagitem="event-absolute-y"]')

    let eventCount = 0
    let styleUpdateTimer = null
    xGesture.attach(gestureElement, {
        onDoubleTap(evte, { tapX, tapY }, gesture) {
            console.log({ tapX, tapY })
            window.clearTimeout(styleUpdateTimer)
            gestureElement.classList.add(interactiveSelectedClassname)
            countElement.textContent = ++eventCount
            xAbsoluteElement.textContent = tapX
            yAbsoluteElement.textContent = tapY
            styleUpdateTimer = window.setTimeout(() => {
                gestureElement.classList.remove(interactiveSelectedClassname)
            }, 85)
        },
    })
})(globalContainerElement.querySelector('[data-tagitem="doubletap"]'));


/****************************** ******************************/
/****************************** ******************************/
/** Drag Move ***/
/****************************** ******************************/
/****************************** ******************************/
;(function(sectionElement) {
    const gestureElement = sectionElement.querySelector('[data-tagitem="gesture"]')
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
    let gestureElementRect = null
    xGesture.attach(gestureElement, {
        cssTouchAction: 'none',
        onDragMove(evte, { movePosition, moveDirection, distX, distY, diffX, diffY, clientX, clientY }, gesture) {
            console.log({ movePosition, moveDirection, distX, distY, diffX, diffY, clientX, clientY })
            window.clearTimeout(styleUpdateTimer)
            gestureElement.classList.add(interactiveSelectedClassname)
            gestureElementRect = gestureElement.getBoundingClientRect()
            xAbsoluteElement.textContent = clientX
            yAbsoluteElement.textContent = clientY
            xRelativeElement.textContent = clientX - gestureElementRect.left
            yRelativeElement.textContent = clientY - gestureElementRect.top
            xSpeedElement.textContent = diffX
            ySpeedElement.textContent = diffY
            positionMoveElement.textContent = movePosition
            directionMoveElement.textContent = moveDirection
            xDistElement.textContent = distX
            yDistElement.textContent = distY
            styleUpdateTimer = window.setTimeout(() => {
                gestureElement.classList.remove(interactiveSelectedClassname)
            }, 150)
        },
    })
})(globalContainerElement.querySelector('[data-tagitem="dragmove"]'));


/****************************** ******************************/
/****************************** ******************************/
/** Swipe ***/
/****************************** ******************************/
/****************************** ******************************/
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


/****************************** ******************************/
/****************************** ******************************/
/** Wheel ***/
/****************************** ******************************/
/****************************** ******************************/
;(function(sectionElement) {
    const gestureElement = sectionElement.querySelector('[data-tagitem="gesture"]')
    const targetImageElement = sectionElement.querySelector('[data-tagitem="target-image"]')
    const scaleValueElement = sectionElement.querySelector('[data-tagitem="scale-value"]')

    class TransfromManager {
        static _scale = 1

        static set scale(value) {
            this._scale = value
        }

        static get scale() {
            return this._scale
        }

        static setTransitionStyle(targetElement, use = false) {
            if (!use) {
                targetElement.style.transition = 'none'
                return
            }
            targetElement.style.transition = 'transform .15s ease'
        }

        static applyTransfromStyle(targetElement) {
            const transform = `scale(${this._scale})`
            targetElement.style.transform = transform
        }
    }

    TransfromManager.setTransitionStyle(targetImageElement, true)

    let styleUpdateTimer = null
    let maxScale = 10
    let minScale = 0.1
    xGesture.attach(gestureElement, {
        onWheel(evte, { scale, clientX, clientY }, gesture) {
            console.log({ scale, clientX, clientY })
            window.clearTimeout(styleUpdateTimer)
            gestureElement.classList.add(interactiveSelectedClassname)
            TransfromManager.scale *= scale
            if (TransfromManager.scale > maxScale) {
                TransfromManager.scale = maxScale
            } else if (TransfromManager.scale < minScale) {
                TransfromManager.scale = minScale
            }
            TransfromManager.applyTransfromStyle(targetImageElement)
            scaleValueElement.textContent = TransfromManager.scale
            styleUpdateTimer = window.setTimeout(() => {
                gestureElement.classList.remove(interactiveSelectedClassname)
            }, 150)
        },
    })
})(globalContainerElement.querySelector('[data-tagitem="wheel"]'));


/****************************** ******************************/
/****************************** ******************************/
/** Pinch ***/
/****************************** ******************************/
/****************************** ******************************/
;(function(sectionElement) {
    const gestureElement = sectionElement.querySelector('[data-tagitem="gesture"]')
    const targetImageElement = sectionElement.querySelector('[data-tagitem="target-image"]')
    const pinchValueElement = sectionElement.querySelector('[data-tagitem="pinch-value"]')
    const xCenterElement = sectionElement.querySelector('[data-tagitem="center-x"]')
    const yCenterElement = sectionElement.querySelector('[data-tagitem="center-y"]')
    const xPoiner1Element = sectionElement.querySelector('[data-tagitem="pointer1-x"]')
    const yPoiner1Element = sectionElement.querySelector('[data-tagitem="pointer1-y"]')
    const xPoiner2Element = sectionElement.querySelector('[data-tagitem="pointer2-x"]')
    const yPoiner2Element = sectionElement.querySelector('[data-tagitem="pointer2-y"]')

    class TransfromManager {
        static _scale = 1

        static set scale(value) {
            this._scale = value
        }

        static get scale() {
            return this._scale
        }

        static setTransitionStyle(targetElement, use = false) {
            if (!use) {
                targetElement.style.transition = 'none'
                return
            }
            targetElement.style.transition = 'transform .15s ease'
        }

        static applyTransfromStyle(targetElement) {
            const transform = `scale(${this._scale})`
            targetElement.style.transform = transform
        }
    }

    TransfromManager.setTransitionStyle(targetImageElement, true)

    let styleUpdateTimer = null
    let maxWScale = 10
    let minScale = 0.1
    xGesture.attach(gestureElement, {
        cssTouchAction: 'none',
        onPinch(evte, { scale, centerX, centerY, lastCenterX, lastCenterY, pointA, pointB }, gesture) {
            console.log({ scale, centerX, centerY, lastCenterX, lastCenterY, pointA, pointB })
            window.clearTimeout(styleUpdateTimer)
            gestureElement.classList.add(interactiveSelectedClassname)
            xCenterElement.textContent = centerX
            yCenterElement.textContent = centerY
            xPoiner1Element.textContent = pointA.x
            yPoiner1Element.textContent = pointA.x
            xPoiner2Element.textContent = pointB.x
            yPoiner2Element.textContent = pointB.x
            TransfromManager.scale *= scale
            if (TransfromManager.scale > maxWScale) {
                TransfromManager.scale = maxWScale
            } else if (TransfromManager.scale < minScale) {
                TransfromManager.scale = minScale
            }
            TransfromManager.applyTransfromStyle(targetImageElement)
            pinchValueElement.textContent = TransfromManager.scale
            styleUpdateTimer = window.setTimeout(() => {
                gestureElement.classList.remove(interactiveSelectedClassname)
            }, 150)
        },
    })
})(globalContainerElement.querySelector('[data-tagitem="pinch"]'));


/****************************** ******************************/
/****************************** ******************************/
/** Rotate ***/
/****************************** ******************************/
/****************************** ******************************/
;(function(sectionElement) {
    const gestureElement = sectionElement.querySelector('[data-tagitem="gesture"]')
    const targetImageElement = sectionElement.querySelector('[data-tagitem="target-image"]')
    const rotateValueElement = sectionElement.querySelector('[data-tagitem="rotate-value"]')
    const xCenterElement = sectionElement.querySelector('[data-tagitem="center-x"]')
    const yCenterElement = sectionElement.querySelector('[data-tagitem="center-y"]')
    const xPoiner1Element = sectionElement.querySelector('[data-tagitem="pointer1-x"]')
    const yPoiner1Element = sectionElement.querySelector('[data-tagitem="pointer1-y"]')
    const xPoiner2Element = sectionElement.querySelector('[data-tagitem="pointer2-x"]')
    const yPoiner2Element = sectionElement.querySelector('[data-tagitem="pointer2-y"]')

    class TransfromManager {
        static _rorate = 1

        static set rorate(value) {
            this._rorate = value
        }

        static get rorate() {
            return this._rorate
        }

        static setTransitionStyle(targetElement, use = false) {
            if (!use) {
                targetElement.style.transition = 'none'
                return
            }
            targetElement.style.transition = 'transform .15s ease'
        }

        static applyTransfromStyle(targetElement) {
            const transform = `rotate(${this._rorate}deg)`
            targetElement.style.transform = transform
        }
    }

    TransfromManager.setTransitionStyle(targetImageElement, true)

    let styleUpdateTimer = null
    xGesture.attach(gestureElement, {
        cssTouchAction: 'none',
        onPinch(evte, { rotate, centerX, centerY, lastCenterX, lastCenterY, pointA, pointB }, gesture) {
            console.log({ rotate, centerX, centerY, lastCenterX, lastCenterY, pointA, pointB })
            window.clearTimeout(styleUpdateTimer)
            gestureElement.classList.add(interactiveSelectedClassname)
            xCenterElement.textContent = centerX
            yCenterElement.textContent = centerY
            xPoiner1Element.textContent = pointA.x
            yPoiner1Element.textContent = pointA.x
            xPoiner2Element.textContent = pointB.x
            yPoiner2Element.textContent = pointB.x
            TransfromManager.rorate = (TransfromManager.rorate + _rotate) % 360
            TransfromManager.applyTransfromStyle(evte.currentTarget)
            rotateValueElement.textContent = TransfromManager.rorate
            styleUpdateTimer = window.setTimeout(() => {
                gestureElement.classList.remove(interactiveSelectedClassname)
            }, 150)
        },
    })
})(globalContainerElement.querySelector('[data-tagitem="rotate"]'));

