function drawCanvas1(containerElement, type) {
	const VS = `
		precision mediump float;
		attribute vec2 a_Position;
		attribute vec2 a_CanvasSize;
		void main() {
			vec2 position = (a_Position / a_CanvasSize) * 2.0 - 1.0; 
			position = position * vec2(1.0, -1.0);
			gl_Position = vec4(position, 0, 1);
			gl_PointSize = 5.0;
		}
	`
	const FS = `
		precision mediump float;
		void main() {
			gl_FragColor = vec4(1.1, 1.0, 1.0, 1.0);
		}
	`

	const positions = []

	const canvasElement = containerElement.querySelector('canvas')
	const gl = initWebGLContext(canvasElement)

	const vertexShader = createShader(gl, gl.VERTEX_SHADER, VS)
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FS)
	const program = createProgram(gl, vertexShader, fragmentShader)

	gl.useProgram(program)

	gl.clearColor(0.0, 0.0, 0.0, 1.0)
	gl.clear(gl.COLOR_BUFFER_BIT)

	const a_Position = gl.getAttribLocation(program, 'a_Position')
	const a_CanvasSize = gl.getAttribLocation(program, 'a_CanvasSize')

	gl.enableVertexAttribArray(a_Position)

	/**
	 * 向顶点着色器变量 attribute vec2 a_CanvasSize 传递匹配数据
	 */
	gl.vertexAttrib2f(a_CanvasSize, canvasElement.width, canvasElement.height)

	const buffer = createBuffer(gl)
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)

	canvasElement.addEventListener('click', function (e) {
		const canvasRect = canvasElement.getBoundingClientRect().toJSON()
		positions.push(e.clientX - canvasRect.left, e.clientY - canvasRect.top)
		if (positions.length > 0) {
			console.time(`draw-webgl`)
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW)
			gl.clearColor(0, 0, 0, 1.0)
			gl.clear(gl.COLOR_BUFFER_BIT)
			gl.drawArrays(gl.POINTS, 0, positions.length / 2)
			switch (type) {
				case 'LINES': {
					gl.drawArrays(gl.LINES, 0, positions.length / 2)
					break
				}
				case 'LINE_STRIP': {
					gl.drawArrays(gl.LINE_STRIP, 0, positions.length / 2)
					break
				}
				case 'LINE_LOOP': {
					gl.drawArrays(gl.LINE_LOOP, 0, positions.length / 2)
					break
				}
				default: {
					gl.drawArrays(gl.LINE_STRIP, 0, positions.length / 2)
				}
			}
			gl.drawArrays(gl.LINES, 0, positions.length / 2)
			console.timeEnd(`draw-webgl`)
		}
	})
}
