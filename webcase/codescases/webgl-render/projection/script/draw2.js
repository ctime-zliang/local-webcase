/**
 * 绘制纯色填充三角形
 * 		按鼠标点击位置绘制
 */
function drawCanvas2(containerElement) {
	const VS = `
		precision mediump float;
		attribute vec2 a_Position;
		attribute vec2 a_CanvasSize;
		void main() {
			vec2 position = (a_Position / a_CanvasSize) * 2.0 - 1.0; 
			position = position * vec2(1.0, -1.0);
			gl_Position = vec4(position, 0, 1);
			gl_PointSize = 10.0;
		}
	`
	const FS = `
		precision mediump float;
		uniform vec4 u_Color;
		void main() {
			vec4 color = u_Color / vec4(255, 255, 255, 1.0);
			gl_FragColor = color;
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
	const u_Color = gl.getUniformLocation(program, 'u_Color')

	gl.enableVertexAttribArray(a_Position)

	/**
	 * 向顶点着色器变量 attribute vec2 a_CanvasSize 传递匹配数据
	 */
	gl.vertexAttrib2f(a_CanvasSize, canvasElement.width, canvasElement.height)

	const datasBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, datasBuffer)
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)

	canvasElement.addEventListener('click', function (e) {
		const canvasRect = canvasElement.getBoundingClientRect().toJSON()
		positions.push(e.clientX - canvasRect.left, e.clientY - canvasRect.top)
		if (positions.length % 6 === 0) {
			console.time(`draw-webgl`)
			const color = ven$randomColor()
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW)
			gl.clearColor(0, 0, 0, 1.0)
			gl.clear(gl.COLOR_BUFFER_BIT)
			gl.uniform4f(u_Color, color.r, color.g, color.b, color.a)
			gl.drawArrays(gl.TRIANGLES, 0, positions.length / 2)
			console.timeEnd(`draw-webgl`)
		}
	})
}
