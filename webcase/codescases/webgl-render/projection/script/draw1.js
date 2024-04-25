/**
 * 正交投影
 */

class Program1 {
	static containerElement
	static profile = {
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
		const modelXRotationRangeElement = this.containerElement.querySelector(`[name="modelXRotationRange"]`)
		const modelYRotationRangeElement = this.containerElement.querySelector(`[name="modelYRotationRange"]`)
		const modelZRotationRangeElement = this.containerElement.querySelector(`[name="modelZRotationRange"]`)
		const modelXOffsetRangeElement = this.containerElement.querySelector(`[name="modelXOffsetRange"]`)
		const modelYOffsetRangeElement = this.containerElement.querySelector(`[name="modelYOffsetRange"]`)
		const modelZOffsetRangeElement = this.containerElement.querySelector(`[name="modelZOffsetRange"]`)

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
	}
}

function drawCanvas1(containerElement) {
	Program1.init(containerElement)

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

	const p01 = [
		/* ... */
		0.6, 0.35, -0.5, 1, 0, 0, 1 /* ... */, 0.35, -0.2, -0.5, 1, 0, 0, 1 /* ... */, 0.85, -0.2, -0.5, 1, 0, 0, 1,
		/* ... */
	]
	const p02 = [
		/* ... */
		0, 0.35, 0, 1, 1, 0, 1 /* ... */, -0.25, -0.2, 0, 1, 1, 0, 1 /* ... */, 0.25, -0.2, 0, 1, 1, 0, 1,
		/* ... */
	]
	const p03 = [
		/* ... */
		-0.6, 0.35, 0.5, 1, 0, 1, 1 /* ... */, -0.85, -0.2, 0.5, 1, 0, 1, 1 /* ... */, -0.35, -0.2, 0.5, 1, 0, 1, 1,
		/* ... */
	]
	const datasResult = {
		vertexPositions: new Float32Array([...p01, ...p02, ...p03]),
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

	const orthoProjectionMatrix4 = Ven$CanvasMatrix4.createOrthoProjectionMatrix4OfRectView(canvasElement.width / canvasElement.height, -25, 25, 1)

	const render = () => {
		const modelXRotationMatrix4 = Ven$Matrix4.createRotateXMatrix4ByRadian(Ven$Angles.degreeToRadian(Program1.profile.modelRatation.x))
		const modelYRotationMatrix4 = Ven$Matrix4.createRotateYMatrix4ByRadian(Ven$Angles.degreeToRadian(Program1.profile.modelRatation.y))
		const modelZRotationMatrix4 = Ven$Matrix4.createRotateZMatrix4ByRadian(Ven$Angles.degreeToRadian(Program1.profile.modelRatation.z))
		const modelOffsetMatrix4 = Ven$Matrix4.createTranslateMatrix4ByCoordinate(
			Program1.profile.modelOffset.x,
			Program1.profile.modelOffset.y,
			Program1.profile.modelOffset.z
		)
		const modelEffectMatrix4 = modelXRotationMatrix4
			.multiply4(modelYRotationMatrix4)
			.multiply4(modelZRotationMatrix4)
			.multiply4(modelOffsetMatrix4)
		const modelResultMatrix4 = modelEffectMatrix4.multiply4(orthoProjectionMatrix4)
		gl.uniformMatrix4fv(u_Matrix, false, new Float32Array(modelResultMatrix4.data))
		gl.clear(gl.COLOR_BUFFER_BIT)
		gl.drawArrays(gl.TRIANGLES, 0, datasResult.vertexPositions.length / 7)
	}

	const exec = () => {
		render()
		requestAnimationFrame(exec)
	}

	exec()
}
