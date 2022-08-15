;(function(sectionElement) {
    const imageViewContainerElement = sectionElement.querySelector('[data-tagitem="imageViewContainer"]')
    const pointerListElement = sectionElement.querySelector('[data-tagitem="pointer-list"]')
    const scaleValueElement = sectionElement.querySelector('[data-tagitem="scale-value"]')
    const rotateValueElement = sectionElement.querySelector('[data-tagitem="rotate-value"]')

    class TransfromManager {
        static scale = 1
        static rotate = 0
        static translateX = 0
        static translateY = 0
        static translateZ = 5

        static setScale(value) {
            this.scale = value
        }

        static getScale() {
            return this.scale
        }

        static setRotate(value) {
            this.rotate = value
        }

        static getRotate() {
            return this.rotate
        }

        static setTranslateX(value) {
            this.translateX = value
        }

        static getTranslateX() {
            return this.translateX
        }

        static setTranslateY(value) {
            this.translateY = value
        }

        static getTranslateY() {
            return this.translateY
        }

        static setTranslateZ(value) {
            this.translateZ = value
        }

        static getTranslateZ() {
            return this.translateZ
        }

        static setTransitionStyle(targetElement, use = false) {
            if (!use) {
                targetElement.style.transition = 'none'
                return
            }
            targetElement.style.transition = 'transform .3s ease'
        }

        static applyTransfromStyle(targetElement) {
            targetElement.style.transform = this.getString()
        }

        static getString() {
            return `translate3d(${this.translateX}px, ${this.translateY}px, ${this.translateZ}px) scale(${this.scale}) rotate(${this.rotate})`
        }
    }

    const profile = {
        maxScale: 0,
        minScale: 0,
        width: 0,
        height: 0
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
    const initImageSize = (imageElement, containerElement) => {
        const containerRect = containerElement.getBoundingClientRect()
        const sizeResult = ven$zoomImageByContainer(imageElement.width, imageElement.height, containerRect.width, containerRect.height)
        const top = (containerRect.height - sizeResult.height) / 2
        const left = (containerRect.width - sizeResult.width) / 2
        imageElement.style.height = `${sizeResult.height}px`
        imageElement.style.width = `${sizeResult.width}px`
        imageElement.style.opacity = '1'
        TransfromManager.setTransitionStyle(imageElement, false)
        TransfromManager.applyTransfromStyle(imageElement)
        // imageElement.style.top = `${top}px`
        // imageElement.style.left = `${left}px`
        // imageElement.style.position = `absolute`
        return sizeResult
    }
    const init = async () => {
        const imageLoadRes = await initImageDOM()
        const sizeResult = initImageSize(imageLoadRes.image, imageViewContainerElement)
        profile.maxScale = Math.max(Math.round(imageLoadRes.width / sizeResult.width), 3)
        profile.width = sizeResult.width
        profile.height = sizeResult.height

        bindEvent(imageLoadRes.image)
    }
    const bindEvent = (imageElement) => {
        xGesture.attach(imageElement, {
            cssTouchAction: 'none',
            onContextmenu(evte, { clientX, clientY }, gesture) {
                evte.preventDefault()
            },
            onPointerdown(evte, { clientX, clientY }, gesture) {
                updatePointersPositionShow(gesture.getAllPointers())
                console.log(evte, { clientX, clientY }, gesture)
            },
            onPointermove(evte, { clientX, clientY }, gesture) {
                updatePointersPositionShow(gesture.getAllPointers())
            },
            onPointerup(evte, { clientX, clientY }, gesture) {
                updatePointersPositionShow(gesture.getAllPointers())
                console.log(evte, { clientX, clientY }, gesture)
            },
            onDoubleTap(evte, { tapX, tapY }, gesture) {
                let ratio = 1 / TransfromManager.getScale()
                if (TransfromManager.getScale() <= 1) {
                    TransfromManager.setScale(profile.maxScale / TransfromManager.getScale())
                }
                const origin = {
                    x: (ratio - 1) * profile.width / 2,
                    y: (ratio - 1) * profile.height / 2,
                }
                // TransfromManager.setTranslateX(TransfromManager.getTranslateX() - ((ratio - 1) * (tapX - TransfromManager.getTranslateX()) - origin.x))
                // TransfromManager.setTranslateY(TransfromManager.getTranslateY() - ((ratio - 1) * (tapY - TransfromManager.getTranslateY()) - origin.x))
                TransfromManager.setScale(TransfromManager.getScale() * ratio)
                TransfromManager.setTransitionStyle(evte.currentTarget, true)
                TransfromManager.applyTransfromStyle(evte.currentTarget)
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
