/**
 * 绘制纯色填充圆环
 */
function drawCanvas2(containerElement) {
	const VS = `
		precision mediump float;
		varying vec4 v_Color;
		attribute vec2 a_CanvasSize;
		// 顶点配置(组)
		attribute vec2 a_Position;
		attribute vec4 a_Color;
		void main() {
			vec2 position = (a_Position / a_CanvasSize) * 2.0 - 1.0; 
			position = position * vec2(1.0, -1.0);
			gl_Position = vec4(position, 0, 1);
			gl_PointSize = 5.0;
			v_Color = a_Color;
		}
	`
	const FS = `
		precision mediump float;
		varying vec4 v_Color;
		void main() {
			vec4 color = v_Color / vec4(255, 255, 255, 1.0);
			gl_FragColor = color;
		}
	`

	const { positions: datas, indices: indices } = createRingVertexDatas(200, 200, 40, 80, 50)

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
	const a_Color = gl.getAttribLocation(program, 'a_Color')

	gl.enableVertexAttribArray(a_Position)
	gl.enableVertexAttribArray(a_Color)

	/**
	 * 向顶点着色器变量 attribute vec2 a_CanvasSize 传递匹配数据
	 */
	gl.vertexAttrib2f(a_CanvasSize, canvasElement.width, canvasElement.height)

	const datasBuffer = gl.createBuffer()
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
