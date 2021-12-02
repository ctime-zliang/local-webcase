
function modifyCanvasControl(canvasHandler, data) {
    const idata = { ...data.brushStyle, ...data.control }
    Object.keys(idata).forEach((item) => {
        switch(item) {
            case 'canvasMode': {
                /* 绘图模式设置 */
                if (idata[item] === 'drawing') {
                    canvasHandler.toggleStateToDrawing()
                } else if (idata[item] === 'select') {
                    canvasHandler.toggleStateToSelect()
                }
                break
            }
            case 'geometryType': {
                const geometryType = idata['geometryType']
                /* 图形类型设置 */
                if (geometryType === 'circle') {
                    canvasHandler.setGeometryConstructor(Circle)
                } else if (geometryType === 'rectangle') {
                    canvasHandler.setGeometryConstructor(Rect)
                } else if (geometryType === 'line') {
                    canvasHandler.setGeometryConstructor(Line)
                }
                if (idata[geometryType]) {
                    /* 画笔样式设置 */
                    const toolState = canvasHandler.getToolState()
                    if (typeof idata[geometryType].smooth !== 'undefined') {
                        toolState.smooth = !!idata[geometryType].smooth
                        delete idata[geometryType].smooth
                    }                
                    toolState.paintBrushState = {
                        ...toolState.paintBrushState,
                        ...idata[geometryType]
                    }
                    canvasHandler.setToolState(toolState)
                }                
                break
            }
            default:;
        }
    })
    
}





window.onload = function() {
    function createGeometries() {
        const arr = []
        const len = 100
        for (let i = 0; i < len; i++) {
            arr.push(new Circle(utils.getRandom(100, 1000), utils.getRandom(100, 400), utils.getRandom(50, 80)))
            // arr.push(new Circle((i + 1) * 120, 100, (i + 1) + 50))
        }
        return arr
    }





    const canvasContoller = new CanvasContoller(document.querySelector('canvas'))
    canvasContoller.init()
    canvasContoller.setGeometryConstructor(Circle)
    canvasContoller.toggleStateToSelect()
    console.log(canvasContoller)





    window.setTimeout(() => {
        const ges = createGeometries()
        const arr = []
        const interval = window.setInterval(() => {
            if (!ges.length) {
                window.clearInterval(interval)
                return
            }
            const item = ges.pop()
            canvasContoller.clearAllGeometries()
            canvasContoller.pushGeometries((arr.push(item), arr))
            console.time('CanvasRerender')
            canvasContoller.rerender()
            console.timeEnd('CanvasRerender')
        }, 75)
        // canvasContoller.clearAllGeometries()
        // canvasContoller.pushGeometries(createGeometries())
        // console.time('CanvasRerender')
        // canvasContoller.rerender()
        // console.timeEnd('CanvasRerender')
    })



    formControl.container = document.querySelector('.canvas-menu-wrapper')
    formControl.changeCallback = (data) => {
        modifyCanvasControl(canvasContoller, data)
    }
    formControl.init()
}