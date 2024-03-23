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

	const cubeDatasResult = createCubeDatas(3, 3, 3)
	console.log(cubeDatasResult)

	const canvasElement = containerElement.querySelector('canvas')
	const gl = initWebGLContext(canvasElement)

	const vertexShader = createShader(gl, gl.VERTEX_SHADER, VS)
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FS)
	const program = createProgram(gl, vertexShader, fragmentShader)

	gl.useProgram(program)

	gl.clearColor(0.0, 0.0, 0.0, 1.0)
	gl.clear(gl.COLOR_BUFFER_BIT)

	const u_Matrix = gl.getUniformLocation(program, 'u_Matrix')
	const a_Position = gl.getAttribLocation(program, 'a_Position')
	const a_Color = gl.getAttribLocation(program, 'a_Color')

	gl.enableVertexAttribArray(a_Position)
	gl.enableVertexAttribArray(a_Color)

	const positionBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 28, 0)
	gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 28, 12)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeDatasResult.positions), gl.STATIC_DRAW)

	const indicesBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer)
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeDatasResult.indices), gl.STATIC_DRAW)

	gl.enable(gl.CULL_FACE)

	const aspect = canvasElement.width / canvasElement.height
	const projectionMatrix = matrix.ortho(-aspect * 4, aspect * 4, -4, 4, 100, -100)
	const dstMatrix = matrix.identity()
	const tmpMatrix = matrix.identity()

	let xAngle = 0
	let yAngle = 0

	const render = () => {
		xAngle += 1
		yAngle += 1
		if (xAngle >= 30 || yAngle >= 30) {
			return
		}
		matrix.rotationY(degreeToRadian(yAngle), dstMatrix)
		matrix.multiply(dstMatrix, matrix.rotationX(degreeToRadian(xAngle), tmpMatrix), dstMatrix)
		matrix.multiply(projectionMatrix, dstMatrix, dstMatrix)
		gl.uniformMatrix4fv(u_Matrix, false, dstMatrix)
		gl.clear(gl.COLOR_BUFFER_BIT)
		gl.drawElements(gl.TRIANGLES, cubeDatasResult.indices.length, gl.UNSIGNED_SHORT, 0)
		requestAnimationFrame(render)
	}

	render()
}
