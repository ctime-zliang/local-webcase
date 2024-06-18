class Model3 {
	constructor() {
		this._vertexDatas = null
		this._modelParam = null
		this._modelRatation = {
			x: 0,
			y: 0,
			z: 0,
		}
		this._modelOffset = {
			x: 0,
			y: 0,
			z: 0,
		}
		this._modelScale = {
			x: 1,
			y: 1,
			z: 1,
		}
		this._featureBuffer = null
		this._normalBuffer = null
		this._texCoordBuffer = null
		this._modelMatrix = null
	}

	get modelParam() {
		return this._modelParam
	}

	get modelRatation() {
		return this._modelRatation
	}

	get modelOffset() {
		return this._modelOffset
	}

	get modelScale() {
		return this._modelScale
	}

	get vertexDatas() {
		return this._vertexDatas
	}
	set vertexDatas(value) {
		this._vertexDatas = value
	}

	get featureBuffer() {
		return this._featureBuffer
	}
	set featureBuffer(value) {
		this._featureBuffer = value
	}

	get normalBuffer() {
		return this._normalBuffer
	}
	set normalBuffer(value) {
		this._normalBuffer = value
	}

	get texCoordBuffer() {
		return this._texCoordBuffer
	}
	set texCoordBuffer(value) {
		this._texCoordBuffer = value
	}

	get modelMatrix() {
		return this._modelMatrix
	}
	set modelMatrix(value) {
		this._modelMatrix = value
	}
}

class CubeModel3 extends Model3 {
	constructor(width, length, depth, color = '#ffffff', offsetX = 0, offsetY = 0, offsetZ = 0) {
		super()
		this._modelParam = {
			width,
			length,
			depth,
			rgba: ven$hex2Rgba(color),
			offsetX,
			offsetY,
			offsetZ,
		}
		this.vertexDatas = this._createVertexData()
	}

	_createVertexData() {
		return createCubeDatas(
			this._modelParam.width,
			this._modelParam.length,
			this._modelParam.depth,
			{
				up: [this._modelParam.rgba.r, this._modelParam.rgba.g, this._modelParam.rgba.b, 1],
				bottom: [this._modelParam.rgba.r, this._modelParam.rgba.g, this._modelParam.rgba.b, 1],
				front: [this._modelParam.rgba.r, this._modelParam.rgba.g, this._modelParam.rgba.b, 1],
				back: [this._modelParam.rgba.r, this._modelParam.rgba.g, this._modelParam.rgba.b, 1],
				right: [this._modelParam.rgba.r, this._modelParam.rgba.g, this._modelParam.rgba.b, 1],
				left: [this._modelParam.rgba.r, this._modelParam.rgba.g, this._modelParam.rgba.b, 1],
			},
			this._modelParam.offsetX,
			this._modelParam.offsetY,
			this._modelParam.offsetZ
		)
	}
}

class ShereModel3 extends Model3 {
	constructor(radius, meridianCount, latitudeCount, color = '#ffffff', offsetX = 0, offsetY = 0, offsetZ = 0) {
		super()
		this._modelParam = {
			radius,
			meridianCount,
			latitudeCount,
			rgba: color === null ? null : ven$hex2Rgba(color),
			offsetX,
			offsetY,
			offsetZ,
		}
		this.vertexDatas = this._createVertexData()
	}

	_createVertexData() {
		this._modelParam
		const colorSetting = this._modelParam.rgba
			? {
					redRange: [this._modelParam.rgba.r, this._modelParam.rgba.r],
					greenRange: [this._modelParam.rgba.g, this._modelParam.rgba.g],
					blueRange: [this._modelParam.rgba.b, this._modelParam.rgba.b],
					alphaRange: [1, 1],
			  }
			: undefined
		return createShereDatas(
			this._modelParam.radius,
			this._modelParam.meridianCount,
			this._modelParam.latitudeCount,
			colorSetting,
			this._modelParam.offsetX,
			this._modelParam.offsetY,
			this._modelParam.offsetZ
		)
	}
}

class Triangle3 extends Model3 {
	constructor() {
		super()
		this._modelParam = {}
		this.vertexDatas = this._createVertexData()
	}

	_createVertexData() {
		return {
			// prettier-ignore
			vertexFeature: new Float32Array([
				0.0, 1.5, -0.75, 1.0, 0.0, 0.0, 1.0,
				-0.75, 1.5, 0.0, 1.0, 0.0, 0.0, 1.0,
				0.75, 1.5, 0.0, 1.0, 0.0, 0.0, 1.0
			]),
		}
	}
}

class Program3 {
	static isRender = true
	static containerElement
	static profile = {
		autoTransformation: false,
		offscreenWidth: 2048,
		offscreenHeight: 2048,
		/**
		 * 视图矩阵参数
		 */
		lookAt: {
			eyePosition: {
				x: 4,
				y: 5,
				z: 6,
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
			far: 300,
		},
		/**
		 * 光照参数
		 */
		light: {
			illuType: 2,
			intensityGain: 1.0,
			direction: {
				x: 0.5,
				y: 3.0,
				z: 4.0,
			},
			position: {
				x: 1.0,
				y: 7.0,
				z: 2.5,
			},
			color: {
				r: 255,
				g: 255,
				b: 255,
			},
			ambient: {
				r: 0.1,
				g: 0.1,
				b: 0.1,
			},
		},
		clearColor: {
			r: 0,
			g: 0,
			b: 0,
		},
	}

	static glControl = {}

	static init(containerElement) {
		this.containerElement = containerElement
		this.glControl = {
			gl: this.glControl.gl || null,
			modelInstances1: [],
			vertexFeatureSize1: 0,
			modelInstances2: [],
			vertexFeatureSize2: 0,
		}
		this.initFormView()
		this.eventHandle()
		this.initModelModelDatas()
	}

	static initFormView() {
		const self = this
		const modelRotationRangeXElement = this.containerElement.querySelector(`[data-tag-name="modelRotationRangeX"]`)
		const modelRotationXShowSpanElement = this.containerElement.querySelector(`[data-tag-name="modelRotationRangeXShow"]`)
		const modelRotationRangeYElement = this.containerElement.querySelector(`[data-tag-name="modelRotationRangeY"]`)
		const modelRotationYShowSpanElement = this.containerElement.querySelector(`[data-tag-name="modelRotationRangeYShow"]`)
		const modelRotationRangeZElement = this.containerElement.querySelector(`[data-tag-name="modelRotationRangeZ"]`)
		const modelRotationZShowSpanElement = this.containerElement.querySelector(`[data-tag-name="modelRotationRangeZShow"]`)
		const modelOffsetRangeXElement = this.containerElement.querySelector(`[data-tag-name="modelOffsetRangeX"]`)
		const modelOffsetXShowSpanElement = this.containerElement.querySelector(`[data-tag-name="modelOffsetRangeXShow"]`)
		const modelOffsetRangeYElement = this.containerElement.querySelector(`[data-tag-name="modelOffsetRangeY"]`)
		const modelOffsetYShowSpanElement = this.containerElement.querySelector(`[data-tag-name="modelOffsetRangeYShow"]`)
		const modelOffsetRangeZElement = this.containerElement.querySelector(`[data-tag-name="modelOffsetRangeZ"]`)
		const modelOffsetZShowSpanElement = this.containerElement.querySelector(`[data-tag-name="modelOffsetRangeZShow"]`)
		const modelScaleRangeElement = this.containerElement.querySelector(`[data-tag-name="modelScaleRange"]`)
		const modelScaleRangeShowSpanElement = this.containerElement.querySelector(`[data-tag-name="modelScaleRangeShow"]`)
		const persProjectionFovyRangeElement = this.containerElement.querySelector(`[data-tag-name="persProjectionFovy"]`)
		const persProjectionFovyShowSpanElement = this.containerElement.querySelector(`[data-tag-name="persProjectionFovyShow"]`)
		const persProjectionNearRangeElement = this.containerElement.querySelector(`[data-tag-name="persProjectionNear"]`)
		const persProjectionNearShowSpanElement = this.containerElement.querySelector(`[data-tag-name="persProjectionNearShow"]`)
		const persProjectionFarRangeElement = this.containerElement.querySelector(`[data-tag-name="persProjectionFar"]`)
		const persProjectionFarShowSpanElement = this.containerElement.querySelector(`[data-tag-name="persProjectionFarShow"]`)
		const lookAtMatrix4EyePositionXRangeElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4EyePositionX"]`)
		const lookAtMatrix4EyePositionXShowSpanElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4EyePositionXShow"]`)
		const lookAtMatrix4EyePositionYRangeElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4EyePositionY"]`)
		const lookAtMatrix4EyePositionYShowSpanElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4EyePositionYShow"]`)
		const lookAtMatrix4EyePositionZRangeElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4EyePositionZ"]`)
		const lookAtMatrix4EyePositionZShowSpanElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4EyePositionZShow"]`)
		const lookAtMatrix4AtPositionXRangeElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4AtPositionX"]`)
		const lookAtMatrix4AtPositionXShowSpanElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4AtPositionXShow"]`)
		const lookAtMatrix4AtPositionYRangeElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4AtPositionY"]`)
		const lookAtMatrix4AtPositionYShowSpanElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4AtPositionYShow"]`)
		const lookAtMatrix4AtPositionZRangeElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4AtPositionZ"]`)
		const lookAtMatrix4AtPositionZShowSpanElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4AtPositionZShow"]`)
		const lightColorPickElement = this.containerElement.querySelector(`[data-tag-name="lightColor"]`)
		const lightColorShowSpanElement = this.containerElement.querySelector(`[data-tag-name="lightColorShow"]`)
		const lightIlluTypeRadioElements = this.containerElement.querySelectorAll(`[data-tag-name="lightIlluType"]`)
		const lightPositionRangeXRangeElement = this.containerElement.querySelector(`[data-tag-name="lightPositionRangeX"]`)
		const lightPositionRangeXShowElement = this.containerElement.querySelector(`[data-tag-name="lightPositionRangeXShow"]`)
		const lightPositionRangeYRangeElement = this.containerElement.querySelector(`[data-tag-name="lightPositionRangeY"]`)
		const lightPositionRangeYShowElement = this.containerElement.querySelector(`[data-tag-name="lightPositionRangeYShow"]`)
		const lightPositionRangeZRangeElement = this.containerElement.querySelector(`[data-tag-name="lightPositionRangeZ"]`)
		const lightPositionRangeZShowElement = this.containerElement.querySelector(`[data-tag-name="lightPositionRangeZShow"]`)
		const lightDirectionRangeXRangeElement = this.containerElement.querySelector(`[data-tag-name="lightDirectionRangeX"]`)
		const lightDirectionRangeXShowElement = this.containerElement.querySelector(`[data-tag-name="lightDirectionRangeXShow"]`)
		const lightDirectionRangeYRangeElement = this.containerElement.querySelector(`[data-tag-name="lightDirectionRangeY"]`)
		const lightDirectionRangeYShowElement = this.containerElement.querySelector(`[data-tag-name="lightDirectionRangeYShow"]`)
		const lightDirectionRangeZRangeElement = this.containerElement.querySelector(`[data-tag-name="lightDirectionRangeZ"]`)
		const lightDirectionRangeZShowElement = this.containerElement.querySelector(`[data-tag-name="lightDirectionRangeZShow"]`)
		const ambientLightRangeRRangeElement = this.containerElement.querySelector(`[data-tag-name="ambientLightRangeR"]`)
		const ambientLightRShowSpanElement = this.containerElement.querySelector(`[data-tag-name="ambientLightRShow"]`)
		const ambientLightRangeGRangeElement = this.containerElement.querySelector(`[data-tag-name="ambientLightRangeG"]`)
		const ambientLightRangeGShowSpanElement = this.containerElement.querySelector(`[data-tag-name="ambientLightGShow"]`)
		const ambientLightRangeBRangeElement = this.containerElement.querySelector(`[data-tag-name="ambientLightRangeB"]`)
		const ambientLightRangeBShowSpanElement = this.containerElement.querySelector(`[data-tag-name="ambientLightBShow"]`)
		const lightIntensityGainRangeRangeElement = this.containerElement.querySelector(`[data-tag-name="lightIntensityGainRange"]`)
		const lightIntensityGainRangeShowSpanElement = this.containerElement.querySelector(`[data-tag-name="lightIntensityGainRangeShow"]`)
		const autoTransformationCheckboxElement = this.containerElement.querySelector(`[data-tag-name="autoTransformation"]`)

		modelRotationXShowSpanElement.textContent = modelRotationRangeXElement.value = 0
		modelRotationYShowSpanElement.textContent = modelRotationRangeYElement.value = 0
		modelRotationZShowSpanElement.textContent = modelRotationRangeZElement.value = 0
		modelOffsetXShowSpanElement.textContent = modelOffsetRangeXElement.value = 0
		modelOffsetYShowSpanElement.textContent = modelOffsetRangeYElement.value = 0
		modelOffsetZShowSpanElement.textContent = modelOffsetRangeZElement.value = 0
		modelScaleRangeShowSpanElement.textContent = modelScaleRangeElement.value = 1
		persProjectionFovyShowSpanElement.textContent = persProjectionFovyRangeElement.value = self.profile.persProjection.fovy
		persProjectionNearShowSpanElement.textContent = persProjectionNearRangeElement.value = self.profile.persProjection.near
		persProjectionFarShowSpanElement.textContent = persProjectionFarRangeElement.value = self.profile.persProjection.far
		lookAtMatrix4EyePositionXShowSpanElement.textContent = lookAtMatrix4EyePositionXRangeElement.value = self.profile.lookAt.eyePosition.x
		lookAtMatrix4EyePositionYShowSpanElement.textContent = lookAtMatrix4EyePositionYRangeElement.value = self.profile.lookAt.eyePosition.y
		lookAtMatrix4EyePositionZShowSpanElement.textContent = lookAtMatrix4EyePositionZRangeElement.value = self.profile.lookAt.eyePosition.z
		lookAtMatrix4AtPositionXShowSpanElement.textContent = lookAtMatrix4AtPositionXRangeElement.value = self.profile.lookAt.atPosition.x
		lookAtMatrix4AtPositionYShowSpanElement.textContent = lookAtMatrix4AtPositionYRangeElement.value = self.profile.lookAt.atPosition.y
		lookAtMatrix4AtPositionZShowSpanElement.textContent = lookAtMatrix4AtPositionZRangeElement.value = self.profile.lookAt.atPosition.z
		lightColorShowSpanElement.textContent = lightColorPickElement.value = ven$rgba2Hex(self.profile.light.color)
		lightIlluTypeRadioElements.forEach(itemElement => {
			const name = this.containerElement.id + '_' + itemElement.getAttribute('data-tag-name')
			itemElement.setAttribute('name', name)
			itemElement.checked = itemElement.value === String(self.profile.light.illuType)
		})
		lightPositionRangeXShowElement.textContent = lightPositionRangeXRangeElement.value = self.profile.light.position.x
		lightPositionRangeYShowElement.textContent = lightPositionRangeYRangeElement.value = self.profile.light.position.y
		lightPositionRangeZShowElement.textContent = lightPositionRangeZRangeElement.value = self.profile.light.position.z
		lightDirectionRangeXShowElement.textContent = lightDirectionRangeXRangeElement.value = self.profile.light.direction.x
		lightDirectionRangeYShowElement.textContent = lightDirectionRangeYRangeElement.value = self.profile.light.direction.y
		lightDirectionRangeZShowElement.textContent = lightDirectionRangeZRangeElement.value = self.profile.light.direction.z
		ambientLightRShowSpanElement.textContent = ambientLightRangeRRangeElement.value = self.profile.light.ambient.r
		ambientLightRangeGShowSpanElement.textContent = ambientLightRangeGRangeElement.value = self.profile.light.ambient.g
		ambientLightRangeBShowSpanElement.textContent = ambientLightRangeBRangeElement.value = self.profile.light.ambient.b
		lightIntensityGainRangeShowSpanElement.textContent = lightIntensityGainRangeRangeElement.value = self.profile.light.intensityGain
		autoTransformationCheckboxElement.checked = self.profile.autoTransformation

		this.toggleLightIlluTypeView()
	}

	static eventHandle() {
		const self = this
		const canvasElement = this.containerElement.querySelector(`canvas`)
		const modelRotationRangeXElement = this.containerElement.querySelector(`[data-tag-name="modelRotationRangeX"]`)
		const modelRotationRangeXShowSpanElement = this.containerElement.querySelector(`[data-tag-name="modelRotationRangeXShow"]`)
		const modelRotationRangeYElement = this.containerElement.querySelector(`[data-tag-name="modelRotationRangeY"]`)
		const modelRotationRangeYShowSpanElement = this.containerElement.querySelector(`[data-tag-name="modelRotationRangeYShow"]`)
		const modelRotationRangeZElement = this.containerElement.querySelector(`[data-tag-name="modelRotationRangeZ"]`)
		const modelRotationRangeZShowSpanElement = this.containerElement.querySelector(`[data-tag-name="modelRotationRangeZShow"]`)
		const modelOffsetRangeXElement = this.containerElement.querySelector(`[data-tag-name="modelOffsetRangeX"]`)
		const modelOffsetRangeXShowSpanElement = this.containerElement.querySelector(`[data-tag-name="modelOffsetRangeXShow"]`)
		const modelOffsetRangeYElement = this.containerElement.querySelector(`[data-tag-name="modelOffsetRangeY"]`)
		const modelOffsetRangeYShowSpanElement = this.containerElement.querySelector(`[data-tag-name="modelOffsetRangeYShow"]`)
		const modelOffsetRangeZElement = this.containerElement.querySelector(`[data-tag-name="modelOffsetRangeZ"]`)
		const modelOffsetRangeZShowSpanElement = this.containerElement.querySelector(`[data-tag-name="modelOffsetRangeZShow"]`)
		const modelScaleRangeElement = this.containerElement.querySelector(`[data-tag-name="modelScaleRange"]`)
		const modelScaleRangeShowSpanElement = this.containerElement.querySelector(`[data-tag-name="modelScaleRangeShow"]`)
		const persProjectionFovyRangeElement = this.containerElement.querySelector(`[data-tag-name="persProjectionFovy"]`)
		const persProjectionFovyShowSpanElement = this.containerElement.querySelector(`[data-tag-name="persProjectionFovyShow"]`)
		const persProjectionNearRangeElement = this.containerElement.querySelector(`[data-tag-name="persProjectionNear"]`)
		const persProjectionNearShowSpanElement = this.containerElement.querySelector(`[data-tag-name="persProjectionNearShow"]`)
		const persProjectionFarRangeElement = this.containerElement.querySelector(`[data-tag-name="persProjectionFar"]`)
		const persProjectionFarShowSpanElement = this.containerElement.querySelector(`[data-tag-name="persProjectionFarShow"]`)
		const lookAtMatrix4EyePositionXRangeElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4EyePositionX"]`)
		const lookAtMatrix4EyePositionXShowSpanElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4EyePositionXShow"]`)
		const lookAtMatrix4EyePositionYRangeElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4EyePositionY"]`)
		const lookAtMatrix4EyePositionYShowSpanElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4EyePositionYShow"]`)
		const lookAtMatrix4EyePositionZRangeElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4EyePositionZ"]`)
		const lookAtMatrix4EyePositionZShowSpanElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4EyePositionZShow"]`)
		const lookAtMatrix4AtPositionXRangeElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4AtPositionX"]`)
		const lookAtMatrix4AtPositionXShowSpanElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4AtPositionXShow"]`)
		const lookAtMatrix4AtPositionYRangeElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4AtPositionY"]`)
		const lookAtMatrix4AtPositionYShowSpanElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4AtPositionYShow"]`)
		const lookAtMatrix4AtPositionZRangeElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4AtPositionZ"]`)
		const lookAtMatrix4AtPositionZShowSpanElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4AtPositionZShow"]`)
		const lightColorPickElement = this.containerElement.querySelector(`[data-tag-name="lightColor"]`)
		const lightColorShowSpanElement = this.containerElement.querySelector(`[data-tag-name="lightColorShow"]`)
		const lightIlluTypeRadioElements = this.containerElement.querySelectorAll(`[data-tag-name="lightIlluType"]`)
		const lightPositionRangeXRangeElement = this.containerElement.querySelector(`[data-tag-name="lightPositionRangeX"]`)
		const lightPositionRangeXShowElement = this.containerElement.querySelector(`[data-tag-name="lightPositionRangeXShow"]`)
		const lightPositionRangeYRangeElement = this.containerElement.querySelector(`[data-tag-name="lightPositionRangeY"]`)
		const lightPositionRangeYShowElement = this.containerElement.querySelector(`[data-tag-name="lightPositionRangeYShow"]`)
		const lightPositionRangeZRangeElement = this.containerElement.querySelector(`[data-tag-name="lightPositionRangeZ"]`)
		const lightPositionRangeZShowElement = this.containerElement.querySelector(`[data-tag-name="lightPositionRangeZShow"]`)
		const lightDirectionRangeXRangeElement = this.containerElement.querySelector(`[data-tag-name="lightDirectionRangeX"]`)
		const lightDirectionRangeXShowElement = this.containerElement.querySelector(`[data-tag-name="lightDirectionRangeXShow"]`)
		const lightDirectionRangeYRangeElement = this.containerElement.querySelector(`[data-tag-name="lightDirectionRangeY"]`)
		const lightDirectionRangeYShowElement = this.containerElement.querySelector(`[data-tag-name="lightDirectionRangeYShow"]`)
		const lightDirectionRangeZRangeElement = this.containerElement.querySelector(`[data-tag-name="lightDirectionRangeZ"]`)
		const lightDirectionRangeZShowElement = this.containerElement.querySelector(`[data-tag-name="lightDirectionRangeZShow"]`)
		const ambientLightRangeRRangeElement = this.containerElement.querySelector(`[data-tag-name="ambientLightRangeR"]`)
		const ambientLightRShowSpanElement = this.containerElement.querySelector(`[data-tag-name="ambientLightRShow"]`)
		const ambientLightRangeGRangeElement = this.containerElement.querySelector(`[data-tag-name="ambientLightRangeG"]`)
		const ambientLightRangeGShowSpanElement = this.containerElement.querySelector(`[data-tag-name="ambientLightGShow"]`)
		const ambientLightRangeBRangeElement = this.containerElement.querySelector(`[data-tag-name="ambientLightRangeB"]`)
		const ambientLightRangeBShowSpanElement = this.containerElement.querySelector(`[data-tag-name="ambientLightBShow"]`)
		const lightIntensityGainRangeRangeElement = this.containerElement.querySelector(`[data-tag-name="lightIntensityGainRange"]`)
		const lightIntensityGainRangeShowSpanElement = this.containerElement.querySelector(`[data-tag-name="lightIntensityGainRangeShow"]`)
		const autoTransformationCheckboxElement = this.containerElement.querySelector(`[data-tag-name="autoTransformation"]`)

		canvasElement.addEventListener('contextmenu', function (e) {
			e.preventDefault()
			e.stopPropagation()
		})
		modelRotationRangeXElement.addEventListener('input', function (e) {
			modelRotationRangeXShowSpanElement.textContent = +this.value
			;[...self.glControl.modelInstances1, ...self.glControl.modelInstances2].forEach(modelInstanceItem => {
				modelInstanceItem.modelRatation.x = +this.value
			})
			self.isRender = true
		})
		modelRotationRangeYElement.addEventListener('input', function (e) {
			modelRotationRangeYShowSpanElement.textContent = +this.value
			;[...self.glControl.modelInstances1, ...self.glControl.modelInstances2].forEach(modelInstanceItem => {
				modelInstanceItem.modelRatation.y = +this.value
			})
			self.isRender = true
		})
		modelRotationRangeZElement.addEventListener('input', function (e) {
			modelRotationRangeZShowSpanElement.textContent = +this.value
			;[...self.glControl.modelInstances1, ...self.glControl.modelInstances2].forEach(modelInstanceItem => {
				modelInstanceItem.modelRatation.z = +this.value
			})
			self.isRender = true
		})
		modelOffsetRangeXElement.addEventListener('input', function (e) {
			modelOffsetRangeXShowSpanElement.textContent = +this.value
			;[...self.glControl.modelInstances1, ...self.glControl.modelInstances2].forEach(modelInstanceItem => {
				modelInstanceItem.modelOffset.x = +this.value
			})
			self.isRender = true
		})
		modelOffsetRangeYElement.addEventListener('input', function (e) {
			modelOffsetRangeYShowSpanElement.textContent = +this.value
			;[...self.glControl.modelInstances1, ...self.glControl.modelInstances2].forEach(modelInstanceItem => {
				modelInstanceItem.modelOffset.y = +this.value
			})
			self.isRender = true
		})
		modelOffsetRangeZElement.addEventListener('input', function (e) {
			modelOffsetRangeZShowSpanElement.textContent = +this.value
			;[...self.glControl.modelInstances1, ...self.glControl.modelInstances2].forEach(modelInstanceItem => {
				modelInstanceItem.modelOffset.z = +this.value
			})
			self.isRender = true
		})
		modelScaleRangeElement.addEventListener('input', function (e) {
			modelScaleRangeShowSpanElement.textContent = +this.value
			;[...self.glControl.modelInstances1, ...self.glControl.modelInstances2].forEach(modelInstanceItem => {
				modelInstanceItem.modelScale.x = +this.value
				modelInstanceItem.modelScale.y = +this.value
				modelInstanceItem.modelScale.z = +this.value
			})
			self.isRender = true
		})
		persProjectionFovyRangeElement.addEventListener('input', function (e) {
			persProjectionFovyShowSpanElement.textContent = self.profile.persProjection.fovy = +this.value
			console.log('persProjection:', JSON.stringify(self.profile.persProjection))
			self.isRender = true
		})
		persProjectionNearRangeElement.addEventListener('input', function (e) {
			persProjectionNearShowSpanElement.textContent = self.profile.persProjection.near = +this.value
			console.log('persProjection:', JSON.stringify(self.profile.persProjection))
			self.isRender = true
		})
		persProjectionFarRangeElement.addEventListener('input', function (e) {
			persProjectionFarShowSpanElement.textContent = self.profile.persProjection.far = +this.value
			console.log('persProjection:', JSON.stringify(self.profile.persProjection))
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
		lightIlluTypeRadioElements.forEach(itemElement => {
			itemElement.addEventListener('change', function (e) {
				self.profile.light.illuType = +this.value
				self.toggleLightIlluTypeView()
				console.log('light.illuType:', self.profile.light.illuType)
				self.isRender = true
			})
		})
		lightPositionRangeXRangeElement.addEventListener('input', function (e) {
			lightPositionRangeXShowElement.textContent = self.profile.light.position.x = +this.value
			console.log('light.position:', JSON.stringify(self.profile.light.position))
			self.isRender = true
		})
		lightPositionRangeYRangeElement.addEventListener('input', function (e) {
			lightPositionRangeYShowElement.textContent = self.profile.light.position.y = +this.value
			console.log('light.position:', JSON.stringify(self.profile.light.position))
			self.isRender = true
		})
		lightPositionRangeZRangeElement.addEventListener('input', function (e) {
			lightPositionRangeZShowElement.textContent = self.profile.light.position.z = +this.value
			console.log('light.position:', JSON.stringify(self.profile.light.position))
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
		autoTransformationCheckboxElement.addEventListener('change', function (e) {
			self.profile.autoTransformation = this.checked
			self.isRender = true
		})
	}

	static toggleLightIlluTypeView() {
		const lightPositionRangeXRangeElement = this.containerElement.querySelector(`[data-tag-name="lightPositionRangeX"]`)
		const lightPositionRangeYRangeElement = this.containerElement.querySelector(`[data-tag-name="lightPositionRangeY"]`)
		const lightPositionRangeZRangeElement = this.containerElement.querySelector(`[data-tag-name="lightPositionRangeZ"]`)
		const lightDirectionRangeXRangeElement = this.containerElement.querySelector(`[data-tag-name="lightDirectionRangeX"]`)
		const lightDirectionRangeYRangeElement = this.containerElement.querySelector(`[data-tag-name="lightDirectionRangeY"]`)
		const lightDirectionRangeZRangeElement = this.containerElement.querySelector(`[data-tag-name="lightDirectionRangeZ"]`)
		if (this.profile.light.illuType === 1) {
			lightPositionRangeXRangeElement.parentElement.style.display = 'none'
			lightPositionRangeYRangeElement.parentElement.style.display = 'none'
			lightPositionRangeZRangeElement.parentElement.style.display = 'none'
			lightDirectionRangeXRangeElement.parentElement.style.display = 'flex'
			lightDirectionRangeYRangeElement.parentElement.style.display = 'flex'
			lightDirectionRangeZRangeElement.parentElement.style.display = 'flex'
		}
		if (this.profile.light.illuType === 2) {
			lightDirectionRangeXRangeElement.parentElement.style.display = 'none'
			lightDirectionRangeYRangeElement.parentElement.style.display = 'none'
			lightDirectionRangeZRangeElement.parentElement.style.display = 'none'
			lightPositionRangeXRangeElement.parentElement.style.display = 'flex'
			lightPositionRangeYRangeElement.parentElement.style.display = 'flex'
			lightPositionRangeZRangeElement.parentElement.style.display = 'flex'
		}
	}

	static initModelModelDatas() {
		this.glControl.modelInstances1 = [new Triangle3()]
		this.glControl.modelInstances1.forEach(modelInstanceItem => {
			modelInstanceItem.featureBuffer = ven$initArrayBufferForLaterUse(this.glControl.gl)
			modelInstanceItem.modelMatrix = Ven$CanvasMatrix4.initMatrix()
		})
		this.glControl.vertexFeatureSize1 = this.getVertexFeatureSize(this.glControl.modelInstances1)
		/* ... */
		this.glControl.modelInstances2 = [new ShereModel3(1.0, 30, 30, null)]
		// this.glControl.modelInstances2 = [new CubeModel3(1.0, 1.0, 1.0)]
		this.glControl.modelInstances2.forEach(modelInstanceItem => {
			modelInstanceItem.featureBuffer = ven$initArrayBufferForLaterUse(this.glControl.gl)
			modelInstanceItem.modelMatrix = Ven$CanvasMatrix4.initMatrix()
		})
		this.glControl.vertexFeatureSize2 = this.getVertexFeatureSize(this.glControl.modelInstances2)
	}

	static getVertexFeatureSize(modelInstances) {
		let len = 0
		modelInstances.forEach(modelInstanceItem => {
			len += modelInstanceItem.vertexDatas.vertexFeature.length
		})
		return len
	}
}

function drawCanvas3(containerElement) {
	const canvasElement = containerElement.querySelector('canvas')
	Program3.glControl.gl = ven$initWebGLContext(canvasElement)
	Program3.init(containerElement)

	const SHADOW_VERTEX_SHADER = `
		precision highp float;
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
		}
	`
	const SHADOW_FRAGMENT_SHADER = `
		precision highp float;
		void main() {
			const vec4 bitShift = vec4(1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0);
			const vec4 bitMask = vec4(1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0, 0.0);
			vec4 rgbaDepth = fract(gl_FragCoord.z * bitShift);
			rgbaDepth -= rgbaDepth.gbaa * bitMask;
			gl_FragColor = rgbaDepth;
		}
	`
	const MAIN_VERTEX_SHADER = `
		precision highp float;
		varying vec4 v_Color;
		varying vec4 v_PositionFromLight;
		// 顶点配置(组)
		attribute vec3 a_Position;
		attribute vec4 a_Color;
		// 变换矩阵(组)
		uniform mat4 u_ModelMatrix;
		uniform mat4 u_ViewMatrix;
		uniform mat4 u_ProjMatrix;
		uniform mat4 u_ModelMatrixFromLight;
		uniform mat4 u_ViewMatrixFromLight;
		uniform mat4 u_ProjMatrixFromLight;
		void main() {
			gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * vec4(a_Position, 1.0);
			v_PositionFromLight = u_ProjMatrixFromLight * u_ViewMatrixFromLight * u_ModelMatrixFromLight * vec4(a_Position, 1.0);
			v_Color = a_Color;
		}
	`
	const MAIN_FRAGMENT_SHADER = `
		precision highp float;
		varying vec4 v_PositionFromLight;
		varying vec4 v_Color;
		// 参数(组)
		uniform sampler2D u_ShadowMap;
		float unpackDepth(const in vec4 rgbaDepth) {
			const vec4 bitShift = vec4(1.0, 1.0 / 256.0, 1.0 / (256.0 * 256.0), 1.0 / (256.0 * 256.0 * 256.0));
			float depth = dot(rgbaDepth, bitShift);
			return depth;
		}
		void main() {
			vec3 shadowCoord = (v_PositionFromLight.xyz / v_PositionFromLight.w) / 2.0 + 0.5;
			vec4 rgbaDepth = texture2D(u_ShadowMap, shadowCoord.xy);
			float depth = unpackDepth(rgbaDepth);
			float visibility = (shadowCoord.z > depth + 0.0015) ? 0.7 : 1.0;
			gl_FragColor = vec4(v_Color.rgb * visibility, v_Color.a);
		}
	`

	const LIGHT = [0, 7, 2]

	Program3.glControl.gl.clearColor(
		Program3.profile.clearColor.r / 255,
		Program3.profile.clearColor.g / 255,
		Program3.profile.clearColor.b / 255,
		1.0
	)
	Program3.glControl.gl.clear(Program3.glControl.gl.COLOR_BUFFER_BIT | Program3.glControl.gl.DEPTH_BUFFER_BIT)
	Program3.glControl.gl.enable(Program3.glControl.gl.BLEND)
	Program3.glControl.gl.blendFunc(Program3.glControl.gl.SRC_ALPHA, Program3.glControl.gl.ONE_MINUS_SRC_ALPHA)
	Program3.glControl.gl.enable(Program3.glControl.gl.CULL_FACE)
	Program3.glControl.gl.enable(Program3.glControl.gl.DEPTH_TEST)
	Program3.glControl.gl.enable(Program3.glControl.gl.POLYGON_OFFSET_FILL)
	Program3.glControl.gl.polygonOffset(1.0, 1.0)

	Program3.glControl.shadow = {
		glAttributes: {},
		glUniforms: {},
		program: null,
	}
	Program3.glControl.main = {
		isLoadTexture: false,
		glAttributes: {},
		glUniforms: {},
		program: null,
	}

	Program3.glControl.shadow.program = ven$createProgram(Program3.glControl.gl, SHADOW_VERTEX_SHADER, SHADOW_FRAGMENT_SHADER)
	const commonWebGLVariableLocation = ven$getWebGLVariableLocation(Program3.glControl.gl, Program3.glControl.shadow.program, {
		glAttributes: ['a_Position', 'a_Color'],
		glUniforms: ['u_ModelMatrix', 'u_ViewMatrix', 'u_ProjMatrix'],
	})
	Program3.glControl.shadow.glAttributes = commonWebGLVariableLocation.glAttributes
	Program3.glControl.shadow.glUniforms = commonWebGLVariableLocation.glUniforms

	Program3.glControl.main.program = ven$createProgram(Program3.glControl.gl, MAIN_VERTEX_SHADER, MAIN_FRAGMENT_SHADER)
	const textureWebGLVariableLocation = ven$getWebGLVariableLocation(Program3.glControl.gl, Program3.glControl.main.program, {
		glAttributes: ['a_Position', 'a_Color'],
		glUniforms: [
			'u_ModelMatrix',
			'u_ViewMatrix',
			'u_ProjMatrix',
			'u_ModelMatrixFromLight',
			'u_ViewMatrixFromLight',
			'u_ProjMatrixFromLight',
			'u_ShadowMap',
		],
	})
	Program3.glControl.main.glAttributes = textureWebGLVariableLocation.glAttributes
	Program3.glControl.main.glUniforms = textureWebGLVariableLocation.glUniforms

	const { frameBuffer: frameBuffer, texture: frameTexture } = ven$initFramebufferObject(
		Program3.glControl.gl,
		Program3.profile.offscreenWidth,
		Program3.profile.offscreenHeight
	)
	Program3.glControl.main.frameBuffer = frameBuffer
	Program3.glControl.main.frameTexture = frameTexture
	Program3.glControl.gl.activeTexture(Program3.glControl.gl.TEXTURE0)
	Program3.glControl.gl.bindTexture(Program3.glControl.gl.TEXTURE_2D, Program3.glControl.main.frameTexture)

	const canvas = {
		status: null,
		init(status, gl, frameBuffer) {
			this.status = status
			/**
			 * 绑定创建的帧缓冲区
			 * 		使绘图结果生成在帧缓冲区
			 */
			gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer)
		},
		clear(gl) {
			if (this.status === 'FRAME_BUFFER') {
				gl.viewport(0, 0, Program3.profile.offscreenWidth, Program3.profile.offscreenHeight)
				gl.clearColor(0.0, 0.0, 0.0, 1.0)
				gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
			} else {
				gl.viewport(0, 0, canvasElement.width, canvasElement.height)
				gl.clearColor(0.0, 0.0, 0.0, 1.0)
				gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
			}
		},
		setProfile(gl, itemProgramControl) {
			const { glUniforms } = itemProgramControl

			let projectionMatrix4 = Ven$CanvasMatrix4.initMatrix()
			let lookAtMatrix4 = Ven$CanvasMatrix4.initMatrix()
			if (this.status === 'FRAME_BUFFER') {
				projectionMatrix4 = Ven$CanvasMatrix4.setPerspective(
					Program3.profile.persProjection.fovy * 2,
					Program3.profile.offscreenWidth / Program3.profile.offscreenHeight,
					Program3.profile.persProjection.near,
					Program3.profile.persProjection.far
				)
				lookAtMatrix4 = Ven$CanvasMatrix4.setLookAt(
					new Ven$Vector3(LIGHT[0], LIGHT[1], LIGHT[2]),
					new Ven$Vector3(Program3.profile.lookAt.atPosition.x, Program3.profile.lookAt.atPosition.y, Program3.profile.lookAt.atPosition.z),
					new Ven$Vector3(0, 1, 0)
				)
			} else {
				projectionMatrix4 = Ven$CanvasMatrix4.setPerspective(
					Program3.profile.persProjection.fovy,
					canvasElement.width / canvasElement.height,
					Program3.profile.persProjection.near,
					Program3.profile.persProjection.far
				)
				lookAtMatrix4 = Ven$CanvasMatrix4.setLookAt(
					new Ven$Vector3(
						Program3.profile.lookAt.eyePosition.x,
						Program3.profile.lookAt.eyePosition.y,
						Program3.profile.lookAt.eyePosition.z
					),
					new Ven$Vector3(Program3.profile.lookAt.atPosition.x, Program3.profile.lookAt.atPosition.y, Program3.profile.lookAt.atPosition.z),
					new Ven$Vector3(0, 1, 0)
				)
			}

			gl.uniformMatrix4fv(glUniforms.u_ViewMatrix, false, new Float32Array(lookAtMatrix4.data))
			gl.uniformMatrix4fv(glUniforms.u_ProjMatrix, false, new Float32Array(projectionMatrix4.data))
			return {
				projectionMatrix4,
				lookAtMatrix4,
			}
		},
		render(gl, vertexFeatureSize, modelInstances, itemProgramControl) {
			const { glUniforms } = itemProgramControl

			if (this.status === 'CANVAS') {
				gl.uniform1i(glUniforms.u_ShadowMap, 0)
			}
			modelInstances.forEach(modelInstanceItem => {
				const modelEffectMatrix4 = this.applyModelMatrix(gl, modelInstanceItem, itemProgramControl)
				modelInstanceItem.modelMatrix = modelEffectMatrix4
				this.drawBuffer(gl, vertexFeatureSize, modelInstanceItem, itemProgramControl)
			})
		},
		drawBuffer(gl, vertexFeatureSize, modelInstanceItem, itemProgramControl) {
			const { featureBuffer, vertexDatas } = modelInstanceItem
			const { vertexFeature: featureData } = vertexDatas
			const { glAttributes, frameTexture } = itemProgramControl

			gl.bindBuffer(gl.ARRAY_BUFFER, featureBuffer)
			gl.bufferData(gl.ARRAY_BUFFER, featureData, gl.STATIC_DRAW)
			ven$initAttributeVariable(gl, glAttributes.a_Position, featureBuffer, {
				size: 3,
				stride: 28,
			})
			ven$initAttributeVariable(gl, glAttributes.a_Color, featureBuffer, {
				size: 4,
				stride: 28,
				offset: 12,
			})

			gl.drawArrays(gl.TRIANGLES, 0, vertexFeatureSize / 7)
		},
		applyModelMatrix(gl, modelInstance, itemProgramControl) {
			const { glUniforms } = itemProgramControl

			const modelRotationXMatrix4 = Ven$CanvasMatrix4.setRotate(
				Ven$Angles.degreeToRadian(modelInstance.modelRatation.x),
				new Ven$Vector3(1, 0, 0)
			)
			const modelRotationYMatrix4 = Ven$CanvasMatrix4.setRotate(
				Ven$Angles.degreeToRadian(modelInstance.modelRatation.y),
				new Ven$Vector3(0, 1, 0)
			)
			const modelRotationZMatrix4 = Ven$CanvasMatrix4.setRotate(
				Ven$Angles.degreeToRadian(modelInstance.modelRatation.z),
				new Ven$Vector3(0, 0, 1)
			)
			const modelOffsetMatrix4 = Ven$CanvasMatrix4.setTranslate(
				new Ven$Vector3(modelInstance.modelOffset.x, modelInstance.modelOffset.y, modelInstance.modelOffset.z)
			)
			const modelScaleMatrix4 = Ven$CanvasMatrix4.setScale(
				new Ven$Vector3(modelInstance.modelScale.x, modelInstance.modelScale.y, modelInstance.modelScale.z)
			)

			const modelEffectMatrix4 = modelRotationXMatrix4
				.multiply4(modelRotationYMatrix4)
				.multiply4(modelRotationZMatrix4)
				.multiply4(modelScaleMatrix4)
				.multiply4(modelOffsetMatrix4)

			gl.uniformMatrix4fv(glUniforms.u_ModelMatrix, false, new Float32Array(modelEffectMatrix4.data))
			return modelEffectMatrix4
		},
	}

	const stepControl = new Ven$StepControl(0, 45, 360)
	let angle = 0
	const exec = () => {
		if (!Program3.isRender) {
			window.requestAnimationFrame(exec)
			stepControl.updateLastStamp()
			return
		}
		Program3.isRender = false

		const { glUniforms: shadowGlUniforms } = Program3.glControl.shadow
		const { glUniforms: mainGlUniforms } = Program3.glControl.main

		canvas.init('FRAME_BUFFER', Program3.glControl.gl, Program3.glControl.main.frameBuffer)
		canvas.clear(Program3.glControl.gl)
		Program3.glControl.gl.useProgram(Program3.glControl.shadow.program)
		const { projectionMatrix4: s1ProjectionMatrix4, lookAtMatrix4: s1LookAtMatrix4 } = canvas.setProfile(
			Program3.glControl.gl,
			Program3.glControl.shadow
		)
		canvas.render(Program3.glControl.gl, Program3.glControl.vertexFeatureSize1, Program3.glControl.modelInstances1, Program3.glControl.shadow)
		const m1 = Ven$CanvasMatrix4.copyMatrix(Program3.glControl.modelInstances1[0].modelMatrix)
		canvas.render(Program3.glControl.gl, Program3.glControl.vertexFeatureSize2, Program3.glControl.modelInstances2, Program3.glControl.shadow)
		const m2 = Ven$CanvasMatrix4.copyMatrix(Program3.glControl.modelInstances2[0].modelMatrix)

		canvas.init('CANVAS', Program3.glControl.gl, null)
		canvas.clear(Program3.glControl.gl)
		Program3.glControl.gl.useProgram(Program3.glControl.main.program)
		Program3.glControl.gl.uniformMatrix4fv(mainGlUniforms.u_ViewMatrixFromLight, false, new Float32Array(s1LookAtMatrix4.data))
		Program3.glControl.gl.uniformMatrix4fv(mainGlUniforms.u_ProjMatrixFromLight, false, new Float32Array(s1ProjectionMatrix4.data))
		const { projectionMatrix4: s2ProjectionMatrix4, lookAtMatrix4: s2LookAtMatrix4 } = canvas.setProfile(
			Program3.glControl.gl,
			Program3.glControl.main
		)
		Program3.glControl.gl.uniformMatrix4fv(mainGlUniforms.u_ModelMatrixFromLight, false, new Float32Array(m1.data))
		canvas.render(Program3.glControl.gl, Program3.glControl.vertexFeatureSize1, Program3.glControl.modelInstances1, Program3.glControl.main)
		Program3.glControl.gl.uniformMatrix4fv(mainGlUniforms.u_ModelMatrixFromLight, false, new Float32Array(m2.data))
		canvas.render(Program3.glControl.gl, Program3.glControl.vertexFeatureSize2, Program3.glControl.modelInstances2, Program3.glControl.main)

		stepControl.updateLastStamp()
		window.requestAnimationFrame(exec)
	}
	exec()

	console.log(Program3.glControl)
}
