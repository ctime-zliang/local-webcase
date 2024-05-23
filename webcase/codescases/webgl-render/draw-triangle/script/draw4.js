/**
 * 绘制固定纯色填充三角形
 * 		矩阵基础变换
 */
function drawCanvas4(containerElement) {
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
		// 顶点配置(组)
		uniform vec4 u_Color;
		void main() {
			vec4 color = u_Color / vec4(255, 0.0, 0.0, 1.0);
			gl_FragColor = color;
		}
	`

	// prettier-ignore
	const positions = [
		0.1, 0.45, 0, 
		0.1, 0.1, 0, 
		0.45, 0.1, 0
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

	/**
	 * 复合平移矩阵
	 */
	const translateMatrix4 = translate2Matrix4.multiply4(translate1Matrix4)

	{
		console.log(`\n`)
		console.log(`平移矩阵 T: `, translateMatrix4.toStringFormat())
		const angle = 30
		const rotationMatrix4_i = Ven$Matrix4.createRotateZMatrix4ByRadian(Ven$Angles.degreeToRadian(angle))
		const rotationMatrix4_1 = Ven$CanvasMatrix4.setRotate(Ven$Angles.degreeToRadian(angle), new Ven$Vector3(0, 0, 1))
		const rotationMatrix4_2 = Ven$CanvasMatrix4.setRotate(Ven$Angles.degreeToRadian(-angle), new Ven$Vector3(0, 0, 1))

		// console.log(`绕 Z 坐标轴旋转矩阵 R: `, rotationMatrix4_i.toStringFormat())
		console.log(`旋转矩阵 R1: `, rotationMatrix4_1.toStringFormat())

		console.log(`R1 * T 变换矩阵: `, rotationMatrix4_1.multiply4(translateMatrix4).toStringFormat())
		console.log(`T * R1 变换矩阵: `, translateMatrix4.multiply4(rotationMatrix4_1).toStringFormat())
		console.log(`R1 * T * R2 变换矩阵: `, rotationMatrix4_1.multiply4(translateMatrix4).multiply4(rotationMatrix4_2).toStringFormat())
		console.log(`R2 * T * R1 变换矩阵: `, rotationMatrix4_2.multiply4(translateMatrix4).multiply4(rotationMatrix4_1).toStringFormat())
		console.log(`R1 * R2 * T 变换矩阵: `, rotationMatrix4_1.multiply4(rotationMatrix4_2).multiply4(translateMatrix4).toStringFormat())
		console.log(`\n`)
	}

	const render = angle => {
		gl.clearColor(0.0, 0.0, 0.0, 1.0)
		gl.clear(gl.COLOR_BUFFER_BIT)
		/**
		 * 创建旋转矩阵
		 * 		绕 L(O): Ven$Vector3(0, 0, 1) 轴方向自旋 angle 角度
		 * 创建旋转矩阵
		 * 		绕 L(O): Ven$Vector3(0, 0, 1) 轴方向自旋 -angle 角度
		 */
		const rotationMatrix4_1 = Ven$CanvasMatrix4.setRotate(Ven$Angles.degreeToRadian(angle), new Ven$Vector3(0, 0, 1))
		const rotationMatrix4_2 = Ven$CanvasMatrix4.setRotate(Ven$Angles.degreeToRadian(-angle), new Ven$Vector3(0, 0, 1))
		/**
		 * 生成复合变换矩阵
		 * 		rotationMatrix4_1.multiply4(translateMatrix4)
		 * 			对旋转矩阵应用平移矩阵, 生成新矩阵 M(1)
		 * 				将旋转矩阵包含的旋转量(包含旋转轴坐标/旋转角度/旋转方向)按照平移矩阵包含的平移量(包含长度/方向)进行平移
		 * 			图形将按照 M(1) 进行变换
		 * 				图形在固定的平移终点 P(r) 坐标点位置旋转
		 *
		 * 		translateMatrix4.multiply4(rotationMatrix4_1)
		 * 			对平移矩阵应用旋转矩阵, 生成新矩阵 M(1)
		 * 				将平移矩阵包含的平移量(包含长度/方向)按照旋转矩阵包含的旋转量(包含旋转轴坐标/旋转角度/旋转方向)进行旋转
		 * 			图形将按照 M(1) 进行变换
		 * 				由于旋转矩阵包含的旋转量(包含旋转轴坐标/旋转角度/旋转方向)是一个跟随 angle 变化而变化的值
		 * 				因此平移终点 P(r) 将围绕平移起点 P(o) 旋转
		 * 				图形在动态的平移终点 P(r) 坐标点位置旋转
		 *
		 * 		rotationMatrix4_1.multiply4(translateMatrix4).multiply4(rotationMatrix4_2)
		 * 		rotationMatrix4_2.multiply4(translateMatrix4).multiply4(rotationMatrix4_1)
		 *
		 * 		translateMatrix4.multiply4(rotationMatrix4_1).multiply4(rotationMatrix4_2)
		 * 		translateMatrix4.multiply4(rotationMatrix4_2).multiply4(rotationMatrix4_1)
		 *
		 * 		rotationMatrix4_1.multiply4(rotationMatrix4_2).multiply4(translateMatrix4)
		 * 		rotationMatrix4_2.multiply4(rotationMatrix4_1).multiply4(translateMatrix4)
		 */
		const modelEffectMatrix4_0 = rotationMatrix4_1.multiply4(translateMatrix4).multiply4(rotationMatrix4_2)
		gl.uniformMatrix4fv(u_Matrix, false, new Float32Array(modelEffectMatrix4_0.data))

		gl.drawArrays(gl.TRIANGLES, 0, 3)
	}

	const setpControl = new Ven$StepControl(0, 45, 360)
	let angle = 0

	const strat = performance.now()
	const exec = () => {
		render(angle)
		angle = setpControl.getNextValue() % 360
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
