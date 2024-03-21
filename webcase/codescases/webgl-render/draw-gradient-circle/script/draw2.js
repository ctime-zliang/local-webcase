function drawCanvas2(containerElement, vs, fs) {
	const { positions: datas, indices: indices } = createRingVertexDatas(200, 200, 40, 80, 50)

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

	/**
	 * 向顶点着色器变量 attribute vec2 a_CanvasSize 传递匹配数据
	 */
	gl.vertexAttrib2f(a_CanvasSize, canvasElement.width, canvasElement.height)

	const datasBuffer = createBuffer(gl)
	gl.enableVertexAttribArray(a_Position)
	gl.enableVertexAttribArray(a_Color)
	gl.bindBuffer(gl.ARRAY_BUFFER, datasBuffer)
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 24, 0)
	gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 24, 8)

	const indicesBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer)
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)

	console.time(`draw-webgl`)
	gl.bindBuffer(gl.ARRAY_BUFFER, datasBuffer)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(datas), gl.DYNAMIC_DRAW)
	/* ... */
	gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)
	console.timeEnd(`draw-webgl`)
}
