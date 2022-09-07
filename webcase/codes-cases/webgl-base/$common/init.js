const gVars = {}

gVars.initCanvasHandler = (canvasElement) => {
    gVars.canvasElement = canvasElement
    gVars.gl = gVars.canvasElement.getContext('webgl')
}
