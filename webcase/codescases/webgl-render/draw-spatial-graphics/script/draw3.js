/**
 * 绘制纯色方体
 * 		环境光效果
 */

class Program3 {
	static containerElement
	static profile = {
		/**
		 * 环境光颜色
		 */
		lightColor: {
			r: 255,
			g: 255,
			b: 255,
			a: 1,
		},
		/**
		 * 环境光强度
		 */
		ambientFactor: 1,
	}

	static init(containerElement) {
		this.containerElement = containerElement
		this.initFormView()
		this.eventHandle()
	}

	static initFormView() {
		const self = this
		const ambientRangeElement = this.containerElement.querySelector(`[name="ambientRange"]`)
		const lightColorElement = this.containerElement.querySelector(`[name="lightColor"]`)

		ambientRangeElement.value = self.profile.ambientFactor
		lightColorElement.value = ven$rgba2Hex(self.profile.lightColor)
	}

	static eventHandle() {
		const self = this
		const ambientRangeElement = this.containerElement.querySelector(`[name="ambientRange"]`)
		const lightColorElement = this.containerElement.querySelector(`[name="lightColor"]`)

		ambientRangeElement.addEventListener('input', function (e) {
			self.profile.ambientFactor = +this.value
		})
		lightColorElement.addEventListener('input', function (e) {
			const rgb = ven$hex2Rgba(this.value)
			self.profile.lightColor.r = rgb.r
			self.profile.lightColor.g = rgb.g
			self.profile.lightColor.b = rgb.b
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
		// 环境光颜色
		uniform vec3 u_LightColor;
		// 环境光强度
		uniform float u_AmbientFactor;
		void main() {
			// 生成环境光参数因子向量
			vec3 ambient = u_AmbientFactor * u_LightColor;
			gl_FragColor = v_Color * vec4(ambient, 1);
		}
	`

	console.time(`CreateCubeDatas`)
	const cubeDatasResult = createCubeDatas(0.6, 0.6, 0.6, 0, 0, 0)
	console.log(cubeDatasResult)
	console.timeEnd(`CreateCubeDatas`)

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
	const u_LightColor = gl.getUniformLocation(program, 'u_LightColor')
	const u_AmbientFactor = gl.getUniformLocation(program, 'u_AmbientFactor')
	const a_Position = gl.getAttribLocation(program, 'a_Position')
	const a_Color = gl.getAttribLocation(program, 'a_Color')

	gl.enableVertexAttribArray(a_Position)
	gl.enableVertexAttribArray(a_Color)

	const vertextBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, vertextBuffer)
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 28, 0)
	gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 28, 12)
	gl.bufferData(gl.ARRAY_BUFFER, cubeDatasResult.vertexPositions, gl.STATIC_DRAW)

	/**
	 * 创建透视矩阵
	 */
	const aspect = canvasElement.width / canvasElement.height
	const padding = 1
	const near = 100
	const far = -100
	const projectionMatrix4 = ven$matrix4Ortho(-aspect * padding, aspect * padding, -padding, padding, near, far)

	const render = () => {
		/**
		 * 创建任意 xAngle/yAngle 角度对应的旋转矩阵
		 */
		const xRotationMatrix4 = Ven$Matrix4.createRotateXMatrix4ByRadian(Ven$Angles.degreeToRadian(xAngle))
		const yRotationMatrix4 = Ven$Matrix4.createRotateYMatrix4ByRadian(Ven$Angles.degreeToRadian(yAngle))
		/**
		 * 生成变换矩阵
		 * 		将旋转矩阵应用到透视矩阵
		 */
		const effectMatrix4 = xRotationMatrix4.multiply4(yRotationMatrix4)
		const resultMatrix4 = effectMatrix4.multiply4(projectionMatrix4)
		gl.uniformMatrix4fv(u_Matrix, false, new Float32Array(resultMatrix4.data))
		gl.uniform3f(u_LightColor, Program3.profile.lightColor.r / 255, Program3.profile.lightColor.g / 255, Program3.profile.lightColor.b / 255)
		gl.uniform1f(u_AmbientFactor, Program3.profile.ambientFactor)
		gl.clear(gl.COLOR_BUFFER_BIT)
		gl.drawArrays(gl.TRIANGLES, 0, cubeDatasResult.vertexPositions.length / 7)
	}

	let xAngle = 0
	let yAngle = 0

	const exec = () => {
		xAngle += 0.5
		yAngle += 0.5
		// if (xAngle >= 30 || yAngle >= 30) {
		// 	render()
		// 	return
		// }
		render()
		requestAnimationFrame(exec)
	}

	exec()
}
