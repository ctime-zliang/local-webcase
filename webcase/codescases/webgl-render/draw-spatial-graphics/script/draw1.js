/**
 * 绘制方体
 */

class Program1 {
	static isRender = true
	static containerElement
	static profile = {
		/**
		 * 视图矩阵参数
		 */
		lookAt: {
			eyePosition: {
				x: 3,
				y: 3,
				z: 7,
			},
			atPosition: {
				x: 0,
				y: 0,
				z: 0,
			},
		},
		/**
		 * 透视投影矩阵参数
		 */
		persProjection: {
			fovy: 30,
			aspect: 1,
			near: 1,
			far: 30,
		},
		/**
		 * 模型参数
		 */
		modelSize: {
			cubeLength: 1.0,
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
		const modelRotationRangeXElement = this.containerElement.querySelector(`[name="modelRotationRangeX"]`)
		const modelRotationXShowSpanElement = this.containerElement.querySelector(`[name="modelRotationRangeXShow"]`)
		const modelRotationRangeYElement = this.containerElement.querySelector(`[name="modelRotationRangeY"]`)
		const modelRotationYShowSpanElement = this.containerElement.querySelector(`[name="modelRotationRangeYShow"]`)
		const modelRotationRangeZElement = this.containerElement.querySelector(`[name="modelRotationRangeZ"]`)
		const modelRotationZShowSpanElement = this.containerElement.querySelector(`[name="modelRotationRangeZShow"]`)
		const modelOffsetRangeXElement = this.containerElement.querySelector(`[name="modelOffsetRangeX"]`)
		const modelOffsetXShowSpanElement = this.containerElement.querySelector(`[name="modelOffsetRangeXShow"]`)
		const modelOffsetRangeYElement = this.containerElement.querySelector(`[name="modelOffsetRangeY"]`)
		const modelOffsetYShowSpanElement = this.containerElement.querySelector(`[name="modelOffsetRangeYShow"]`)
		const modelOffsetRangeZElement = this.containerElement.querySelector(`[name="modelOffsetRangeZ"]`)
		const modelOffsetZShowSpanElement = this.containerElement.querySelector(`[name="modelOffsetRangeZShow"]`)
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
		modelRotationXShowSpanElement.textContent = modelRotationRangeXElement.value = self.profile.modelRatation.x
		modelRotationYShowSpanElement.textContent = modelRotationRangeYElement.value = self.profile.modelRatation.y
		modelRotationZShowSpanElement.textContent = modelRotationRangeZElement.value = self.profile.modelRatation.z
		modelOffsetXShowSpanElement.textContent = modelOffsetRangeXElement.value = self.profile.modelOffset.x
		modelOffsetYShowSpanElement.textContent = modelOffsetRangeYElement.value = self.profile.modelOffset.y
		modelOffsetZShowSpanElement.textContent = modelOffsetRangeZElement.value = self.profile.modelOffset.z
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
		const modelRotationRangeXElement = this.containerElement.querySelector(`[name="modelRotationRangeX"]`)
		const modelRotationXShowSpanElement = this.containerElement.querySelector(`[name="modelRotationRangeXShow"]`)
		const modelRotationRangeYElement = this.containerElement.querySelector(`[name="modelRotationRangeY"]`)
		const modelRotationYShowSpanElement = this.containerElement.querySelector(`[name="modelRotationRangeYShow"]`)
		const modelRotationRangeZElement = this.containerElement.querySelector(`[name="modelRotationRangeZ"]`)
		const modelRotationZShowSpanElement = this.containerElement.querySelector(`[name="modelRotationRangeZShow"]`)
		const modelOffsetRangeXElement = this.containerElement.querySelector(`[name="modelOffsetRangeX"]`)
		const modelOffsetXShowSpanElement = this.containerElement.querySelector(`[name="modelOffsetRangeXShow"]`)
		const modelOffsetRangeYElement = this.containerElement.querySelector(`[name="modelOffsetRangeY"]`)
		const modelOffsetYShowSpanElement = this.containerElement.querySelector(`[name="modelOffsetRangeYShow"]`)
		const modelOffsetRangeZElement = this.containerElement.querySelector(`[name="modelOffsetRangeZ"]`)
		const modelOffsetZShowSpanElement = this.containerElement.querySelector(`[name="modelOffsetRangeZShow"]`)
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

		projectionFovyRangeElement.addEventListener('input', function (e) {
			projectionFovyShowSpanElement.textContent = self.profile.persProjection.fovy = +this.value
			console.log('persProjection:', JSON.stringify(self.profile.persProjection))
			self.isRender = true
		})
		projectionNearRangeElement.addEventListener('input', function (e) {
			projectionNearShowSpanElement.textContent = self.profile.persProjection.near = +this.value
			console.log('persProjection:', JSON.stringify(self.profile.persProjection))
			self.isRender = true
		})
		projectionFarRangeElement.addEventListener('input', function (e) {
			projectionFarShowSpanElement.textContent = self.profile.persProjection.far = +this.value
			console.log('persProjection:', JSON.stringify(self.profile.persProjection))
			self.isRender = true
		})
		modelRotationRangeXElement.addEventListener('input', function (e) {
			modelRotationXShowSpanElement.textContent = self.profile.modelRatation.x = +this.value
			console.log('modelRatation:', JSON.stringify(self.profile.modelRatation))
			self.isRender = true
		})
		modelRotationRangeYElement.addEventListener('input', function (e) {
			modelRotationYShowSpanElement.textContent = self.profile.modelRatation.y = +this.value
			console.log('modelRatation:', JSON.stringify(self.profile.modelRatation))
			self.isRender = true
		})
		modelRotationRangeZElement.addEventListener('input', function (e) {
			modelRotationZShowSpanElement.textContent = self.profile.modelRatation.z = +this.value
			console.log('modelRatation:', JSON.stringify(self.profile.modelRatation))
			self.isRender = true
		})
		modelOffsetRangeXElement.addEventListener('input', function (e) {
			modelOffsetXShowSpanElement.textContent = self.profile.modelOffset.x = +this.value
			console.log('modelOffset:', JSON.stringify(self.profile.modelOffset))
			self.isRender = true
		})
		modelOffsetRangeYElement.addEventListener('input', function (e) {
			modelOffsetYShowSpanElement.textContent = self.profile.modelOffset.y = +this.value
			console.log('modelOffset:', JSON.stringify(self.profile.modelOffset))
			self.isRender = true
		})
		modelOffsetRangeZElement.addEventListener('input', function (e) {
			modelOffsetZShowSpanElement.textContent = self.profile.modelOffset.z = +this.value
			console.log('modelOffset:', JSON.stringify(self.profile.modelOffset))
			self.isRender = true
		})
		lookAtMatrix4EyePositionXRangeElement.addEventListener('input', function (e) {
			lookAtMatrix4EyePositionXShowSpanElement.textContent = self.profile.lookAt.eyePosition.x = +this.value
			console.log('lookAt.eyePosition:', JSON.stringify(self.profile.lookAt.eyePosition))
			self.isRender = true
		})
		lookAtMatrix4EyePositionYRangeElement.addEventListener('input', function (e) {
			lookAtMatrix4EyePositionYShowSpanElement.textContent = self.profile.lookAt.eyePosition.y = +this.value
			console.log('lookAt.eyePosition:', JSON.stringify(self.profile.lookAt.eyePosition))
			self.isRender = true
		})
		lookAtMatrix4EyePositionZRangeElement.addEventListener('input', function (e) {
			lookAtMatrix4EyePositionZShowSpanElement.textContent = self.profile.lookAt.eyePosition.z = +this.value
			console.log('lookAt.eyePosition:', JSON.stringify(self.profile.lookAt.eyePosition))
			self.isRender = true
		})
		lookAtMatrix4AtPositionXRangeElement.addEventListener('input', function (e) {
			lookAtMatrix4AtPositionXShowSpanElement.textContent = self.profile.lookAt.atPosition.x = +this.value
			console.log('lookAt.atPosition:', JSON.stringify(self.profile.lookAt.atPosition))
			self.isRender = true
		})
		lookAtMatrix4AtPositionYRangeElement.addEventListener('input', function (e) {
			lookAtMatrix4AtPositionYShowSpanElement.textContent = self.profile.lookAt.atPosition.y = +this.value
			console.log('lookAt.atPosition:', JSON.stringify(self.profile.lookAt.atPosition))
			self.isRender = true
		})
		lookAtMatrix4AtPositionZRangeElement.addEventListener('input', function (e) {
			lookAtMatrix4AtPositionZShowSpanElement.textContent = self.profile.lookAt.atPosition.z = +this.value
			console.log('lookAt.atPosition:', JSON.stringify(self.profile.lookAt.atPosition))
			self.isRender = true
		})
	}
}

function drawCanvas1(containerElement) {
	Program1.init(containerElement)

	const VS = `
		precision mediump float;
		varying vec4 v_Color;
		// 顶点配置(组)
		attribute vec3 a_Position;
		attribute vec4 a_Color;
		// 变换矩阵(组)
		uniform mat4 u_ModelMatrix;
		uniform mat4 u_ViewMatrix;
		uniform mat4 u_ProjMatrix;
		void main() {
			gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * vec4(a_Position, 1.0);
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
	const cubeDatasResult = createCubeDatas(
		Program1.profile.modelSize.cubeLength,
		Program1.profile.modelSize.cubeLength,
		Program1.profile.modelSize.cubeLength,
		{
			up: [255, 0, 0, 1],
			bottom: [0, 255, 0, 1],
			front: [0, 0, 255, 1],
			back: [255, 255, 0, 1],
			right: [0, 255, 255, 1],
			left: [255, 0, 255, 1],
		}
	)
	console.log(cubeDatasResult)
	console.timeEnd(`CreateCubeDatas`)

	const canvasElement = containerElement.querySelector('canvas')
	const gl = initWebGLContext(canvasElement)

	const vertexShader = createShader(gl, gl.VERTEX_SHADER, VS)
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FS)
	const program = createProgram(gl, vertexShader, fragmentShader)

	gl.useProgram(program)

	gl.clearColor(0.0, 0.0, 0.0, 1.0)
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
	gl.enable(gl.CULL_FACE)
	gl.enable(gl.DEPTH_TEST)
	gl.enable(gl.POLYGON_OFFSET_FILL)
	gl.polygonOffset(1.0, 1.0)

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
	gl.bufferData(gl.ARRAY_BUFFER, cubeDatasResult.vertexPositions, gl.STATIC_DRAW)

	const render = () => {
		if (!Program1.isRender) {
			return
		}
		// Program1.isRender = false

		/**
		 * 创建透视投影矩阵
		 */
		const projectionMatrix4 = Ven$CanvasMatrix4.setPerspective(
			Program1.profile.persProjection.fovy,
			Program1.profile.persProjection.aspect,
			Program1.profile.persProjection.near,
			Program1.profile.persProjection.far
		)
		/**
		 * 创建视图矩阵
		 */
		const lookAtMatrix4 = Ven$CanvasMatrix4.setLookAt(
			new Ven$Vector3(Program1.profile.lookAt.eyePosition.x, Program1.profile.lookAt.eyePosition.y, Program1.profile.lookAt.eyePosition.z),
			new Ven$Vector3(Program1.profile.lookAt.atPosition.x, Program1.profile.lookAt.atPosition.y, Program1.profile.lookAt.atPosition.z),
			new Ven$Vector3(0, 1, 0)
		)
		/**
		 * 创建旋转矩阵
		 */
		const modelXRotationMatrix4 = Ven$CanvasMatrix4.setRotateMatrxi4(
			Ven$Angles.degreeToRadian(Program1.profile.modelRatation.x),
			new Ven$Vector3(1, 0, 0)
		)
		const modelRotationYMatrix4 = Ven$CanvasMatrix4.setRotateMatrxi4(
			Ven$Angles.degreeToRadian(Program1.profile.modelRatation.y),
			new Ven$Vector3(0, 1, 0)
		)
		const modelRotationZMatrix4 = Ven$CanvasMatrix4.setRotateMatrxi4(
			Ven$Angles.degreeToRadian(Program1.profile.modelRatation.z),
			new Ven$Vector3(0, 0, 1)
		)
		/**
		 * 创建平移矩阵
		 */
		const modelOffsetMatrix4 = Ven$CanvasMatrix4.setTranslate(
			new Ven$Vector3(Program1.profile.modelOffset.x, Program1.profile.modelOffset.y, Program1.profile.modelOffset.z)
		)
		/**
		 * 生成模型变换矩阵
		 */
		const modelEffectMatrix4 = modelXRotationMatrix4
			.multiply4(modelRotationYMatrix4)
			.multiply4(modelRotationZMatrix4)
			.multiply4(modelOffsetMatrix4)

		gl.uniformMatrix4fv(u_ModelMatrix, false, new Float32Array(modelEffectMatrix4.data))
		gl.uniformMatrix4fv(u_ViewMatrix, false, new Float32Array(lookAtMatrix4.data))
		gl.uniformMatrix4fv(u_ProjMatrix, false, new Float32Array(projectionMatrix4.data))
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
		gl.clearColor(0.0, 0.0, 0.0, 1.0)
		gl.drawArrays(gl.TRIANGLES, 0, cubeDatasResult.vertexPositions.length / 7)
	}

	const exec = () => {
		render()
		requestAnimationFrame(exec)
	}

	exec()
}
