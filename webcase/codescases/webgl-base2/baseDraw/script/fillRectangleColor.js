const canvasElement = document.getElementById('webglCanvas')

function main() {
	gVars.canvasRect = canvasElement.getBoundingClientRect().toJSON()
	gVars.webglContext = initWebGLContext(canvasElement)
	console.log(gVars)

	const gl = gVars.webglContext

	gl.clearColor(1.0, 1.0, 0.0, 0.5)
	gl.clear(gl.COLOR_BUFFER_BIT)
}

window.addEventListener('DOMContentLoaded', main)
