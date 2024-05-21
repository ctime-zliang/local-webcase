/**
 * 绘制固定纯色填充三角形
 * 		矩阵基础变换
 */
function drawCanvas3(containerElement) {
	const VS = `
		precision mediump float;
		// 顶点配置(组)
		attribute vec3 a_Position;
		// 变换矩阵(组)
		uniform mat4 u_Matrix;
		void main() {
			gl_Position = u_Matrix * vec4(a_Position, 1.0);
			gl_PointSize = 10.0;
		}
	`
	const FS = `
		precision mediump float;
		uniform vec4 u_Color;
		void main() {
			vec4 color = u_Color / vec4(255, 0.0, 0.0, 1.0);
			gl_FragColor = color;
		}
	`

	// prettier-ignore
	const positions = [
		0.25, -0.25, 0, 
		0, 0.35, 0, 
		-0.25, -0.25, 0
	]

	const canvasElement = containerElement.querySelector('canvas')
	const gl = initWebGLContext(canvasElement)

	const vertexShader = createShader(gl, gl.VERTEX_SHADER, VS)
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FS)
	const program = createProgram(gl, vertexShader, fragmentShader)

	gl.useProgram(program)

	gl.clearColor(0.0, 0.0, 0.0, 1.0)
	gl.clear(gl.COLOR_BUFFER_BIT)

	const a_Position = gl.getAttribLocation(program, 'a_Position')
	const u_Color = gl.getUniformLocation(program, 'u_Color')
	const u_Matrix = gl.getUniformLocation(program, 'u_Matrix')

	gl.uniform4f(u_Color, 255, 0, 0, 1)

	const vertextBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, vertextBuffer)
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0)
	gl.enableVertexAttribArray(a_Position)

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

	/**
	 * 创建平移矩阵
	 */
	const translateMatrix4 = Ven$CanvasMatrix4.setTranslate(new Ven$Vector3(0.5, 0, 0))

	const render = angle => {
		gl.clearColor(0.0, 0.0, 0.0, 1.0)
		gl.clear(gl.COLOR_BUFFER_BIT)
		/**
		 * 创建旋转矩阵
		 */
		const rotationMatrix4 = Ven$CanvasMatrix4.setRotateMatrxi4(Ven$Angles.degreeToRadian(angle), new Ven$Vector3(0, 0, 1))
		const rotationMatrix4_1 = Ven$Matrix4.createRotateZMatrix4ByRadian(Ven$Angles.degreeToRadian(angle))
		/**
		 * 生成复合变换矩阵
		 */
		const modelEffectMatrix4 = translateMatrix4.multiply4(rotationMatrix4)
		const modelEffectMatrix4_1 = translateMatrix4.multiply4(rotationMatrix4_1)
		gl.uniformMatrix4fv(u_Matrix, false, new Float32Array(modelEffectMatrix4.data))
		gl.drawArrays(gl.TRIANGLES, 0, 3)
	}

	let angle = 0

	const ANGLE_STEP = 45.0
	let lastTimeStamp = performance.now()
	const getNextAngle = (angle = 0) => {
		const now = performance.now()
		const elapsed = now - lastTimeStamp
		lastTimeStamp = now
		const newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0
		return newAngle % 360
	}

	const strat = performance.now()
	const exec = () => {
		render(angle)
		angle = getNextAngle(angle)
		if (angle >= 90) {
			angle = 90
			render(angle)
			console.log(`draw3: matrix-transform finish: `, performance.now() - strat)
			return
		}
		requestAnimationFrame(exec)
	}

	exec()
}
