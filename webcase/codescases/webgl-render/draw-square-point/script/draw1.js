/**
 * 绘制单个点
 */
function drawCanvas1(containerElement) {
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

	const points = [{ x: 100, y: 100 }]

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
	const setColor = ven$randomColor()
	/**
	 * 向片元着色器变量 uniform vec4 u_Color 传递匹配数据
	 */
	gl.uniform4f(u_Color, setColor.r, setColor.g, setColor.b, setColor.a)
	/**
	 * 向顶点着色器变量 attribute vec2 a_Position 传递匹配数据
	 */
	for (let i = 0; i < points.length; i++) {
		gl.vertexAttrib2f(a_Position, points[i].x, points[i].y)
	}

	if (points.length) {
		gl.drawArrays(gl.POINTS, 0, 1)
	}
}
