function init() {
    const canvasElement = document.getElementById('webglCanvas')
    gVars.initCanvasHandler(canvasElement)

    const drawGraphicTypeSelectorDataList = [
        { text: 'Simple Rect Dot', value: 'SimpleRectDotDraw', },
        { text: 'Simple Rect', value: 'SimpleRectDraw', },
        { text: 'Simple Triangle', value: 'SimpleTriangleDraw', },
        { text: 'Simple Cube', value: 'SimpleCubeDraw', },
        { text: 'Simple Cube2', value: 'SimpleCube2Draw', },
        { text: ' Simple Gradient Line', value: 'SimpleGradientLineDraw', },
        { text: ' Simple Gradient Triangle', value: 'SimpleGradientTriangleDraw', },
        { text: ' Simple Colourful Cube', value: 'SimpleColourfulCubeDraw', }
    ]
    const selectedValue = drawGraphicTypeSelectorDataList[drawGraphicTypeSelectorDataList.length - 1].value
    handlerDrawGraphicTypeSelector(
        document.getElementById('drawGraphicTypeSelector'), 
        drawGraphicTypeSelectorDataList, 
        selectedValue,
        (controllerName) => {
            if (!window[controllerName]) {
                console.warn(`${controllerName} is not found on window.`)
                return
            }
            window[controllerName].render(gVars.gl)
        }
    )
}

function main() {
    console.log(gVars)
}

init()
main()
