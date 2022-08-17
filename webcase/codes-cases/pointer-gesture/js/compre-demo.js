;(function(sectionElement) {
    const imageViewContainerElement = sectionElement.querySelector('[data-tagitem="imageViewContainer"]')
    const pointerListElement = sectionElement.querySelector('[data-tagitem="pointer-list"]')
    const scaleValueElement = sectionElement.querySelector('[data-tagitem="scale-value"]')
    const rotateValueElement = sectionElement.querySelector('[data-tagitem="rotate-value"]')

    class TransfromManager {
        static _scale = 1
        static _rotate = 0
        static _translateX = 0
        static _translateY = 0
        static _translateZ = 5

        static set scale(value) {
            this._scale = value
        }

        static get scale() {
            return this._scale
        }

        static set rotate(value) {
            this._rotate = value
        }

        static get rotate() {
            return this._rotate
        }

        static set translateX(value) {
            this._translateX = value
        }

        static get translateX() {
            return this._translateX
        }

        static set translateY(value) {
            this._translateY = value
        }

        static get translateY() {
            return this._translateY
        }

        static set translateZ(value) {
            this._translateZ = value
        }

        static get translateZ() {
            return this._translateZ
        }

        static setTransitionStyle(targetElement, use = false) {
            if (!use) {
                targetElement.style.transition = 'none'
                return
            }
            targetElement.style.transition = 'transform .3s ease'
        }

        static applyTransfromStyle(targetElement) {
            const transform = `translate3d(${this.translateX}px, ${this._translateY}px, ${this._translateZ}px) scale(${this._scale}) rotate(${this._rotate})`
            targetElement.style.transform = transform
        }
    }

    const profile = {
        maxScale: 3,
        minScale: 1,
        maxWheelScale:  10,
        minWheelScale:  0.1,
        isWheelDispatch: false,
        pointerdownTarget: null
    }
    const initImageDOM = async () => {
        return new Promise((_) => {
            const imageElement = new Image()
            imageElement.onload = function(e) {
                _({ width: this.width, height: this.height, image: this })
            }
            imageElement.style.opacity = '0'
            imageElement.src = './images/demo1.jpg'
            imageViewContainerElement.appendChild(imageElement)
        })
    }
    const initImageSize = (imageElement) => {
        const containerRect = {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        }
        const sizeResult = ven$zoomImageByContainer(imageElement.width, imageElement.height, containerRect.width, containerRect.height)
        const top = (containerRect.height - sizeResult.height) / 2
        const left = (containerRect.width - sizeResult.width) / 2
        imageElement.style.height = `${sizeResult.height}px`
        imageElement.style.width = `${sizeResult.width}px`
        imageElement.style.opacity = '1'
        TransfromManager.setTransitionStyle(imageElement, false)
        TransfromManager.applyTransfromStyle(imageElement)
        return sizeResult
    }
    const init = async () => {
        const imageLoadRes = await initImageDOM()
        const sizeResult = initImageSize(imageLoadRes.image)
        const imageClientRectJSON = imageLoadRes.image.getBoundingClientRect().toJSON()
        Object.keys(sizeResult).forEach((item) => {
            profile[item] = sizeResult[item]
        })
        Object.keys(imageClientRectJSON).forEach((item) => {
            profile[item] = imageClientRectJSON[item]
        })
        profile.maxScale = 1 / profile.containerScale

        bindEvent(imageLoadRes.image)
    }
    const bindEvent = (imageElement) => {
        xGesture.attach(imageElement.parentElement, {
            cssTouchAction: 'none',
            onWheel(evte, { scale, clientX, clientY }, gesture) {
                profile.isWheelDispatch = true
                TransfromManager.scale *= scale
                if (TransfromManager.scale > profile.maxWheelScale) {
                    TransfromManager.scale = profile.maxWheelScale
                } else if (TransfromManager.scale < profile.minWheelScale) {
                    TransfromManager.scale = profile.minWheelScale
                }
                TransfromManager.setTransitionStyle(imageElement, true)
                TransfromManager.applyTransfromStyle(imageElement)
                scaleValueElement.textContent = TransfromManager.scale
            },
            onContextmenu(evte, { clientX, clientY }, gesture) {
                evte.preventDefault()
            },
            onPointerdown(evte, { clientX, clientY }, gesture) {
                profile.pointerdownTarget = evte.target
                updatePointersPositionShow(gesture.getAllPointers())
            },
            onPointermove(evte, { clientX, clientY }, gesture) {
                updatePointersPositionShow(gesture.getAllPointers())
            },
            onPointerup(evte, { clientX, clientY }, gesture) {
                profile.pointerdownTarget = null
                updatePointersPositionShow(gesture.getAllPointers())
            },
            onDragMove(evte, { movePosition, moveDirection, distX, distY, diffX, diffY, clientX, clientY }, gesture) {
                if (profile.pointerdownTarget !== imageElement) {
                    return
                }
                TransfromManager.translateX += diffX
                TransfromManager.translateY += diffY
                TransfromManager.setTransitionStyle(imageElement, false)
                TransfromManager.applyTransfromStyle(imageElement)
            },
            onDoubleTap(evte, { tapX, tapY }, gesture) {
                const offsetX = tapX - profile.width / 2
                const offsetY = tapX - profile.height / 2
                if (profile.isWheelDispatch) {
                    TransfromManager.translateX = 0
                    TransfromManager.translateY = 0
                    TransfromManager.scale = 1
                    profile.isWheelDispatch = false
                } else {
                    if (TransfromManager.scale <= 1) {
                        TransfromManager.setTransitionStyle(imageElement, false)
                        TransfromManager.translateX = 0
                        TransfromManager.translateY = 0
                        TransfromManager.applyTransfromStyle(imageElement)
                        TransfromManager.scale = profile.maxScale
                        TransfromManager.translateX = -1 * offsetX * TransfromManager.scale
                        const translateXMax = (profile.width / 2)  * TransfromManager.scale - profile.width / 2
                        if (TransfromManager.translateX >= translateXMax) {
                            TransfromManager.translateX = translateXMax
                        }
                        const translateXMin = -1 * translateXMax
                        if (TransfromManager.translateX <= translateXMin) {
                            TransfromManager.translateX = translateXMin
                        }
                    } else {
                        TransfromManager.scale = 1
                        TransfromManager.translateX = 0
                        TransfromManager.translateY = 0
                    }
                }
                TransfromManager.setTransitionStyle(imageElement, true)
                TransfromManager.applyTransfromStyle(imageElement)
                scaleValueElement.textContent = TransfromManager.scale
                console.log(profile)
            },
        })
    }
    const updatePointersPositionShow = (allPointers) => {
        let htmlStringArray = []
        allPointers.forEach((item) => {
            htmlStringArray.push(`<span>[${item.clientX}, ${item.clientY}]</span>`)
        })
        if (!htmlStringArray.length) {
            pointerListElement.innerHTML = `-`
            return
        }
        pointerListElement.innerHTML = htmlStringArray.join(', ')
    }

    init()
    
})(globalContainerElement.querySelector('[data-tagitem="fullcaseContainer"]'));
