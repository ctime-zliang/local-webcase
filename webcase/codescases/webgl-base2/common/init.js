const PI = Math.PI

function initWebGLContext(canvasElement) {
    gVars.canvasElement = canvasElement
    return canvasElement.getContext('webgl')
}

function init2DContext(canvasElement) {
    gVars.canvasElement = canvasElement
    return canvasElement.getContext('2d')
}