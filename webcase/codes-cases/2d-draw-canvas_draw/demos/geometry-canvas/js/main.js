const initFormData = {
    canvasMode: 'drawing',
    geometryType: 'circle'
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function modifyScene(scene, key, value, formData) {
    switch(key) {
        case 'canvasMode': {
            if (value === 'drawing') {
                scene.toggleStateToDrawing()
            } else if (value === 'select') {
                scene.toggleStateToSelect()
            }
        }
    }
}

window.onload = function() {
    const ccer = new CanvasContoller(document.querySelector('canvas'))
    ccer.setGeometryConstructor(Circle)
    ccer.toggleStateToDrawing()
    ccer.on(EVENT_NS.DRAW_START, (res) => {
        console.log(res, ccer)
    })
    ccer.on(EVENT_NS.DRAW_FINISHED, (res) => {
        console.log(res, ccer)
    })
    console.log(ccer)




    const formControl = new FormControl(document.querySelector('.canvas-menu-wrapper'))
    formControl.setData(initFormData)
    formControl.on('change', (key, value, formData) => {
        modifyScene(ccer, key, value, formData)
    })
}