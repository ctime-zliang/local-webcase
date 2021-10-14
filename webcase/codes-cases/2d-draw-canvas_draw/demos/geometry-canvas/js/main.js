window.onload = function() {
    const scene = new Scene(document.querySelector('canvas'))
    scene.setGeometryConstructor(Circle)
    scene.on(EVENT_NS.DRAW_START, (res) => {
        console.log(res, scene)
    })
    scene.on(EVENT_NS.DRAW_FINISHED, (res) => {
        console.log(res, scene)
    })
    console.log(scene)
}