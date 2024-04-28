/**
 * 绘制单个点
 * 		纵深测试
 * 		NDC 坐标
 */
function drawCanvas3(containerElement) {
	const VS = `
		precision mediump float;
		attribute vec3 a_Position;
		attribute vec4 a_Color;
		varying vec4 v_Color;
		uniform mat4 u_Matrix;
		void main() {
			gl_Position = u_Matrix * vec4(a_Position, 1);
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

	const u_Matrix = gl.getUniformLocation(program, 'u_Matrix')
	const a_Position = gl.getAttribLocation(program, 'a_Position')
	const a_Color = gl.getAttribLocation(program, 'a_Color')

	const positionBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 28, 0)
	gl.enableVertexAttribArray(a_Position)
	gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 28, 12)
	gl.enableVertexAttribArray(a_Color)

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW)

	const orthoProjectionMatrix4 = Ven$CanvasMatrix4.createOrthoProjectionMatrix4OfRectView(canvasElement.width / canvasElement.height)

	const render = () => {
		const modelXRotationMatrix4 = Ven$Matrix4.createRotateXMatrix4ByRadian(Ven$Angles.degreeToRadian(xAngle))
		const modelYRotationMatrix4 = Ven$Matrix4.createRotateYMatrix4ByRadian(Ven$Angles.degreeToRadian(yAngle))
		const modelEffectMatrix4 = modelXRotationMatrix4.multiply4(modelYRotationMatrix4)
		const modelResultMatrix4 = modelEffectMatrix4.multiply4(orthoProjectionMatrix4)
		gl.uniformMatrix4fv(u_Matrix, false, new Float32Array(modelResultMatrix4.data))
		// gl.uniformMatrix4fv(u_Matrix, false, new Float32Array(new Ven$Matrix4().data))
		gl.clear(gl.COLOR_BUFFER_BIT)
		gl.drawArrays(gl.POINTS, 0, 2)
	}

	let xAngle = 0
	let yAngle = 0

	const exec = () => {
		// xAngle += 0.5
		// yAngle += 0.5
		// if (xAngle >= 30 || yAngle >= 30) {
		// 	render()
		// 	return
		// }
		render()
		requestAnimationFrame(exec)
	}

	exec()
}
