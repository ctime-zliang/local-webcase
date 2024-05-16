/**
 * 通过视点观察图形
 */

class Program1 {
	static isRender = true
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

	static initFormView() {}

	static eventHandle() {}
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
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
	// gl.enable(gl.CULL_FACE)
	// gl.enable(gl.DEPTH_TEST)
	// gl.enable(gl.POLYGON_OFFSET_FILL)
	// gl.polygonOffset(1.0, 1.0)

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

	/**
	 * 创建矩形视口正交投影矩阵
	 */
	const orthoProjectionMatrix4 = Ven$CanvasMatrix4.setOrthoRectView(canvasElement.width / canvasElement.height, -25, 25, 1)

	{
		const lookAtMatrix4 = Ven$CanvasMatrix4.setLookAt(new Ven$Vector3(0.2, 0.2, 0.2), new Ven$Vector3(0, 0, 0), new Ven$Vector3(0, 1, 0))
		const viewMatrix = new Matrix4()
		viewMatrix.setLookAt(0.2, 0.2, 0.2, 0, 0, 0, 0, 1, 0)
		console.log(lookAtMatrix4.data)
		console.log(Array.from(viewMatrix.elements))
	}

	const webglDefaultLookAtMatrix4 = Ven$CanvasMatrix4.setLookAt(new Ven$Vector3(0, 0, 0), new Ven$Vector3(0, 0, -1), new Ven$Vector3(0, 1, 0))
	const lookAtMatrix4_1 = Ven$CanvasMatrix4.setLookAt(new Ven$Vector3(0.2, 0.2, 0.2), new Ven$Vector3(0, 0, -1), new Ven$Vector3(0, 1, 0))
	const lookAtMatrix4_2 = Ven$CanvasMatrix4.setLookAt(new Ven$Vector3(0.2, 0.2, 0.2), new Ven$Vector3(0, 0, -0.5), new Ven$Vector3(0, 1, 0))
	const lookAtMatrix4_3 = Ven$CanvasMatrix4.setLookAt(new Ven$Vector3(0.2, 0.2, 0.2), new Ven$Vector3(0, 0, 0), new Ven$Vector3(0, 1, 0))

	const render = () => {
		if (!Program1.isRender) {
			return
		}
		Program1.isRender = false
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
		 * 生成复合变换矩阵
		 */
		const modelEffectMatrix4 = modelXRotationMatrix4
			.multiply4(modelRotationYMatrix4)
			.multiply4(modelRotationZMatrix4)
			.multiply4(modelOffsetMatrix4)
		const modelResultMatrix4 = modelEffectMatrix4.multiply4(orthoProjectionMatrix4)

		gl.uniformMatrix4fv(u_Matrix, false, new Float32Array(lookAtMatrix4_3.data))
		gl.clear(gl.COLOR_BUFFER_BIT)
		gl.drawArrays(gl.TRIANGLES, 0, datasResult.vertexPositions.length / 7)
	}

	const exec = () => {
		render()
		requestAnimationFrame(exec)
	}

	exec()
}
