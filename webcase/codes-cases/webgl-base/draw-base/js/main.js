const DRAWTYPE_SIMPLE_RECT_DOT = 'SimpleRectDotDraw'
const DRAWTYPE_SIMPLE_RECT = 'SimpleRectDraw'
const DRAWTYPE_SIMPLE_TRIANGLE = 'SimpleTriangleDraw'
const DRAWTYPE_SIMPLE_CUBE = 'SimpleCubeDraw'
const DRAWTYPE_SIMPLE_CUBE2 = 'SimpleCube2Draw'
const DRAWTYPE_SIMPLE_GRADIENT_LINE = 'SimpleGradientLineDraw'
const DRAWTYPE_SIMPLE_GRADIENT_TRIANGLE = 'SimpleGradientTriangleDraw'
const DRAWTYPE_SIMPLE_COLOURFUL_CUBE = 'SimpleColourfulCubeDraw'
const DRAWTYPE_SIMPLE_LIGHT_CUBE = 'SimpleLightCubeDraw'

function drawGraphicsModifiedHandler(selectedValue) {
    switch(selectedValue) {
        case DRAWTYPE_SIMPLE_COLOURFUL_CUBE: {
            gVars.canvasElement.style.backgroundColor = '#000000'
            break
        }
        case DRAWTYPE_SIMPLE_LIGHT_CUBE: {
            gVars.canvasElement.style.backgroundColor = '#000000'
            break
        }
        default: {
            gVars.canvasElement.style.backgroundColor = 'transparent'
        }
    }
} 

function init() {
    const canvasElement = document.getElementById('webglCanvas')
    gVars.initCanvasHandler(canvasElement)

    const drawGraphicTypeSelectorDataList = [
        { text: '简单矩形色块/点', value: DRAWTYPE_SIMPLE_RECT_DOT, },
        { text: '简单矩形', value: DRAWTYPE_SIMPLE_RECT, },
        { text: '简单三角形', value: DRAWTYPE_SIMPLE_TRIANGLE, },
        { text: '简单立方体', value: DRAWTYPE_SIMPLE_CUBE, },
        { text: '简单立方体2', value: DRAWTYPE_SIMPLE_CUBE2, },
        { text: '简单颜色线性渐变线条', value: DRAWTYPE_SIMPLE_GRADIENT_LINE, },
        { text: '简单颜色线性渐变三角形', value: DRAWTYPE_SIMPLE_GRADIENT_TRIANGLE, },
        { text: '简单多色立方体', value: DRAWTYPE_SIMPLE_COLOURFUL_CUBE, },
        { text: '简单平行光光照立方体', value: DRAWTYPE_SIMPLE_LIGHT_CUBE, }
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
            drawGraphicsModifiedHandler(controllerName)
            window[controllerName].render(gVars.gl)
        }
    )
}

function main() {
    console.log(gVars)
}

init()
main()
