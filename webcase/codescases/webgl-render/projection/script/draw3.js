/**
 * 绘制纯色方体
 * 		通过视图矩阵变换观察视角
 */
function drawCanvas3(containerElement) {
	const vertices = [
		// 黄
		-0.5, -0.5, 0.5, 0.98, 0.86, 0.078, 1, 0.5, -0.5, 0.5, 0.98, 0.86, 0.078, 1, 0.5, 0.5, 0.5, 0.98, 0.86, 0.078, 1, -0.5, 0.5, 0.5, 0.98, 0.86,
		0.078, 1,
		// 绿
		-0.5, 0.5, 0.5, 0.45, 0.82, 0.24, 1, -0.5, 0.5, -0.5, 0.45, 0.82, 0.24, 1, -0.5, -0.5, -0.5, 0.45, 0.82, 0.24, 1, -0.5, -0.5, 0.5, 0.45, 0.82,
		0.24, 1,
		// 蓝
		0.5, 0.5, 0.5, 0.086, 0.53, 1, 1, 0.5, -0.5, 0.5, 0.086, 0.53, 1, 1, 0.5, -0.5, -0.5, 0.086, 0.53, 1, 1, 0.5, 0.5, -0.5, 0.086, 0.53, 1, 1,
		// 橙
		0.5, 0.5, -0.5, 0.98, 0.68, 0.078, 1, 0.5, -0.5, -0.5, 0.98, 0.68, 0.078, 1, -0.5, -0.5, -0.5, 0.98, 0.68, 0.078, 1, -0.5, 0.5, -0.5, 0.98,
		0.68, 0.078, 1,
		// 红
		-0.5, 0.5, 0.5, 1, 0.3, 0.31, 1, 0.5, 0.5, 0.5, 1, 0.3, 0.31, 1, 0.5, 0.5, -0.5, 1, 0.3, 0.31, 1, -0.5, 0.5, -0.5, 1, 0.3, 0.31, 1,
		// 紫色
		-0.5, -0.5, 0.5, 0.7, 0.5, 0.92, 1, -0.5, -0.5, -0.5, 0.7, 0.5, 0.92, 1, 0.5, -0.5, -0.5, 0.7, 0.5, 0.92, 1, 0.5, -0.5, 0.5, 0.7, 0.5, 0.92,
		1,
	]
	const VS = `
		precision mediump float;
		attribute vec3 a_Position;
		attribute vec4 a_Color;
		varying vec4 v_Color;
		uniform mat4 u_ViewMatrix;
		void main() {
			gl_Position = u_ViewMatrix * vec4(a_Position, 1);
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
	// const cubeDatasResult = createCubeDatas(0.5, 0.5, 0.5, 0, 0, 0)
	const cubeDatasResult = {
		vertexPositions: new Float32Array(vertices),
	}
	const indices = new Uint8Array([
		0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,
	])
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

	const u_ViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix')
	const a_Position = gl.getAttribLocation(program, 'a_Position')
	const a_Color = gl.getAttribLocation(program, 'a_Color')

	gl.enableVertexAttribArray(a_Position)
	gl.enableVertexAttribArray(a_Color)

	const vertextBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, vertextBuffer)
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 28, 0)
	gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 28, 12)
	gl.bufferData(gl.ARRAY_BUFFER, cubeDatasResult.vertexPositions, gl.STATIC_DRAW)

	const indexBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

	const cameraPositionVector3 = new Ven$Vector3(0, 0, 0)
	const targetPositionVector3 = new Ven$Vector3(0, 0, -1)

	const render = () => {
		const cameraMatrix4 = Ven$CanvasMatrix4.createViewAtMatrix4(cameraPositionVector3, targetPositionVector3)
		gl.uniformMatrix4fv(u_ViewMatrix, false, new Float32Array(cameraMatrix4.data))
		// gl.uniformMatrix4fv(u_ViewMatrix, false, new Float32Array(new Ven$Matrix4().data))
		gl.clear(gl.COLOR_BUFFER_BIT)
		// gl.drawArrays(gl.TRIANGLES, 0, cubeDatasResult.vertexPositions.length / 7)
		gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0)
	}

	const exec = () => {
		cameraPositionVector3.x += 0.005
		if (cameraPositionVector3.x >= 1) {
			cameraPositionVector3.x = 1
		}
		render()
		requestAnimationFrame(exec)
	}

	exec()
}
