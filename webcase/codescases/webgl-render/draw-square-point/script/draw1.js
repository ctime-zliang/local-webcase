/**
 * 绘制单个点
 */
function drawCanvas1(containerElement) {
	const VS = `
		precision mediump float;
		attribute vec2 a_CanvasSize;
		// 顶点配置(组)
		attribute vec2 a_Position;
		attribute float a_PointSize;
		void main() {
			vec2 position = (a_Position / a_CanvasSize) * 2.0 - 1.0; 
			position = position * vec2(1.0, -1.0);
			gl_Position = vec4(position, 0, 1);
			gl_PointSize = a_PointSize;
		}
	`
	const FS = `
		precision mediump float;
		// 顶点配置(组)
		uniform vec4 u_Color;
		void main() {
			vec4 color = u_Color / vec4(255, 255, 255, 1.0);
			gl_FragColor = color;
		}
	`

	const points = [100, 100]

	const canvasElement = containerElement.querySelector('canvas')
	const gl = initWebGLContext(canvasElement)

	const vertexShader = createShader(gl, gl.VERTEX_SHADER, VS)
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FS)
	const program = createProgram(gl, vertexShader, fragmentShader)

	gl.useProgram(program)

	gl.clearColor(0.0, 0.0, 0.0, 1.0)
	gl.clear(gl.COLOR_BUFFER_BIT)

	const a_Position = gl.getAttribLocation(program, 'a_Position')
	const a_PointSize = gl.getAttribLocation(program, 'a_PointSize')
	const a_CanvasSize = gl.getAttribLocation(program, 'a_CanvasSize')
	const u_Color = gl.getUniformLocation(program, 'u_Color')

	gl.vertexAttrib2f(a_CanvasSize, canvasElement.width, canvasElement.height)

	const setColor = ven$randomColor()
	gl.uniform4f(u_Color, setColor.r, setColor.g, setColor.b, setColor.a)

	const pointSize = ven$getRandomInArea(20, 30)
	gl.vertexAttrib1f(a_PointSize, pointSize)

	for (let i = 0; i < points.length; i += 1) {
		/**
		 * 以分量形式传递数据
		 */
		// gl.vertexAttrib2f(a_Position, points[i], points[i + 1])
		/**
		 * 以矢量方式传递数据
		 */
		gl.vertexAttrib2fv(a_Position, new Float32Array(points))
	}
	gl.drawArrays(gl.POINTS, 0, 1)
}
