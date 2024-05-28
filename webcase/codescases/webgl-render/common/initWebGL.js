function initWebGLContext(canvasElement) {
	gVars.canvasElement = canvasElement
	return canvasElement.getContext('webgl')
}

function init2DContext(canvasElement) {
	gVars.canvasElement = canvasElement
	return canvasElement.getContext('2d')
}

function createShader(gl, type, source) {
	const shader = gl.createShader(type)
	if (shader === null) {
		console.log('unable to create shader.')
		return null
	}
	gl.shaderSource(shader, source)
	gl.compileShader(shader)
	const result = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
	if (result) {
		return shader
	}
	const info = gl.getShaderInfoLog(shader)
	console.log('failed to compile shader: ' + info)
	gl.deleteShader(shader)
	return null
}

function createProgram(gl, vertexShader, fragmentShader) {
	const program = gl.createProgram()
	if (!program) {
		return null
	}
	gl.attachShader(program, vertexShader)
	gl.attachShader(program, fragmentShader)
	gl.linkProgram(program)
	const result = gl.getProgramParameter(program, gl.LINK_STATUS)
	if (result) {
		return program
	}
	const info = gl.getProgramInfoLog(program)
	console.log('failed to link program: ' + info)
	gl.deleteProgram(program)
	return null
}

function createBuffer(gl, attribute, options) {
	const { size, type, normalize, stride, offset } = options
	gl.enableVertexAttribArray(attribute)
	const buffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
	gl.vertexAttribPointer(attribute, size, type || gl.FLOAT, normalize || false, stride || 0, offset || 0)
	return buffer
}

function initWebGL(gl, vertexShaderSouce, fragmentShaderSouce) {
	const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSouce)
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSouce)
	const program = createProgram(gl, vertexShader, fragmentShader)
	gl.useProgram(program)
	return program
}
