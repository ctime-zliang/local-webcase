/**
 * 通过视点观察图形
 */

class Program3 {
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
		 * 正交投影矩阵参数
		 */
		orthoProjection: {
			left: -1,
			right: 1,
			bottom: -1,
			top: 1,
			near: 0,
			far: 0.5,
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
		const orthoNearRangeElement = this.containerElement.querySelector(`[name="orthoNear"]`)
		const orthoFarRangeElement = this.containerElement.querySelector(`[name="orthoFar"]`)

		orthoNearRangeElement.value = self.profile.orthoProjection.near
		orthoFarRangeElement.value = self.profile.orthoProjection.far
	}

	static eventHandle() {
		const self = this
		const orthoNearRangeElement = this.containerElement.querySelector(`[name="orthoNear"]`)
		const orthoFarRangeElement = this.containerElement.querySelector(`[name="orthoFar"]`)

		orthoNearRangeElement.addEventListener('input', function (e) {
			self.profile.orthoProjection.near = +this.value
			console.log('orthoProjection:', JSON.stringify(self.profile.orthoProjection))
		})
		orthoFarRangeElement.addEventListener('input', function (e) {
			self.profile.orthoProjection.far = +this.value
			console.log('orthoProjection:', JSON.stringify(self.profile.orthoProjection))
		})
	}
}

function drawCanvas3(containerElement) {
	Program3.init(containerElement)

	const VS = `
		precision mediump float;
		attribute vec3 a_Position;
		attribute vec4 a_Color;
		varying vec4 v_Color;
		uniform mat4 u_OrthoProjMatrix;
		void main() {
			gl_Position = u_OrthoProjMatrix * vec4(a_Position, 1);
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

	const u_OrthoProjMatrix = gl.getUniformLocation(program, 'u_OrthoProjMatrix')
	const a_Position = gl.getAttribLocation(program, 'a_Position')
	const a_Color = gl.getAttribLocation(program, 'a_Color')

	gl.enableVertexAttribArray(a_Position)
	gl.enableVertexAttribArray(a_Color)

	const vertextBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, vertextBuffer)
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 28, 0)
	gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 28, 12)
	gl.bufferData(gl.ARRAY_BUFFER, datasResult.vertexPositions, gl.STATIC_DRAW)

	const render = () => {
		/**
		 * 创建矩形视口正交投影矩阵
		 */
		const orthoProjectionMatrix4 = Ven$CanvasMatrix4.setOrtho(
			Program3.profile.orthoProjection.left,
			Program3.profile.orthoProjection.right,
			Program3.profile.orthoProjection.bottom,
			Program3.profile.orthoProjection.top,
			Program3.profile.orthoProjection.near,
			Program3.profile.orthoProjection.far
		)

		/**
		 * 创建视图矩阵
		 */
		const lookAtMatrix4 = Ven$CanvasMatrix4.setLookAt(
			new Ven$Vector3(Program3.profile.lookAt.eyePosition.x, Program3.profile.lookAt.eyePosition.y, Program3.profile.lookAt.eyePosition.z),
			new Ven$Vector3(Program3.profile.lookAt.atPosition.x, Program3.profile.lookAt.atPosition.y, Program3.profile.lookAt.atPosition.z),
			new Ven$Vector3(0, 1, 0)
		)

		gl.uniformMatrix4fv(u_OrthoProjMatrix, false, new Float32Array(orthoProjectionMatrix4.data))
		gl.clear(gl.COLOR_BUFFER_BIT)
		gl.drawArrays(gl.TRIANGLES, 0, datasResult.vertexPositions.length / 7)
	}

	const exec = () => {
		render()
		requestAnimationFrame(exec)
	}

	exec()
}
