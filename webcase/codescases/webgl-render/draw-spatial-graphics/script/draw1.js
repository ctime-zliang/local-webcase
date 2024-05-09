/**
 * 绘制纯色方体
 */
function drawCanvas1(containerElement) {
	const VS = `
		precision mediump float;
		attribute vec3 a_Position;
		attribute vec4 a_Color;
		varying vec4 v_Color;
		uniform mat4 u_Matrix;
		void main() {
			gl_Position = u_Matrix * vec4(a_Position, 1);
			v_Color = a_Color;
			gl_PointSize = 5.0;
		}
	`
	const FS = `
		precision mediump float;
		varying vec4 v_Color;
		void main() {
			gl_FragColor = v_Color;
		}
	`

	console.time(`CreateCubeDatas`)
	const cubeDatasResult = createCubeDatas(0.6, 0.6, 0.6, 0, 0, 0)
	console.log(cubeDatasResult)
	console.timeEnd(`CreateCubeDatas`)

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

	gl.enableVertexAttribArray(a_Position)
	gl.enableVertexAttribArray(a_Color)

	const vertextBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, vertextBuffer)
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 28, 0)
	gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 28, 12)
	gl.bufferData(gl.ARRAY_BUFFER, cubeDatasResult.vertexPositions, gl.STATIC_DRAW)

	/**
	 * 创建矩形视口正交投影矩阵
	 */
	const orthoProjectionMatrix4 = Ven$CanvasMatrix4.setOrthoRectView(canvasElement.width / canvasElement.height, -25, 25, 1)

	const render = (xAngle, yAngle) => {
		/**
		 * 创建旋转矩阵
		 */
		const modelXRotationMatrix4 = Ven$CanvasMatrix4.setRotateMatrxi4(Ven$Angles.degreeToRadian(xAngle), new Ven$Vector3(1, 0, 0))
		const modelYRotationMatrix4 = Ven$CanvasMatrix4.setRotateMatrxi4(Ven$Angles.degreeToRadian(yAngle), new Ven$Vector3(0, 1, 0))
		/**
		 * 生成复合变换矩阵
		 */
		const modelEffectMatrix4 = modelXRotationMatrix4.multiply4(modelYRotationMatrix4)
		const modelResultMatrix4 = modelEffectMatrix4.multiply4(orthoProjectionMatrix4)
		gl.uniformMatrix4fv(u_Matrix, false, new Float32Array(modelResultMatrix4.data))
		gl.clear(gl.COLOR_BUFFER_BIT)
		gl.drawArrays(gl.TRIANGLES, 0, cubeDatasResult.vertexPositions.length / 7)
	}

	let xAngle = 0
	let yAngle = 0

	const exec = () => {
		xAngle += 0.5
		yAngle += 0.5
		render(xAngle, yAngle)
		requestAnimationFrame(exec)
	}

	exec()
}
