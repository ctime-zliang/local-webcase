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

	const shereDatasResult = createShereDatas2(5, 2, 2)

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

	const aspect = canvasElement.clientWidth / canvasElement.clientHeight
	const fieldOfViewRadians = 60
	const projectionMatrix = createMatrix4Perspective(fieldOfViewRadians, aspect, 1, 2000)
	const cameraPositionVector = new Ven$Vector3(0, 0, 20)
	const targetVector = new Ven$Vector3(0, 0, 0)
	const upVector = new Ven$Vector3(0, 1, 0)
	const cameraPositionMatrix = createViewAtMatrix4(cameraPositionVector, targetVector, upVector)
	const viewPositionMatrix = cameraPositionMatrix.getInverseMatrix()
	const viewProjectionMatrix = viewPositionMatrix.multiply4(projectionMatrix)

	gl.uniformMatrix4fv(u_Matrix, false, new Float32Array(viewProjectionMatrix.data))

	const positionBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
	gl.bufferData(gl.ARRAY_BUFFER, shereDatasResult.positions, gl.STATIC_DRAW)
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0)

	const colorBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
	gl.bufferData(gl.ARRAY_BUFFER, shereDatasResult.colors, gl.STATIC_DRAW)
	gl.vertexAttribPointer(a_Color, 4, gl.UNSIGNED_BYTE, true, 0, 0)

	let yAngle = 0
	let xAngle = 0
	let timer = null

	const render = () => {
		gl.clear(gl.COLOR_BUFFER_BIT)
		if (shereDatasResult.positions.length <= 0) {
			return
		}
		gl.drawArrays(gl.TRIANGLES, 0, shereDatasResult.positions.length / 3)
	}

	const intervalExec = e => {
		if (timer) {
			window.clearInterval(timer)
			timer = null
			return
		}
		timer = window.setInterval(() => {
			yAngle += 1
			xAngle += 1
			const yRotationMatrix4 = Ven$Matrix4.createRotateYMatrix4ByRadian(Ven$Angles.degreeToRadian(yAngle))
			const xRotateMatrix4 = ven$matrix4RotateX(yRotationMatrix4, Ven$Angles.degreeToRadian(xAngle))
			gl.uniformMatrix4fv(u_Matrix, false, new Float32Array(xRotateMatrix4.multiply4(viewProjectionMatrix).data))
			render(gl)
		}, 50)
	}

	render(gl)

	canvasElement.addEventListener('click', intervalExec)
}
