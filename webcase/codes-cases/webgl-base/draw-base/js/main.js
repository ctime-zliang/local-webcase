function main() {
    const canvasElement = document.getElementById('webglCanvas')
    gVars.initCanvasHandler(canvasElement)

    // SimpleRectDotDraw.render(gVars.gl)
    // SimpleRectDraw.render(gVars.gl)
    SimpleTriangleDraw.render(gVars.gl)

    console.log(gVars)
}

main()
