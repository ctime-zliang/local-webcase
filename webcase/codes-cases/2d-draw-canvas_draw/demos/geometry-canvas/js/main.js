window.onload = function() {
    const scene = new Scene(document.querySelector('canvas'))
    scene.setGeometryConstructor(Circle)
    console.log(scene)
}