/**
 * 通过视点观察图形
 * 		透视投影
 */

class Program4 {
	static containerElement
	static profile = {
		/**
		 * 顶点坐标
		 */
		vertexPosition: new Float32Array([]),
		/**
		 * 视图矩阵参数
		 */
		lookAt: {
			eyePosition: {
				x: 0,
				y: 0,
				z: 5,
			},
			atPosition: {
				x: 0,
				y: 0,
				z: -5,
			},
		},
		/**
		 * 透视投影矩阵参数
		 */
		persProjection: {
			fovy: 30,
			aspect: 1,
			near: 1,
			far: 10,
		},
		/**
		 * 模型旋转角度
		 */
		modelRatation: {
			x: 0,
			y: 0,
			z: 0,
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
	// prettier-ignore
	static vertexProfile = {
		// prettier-ignore
		pos1: new Float32Array([
			/* 绿色 */
			0.0, 1.0, -4.0, 0.4, 1.0, 0.4, 1.0,
			-0.5, -1.0, -4.0, 0.4, 1.0, 0.4, 1.0,
			0.5, -1.0, -4.0, 1.0, 0.4, 0.4, 1.0,
			/* 黄色 */
			0.0, 1.0, -2.0, 1.0, 1.0, 0.4, 1.0,
			-0.5, -1.0, -2.0, 1.0, 1.0, 0.4, 1.0,
			0.5, -1.0, -2.0, 1.0, 0.4, 0.4, 1.0,
			/* 蓝色 */
			0.0, 1.0, 0.0, 0.4, 0.4, 1.0, 1.0,
			-0.5, -1.0, 0.0, 0.4, 0.4, 1.0, 1.0,
			0.5, -1.0, 0.0, 1.0, 0.4, 0.4, 1.0,
		]),
		// prettier-ignore
		pos2: new Float32Array([
			/**
			 * 右侧三角
			 */
			/* 绿色 */
			0.75, 1.0, -4.0, 0.4, 1.0,  0.4, 1.0,
			0.25, -1.0, -4.0, 0.4, 1.0, 0.4, 1.0,
			1.25, -1.0, -4.0, 1.0, 0.4, 0.4, 1.0,
			/* 黄色 */
			0.75, 1.0, -2.0, 1.0, 1.0, 0.4, 1.0,
			0.25, -1.0, -2.0, 1.0, 1.0, 0.4, 1.0,
			1.25, -1.0, -2.0, 1.0, 0.4, 0.4, 1.0,
			/* 蓝色 */
			0.75, 1.0, 0.0, 0.4, 0.4, 1.0, 1.0,
			0.25, -1.0, 0.0, 0.4, 0.4, 1.0, 1.0,
			1.25, -1.0, 0.0, 1.0, 0.4, 0.4, 1.0,
			/**
			 * 左侧三角
			 */
			/* 绿色 */
			-0.75, 1.0, -4.0, 0.4, 1.0, 0.4, 1.0, 
			-1.25, -1.0, -4.0, 0.4, 1.0, 0.4, 1.0,
			-0.25, -1.0, -4.0, 1.0, 0.4, 0.4, 1.0,
			/* 黄色 */
			-0.75, 1.0, -2.0, 1.0, 1.0, 0.4, 1.0,
			-1.25, -1.0, -2.0, 1.0, 1.0, 0.4, 1.0,
			-0.25, -1.0, -2.0, 1.0, 0.4, 0.4, 1.0,
			/* 蓝色 */
			-0.75, 1.0, 0.0, 0.4, 0.4, 1.0, 1.0,
			-1.25, -1.0, 0.0, 0.4, 0.4, 1.0, 1.0,
			-0.25, -1.0, 0.0, 1.0, 0.4, 0.4, 1.0,
		])
	}

	static init(containerElement) {
		this.containerElement = containerElement
		this.initFormView()
		this.eventHandle()
	}

	static initFormView() {
		const self = this
		const projectionFovyRangeElement = this.containerElement.querySelector(`[name="projectionFovy"]`)
		const projectionFovyShowSpanElement = this.containerElement.querySelector(`[name="projectionFovyShow"]`)
		const projectionNearRangeElement = this.containerElement.querySelector(`[name="projectionNear"]`)
		const projectionNearShowSpanElement = this.containerElement.querySelector(`[name="projectionNearShow"]`)
		const projectionFarRangeElement = this.containerElement.querySelector(`[name="projectionFar"]`)
		const projectionFarShowSpanElement = this.containerElement.querySelector(`[name="projectionFarShow"]`)
		const modelRotationXRangeElement = this.containerElement.querySelector(`[name="modelRotationXRange"]`)
		const modelRotationXShowSpanElement = this.containerElement.querySelector(`[name="modelRotationXRangeShow"]`)
		const modelRotationYRangeElement = this.containerElement.querySelector(`[name="modelRotationYRange"]`)
		const modelRotationYShowSpanElement = this.containerElement.querySelector(`[name="modelRotationYRangeShow"]`)
		const modelRotationZRangeElement = this.containerElement.querySelector(`[name="modelRotationZRange"]`)
		const modelRotationZShowSpanElement = this.containerElement.querySelector(`[name="modelRotationZRangeShow"]`)
		const modelOffsetXRangeElement = this.containerElement.querySelector(`[name="modelOffsetXRange"]`)
		const modelOffsetXShowSpanElement = this.containerElement.querySelector(`[name="modelOffsetXRangeShow"]`)
		const modelOffsetYRangeElement = this.containerElement.querySelector(`[name="modelOffsetYRange"]`)
		const modelOffsetYShowSpanElement = this.containerElement.querySelector(`[name="modelOffsetYRangeShow"]`)
		const modelOffsetZRangeElement = this.containerElement.querySelector(`[name="modelOffsetZRange"]`)
		const modelOffsetZShowSpanElement = this.containerElement.querySelector(`[name="modelOffsetZRangeShow"]`)
		const lookAtMatrix4EyePositionXRangeElement = this.containerElement.querySelector(`[name="lookAtMatrix4EyePositionX"]`)
		const lookAtMatrix4EyePositionXShowSpanElement = this.containerElement.querySelector(`[name="lookAtMatrix4EyePositionXShow"]`)
		const lookAtMatrix4EyePositionYRangeElement = this.containerElement.querySelector(`[name="lookAtMatrix4EyePositionY"]`)
		const lookAtMatrix4EyePositionYShowSpanElement = this.containerElement.querySelector(`[name="lookAtMatrix4EyePositionYShow"]`)
		const lookAtMatrix4EyePositionZRangeElement = this.containerElement.querySelector(`[name="lookAtMatrix4EyePositionZ"]`)
		const lookAtMatrix4EyePositionZShowSpanElement = this.containerElement.querySelector(`[name="lookAtMatrix4EyePositionZShow"]`)
		const lookAtMatrix4AtPositionXRangeElement = this.containerElement.querySelector(`[name="lookAtMatrix4AtPositionX"]`)
		const lookAtMatrix4AtPositionXShowSpanElement = this.containerElement.querySelector(`[name="lookAtMatrix4AtPositionXShow"]`)
		const lookAtMatrix4AtPositionYRangeElement = this.containerElement.querySelector(`[name="lookAtMatrix4AtPositionY"]`)
		const lookAtMatrix4AtPositionYShowSpanElement = this.containerElement.querySelector(`[name="lookAtMatrix4AtPositionYShow"]`)
		const lookAtMatrix4AtPositionZRangeElement = this.containerElement.querySelector(`[name="lookAtMatrix4AtPositionZ"]`)
		const lookAtMatrix4AtPositionZShowSpanElement = this.containerElement.querySelector(`[name="lookAtMatrix4AtPositionZShow"]`)

		projectionFovyShowSpanElement.textContent = projectionFovyRangeElement.value = self.profile.persProjection.fovy
		projectionNearShowSpanElement.textContent = projectionNearRangeElement.value = self.profile.persProjection.near
		projectionFarShowSpanElement.textContent = projectionFarRangeElement.value = self.profile.persProjection.far
		modelRotationXShowSpanElement.textContent = modelRotationXRangeElement.value = self.profile.modelRatation.x
		modelRotationYShowSpanElement.textContent = modelRotationYRangeElement.value = self.profile.modelRatation.y
		modelRotationZShowSpanElement.textContent = modelRotationZRangeElement.value = self.profile.modelRatation.z
		modelOffsetXShowSpanElement.textContent = modelOffsetXRangeElement.value = self.profile.modelOffset.x
		modelOffsetYShowSpanElement.textContent = modelOffsetYRangeElement.value = self.profile.modelOffset.y
		modelOffsetZShowSpanElement.textContent = modelOffsetZRangeElement.value = self.profile.modelOffset.z
		lookAtMatrix4EyePositionXShowSpanElement.textContent = lookAtMatrix4EyePositionXRangeElement.value = self.profile.lookAt.eyePosition.x
		lookAtMatrix4EyePositionYShowSpanElement.textContent = lookAtMatrix4EyePositionYRangeElement.value = self.profile.lookAt.eyePosition.y
		lookAtMatrix4EyePositionZShowSpanElement.textContent = lookAtMatrix4EyePositionZRangeElement.value = self.profile.lookAt.eyePosition.z
		lookAtMatrix4AtPositionXShowSpanElement.textContent = lookAtMatrix4AtPositionXRangeElement.value = self.profile.lookAt.atPosition.x
		lookAtMatrix4AtPositionYShowSpanElement.textContent = lookAtMatrix4AtPositionYRangeElement.value = self.profile.lookAt.atPosition.y
		lookAtMatrix4AtPositionZShowSpanElement.textContent = lookAtMatrix4AtPositionZRangeElement.value = self.profile.lookAt.atPosition.z
	}

	static eventHandle() {
		const self = this
		const projectionFovyRangeElement = this.containerElement.querySelector(`[name="projectionFovy"]`)
		const projectionFovyShowSpanElement = this.containerElement.querySelector(`[name="projectionFovyShow"]`)
		const projectionNearRangeElement = this.containerElement.querySelector(`[name="projectionNear"]`)
		const projectionNearShowSpanElement = this.containerElement.querySelector(`[name="projectionNearShow"]`)
		const projectionFarRangeElement = this.containerElement.querySelector(`[name="projectionFar"]`)
		const projectionFarShowSpanElement = this.containerElement.querySelector(`[name="projectionFarShow"]`)
		const modelRotationXRangeElement = this.containerElement.querySelector(`[name="modelRotationXRange"]`)
		const modelRotationXShowSpanElement = this.containerElement.querySelector(`[name="modelRotationXRangeShow"]`)
		const modelRotationYRangeElement = this.containerElement.querySelector(`[name="modelRotationYRange"]`)
		const modelRotationYShowSpanElement = this.containerElement.querySelector(`[name="modelRotationYRangeShow"]`)
		const modelRotationZRangeElement = this.containerElement.querySelector(`[name="modelRotationZRange"]`)
		const modelRotationZShowSpanElement = this.containerElement.querySelector(`[name="modelRotationZRangeShow"]`)
		const modelOffsetXRangeElement = this.containerElement.querySelector(`[name="modelOffsetXRange"]`)
		const modelOffsetXShowSpanElement = this.containerElement.querySelector(`[name="modelOffsetXRangeShow"]`)
		const modelOffsetYRangeElement = this.containerElement.querySelector(`[name="modelOffsetYRange"]`)
		const modelOffsetYShowSpanElement = this.containerElement.querySelector(`[name="modelOffsetYRangeShow"]`)
		const modelOffsetZRangeElement = this.containerElement.querySelector(`[name="modelOffsetZRange"]`)
		const modelOffsetZShowSpanElement = this.containerElement.querySelector(`[name="modelOffsetZRangeShow"]`)
		const lookAtMatrix4EyePositionXRangeElement = this.containerElement.querySelector(`[name="lookAtMatrix4EyePositionX"]`)
		const lookAtMatrix4EyePositionXShowSpanElement = this.containerElement.querySelector(`[name="lookAtMatrix4EyePositionXShow"]`)
		const lookAtMatrix4EyePositionYRangeElement = this.containerElement.querySelector(`[name="lookAtMatrix4EyePositionY"]`)
		const lookAtMatrix4EyePositionYShowSpanElement = this.containerElement.querySelector(`[name="lookAtMatrix4EyePositionYShow"]`)
		const lookAtMatrix4EyePositionZRangeElement = this.containerElement.querySelector(`[name="lookAtMatrix4EyePositionZ"]`)
		const lookAtMatrix4EyePositionZShowSpanElement = this.containerElement.querySelector(`[name="lookAtMatrix4EyePositionZShow"]`)
		const lookAtMatrix4AtPositionXRangeElement = this.containerElement.querySelector(`[name="lookAtMatrix4AtPositionX"]`)
		const lookAtMatrix4AtPositionXShowSpanElement = this.containerElement.querySelector(`[name="lookAtMatrix4AtPositionXShow"]`)
		const lookAtMatrix4AtPositionYRangeElement = this.containerElement.querySelector(`[name="lookAtMatrix4AtPositionY"]`)
		const lookAtMatrix4AtPositionYShowSpanElement = this.containerElement.querySelector(`[name="lookAtMatrix4AtPositionYShow"]`)
		const lookAtMatrix4AtPositionZRangeElement = this.containerElement.querySelector(`[name="lookAtMatrix4AtPositionZ"]`)
		const lookAtMatrix4AtPositionZShowSpanElement = this.containerElement.querySelector(`[name="lookAtMatrix4AtPositionZShow"]`)
		const vertexPositionItemSelectElement = this.containerElement.querySelector(`[name="vertexPositionItem"]`)

		projectionFovyRangeElement.addEventListener('input', function (e) {
			projectionFovyShowSpanElement.textContent = self.profile.persProjection.fovy = +this.value
			console.log('persProjection:', JSON.stringify(self.profile.persProjection))
		})
		projectionNearRangeElement.addEventListener('input', function (e) {
			projectionNearShowSpanElement.textContent = self.profile.persProjection.near = +this.value
			console.log('persProjection:', JSON.stringify(self.profile.persProjection))
		})
		projectionFarRangeElement.addEventListener('input', function (e) {
			projectionFarShowSpanElement.textContent = self.profile.persProjection.far = +this.value
			console.log('persProjection:', JSON.stringify(self.profile.persProjection))
		})
		modelRotationXRangeElement.addEventListener('input', function (e) {
			modelRotationXShowSpanElement.textContent = self.profile.modelRatation.x = +this.value
			console.log('modelRatation:', JSON.stringify(self.profile.modelRatation))
		})
		modelRotationYRangeElement.addEventListener('input', function (e) {
			modelRotationYShowSpanElement.textContent = self.profile.modelRatation.y = +this.value
			console.log('modelRatation:', JSON.stringify(self.profile.modelRatation))
		})
		modelRotationZRangeElement.addEventListener('input', function (e) {
			modelRotationZShowSpanElement.textContent = self.profile.modelRatation.z = +this.value
			console.log('modelRatation:', JSON.stringify(self.profile.modelRatation))
		})
		modelOffsetXRangeElement.addEventListener('input', function (e) {
			modelOffsetXShowSpanElement.textContent = self.profile.modelOffset.x = +this.value
			console.log('modelOffset:', JSON.stringify(self.profile.modelOffset))
		})
		modelOffsetYRangeElement.addEventListener('input', function (e) {
			modelOffsetYShowSpanElement.textContent = self.profile.modelOffset.y = +this.value
			console.log('modelOffset:', JSON.stringify(self.profile.modelOffset))
		})
		modelOffsetZRangeElement.addEventListener('input', function (e) {
			modelOffsetZShowSpanElement.textContent = self.profile.modelOffset.z = +this.value
			console.log('modelOffset:', JSON.stringify(self.profile.modelOffset))
		})
		lookAtMatrix4EyePositionXRangeElement.addEventListener('input', function (e) {
			lookAtMatrix4EyePositionXShowSpanElement.textContent = self.profile.lookAt.eyePosition.x = +this.value
			console.log('lookAt.eyePosition:', JSON.stringify(self.profile.lookAt.eyePosition))
		})
		lookAtMatrix4EyePositionYRangeElement.addEventListener('input', function (e) {
			lookAtMatrix4EyePositionYShowSpanElement.textContent = self.profile.lookAt.eyePosition.y = +this.value
			console.log('lookAt.eyePosition:', JSON.stringify(self.profile.lookAt.eyePosition))
		})
		lookAtMatrix4EyePositionZRangeElement.addEventListener('input', function (e) {
			lookAtMatrix4EyePositionZShowSpanElement.textContent = self.profile.lookAt.eyePosition.z = +this.value
			console.log('lookAt.eyePosition:', JSON.stringify(self.profile.lookAt.eyePosition))
		})
		lookAtMatrix4AtPositionXRangeElement.addEventListener('input', function (e) {
			lookAtMatrix4AtPositionXShowSpanElement.textContent = self.profile.lookAt.atPosition.x = +this.value
			console.log('lookAt.atPosition:', JSON.stringify(self.profile.lookAt.atPosition))
		})
		lookAtMatrix4AtPositionYRangeElement.addEventListener('input', function (e) {
			lookAtMatrix4AtPositionYShowSpanElement.textContent = self.profile.lookAt.atPosition.y = +this.value
			console.log('lookAt.atPosition:', JSON.stringify(self.profile.lookAt.atPosition))
		})
		lookAtMatrix4AtPositionZRangeElement.addEventListener('input', function (e) {
			lookAtMatrix4AtPositionZShowSpanElement.textContent = self.profile.lookAt.atPosition.z = +this.value
			console.log('lookAt.atPosition:', JSON.stringify(self.profile.lookAt.atPosition))
		})
		vertexPositionItemSelectElement.addEventListener('change', function (e) {
			self.vertexPosition = self.vertexProfile[this.value]
		})
	}
}

function drawCanvas4(containerElement) {
	Program4.init(containerElement)

	const VS = `
		precision mediump float;
		attribute vec3 a_Position;
		attribute vec4 a_Color;
		varying vec4 v_Color;
		uniform mat4 u_ModelMatrix;
		uniform mat4 u_ViewMatrix;
		uniform mat4 u_ProjMatrix;
		void main() {
			gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * vec4(a_Position, 1);
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

	Program4.vertexPosition = Program4.vertexProfile['pos1']

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

	const u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix')
	const u_ViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix')
	const u_ProjMatrix = gl.getUniformLocation(program, 'u_ProjMatrix')
	const a_Position = gl.getAttribLocation(program, 'a_Position')
	const a_Color = gl.getAttribLocation(program, 'a_Color')

	gl.enableVertexAttribArray(a_Position)
	gl.enableVertexAttribArray(a_Color)

	const vertextBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, vertextBuffer)
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 28, 0)
	gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 28, 12)

	const render = () => {
		/**
		 * 创建透视投影矩阵
		 */
		const projectionMatrix4 = Ven$CanvasMatrix4.setPerspective(
			Program4.profile.persProjection.fovy,
			Program4.profile.persProjection.aspect,
			Program4.profile.persProjection.near,
			Program4.profile.persProjection.far
		)
		/**
		 * 创建视图矩阵
		 */
		const lookAtMatrix4 = Ven$CanvasMatrix4.setLookAt(
			new Ven$Vector3(Program4.profile.lookAt.eyePosition.x, Program4.profile.lookAt.eyePosition.y, Program4.profile.lookAt.eyePosition.z),
			new Ven$Vector3(Program4.profile.lookAt.atPosition.x, Program4.profile.lookAt.atPosition.y, Program4.profile.lookAt.atPosition.z),
			new Ven$Vector3(0, 1, 0)
		)
		/**
		 * 创建旋转矩阵
		 */
		const modelXRotationMatrix4 = Ven$CanvasMatrix4.setRotateMatrxi4(
			Ven$Angles.degreeToRadian(Program4.profile.modelRatation.x),
			new Ven$Vector3(1, 0, 0)
		)
		const modelRotationYMatrix4 = Ven$CanvasMatrix4.setRotateMatrxi4(
			Ven$Angles.degreeToRadian(Program4.profile.modelRatation.y),
			new Ven$Vector3(0, 1, 0)
		)
		const modelRotationZMatrix4 = Ven$CanvasMatrix4.setRotateMatrxi4(
			Ven$Angles.degreeToRadian(Program4.profile.modelRatation.z),
			new Ven$Vector3(0, 0, 1)
		)
		/**
		 * 创建平移矩阵
		 */
		const modelOffsetMatrix4 = Ven$CanvasMatrix4.setTranslate(
			new Ven$Vector3(Program4.profile.modelOffset.x, Program4.profile.modelOffset.y, Program4.profile.modelOffset.z)
		)
		/**
		 * 生成复合变换矩阵
		 */
		const modelEffectMatrix4 = modelXRotationMatrix4
			.multiply4(modelRotationYMatrix4)
			.multiply4(modelRotationZMatrix4)
			.multiply4(modelOffsetMatrix4)

		gl.uniformMatrix4fv(u_ModelMatrix, false, new Float32Array(modelEffectMatrix4.data))
		gl.uniformMatrix4fv(u_ViewMatrix, false, new Float32Array(lookAtMatrix4.data))
		gl.uniformMatrix4fv(u_ProjMatrix, false, new Float32Array(projectionMatrix4.data))
		gl.clear(gl.COLOR_BUFFER_BIT)
		gl.clearColor(0.0, 0.0, 0.0, 1.0)
		gl.bufferData(gl.ARRAY_BUFFER, Program4.vertexPosition, gl.STATIC_DRAW)
		gl.drawArrays(gl.TRIANGLES, 0, Program4.vertexPosition.length / 7)
	}

	const exec = () => {
		render()
		requestAnimationFrame(exec)
	}

	exec()
}
