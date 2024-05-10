/**
 * 绘制固定纯色填充三角形
 * 		矩阵基础变换
 */
function drawCanvas4(containerElement) {
	const VS = `
		precision mediump float;
		attribute vec3 a_Position;
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
	 * 		平移标记点 P(0.5, 0, 0)
	 */
	const translateMatrix4 = Ven$CanvasMatrix4.setTranslate(new Ven$Vector3(0.5, 0, 0))

	const render = angle => {
		gl.clearColor(0.0, 0.0, 0.0, 1.0)
		gl.clear(gl.COLOR_BUFFER_BIT)
		/**
		 * 创建绕轴旋转矩阵
		 * 		绕轴 Ven$Vector3(0, 0, 1) 旋转 angle 角度
		 * 		绕轴 Ven$Vector3(0, 0, 1) 旋转 -angle 角度
		 */
		const rotationMatrix4_1 = Ven$CanvasMatrix4.setRotateMatrxi4(Ven$Angles.degreeToRadian(angle), new Ven$Vector3(0, 0, 1))
		const rotationMatrix4_2 = Ven$CanvasMatrix4.setRotateMatrxi4(Ven$Angles.degreeToRadian(-angle), new Ven$Vector3(0, 0, 1))
		/**
		 * 生成复合变换矩阵
		 * 		rotationMatrix4_1.multiply4(translateMatrix4)
		 * 			表现为:
		 * 				使图形在平移矩阵标记点 P 的位置绕图形中心旋转 angle 角度
		 * 		translateMatrix4.multiply4(rotationMatrix4_1)
		 * 			表现为:
		 * 				先将平移矩阵标记点 P 的位置旋转 angle 角度到点 P(r), 后将图形平移到点 P(r), 使图形在点 P(r) 的位置绕图形中心旋转 angle 角度
		 * 		rotationMatrix4_2.multiply4(translateMatrix4).multiply4(rotationMatrix4_1)
		 * 			表现为:
		 * 				先将平移矩阵标记点 P 的位置旋转 angle 角度到点 P(r), 后将图形平移到点 P(r)
		 * 		rotationMatrix4_1.multiply4(translateMatrix4).multiply4(rotationMatrix4_2)
		 * 			表现为:
		 * 				先将平移矩阵标记点 P 的位置旋转 -angle 角度到点 P(r), 后将图形平移到点 P(r)
		 *
		 * 		translateMatrix4.multiply4(rotationMatrix4_1).multiply4(rotationMatrix4_2)
		 * 		translateMatrix4.multiply4(rotationMatrix4_2).multiply4(rotationMatrix4_1)
		 * 			表现为:
		 * 				使图形在平移矩阵标记点 P 的位置
		 * 		rotationMatrix4_1.multiply4(rotationMatrix4_2).multiply4(translateMatrix4)
		 * 		rotationMatrix4_2.multiply4(rotationMatrix4_1).multiply4(translateMatrix4)
		 * 			表现为:
		 * 				使图形在平移矩阵标记点 P 的位置
		 */
		const modelEffectMatrix4_0 = rotationMatrix4_1.multiply4(translateMatrix4)
		gl.uniformMatrix4fv(u_Matrix, false, new Float32Array(modelEffectMatrix4_0.data))
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
			console.log(`draw4: matrix-transform finish: `, performance.now() - strat)
			return
		}
		requestAnimationFrame(exec)
	}

	exec()
}
