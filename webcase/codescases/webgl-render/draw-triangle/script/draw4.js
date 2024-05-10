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
		0, 0.45, 0, 
		0, 0, 0, 
		0.45, 0, 0
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
	const translate1Matrix4 = Ven$CanvasMatrix4.setTranslate(new Ven$Vector3(0.4, 0, 0))
	const translate2Matrix4 = Ven$CanvasMatrix4.setTranslate(new Ven$Vector3(0, 0.1, 0))
	const translate3Matrix4 = Ven$CanvasMatrix4.setTranslate(new Ven$Vector3(0, 0.1, 0.2))

	/**
	 * 复合平移矩阵
	 * 		平移目标点 P
	 */
	const translateMatrix4 = translate2Matrix4.multiply4(translate1Matrix4)

	{
		console.log(`\n`)
		console.log(`平移矩阵: `, translateMatrix4.toStringFormat())
		const angle = 30
		const rotationMatrix4 = Ven$CanvasMatrix4.setRotateMatrxi4(Ven$Angles.degreeToRadian(angle), new Ven$Vector3(0, 0, 1))
		const rotationMatrix4_1 = Ven$Matrix4.createRotateZMatrix4ByRadian(Ven$Angles.degreeToRadian(angle))
		console.log(`绕 Z 坐标轴旋转矩阵: `, rotationMatrix4.toStringFormat())
		console.log(`绕 Z 坐标轴旋转矩阵: `, rotationMatrix4_1.toStringFormat())

		const aMatrix4 = rotationMatrix4_1.multiply4(translateMatrix4)
		const bMatrix4 = translateMatrix4.multiply4(rotationMatrix4_1)
		console.log(`R * T 变换矩阵: `, aMatrix4.toStringFormat())
		console.log(`T * R 变换矩阵: `, bMatrix4.toStringFormat())
		console.log(`\n`)
	}

	const render = angle => {
		gl.clearColor(0.0, 0.0, 0.0, 1.0)
		gl.clear(gl.COLOR_BUFFER_BIT)
		/**
		 * 创建旋转矩阵
		 * 		绕 Ven$Vector3(0, 0, 1) 轴方向自旋 angle 角度
		 * 创建旋转矩阵
		 * 		绕 Ven$Vector3(0, 0, 1) 轴方向自旋 -angle 角度
		 */
		const rotationMatrix4_1 = Ven$CanvasMatrix4.setRotateMatrxi4(Ven$Angles.degreeToRadian(angle), new Ven$Vector3(0, 0, 1))
		const rotationMatrix4_2 = Ven$CanvasMatrix4.setRotateMatrxi4(Ven$Angles.degreeToRadian(-angle), new Ven$Vector3(0, 0, 1))
		/**
		 * 生成复合变换矩阵
		 * 		rotationMatrix4_1.multiply4(translateMatrix4)
		 * 			对旋转矩阵应用平移矩阵
		 * 			表现为: 平移后在新的旋转中心自旋转
		 * 		translateMatrix4.multiply4(rotationMatrix4_1)
		 * 			- 将图形平移至 P 点
		 * 			- 将图形绕 Ven$Vector3(0, 0, 1) 轴方向自旋 angle 角度
		 * 		rotationMatrix4_1.multiply4(translateMatrix4).multiply4(rotationMatrix4_2)
		 * 			- 将图形绕 Ven$Vector3(0, 0, 1) 轴方向自旋 angle 角度
		 * 			- 将图形平移至 P 点
		 * 			- 将图形绕 Ven$Vector3(0, 0, 1) 轴方向自旋 -angle 角度
		 * 		rotationMatrix4_2.multiply4(translateMatrix4).multiply4(rotationMatrix4_1)
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

	let flag = false
	const strat = performance.now()
	const exec = () => {
		render(angle)
		if (flag) {
			angle = getNextAngle(angle)
		}
		if (angle >= 90) {
			angle = 90
			render(angle)
			console.log(`draw4: matrix-transform finish: `, performance.now() - strat)
			return
		}
		requestAnimationFrame(exec)
	}

	window.setTimeout(() => {
		flag = true
		lastTimeStamp = performance.now()
	}, 1000)

	exec()
}
