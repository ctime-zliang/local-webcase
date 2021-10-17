const initFormData = {
    canvasMode: 'drawing',
    geometryType: 'circle'
}

const formControl = {
    container: null,
    inputElements: [],
    changeCallback: null,
    init() {
        this.inputElements = Array.from(this.container.querySelectorAll('[data-forminput-name]'))
        this.bindEvent()
    }, 
    getValueByKey(geometryType, key) {
        const wrapper = this.container.querySelector(`[data-tagitem-geometry-setting="${geometryType}"]`)
        if (!wrapper) {
            return undefined
        }
        const element = wrapper.querySelector(`[data-forminput-name="${key}"]`)
        if (!element) {
            return
        }
        let value = undefined
        switch (element.type) {
            case 'select-one': {
                value = element.value
                break
            }
            case 'radio': {
                const elementsOfName = this.container.querySelectorAll(`[name="${element.getAttribute('name')}"]`)
                for (let j = 0; j < elementsOfName.length; j++) {
                    if (elementsOfName[j].checked) {
                        value = elementsOfName[j].value
                        break
                    }
                }
                break
            }
            case 'checkbox': {
                value = !!element.checked
                break
            }
            default: {
                value = element.value
            }
        }
        return value
    },
    bindEvent() {
        const extendTagElements = this.container.querySelectorAll('[data-tagitem-geometry-setting]')
        for (let i = 0; i < this.inputElements.length; i++) {
            const element = this.inputElements[i]
            element.addEventListener('input', (evte) => {
                const attr = evte.currentTarget.getAttribute('data-forminput-name')
                const value = evte.currentTarget.type === 'checkbox' ? evte.currentTarget.checked : evte.currentTarget.value
                switch(attr) {
                    case 'geometryType': {
                            Array.from(extendTagElements).forEach(el => {
                                if (el.getAttribute('data-tagitem-geometry-setting') === value) {
                                    el.style.display = 'block'
                                } else {
                                    el.style.display = 'none'
                                }
                            })
                        break
                    }
                    default:;
                }
                this.changeCallback && this.changeCallback(attr, value)
            }, false)
        }
    }
}

function modifyCanvasControl(canvasHandler, key, value, formControl) {
    switch(key) {
        case 'canvasMode': {
            if (value === 'drawing') {
                canvasHandler.toggleStateToDrawing()
            } else if (value === 'select') {
                canvasHandler.toggleStateToSelect()
            }
            break
        }
        case 'geometryType': {
            /* 画笔几何图形设置 */
            if (value === 'circle') {
                canvasHandler.setGeometryConstructor(Circle)
            } else if (value === 'rectangle') {
                canvasHandler.setGeometryConstructor(Rect)
            } else if (value === 'line') {
                canvasHandler.setGeometryConstructor(Line)
            }
            /* 画笔样式设置 */
            const strokeStyle = formControl.getValueByKey(value, 'strokeStyle')
            const fillStyle = formControl.getValueByKey(value, 'fillStyle')
            const toolState = canvasHandler.getToolState()
            if (typeof strokeStyle !== 'undefined') {
                toolState.paintBrushState.strokeStyle = strokeStyle
            }
            if (typeof fillStyle !== 'undefined') {
                toolState.paintBrushState.fillStyle = fillStyle
            }            
            /* 画布辅助样式设置 */
            const smooth = formControl.getValueByKey(value, 'smooth')
            if (typeof smooth !== 'undefined') {
                toolState.smooth = smooth
            }
            canvasHandler.setToolState(toolState)
            break
        }
        case 'strokeStyle':
        case 'fillStyle': {
            const toolState = canvasHandler.getToolState()
            toolState.paintBrushState[key] = value
            canvasHandler.setToolState(toolState)
            break
        }
        case 'smooth': {
            const toolState = canvasHandler.getToolState()
            toolState.smooth = value
            canvasHandler.setToolState(toolState)
        }
        default:;
    }
}





window.onload = function() {
    function createGeometries() {
        const arr = []
        for (let i = 0; i < 1000 * 50; i++) {
            arr.push(new Circle(utils.getRandom(50, 1100), getRandom(50, 500), getRandom(50, 100)))
        }
        return arr
    }

    



    const ccer = new CanvasContoller(document.querySelector('canvas'))
    ccer.setGeometryConstructor(Circle)
    ccer.toggleStateToDrawing()
    ccer.on(EVENT_NS.DRAW_START, (res) => {
        // console.log(res, ccer)
    })
    ccer.on(EVENT_NS.DRAW_FINISHED, (res) => {
        // console.log(res, ccer)
    })
    ccer.on(EVENT_NS.SELECT_ONE, (res) => {
        console.log(res, ccer)
    })
    ccer.on(EVENT_NS.CANCEL_SELECT, (res) => {
        console.log(res, ccer)
    })
    ccer.on(EVENT_NS.DELETE_ONE, (res) => {
        console.log(res, ccer)
    })
    console.log(ccer)

    



    window.setTimeout(() => {
        // ccer.pushGeometries(createGeometries())
        // console.time('CanvasRerender')
        // ccer.rerender()
        // console.timeEnd('CanvasRerender')
    })



    formControl.container = document.querySelector('.canvas-menu-wrapper')
    formControl.changeCallback = (key, value) => {
        modifyCanvasControl(ccer, key, value, formControl)
    }
    formControl.init()
}