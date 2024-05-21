/**
 * 绘制单个点
 * 		纵深测试
 * 		NDC 坐标
 */
function drawCanvas3(containerElement) {
	const VS = `
		precision mediump float;
		varying vec4 v_Color;
		// 顶点配置(组)
		attribute vec3 a_Position;
		attribute vec4 a_Color;
		void main() {
			gl_Position = vec4(a_Position, 1.0);
			v_Color = a_Color;
			gl_PointSize = 15.0;
		}
	`
	const FS = `
		precision mediump float;
		varying vec4 v_Color;
		void main() {
			gl_FragColor = v_Color;
		}
	`

	/**
	 * 开启深度测试
	 * 		WebGL Z 轴正方向是由屏幕外向屏幕里
	 * 		即 pointZ 越小, 越靠前显示
	 */
	// prettier-ignore
	const points = [
		0.5, 0.5, -0.5, 1, 0, 0, 1, // 红色
		0.51, 0.51, 0.5, 0, 1, 0, 1, // 绿色
	]

	const canvasElement = containerElement.querySelector('canvas')
	const gl = initWebGLContext(canvasElement)

	const vertexShader = createShader(gl, gl.VERTEX_SHADER, VS)
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FS)
	const program = createProgram(gl, vertexShader, fragmentShader)

	gl.useProgram(program)

	gl.clearColor(0.0, 0.0, 0.0, 1.0)
	gl.clear(gl.COLOR_BUFFER_BIT)
	gl.enable(gl.CULL_FACE)
	gl.enable(gl.DEPTH_TEST)

	const a_Position = gl.getAttribLocation(program, 'a_Position')
	const a_Color = gl.getAttribLocation(program, 'a_Color')

	const positionBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 28, 0)
	gl.enableVertexAttribArray(a_Position)
	gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 28, 12)
	gl.enableVertexAttribArray(a_Color)

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW)

	const render = () => {
		gl.clear(gl.COLOR_BUFFER_BIT)
		gl.drawArrays(gl.POINTS, 0, 2)
	}

	render()
}
