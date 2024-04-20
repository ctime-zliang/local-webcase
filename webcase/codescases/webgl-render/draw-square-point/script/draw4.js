/**
 * 绘制单个点
 * 		正面三角形/反面三角形
 * 		纵深测试
 */
function drawCanvas4(containerElement) {
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

	/**
	 * 开启深度测试
	 * 		WebGL Z 轴正方向是由屏幕外向屏幕里
	 * 		即 pointZ 越小, 越靠前显示
	 *
	 * 由于启用了背面裁剪(gl.CULL_FACE), 因此反面三角将不再显示
	 */
	const z1 = -0.5
	const z2 = 0.5
	const z3 = -0.8
	const points = [
		/* ... */
		0.5,
		0.5,
		z1,
		1,
		0,
		0,
		1, // 红色
		-0.5,
		0.5,
		z1,
		1,
		0,
		0,
		1, // 红色
		-0.5,
		-0.5,
		z1,
		1,
		0,
		0,
		1, // 红色
		/* ... */
		0.5,
		0.5,
		z2,
		0,
		1,
		0,
		1, // 绿色
		-0.5,
		0.5,
		z2,
		0,
		1,
		0,
		1, // 绿色
		-0.5,
		-0.5,
		z2,
		0,
		1,
		0,
		1, // 绿色
		/* ... */
		0.5,
		0.5,
		z3,
		0,
		0,
		1,
		1, // 蓝色
		-0.5,
		-0.5,
		z3,
		0,
		0,
		1,
		1, // 蓝色
		-0.5,
		0.5,
		z3,
		0,
		0,
		1,
		1, // 蓝色
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

	gl.enableVertexAttribArray(a_Position)
	gl.enableVertexAttribArray(a_Color)

	const positionBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 28, 0)
	gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 28, 12)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW)

	/**
	 * 创建透视矩阵
	 */
	const aspect = canvasElement.width / canvasElement.height
	const padding = 5
	const near = 100
	const far = -100
	const projectionMatrix4 = ven$matrix4Ortho(-aspect * padding, aspect * padding, -padding, padding, near, far)

	const render = () => {
		/**
		 * 创建任意 xAngle/yAngle 角度对应的旋转矩阵
		 */
		const modelXRotationMatrix4 = Ven$Matrix4.createRotateXMatrix4ByRadian(Ven$Angles.degreeToRadian(xAngle))
		const modelYRotationMatrix4 = Ven$Matrix4.createRotateYMatrix4ByRadian(Ven$Angles.degreeToRadian(yAngle))
		/**
		 * 生成变换矩阵
		 * 		将旋转矩阵应用到透视矩阵
		 */
		const modelEffectMatrix4 = modelXRotationMatrix4.multiply4(modelYRotationMatrix4)
		const modelResultMatrix4 = modelEffectMatrix4.multiply4(projectionMatrix4)
		gl.uniformMatrix4fv(u_Matrix, false, new Float32Array(modelResultMatrix4.data))
		// gl.uniformMatrix4fv(u_Matrix, false, new Float32Array(new Ven$Matrix4().data))
		gl.clear(gl.COLOR_BUFFER_BIT)
		gl.drawArrays(gl.TRIANGLES, 0, points.length / 7)
	}

	let xAngle = 0
	let yAngle = 0

	const exec = () => {
		xAngle += 0.5
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
