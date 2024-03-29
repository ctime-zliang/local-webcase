function drawCanvas1(containerElement) {
	const VS = `
		precision mediump float;
		attribute vec2 a_Position;
		void main() {
			gl_Position = vec4(a_Position, 0, 1);
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

	const positions = [1, 0, 0, 1, 0, 0]

	const canvasElement = containerElement.querySelector('canvas')
	const gl = initWebGLContext(canvasElement)

	const vertexShader = createShader(gl, gl.VERTEX_SHADER, VS)
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FS)
	const program = createProgram(gl, vertexShader, fragmentShader)

	gl.useProgram(program)

	gl.clearColor(0.0, 0.0, 0.0, 1.0)
	gl.clear(gl.COLOR_BUFFER_BIT)

	const a_Position = gl.getAttribLocation(program, 'a_Position')

	gl.enableVertexAttribArray(a_Position)

	const typeArray = new Float32Array(positions)
	const buffer = createBuffer(gl)
	gl.bufferData(gl.ARRAY_BUFFER, typeArray, gl.STATIC_DRAW)
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)

	gl.drawArrays(gl.TRIANGLES, 0, 3)
}
