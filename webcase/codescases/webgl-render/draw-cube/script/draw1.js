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

	const cubeDatasResult = createCubeDatas(3, 3, 3, 0, 0, 0)
	console.log(cubeDatasResult)

	const canvasElement = containerElement.querySelector('canvas')
	const gl = initWebGLContext(canvasElement)

	const vertexShader = createShader(gl, gl.VERTEX_SHADER, VS)
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FS)
	const program = createProgram(gl, vertexShader, fragmentShader)

	gl.useProgram(program)

	gl.clearColor(0.0, 0.0, 0.0, 1.0)
	gl.clear(gl.COLOR_BUFFER_BIT)
	gl.enable(gl.CULL_FACE)

	const u_Matrix = gl.getUniformLocation(program, 'u_Matrix')
	const a_Position = gl.getAttribLocation(program, 'a_Position')
	const a_Color = gl.getAttribLocation(program, 'a_Color')

	gl.enableVertexAttribArray(a_Position)
	gl.enableVertexAttribArray(a_Color)

	const positionBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 28, 0)
	gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 28, 12)
	gl.bufferData(gl.ARRAY_BUFFER, cubeDatasResult.positions, gl.STATIC_DRAW)

	/**
	 * 创建透视矩阵
	 */
	const projectionMatrix4 = createProjectionMatrix4(canvasElement.width, canvasElement.height)

	const render = () => {
		/**
		 * 创建任意 xAngle/yAngle 角度对应的旋转矩阵
		 */
		const xRotationMatrix4 = Ven$Matrix4.createRotateXMatrix4ByRadian(Ven$Angles.degreeToRadian(xAngle))
		const yRotationMatrix4 = Ven$Matrix4.createRotateYMatrix4ByRadian(Ven$Angles.degreeToRadian(yAngle))
		/**
		 * 生成变换矩阵
		 * 		将旋转矩阵应用到透视矩阵
		 */
		const effectMatrix4 = xRotationMatrix4.multiply4(yRotationMatrix4)
		const resultMatrix4 = effectMatrix4.multiply4(projectionMatrix4)
		gl.uniformMatrix4fv(u_Matrix, false, new Float32Array(resultMatrix4.data))
		gl.clear(gl.COLOR_BUFFER_BIT)
		gl.drawArrays(gl.TRIANGLES, 0, cubeDatasResult.positions.length / 7)
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
