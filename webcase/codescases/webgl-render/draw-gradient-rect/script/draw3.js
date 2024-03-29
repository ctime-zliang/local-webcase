function drawCanvas3(containerElement, vs, fs) {
	const datas = [
		/**
		 * V0
		 */
		30, 300, 255, 255, 0, 1, /**
		 * V1
		 */ 300, 300, 255, 0, 0, 1, /**
		 * V2
		 */ 30, 30, 0, 255, 0, 1, /**
		 * V3
		 */ 300, 30, 0, 0, 255, 1,
	]
	const indices = [0, 1, 2, 0, 2, 3]

	const canvasElement = containerElement.querySelector('canvas')
	const gl = initWebGLContext(canvasElement)

	const vertexShader = createShader(gl, gl.VERTEX_SHADER, vs)
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fs)
	const program = createProgram(gl, vertexShader, fragmentShader)

	gl.useProgram(program)

	gl.clearColor(0.0, 0.0, 0.0, 1.0)
	gl.clear(gl.COLOR_BUFFER_BIT)

	const a_Position = gl.getAttribLocation(program, 'a_Position')
	const a_CanvasSize = gl.getAttribLocation(program, 'a_CanvasSize')
	const a_Color = gl.getAttribLocation(program, 'a_Color')

	gl.enableVertexAttribArray(a_Position)
	gl.enableVertexAttribArray(a_Color)

	/**
	 * 向顶点着色器变量 attribute vec2 a_CanvasSize 传递匹配数据
	 */
	gl.vertexAttrib2f(a_CanvasSize, canvasElement.width, canvasElement.height)

	const datasBuffer = createBuffer(gl)
	gl.bindBuffer(gl.ARRAY_BUFFER, datasBuffer)
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 24, 0)
	gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 24, 8)

	console.time(`draw-webgl`)
	gl.bindBuffer(gl.ARRAY_BUFFER, datasBuffer)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(datas), gl.DYNAMIC_DRAW)
	/* ... */
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, datas.length / 6)
	console.timeEnd(`draw-webgl`)
}
