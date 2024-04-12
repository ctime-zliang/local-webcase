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

	const points = []

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

	/**
	 * 向顶点着色器变量 attribute vec2 a_CanvasSize 传递匹配数据
	 */
	gl.vertexAttrib2f(a_CanvasSize, canvasElement.width, canvasElement.height)

	canvasElement.addEventListener('click', function (e) {
		const canvasRect = canvasElement.getBoundingClientRect().toJSON()
		const setColor = randomColor()
		points.push({ x: e.clientX - canvasRect.left, y: e.clientY - canvasRect.top, color: setColor })
		gl.clearColor(0, 0, 0, 1.0)
		gl.clear(gl.COLOR_BUFFER_BIT)
		for (let i = 0; i < points.length; i++) {
			const colorItem = points[i].color
			/**
			 * 向片元着色器变量 uniform vec4 u_Color 传递匹配数据
			 */
			gl.uniform4f(u_Color, colorItem.r, colorItem.g, colorItem.b, colorItem.a)
			/**
			 * 向顶点着色器变量 attribute vec2 a_Position 传递匹配数据
			 */
			gl.vertexAttrib2f(a_Position, points[i].x, points[i].y)
			gl.drawArrays(gl.POINTS, 0, 1)
		}
	})
}
