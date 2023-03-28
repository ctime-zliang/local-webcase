const PI = Math.PI

function initWebGLContext(canvasElement) {
	gVars.canvasElement = canvasElement
	return canvasElement.getContext('webgl')
}

function init2DContext(canvasElement) {
	gVars.canvasElement = canvasElement
	return canvasElement.getContext('2d')
}

function setShaderProgram(
	gl, 
	vertexShaderSource, 
	fragmentShaderSource, 
	notUseprogram = false
) {
	/**
	 * 创建顶点着色器
	 */
	const vertexShader = gl.createShader(gl.VERTEX_SHADER)
	/**
	 * 创建片元着色器
	 */
	const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
	/**
	 * 为着色器引入源代码
	 */
	gl.shaderSource(vertexShader, vertexShaderSource)
	gl.shaderSource(fragmentShader, fragmentShaderSource)
	/**
	 * 编译写入了源代码后的着色器
	 */
	gl.compileShader(vertexShader)
	gl.compileShader(fragmentShader)

	const vertexShaderCompileSuccess = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)
	if (!vertexShaderCompileSuccess) {
		gl.deleteShader(vertexShader)
		throw new Error(`vertex shader compile failer.`)
	}
	const fragmentShaderCompileSuccess = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)
	if (!fragmentShaderCompileSuccess) {
		gl.deleteShader(fragmentShader)
		throw new Error(`fragment shader compile failer.`)
	}

	const program = gl.createProgram()
	/**
	 * 将着色器应用到 program
	 * 链接
	 * 使用
	 */
	gl.attachShader(program, vertexShader)
	gl.attachShader(program, fragmentShader)
	gl.linkProgram(program)
	const linkProgramSuccess = gl.getProgramParameter(program, gl.LINK_STATUS)
	if (!linkProgramSuccess) {
		gl.deleteProgram(program)
		throw new Error(`webgl program linked failer.`)
	}
	if (!notUseprogram) {
		gl.useProgram(program)
	}	
	return program
}

function setBuffer(gl, data, vertex, n) {
	/**
	 * 创建顶点缓冲区
	 */
	const buffer = gl.createBuffer()
	/**
	 * 将顶点缓冲区绑定到 gl
	 */
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
	/**
	 * 将顶点数据应用到顶点缓冲区
	 */
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
	/**
	 * 将顶点缓冲区数据 data 传递给变量 vertex
	 */
	gl.vertexAttribPointer(vertex, n, gl.FLOAT, false, 0, 0)
	/**
	 * 设置允许传递数据
	 */
	gl.enableVertexAttribArray(vertex)
	return buffer
}
