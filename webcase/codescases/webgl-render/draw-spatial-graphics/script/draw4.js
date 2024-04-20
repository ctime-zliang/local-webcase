/**
 * 绘制球体
 * 		环境光效果
 */

class Program4 {
	static containerElement
	static profile = {
		/**
		 * 环境光颜色
		 */
		lightColor: {
			r: 255,
			g: 255,
			b: 255,
		},
		/**
		 * 环境光光源坐标
		 */
		lightPosition: {
			x: 0,
			y: 0,
			z: 0,
		},
		/**
		 * 环境光强度
		 */
		ambientFactor: 1,
		/**
		 * 模型旋转角度
		 */
		modelRatation: {
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
		const ambientRangeElement = this.containerElement.querySelector(`[name="ambientRange"]`)
		const lightColorElement = this.containerElement.querySelector(`[name="lightColor"]`)
		const modelXRotationRangeElement = this.containerElement.querySelector(`[name="modelXRotationRange"]`)
		const modelYRotationRangeElement = this.containerElement.querySelector(`[name="modelYRotationRange"]`)
		const modelZRotationRangeElement = this.containerElement.querySelector(`[name="modelZRotationRange"]`)
		const lightXPositionRangeElement = this.containerElement.querySelector(`[name="lightXPositionRange"]`)
		const lightYPositionRangeElement = this.containerElement.querySelector(`[name="lightYPositionRange"]`)
		const lightZPositionRangeElement = this.containerElement.querySelector(`[name="lightZPositionRange"]`)

		ambientRangeElement.value = self.profile.ambientFactor
		lightColorElement.value = ven$rgba2Hex(self.profile.lightColor)
		modelXRotationRangeElement.value = self.profile.modelRatation.x
		modelYRotationRangeElement.value = self.profile.modelRatation.y
		modelZRotationRangeElement.value = self.profile.modelRatation.z
		lightXPositionRangeElement.value = self.profile.lightPosition.x
		lightYPositionRangeElement.value = self.profile.lightPosition.y
		lightZPositionRangeElement.value = self.profile.lightPosition.z
	}

	static eventHandle() {
		const self = this
		const ambientRangeElement = this.containerElement.querySelector(`[name="ambientRange"]`)
		const lightColorElement = this.containerElement.querySelector(`[name="lightColor"]`)
		const modelXRotationRangeElement = this.containerElement.querySelector(`[name="modelXRotationRange"]`)
		const modelYRotationRangeElement = this.containerElement.querySelector(`[name="modelYRotationRange"]`)
		const modelZRotationRangeElement = this.containerElement.querySelector(`[name="modelZRotationRange"]`)
		const lightXPositionRangeElement = this.containerElement.querySelector(`[name="lightXPositionRange"]`)
		const lightYPositionRangeElement = this.containerElement.querySelector(`[name="lightYPositionRange"]`)
		const lightZPositionRangeElement = this.containerElement.querySelector(`[name="lightZPositionRange"]`)

		ambientRangeElement.addEventListener('input', function (e) {
			self.profile.ambientFactor = +this.value
		})
		lightColorElement.addEventListener('input', function (e) {
			const rgb = ven$hex2Rgba(this.value)
			self.profile.lightColor.r = rgb.r
			self.profile.lightColor.g = rgb.g
			self.profile.lightColor.b = rgb.b
		})
		modelXRotationRangeElement.addEventListener('input', function (e) {
			self.profile.modelRatation.x = +this.value
		})
		modelYRotationRangeElement.addEventListener('input', function (e) {
			self.profile.modelRatation.y = +this.value
		})
		modelZRotationRangeElement.addEventListener('input', function (e) {
			self.profile.modelRatation.z = +this.value
		})
		lightXPositionRangeElement.addEventListener('input', function (e) {
			self.profile.lightPosition.x = +this.value
		})
		lightYPositionRangeElement.addEventListener('input', function (e) {
			self.profile.lightPosition.y = +this.value
		})
		lightZPositionRangeElement.addEventListener('input', function (e) {
			self.profile.lightPosition.z = +this.value
		})
	}
}

function drawCanvas4(containerElement) {
	Program4.init(containerElement)

	const VS = `
		precision mediump float;
		// 变换矩阵
		uniform mat4 u_Matrix;
		// 顶点坐标
		attribute vec3 a_Position;
		varying vec3 v_Position;
		// 颜色值
		attribute vec4 a_Color;
		varying vec4 v_Color;
		// 顶点法线
		attribute vec3 a_Normal;
		varying vec3 v_Normal;
		// 对象变换据矩阵
		uniform mat4 u_NormalMatrix;
		uniform mat4 u_ModelMatrix;
		void main() {
			gl_Position = u_Matrix * vec4(a_Position, 1);
			v_Color = a_Color;
			v_Position = vec3(u_ModelMatrix * vec4(a_Position,1));
			v_Normal = mat3(u_NormalMatrix) * a_Normal;
		}
	`
	const FS = `
		precision mediump float;
		// 接收顶点着色器变量: 颜色值
		varying vec4 v_Color;
		// 环境光颜色
		uniform vec3 u_LightColor;
		// 环境光强度
		uniform float u_AmbientFactor;
		// 入射光方向向量
		uniform vec3 u_LightPosition;
		varying vec3 v_Position;
		varying vec3 v_Normal;
		void main() {
			// 生成环境光参数因子向量
			vec3 ambient = u_AmbientFactor * u_LightColor;
			// 光源照射方向向量
			vec3 lightDirection = u_LightPosition - v_Position;
			// 漫反射因子
			float diffuseFactor = dot(normalize(lightDirection), normalize(v_Normal));
			diffuseFactor = max(diffuseFactor, 0.0);
			// 漫反射分量
			vec3 diffuseLightColor = u_LightColor * diffuseFactor;
			gl_FragColor = v_Color * vec4(ambient, 1);
		}
	`

	console.time(`CreateCubeDatas`)
	const shereDatasResult = createShereDatas(0.5, 30, 30, 0, 0, 0, {
		redRange: [50, 200],
		greenRange: [50, 200],
		blueRange: [50, 200],
		alphaRange: [1, 1],
	})
	console.log(shereDatasResult)
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

	const a_Position = gl.getAttribLocation(program, 'a_Position')
	const a_Color = gl.getAttribLocation(program, 'a_Color')
	const a_Normal = gl.getAttribLocation(program, 'a_Normal')
	const u_Matrix = gl.getUniformLocation(program, 'u_Matrix')
	const u_AmbientFactor = gl.getUniformLocation(program, 'u_AmbientFactor')
	const u_LightColor = gl.getUniformLocation(program, 'u_LightColor')
	const u_LightPosition = gl.getUniformLocation(program, 'u_LightPosition')
	const u_NormalMatrix = gl.getUniformLocation(program, 'u_NormalMatrix')
	const u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix')

	gl.enableVertexAttribArray(a_Position)
	gl.enableVertexAttribArray(a_Color)
	gl.enableVertexAttribArray(a_Normal)

	const vertextBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, vertextBuffer)
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 28, 0)
	gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 28, 12)
	gl.bufferData(gl.ARRAY_BUFFER, shereDatasResult.vertexPositions, gl.STATIC_DRAW)

	const normalBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
	gl.bufferData(gl.ARRAY_BUFFER, shereDatasResult.originalNormals, gl.STATIC_DRAW)
	gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0)

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
		const xRotationMatrix4 = Ven$Matrix4.createRotateXMatrix4ByRadian(Ven$Angles.degreeToRadian(Program4.profile.modelRatation.x))
		const yRotationMatrix4 = Ven$Matrix4.createRotateYMatrix4ByRadian(Ven$Angles.degreeToRadian(Program4.profile.modelRatation.y))
		const zRotationMatrix4 = Ven$Matrix4.createRotateZMatrix4ByRadian(Ven$Angles.degreeToRadian(Program4.profile.modelRatation.z))
		/**
		 * 生成变换矩阵
		 * 		将旋转矩阵应用到透视矩阵
		 */
		const effectMatrix4 = xRotationMatrix4.multiply4(yRotationMatrix4).multiply4(zRotationMatrix4)
		const resultMatrix4 = effectMatrix4.multiply4(projectionMatrix4)
		gl.uniformMatrix4fv(u_Matrix, false, new Float32Array(resultMatrix4.data))
		gl.uniformMatrix4fv(u_NormalMatrix, false, new Float32Array(resultMatrix4.data))
		gl.uniformMatrix4fv(u_ModelMatrix, false, new Float32Array(resultMatrix4.data))
		gl.uniform3f(u_LightColor, Program4.profile.lightColor.r / 255, Program4.profile.lightColor.g / 255, Program4.profile.lightColor.b / 255)
		gl.uniform3f(u_LightPosition, Program4.profile.lightPosition.x, Program4.profile.lightPosition.y, Program4.profile.lightPosition.z)
		gl.uniform1f(u_AmbientFactor, Program4.profile.ambientFactor)
		gl.clear(gl.COLOR_BUFFER_BIT)
		gl.drawArrays(gl.TRIANGLES, 0, shereDatasResult.vertexPositions.length / 7)
	}

	const exec = () => {
		render()
		requestAnimationFrame(exec)
	}

	exec()
}
