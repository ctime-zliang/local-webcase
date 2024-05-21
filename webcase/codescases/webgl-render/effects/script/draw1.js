/**
 * 绘制方体
 * 		光照效果
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
		 * 光照参数
		 */
		light: {
			intensityGain: 1.0,
			direction: {
				x: 0.5,
				y: 3.0,
				z: 4.0,
			},
			color: {
				r: 255,
				g: 255,
				b: 255,
			},
			ambient: {
				r: 0.2,
				g: 0.2,
				b: 0.2,
			},
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
		const lightColorPickElement = this.containerElement.querySelector(`[name="lightColor"]`)
		const lightColorShowSpanElement = this.containerElement.querySelector(`[name="lightColorShow"]`)
		const lightDirectionRangeXRangeElement = this.containerElement.querySelector(`[name="lightDirectionRangeX"]`)
		const lightDirectionRangeXShowElement = this.containerElement.querySelector(`[name="lightDirectionRangeXShow"]`)
		const lightDirectionRangeYRangeElement = this.containerElement.querySelector(`[name="lightDirectionRangeY"]`)
		const lightDirectionRangeYShowElement = this.containerElement.querySelector(`[name="lightDirectionRangeYShow"]`)
		const lightDirectionRangeZRangeElement = this.containerElement.querySelector(`[name="lightDirectionRangeZ"]`)
		const lightDirectionRangeZShowElement = this.containerElement.querySelector(`[name="lightDirectionRangeZShow"]`)
		const ambientLightRangeRRangeElement = this.containerElement.querySelector(`[name="ambientLightRangeR"]`)
		const ambientLightRShowSpanElement = this.containerElement.querySelector(`[name="ambientLightRShow"]`)
		const ambientLightRangeGRangeElement = this.containerElement.querySelector(`[name="ambientLightRangeG"]`)
		const ambientLightRangeGShowSpanElement = this.containerElement.querySelector(`[name="ambientLightGShow"]`)
		const ambientLightRangeBRangeElement = this.containerElement.querySelector(`[name="ambientLightRangeB"]`)
		const ambientLightRangeBShowSpanElement = this.containerElement.querySelector(`[name="ambientLightBShow"]`)
		const lightIntensityGainRangeRangeElement = this.containerElement.querySelector(`[name="lightIntensityGainRange"]`)
		const lightIntensityGainRangeShowSpanElement = this.containerElement.querySelector(`[name="lightIntensityGainRangeShow"]`)

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
		lightColorShowSpanElement.textContent = lightColorPickElement.value = ven$rgba2Hex(self.profile.light.color)
		lightDirectionRangeXShowElement.textContent = lightDirectionRangeXRangeElement.value = self.profile.light.direction.x
		lightDirectionRangeYShowElement.textContent = lightDirectionRangeYRangeElement.value = self.profile.light.direction.y
		lightDirectionRangeZShowElement.textContent = lightDirectionRangeZRangeElement.value = self.profile.light.direction.z
		ambientLightRShowSpanElement.textContent = ambientLightRangeRRangeElement.value = self.profile.light.ambient.r
		ambientLightRangeGShowSpanElement.textContent = ambientLightRangeGRangeElement.value = self.profile.light.ambient.g
		ambientLightRangeBShowSpanElement.textContent = ambientLightRangeBRangeElement.value = self.profile.light.ambient.b
		lightIntensityGainRangeShowSpanElement.textContent = lightIntensityGainRangeRangeElement.value = self.profile.light.intensityGain
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
		const lightColorPickElement = this.containerElement.querySelector(`[name="lightColor"]`)
		const lightColorShowSpanElement = this.containerElement.querySelector(`[name="lightColorShow"]`)
		const lightDirectionRangeXRangeElement = this.containerElement.querySelector(`[name="lightDirectionRangeX"]`)
		const lightDirectionRangeXShowElement = this.containerElement.querySelector(`[name="lightDirectionRangeXShow"]`)
		const lightDirectionRangeYRangeElement = this.containerElement.querySelector(`[name="lightDirectionRangeY"]`)
		const lightDirectionRangeYShowElement = this.containerElement.querySelector(`[name="lightDirectionRangeYShow"]`)
		const lightDirectionRangeZRangeElement = this.containerElement.querySelector(`[name="lightDirectionRangeZ"]`)
		const lightDirectionRangeZShowElement = this.containerElement.querySelector(`[name="lightDirectionRangeZShow"]`)
		const ambientLightRangeRRangeElement = this.containerElement.querySelector(`[name="ambientLightRangeR"]`)
		const ambientLightRShowSpanElement = this.containerElement.querySelector(`[name="ambientLightRShow"]`)
		const ambientLightRangeGRangeElement = this.containerElement.querySelector(`[name="ambientLightRangeG"]`)
		const ambientLightRangeGShowSpanElement = this.containerElement.querySelector(`[name="ambientLightGShow"]`)
		const ambientLightRangeBRangeElement = this.containerElement.querySelector(`[name="ambientLightRangeB"]`)
		const ambientLightRangeBShowSpanElement = this.containerElement.querySelector(`[name="ambientLightBShow"]`)
		const lightIntensityGainRangeRangeElement = this.containerElement.querySelector(`[name="lightIntensityGainRange"]`)
		const lightIntensityGainRangeShowSpanElement = this.containerElement.querySelector(`[name="lightIntensityGainRangeShow"]`)

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
		lightColorPickElement.addEventListener('input', function (e) {
			const setRGBAColor = ven$hex2Rgba(this.value)
			Object.keys(self.profile.light.color).forEach(key => {
				self.profile.light.color[key] = setRGBAColor[key]
			})
			lightColorShowSpanElement.textContent = ven$rgba2Hex(self.profile.light.color)
			console.log('light.color:', JSON.stringify(self.profile.light.color))
			self.isRender = true
		})
		lightDirectionRangeXRangeElement.addEventListener('input', function (e) {
			lightDirectionRangeXShowElement.textContent = self.profile.light.direction.x = +this.value
			console.log('light.direction:', JSON.stringify(self.profile.light.direction))
			self.isRender = true
		})
		lightDirectionRangeYRangeElement.addEventListener('input', function (e) {
			lightDirectionRangeYShowElement.textContent = self.profile.light.direction.y = +this.value
			console.log('light.direction:', JSON.stringify(self.profile.light.direction))
			self.isRender = true
		})
		lightDirectionRangeZRangeElement.addEventListener('input', function (e) {
			lightDirectionRangeZShowElement.textContent = self.profile.light.direction.z = +this.value
			console.log('light.direction:', JSON.stringify(self.profile.light.direction))
			self.isRender = true
		})
		ambientLightRangeRRangeElement.addEventListener('input', function (e) {
			ambientLightRShowSpanElement.textContent = self.profile.light.ambient.r = +this.value
			console.log('light.ambient:', JSON.stringify(self.profile.light.ambient))
			self.isRender = true
		})
		ambientLightRangeGRangeElement.addEventListener('input', function (e) {
			ambientLightRangeGShowSpanElement.textContent = self.profile.light.ambient.g = +this.value
			console.log('light.ambient:', JSON.stringify(self.profile.light.ambient))
			self.isRender = true
		})
		ambientLightRangeBRangeElement.addEventListener('input', function (e) {
			ambientLightRangeBShowSpanElement.textContent = self.profile.light.ambient.b = +this.value
			console.log('light.ambient:', JSON.stringify(self.profile.light.ambient))
			self.isRender = true
		})
		lightIntensityGainRangeRangeElement.addEventListener('input', function (e) {
			lightIntensityGainRangeShowSpanElement.textContent = self.profile.light.intensityGain = +this.value
			console.log('light.intensityGain:', self.profile.light.intensityGain)
			self.isRender = true
		})
	}
}

function drawCanvas1(containerElement) {
	Program1.init(containerElement)

	const VS = `
		precision mediump float;
		varying vec4 v_Color;
		varying vec3 v_Normal;
		varying vec3 v_Position;
		// 顶点配置(组)
		attribute vec3 a_Position;
		attribute vec4 a_Color;
		attribute vec3 a_Normal;
		// 变换矩阵(组)
		uniform mat4 u_NormalMatrix;
		uniform mat4 u_ModelMatrix;
		uniform mat4 u_ViewMatrix;
		uniform mat4 u_ProjMatrix;
		void main() {
			gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * vec4(a_Position, 1.0);
			// 计算顶点的世界坐标
			v_Position = vec3(u_ModelMatrix * vec4(a_Position, 1.0));
			// 根据法线变换矩阵重新计算法线坐标并归一化
			v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal, 1.0)));
			v_Color = a_Color;
			gl_PointSize = 5.0;
		}
	`
	const FS = `
		precision mediump float;
		varying vec4 v_Color;
		varying vec3 v_Normal;
		varying vec3 v_Position;
		// 参数(组)
		uniform float u_lightIntensityGain;
		// 平行光配置(组)
		uniform vec3 u_LightColor;
		uniform vec3 u_LightDirection;
		uniform vec3 u_AmbientLightColor;
		void main() {
			vec3 normal = normalize(v_Normal);
			// 计算光线方向与法线的点积
			float nDotL = max(dot(u_LightDirection, normal), 0.0);
			// 计算漫反射光和环境光的色值
			vec3 diffuse = u_LightColor * v_Color.rgb * nDotL * u_lightIntensityGain;
			vec3 ambient = u_AmbientLightColor * v_Color.rgb;
			gl_FragColor = vec4(diffuse + ambient, v_Color.a);
		}
	`

	console.time(`CreateCubeDatas`)
	const cubeDatasResult = createCubeDatas(
		Program1.profile.modelSize.cubeLength,
		Program1.profile.modelSize.cubeLength,
		Program1.profile.modelSize.cubeLength,
		{
			up: [255, 255, 255, 1],
			bottom: [255, 255, 255, 1],
			front: [255, 255, 255, 1],
			back: [255, 255, 255, 1],
			right: [255, 255, 255, 1],
			left: [255, 255, 255, 1],
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

	const u_LightColor = gl.getUniformLocation(program, 'u_LightColor')
	const u_LightDirection = gl.getUniformLocation(program, 'u_LightDirection')
	const u_AmbientLightColor = gl.getUniformLocation(program, 'u_AmbientLightColor')
	const u_lightIntensityGain = gl.getUniformLocation(program, 'u_lightIntensityGain')
	const u_NormalMatrix = gl.getUniformLocation(program, 'u_NormalMatrix')
	const u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix')
	const u_ViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix')
	const u_ProjMatrix = gl.getUniformLocation(program, 'u_ProjMatrix')
	const a_Normal = gl.getAttribLocation(program, 'a_Normal')
	const a_Position = gl.getAttribLocation(program, 'a_Position')
	const a_Color = gl.getAttribLocation(program, 'a_Color')

	gl.enableVertexAttribArray(a_Normal)
	gl.enableVertexAttribArray(a_Position)
	gl.enableVertexAttribArray(a_Color)

	const normalBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
	gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0)
	gl.bufferData(gl.ARRAY_BUFFER, cubeDatasResult.vertexNormals, gl.STATIC_DRAW)

	const vertextBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, vertextBuffer)
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 28, 0)
	gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 28, 12)
	gl.bufferData(gl.ARRAY_BUFFER, cubeDatasResult.vertexPositions, gl.STATIC_DRAW)

	const render = () => {
		if (!Program1.isRender) {
			return
		}
		Program1.isRender = false

		/**
		 * 创建平行光方向向量
		 */
		const lightDirection = new Ven$Vector3(
			Program1.profile.light.direction.x,
			Program1.profile.light.direction.y,
			Program1.profile.light.direction.z
		)
		const lightNormalizeDirection = lightDirection.normalize()
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
		/**
		 * 创建法线变换矩阵
		 */
		const modelEffectInverseMatrix4 = Ven$CanvasMatrix4.setInverse(modelEffectMatrix4)
		const modelEffectInverseTransposeMatrix4 = Ven$CanvasMatrix4.setTranspose(modelEffectInverseMatrix4)
		const normalMatrix4 = modelEffectInverseTransposeMatrix4

		gl.uniform3f(u_LightColor, Program1.profile.light.color.r / 255, Program1.profile.light.color.g / 255, Program1.profile.light.color.b / 255)
		gl.uniform3fv(u_LightDirection, new Float32Array([lightNormalizeDirection.x, lightNormalizeDirection.y, lightNormalizeDirection.z]))
		gl.uniform1f(u_lightIntensityGain, Program1.profile.light.intensityGain)
		gl.uniformMatrix4fv(u_ModelMatrix, false, new Float32Array(modelEffectMatrix4.data))
		gl.uniformMatrix4fv(u_ViewMatrix, false, new Float32Array(lookAtMatrix4.data))
		gl.uniformMatrix4fv(u_ProjMatrix, false, new Float32Array(projectionMatrix4.data))
		gl.uniformMatrix4fv(u_NormalMatrix, false, new Float32Array(normalMatrix4.data))
		// gl.uniformMatrix4fv(u_NormalMatrix, false, new Float32Array(Ven$CanvasMatrix4.setMatrix4().data))
		gl.uniform3f(u_AmbientLightColor, Program1.profile.light.ambient.r, Program1.profile.light.ambient.g, Program1.profile.light.ambient.b)
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
