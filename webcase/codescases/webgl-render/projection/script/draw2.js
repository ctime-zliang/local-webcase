/**
 * 透视投影
 */
function drawCanvas2(containerElement) {
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

	const datasResult = {
		vertexPositions: new Float32Array([0, 0.5, 0, 1, 0, 0, 1, -0.5, -0.5, 0, 1, 0, 0, 1, 0.5, -0.5, 0, 1, 0, 0, 1]),
	}
	console.log(datasResult)

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
	gl.bufferData(gl.ARRAY_BUFFER, datasResult.vertexPositions, gl.STATIC_DRAW)

	const persProjectionMatrix4 = ven$createPerspectiveProjectionMatrix4OfRectView(60, canvasElement.width / canvasElement.height, -100, 100)

	const render = () => {
		const modelXRotationMatrix4 = Ven$Matrix4.createRotateXMatrix4ByRadian(Ven$Angles.degreeToRadian(0))
		const modelYRotationMatrix4 = Ven$Matrix4.createRotateYMatrix4ByRadian(Ven$Angles.degreeToRadian(0))
		const modelEffectMatrix4 = modelXRotationMatrix4.multiply4(modelYRotationMatrix4)
		const resultMatrix4 = modelEffectMatrix4.multiply4(persProjectionMatrix4)
		gl.uniformMatrix4fv(u_Matrix, false, new Float32Array(resultMatrix4.data))
		gl.clear(gl.COLOR_BUFFER_BIT)
		gl.drawArrays(gl.TRIANGLES, 0, datasResult.vertexPositions.length / 7)
	}

	const exec = () => {
		render()
		requestAnimationFrame(exec)
	}

	exec()
}
