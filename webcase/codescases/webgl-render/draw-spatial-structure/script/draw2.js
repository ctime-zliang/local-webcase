/**
 * 通过视点观察图形
 */

class Program2 {
	static containerElement
	static profile = {
		/**
		 * 视图矩阵参数
		 */
		lookAt: {
			eyePosition: {
				x: 0.2,
				y: 0.2,
				z: 0.2,
			},
			atPosition: {
				x: 0,
				y: 0,
				z: 0,
			},
		},
		/**
		 * 模型旋转角度
		 */
		modelRatation: {
			x: 0,
			y: 0,
			z: -10,
		},
		/**
		 * 模型偏移坐标
		 */
		modelOffset: {
			x: 0,
			y: 0,
			z: 0,
		},
	}

	static init(containerElement) {
		this.containerElement = containerElement
		this.initFormView()
		this.eventHandle()
	}

	static initFormView() {
		const self = this
		const modelXRotationRangeElement = this.containerElement.querySelector(`[name="modelXRotationRange"]`)
		const modelYRotationRangeElement = this.containerElement.querySelector(`[name="modelYRotationRange"]`)
		const modelZRotationRangeElement = this.containerElement.querySelector(`[name="modelZRotationRange"]`)
		const modelXOffsetRangeElement = this.containerElement.querySelector(`[name="modelXOffsetRange"]`)
		const modelYOffsetRangeElement = this.containerElement.querySelector(`[name="modelYOffsetRange"]`)
		const modelZOffsetRangeElement = this.containerElement.querySelector(`[name="modelZOffsetRange"]`)
		const lookAtMatrix4EyePositionXSelectElement = this.containerElement.querySelector(`[name="lookAtMatrix4EyePositionX"]`)
		const lookAtMatrix4EyePositionYSelectElement = this.containerElement.querySelector(`[name="lookAtMatrix4EyePositionY"]`)
		const lookAtMatrix4EyePositionZSelectElement = this.containerElement.querySelector(`[name="lookAtMatrix4EyePositionZ"]`)
		const lookAtMatrix4AtPositionZSelectElement = this.containerElement.querySelector(`[name="lookAtMatrix4AtPositionZ"]`)

		lookAtMatrix4EyePositionXSelectElement.value = self.profile.lookAt.eyePosition.x
		lookAtMatrix4EyePositionYSelectElement.value = self.profile.lookAt.eyePosition.y
		lookAtMatrix4EyePositionZSelectElement.value = self.profile.lookAt.eyePosition.z
		lookAtMatrix4AtPositionZSelectElement.value = self.profile.lookAt.atPosition.z
		modelXRotationRangeElement.value = self.profile.modelRatation.x
		modelYRotationRangeElement.value = self.profile.modelRatation.y
		modelZRotationRangeElement.value = self.profile.modelRatation.z
		modelXOffsetRangeElement.value = self.profile.modelOffset.x
		modelYOffsetRangeElement.value = self.profile.modelOffset.y
		modelZOffsetRangeElement.value = self.profile.modelOffset.z
	}

	static eventHandle() {
		const self = this
		const modelXRotationRangeElement = this.containerElement.querySelector(`[name="modelXRotationRange"]`)
		const modelYRotationRangeElement = this.containerElement.querySelector(`[name="modelYRotationRange"]`)
		const modelZRotationRangeElement = this.containerElement.querySelector(`[name="modelZRotationRange"]`)
		const modelXOffsetRangeElement = this.containerElement.querySelector(`[name="modelXOffsetRange"]`)
		const modelYOffsetRangeElement = this.containerElement.querySelector(`[name="modelYOffsetRange"]`)
		const modelZOffsetRangeElement = this.containerElement.querySelector(`[name="modelZOffsetRange"]`)
		const lookAtMatrix4EyePositionXSelectElement = this.containerElement.querySelector(`[name="lookAtMatrix4EyePositionX"]`)
		const lookAtMatrix4EyePositionYSelectElement = this.containerElement.querySelector(`[name="lookAtMatrix4EyePositionY"]`)
		const lookAtMatrix4EyePositionZSelectElement = this.containerElement.querySelector(`[name="lookAtMatrix4EyePositionZ"]`)
		const lookAtMatrix4AtPositionZSelectElement = this.containerElement.querySelector(`[name="lookAtMatrix4AtPositionZ"]`)

		modelXRotationRangeElement.addEventListener('input', function (e) {
			self.profile.modelRatation.x = +this.value
			console.log('modelRatation:', JSON.stringify(self.profile.modelRatation))
		})
		modelYRotationRangeElement.addEventListener('input', function (e) {
			self.profile.modelRatation.y = +this.value
			console.log('modelRatation:', JSON.stringify(self.profile.modelRatation))
		})
		modelZRotationRangeElement.addEventListener('input', function (e) {
			self.profile.modelRatation.z = +this.value
			console.log('modelRatation:', JSON.stringify(self.profile.modelRatation))
		})
		modelXOffsetRangeElement.addEventListener('input', function (e) {
			self.profile.modelOffset.x = +this.value
			console.log('modelOffset:', JSON.stringify(self.profile.modelOffset))
		})
		modelYOffsetRangeElement.addEventListener('input', function (e) {
			self.profile.modelOffset.y = +this.value
			console.log('modelOffset:', JSON.stringify(self.profile.modelOffset))
		})
		modelZOffsetRangeElement.addEventListener('input', function (e) {
			self.profile.modelOffset.z = +this.value
			console.log('modelOffset:', JSON.stringify(self.profile.modelOffset))
		})
		lookAtMatrix4EyePositionXSelectElement.addEventListener('input', function (e) {
			self.profile.lookAt.eyePosition.x = +this.value
			console.log('lookAt.eyePosition:', JSON.stringify(self.profile.lookAt.eyePosition))
		})
		lookAtMatrix4EyePositionYSelectElement.addEventListener('input', function (e) {
			self.profile.lookAt.eyePosition.y = +this.value
			console.log('lookAt.eyePosition:', JSON.stringify(self.profile.lookAt.eyePosition))
		})
		lookAtMatrix4EyePositionZSelectElement.addEventListener('input', function (e) {
			self.profile.lookAt.eyePosition.z = +this.value
			console.log('lookAt.eyePosition:', JSON.stringify(self.profile.lookAt.eyePosition))
		})
		lookAtMatrix4AtPositionZSelectElement.addEventListener('input', function (e) {
			self.profile.lookAt.atPosition.z = +this.value
			console.log('lookAt.atPosition:', JSON.stringify(self.profile.lookAt.atPosition))
		})
	}
}

function drawCanvas2(containerElement) {
	Program2.init(containerElement)

	const VS = `
		precision mediump float;
		attribute vec3 a_Position;
		attribute vec4 a_Color;
		varying vec4 v_Color;
		uniform mat4 u_ViewMatrix;
		uniform mat4 u_ModelMatrix;
		uniform mat4 u_ViewModelMatrix;
		void main() {
			// gl_Position = u_ViewMatrix * u_ModelMatrix * vec4(a_Position, 1);
			gl_Position = u_ViewModelMatrix * vec4(a_Position, 1);
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

	// prettier-ignore
	const datasResult = {
		vertexPositions: new Float32Array([
			/* 绿色 */
			0.0, 0.5, -0.4, 0.4, 1.0, 0.4, 1.0,
			-0.5, -0.5, -0.4, 0.4, 1.0, 0.4, 1.0,
			0.5, -0.5, -0.4, 1.0, 0.4, 0.4, 1.0,
			/* 黄色 */
			0.5, 0.4, -0.2, 1.0, 0.4, 0.4, 1.0,
			-0.5, 0.4, -0.2, 1.0, 1.0, 0.4, 1.0,
			0.0, -0.6, -0.2, 1.0, 1.0, 0.4, 1.0,
			/* 蓝色 */
			0.0, 0.5, 0.0, 0.4, 0.4, 1.0, 1.0,
			-0.5, -0.5, 0.0, 0.4, 0.4, 1.0, 1.0,
			0.5, -0.5, 0.0, 1.0, 0.4, 0.4, 1.0
		]),
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
	// gl.enable(gl.CULL_FACE)
	// gl.enable(gl.DEPTH_TEST)

	const u_ViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix')
	const u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix')
	const u_ViewModelMatrix = gl.getUniformLocation(program, 'u_ViewModelMatrix')
	const a_Position = gl.getAttribLocation(program, 'a_Position')
	const a_Color = gl.getAttribLocation(program, 'a_Color')

	gl.enableVertexAttribArray(a_Position)
	gl.enableVertexAttribArray(a_Color)

	const vertextBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, vertextBuffer)
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 28, 0)
	gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 28, 12)
	gl.bufferData(gl.ARRAY_BUFFER, datasResult.vertexPositions, gl.STATIC_DRAW)

	/**
	 * 创建矩形视口正交投影矩阵
	 */
	const orthoProjectionMatrix4 = Ven$CanvasMatrix4.setOrthoRectView(canvasElement.width / canvasElement.height, -25, 25, 1)

	const webglDefaultLookAtMatrix4 = Ven$CanvasMatrix4.setLookAt(new Ven$Vector3(0, 0, 0), new Ven$Vector3(0, 0, -1), new Ven$Vector3(0, 1, 0))
	const lookAtMatrix4_1 = Ven$CanvasMatrix4.setLookAt(new Ven$Vector3(0.2, 0.2, 0.2), new Ven$Vector3(0, 0, -1), new Ven$Vector3(0, 1, 0))
	const lookAtMatrix4_2 = Ven$CanvasMatrix4.setLookAt(new Ven$Vector3(0.2, 0.2, 0.2), new Ven$Vector3(0, 0, -0.5), new Ven$Vector3(0, 1, 0))
	const lookAtMatrix4_3 = Ven$CanvasMatrix4.setLookAt(new Ven$Vector3(0.2, 0.2, 0.2), new Ven$Vector3(0, 0, 0), new Ven$Vector3(0, 1, 0))

	const viewMatrix = new Matrix4()
	viewMatrix.setLookAt(0.2, 0.2, 0.2, 0, 0, 0, 0, 1, 0)

	const render = () => {
		const lookAtMatrix4 = Ven$CanvasMatrix4.setLookAt(
			new Ven$Vector3(Program2.profile.lookAt.eyePosition.x, Program2.profile.lookAt.eyePosition.y, Program2.profile.lookAt.eyePosition.z),
			new Ven$Vector3(Program2.profile.lookAt.atPosition.x, Program2.profile.lookAt.atPosition.y, Program2.profile.lookAt.atPosition.z),
			new Ven$Vector3(0, 1, 0)
		)
		/**
		 * 创建旋转矩阵
		 */
		const modelXRotationMatrix4 = Ven$CanvasMatrix4.setRotateMatrxi4(
			Ven$Angles.degreeToRadian(Program2.profile.modelRatation.x),
			new Ven$Vector3(1, 0, 0)
		)
		const modelYRotationMatrix4 = Ven$CanvasMatrix4.setRotateMatrxi4(
			Ven$Angles.degreeToRadian(Program2.profile.modelRatation.y),
			new Ven$Vector3(0, 1, 0)
		)
		const modelZRotationMatrix4 = Ven$CanvasMatrix4.setRotateMatrxi4(
			Ven$Angles.degreeToRadian(Program2.profile.modelRatation.z),
			new Ven$Vector3(0, 0, 1)
		)
		/**
		 * 创建平移矩阵
		 */
		const modelOffsetMatrix4 = Ven$CanvasMatrix4.setTranslate(
			new Ven$Vector3(Program2.profile.modelOffset.x, Program2.profile.modelOffset.y, Program2.profile.modelOffset.z)
		)
		/**
		 * 生成复合变换矩阵
		 */
		const modelEffectMatrix4 = modelXRotationMatrix4
			.multiply4(modelYRotationMatrix4)
			.multiply4(modelZRotationMatrix4)
			.multiply4(modelOffsetMatrix4)
		const modelResultMatrix4 = modelEffectMatrix4.multiply4(orthoProjectionMatrix4)

		// gl.uniformMatrix4fv(u_ModelMatrix, false, new Float32Array(modelZRotationMatrix4.data))
		// gl.uniformMatrix4fv(u_ViewMatrix, false, new Float32Array(lookAtMatrix4.data))
		// gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements)
		const viewModelMatrix4 = lookAtMatrix4.multiply4(modelZRotationMatrix4)
		gl.uniformMatrix4fv(u_ViewModelMatrix, false, new Float32Array(viewModelMatrix4.data))
		gl.clear(gl.COLOR_BUFFER_BIT)
		gl.drawArrays(gl.TRIANGLES, 0, datasResult.vertexPositions.length / 7)
	}

	const exec = () => {
		render()
		requestAnimationFrame(exec)
	}

	exec()
}
