/**
 * 绘制单个点
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

	gl.vertexAttrib2f(a_CanvasSize, canvasElement.width, canvasElement.height)

	canvasElement.addEventListener('click', function (e) {
		const canvasRect = canvasElement.getBoundingClientRect().toJSON()
		const setColor = ven$randomColor()
		/**
		 * 以"平铺"的方式写入数组
		 */
		points.push(e.clientX - canvasRect.left, e.clientY - canvasRect.top, setColor.r, setColor.g, setColor.b, setColor.a)
		gl.clearColor(0, 0, 0, 1.0)
		gl.clear(gl.COLOR_BUFFER_BIT)
		for (let i = 0; i < points.length; i += 6) {
			gl.vertexAttrib2f(a_Position, points[i], points[i + 1])
			gl.uniform4f(u_Color, points[i + 2], points[i + 3], points[i + 4], points[i + 5])
			gl.drawArrays(gl.POINTS, 0, 1)
		}
	})
}
