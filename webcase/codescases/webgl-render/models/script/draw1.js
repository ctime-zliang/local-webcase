class Model1 {
	constructor() {
		this._modelParma = null
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
		this._vertexData = null
		this._vertextBuffer = null
		this._normalBuffer = null
	}

	get modelParam() {
		return this._modelParma
	}
	get modelRatation() {
		return this._modelRatation
	}
	get modelOffset() {
		return this._modelOffset
	}
	get vertexData() {
		return this._vertexData
	}

	get vertextBuffer() {
		return this._vertextBuffer
	}
	get normalBuffer() {
		return this._normalBuffer
	}

	bindVertextBuffer(glBuffer) {
		this._vertextBuffer = glBuffer
	}
	bindNormalBuffer(glBuffer) {
		this._normalBuffer = glBuffer
	}
}

class RectangularModel1 extends Model1 {
	constructor(width, length, depth, color = '#ffffff', offsetX = 0, offsetY = 0, offsetZ = 0) {
		super()
		this._modelParma = {
			width,
			length,
			depth,
			rgba: ven$hex2Rgba(color),
			offsetX,
			offsetY,
			offsetZ,
		}
		this._vertexData = this._createVertexData()
	}

	_createVertexData() {
		return createCubeDatas(
			this._modelParma.width,
			this._modelParma.length,
			this._modelParma.depth,
			{
				up: [this._modelParma.rgba.r, this._modelParma.rgba.g, this._modelParma.rgba.b, 1],
				bottom: [this._modelParma.rgba.r, this._modelParma.rgba.g, this._modelParma.rgba.b, 1],
				front: [this._modelParma.rgba.r, this._modelParma.rgba.g, this._modelParma.rgba.b, 1],
				back: [this._modelParma.rgba.r, this._modelParma.rgba.g, this._modelParma.rgba.b, 1],
				right: [this._modelParma.rgba.r, this._modelParma.rgba.g, this._modelParma.rgba.b, 1],
				left: [this._modelParma.rgba.r, this._modelParma.rgba.g, this._modelParma.rgba.b, 1],
			},
			this._modelParma.offsetX,
			this._modelParma.offsetY,
			this._modelParma.offsetZ
		)
	}
}

class ShereModel1 extends Model1 {
	constructor(radius, meridianCount, latitudeCount, color = '#ffffff', offsetX = 0, offsetY = 0, offsetZ = 0) {
		super()
		this._modelParma = {
			radius,
			meridianCount,
			latitudeCount,
			rgba: ven$hex2Rgba(color),
			offsetX,
			offsetY,
			offsetZ,
		}
		this._vertexData = this._createVertexData()
	}

	_createVertexData() {
		return createShereDatas(
			this._modelParma.radius,
			this._modelParma.meridianCount,
			this._modelParma.latitudeCount,
			{
				redRange: [this._modelParma.rgba.r, this._modelParma.rgba.r],
				greenRange: [this._modelParma.rgba.g, this._modelParma.rgba.g],
				blueRange: [this._modelParma.rgba.b, this._modelParma.rgba.b],
				alphaRange: [1, 1],
			},
			this._modelParma.offsetX,
			this._modelParma.offsetY,
			this._modelParma.offsetZ
		)
	}
}

class Program1 {
	static isRender = true
	static containerElement
	static modelInstances = []
	static downKeys = new Set()
	static downNumberKeys = new Set()
	static mouseInfo = {
		isRightDown: false,
		hasRightDownMove: false,
		isLeftDown: false,
		hasLeftDownMove: false,
		isMiddleDown: false,
		hasMiddleDownMove: false,
		moveLastNativeX: 0,
		moveLastNativeY: 0,
		nativeRightDownX: -1,
		nativeRightDownY: -1,
		nativeMiddleDownX: -1,
		nativeMiddleDownY: -1,
		nativeLeftDownX: -1,
		nativeLeftDownY: -1,
		sceneRightDownX: -1,
		sceneRightDownY: -1,
		sceneMiddleDownX: -1,
		sceneMiddleDownY: -1,
		sceneLeftDownX: -1,
		sceneLeftDownY: -1,
	}
	static profile = {
		autoTransition: false,
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
			illuType: 1,
			intensityGain: 1.0,
			direction: {
				x: 0.5,
				y: 3.0,
				z: 4.0,
			},
			position: {
				x: 1.0,
				y: 2.0,
				z: 1.5,
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
		/**
		 * 雾化参数
		 */
		fog: {
			color: {
				r: 0,
				g: 0,
				b: 0,
			},
			dist: {
				distOfStartAndEye: 1,
				distOfEndAndEye: 100,
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
		this.syncFogColor2ClearColor()
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
		const lightIlluTypeCheckRadioElements = this.containerElement.querySelectorAll(`[name="lightIlluTypeCheck"]`)
		const lightPositionRangeXRangeElement = this.containerElement.querySelector(`[name="lightPositionRangeX"]`)
		const lightPositionRangeXShowElement = this.containerElement.querySelector(`[name="lightPositionRangeXShow"]`)
		const lightPositionRangeYRangeElement = this.containerElement.querySelector(`[name="lightPositionRangeY"]`)
		const lightPositionRangeYShowElement = this.containerElement.querySelector(`[name="lightPositionRangeYShow"]`)
		const lightPositionRangeZRangeElement = this.containerElement.querySelector(`[name="lightPositionRangeZ"]`)
		const lightPositionRangeZShowElement = this.containerElement.querySelector(`[name="lightPositionRangeZShow"]`)
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
		const autoTransitionCheckboxElement = this.containerElement.querySelector(`[name="autoTransition"]`)
		const fogStartDistRangeElement = this.containerElement.querySelector(`[name="fogStartDist"]`)
		const fogStartDistShowShowSpanElement = this.containerElement.querySelector(`[name="fogStartDistShow"]`)
		const fogEndDistRangeElement = this.containerElement.querySelector(`[name="fogEndDist"]`)
		const fogEndDistShowShowSpanElement = this.containerElement.querySelector(`[name="fogEndDistShow"]`)

		projectionFovyShowSpanElement.textContent = projectionFovyRangeElement.value = self.profile.persProjection.fovy
		projectionNearShowSpanElement.textContent = projectionNearRangeElement.value = self.profile.persProjection.near
		projectionFarShowSpanElement.textContent = projectionFarRangeElement.value = self.profile.persProjection.far
		lookAtMatrix4EyePositionXShowSpanElement.textContent = lookAtMatrix4EyePositionXRangeElement.value = self.profile.lookAt.eyePosition.x
		lookAtMatrix4EyePositionYShowSpanElement.textContent = lookAtMatrix4EyePositionYRangeElement.value = self.profile.lookAt.eyePosition.y
		lookAtMatrix4EyePositionZShowSpanElement.textContent = lookAtMatrix4EyePositionZRangeElement.value = self.profile.lookAt.eyePosition.z
		lookAtMatrix4AtPositionXShowSpanElement.textContent = lookAtMatrix4AtPositionXRangeElement.value = self.profile.lookAt.atPosition.x
		lookAtMatrix4AtPositionYShowSpanElement.textContent = lookAtMatrix4AtPositionYRangeElement.value = self.profile.lookAt.atPosition.y
		lookAtMatrix4AtPositionZShowSpanElement.textContent = lookAtMatrix4AtPositionZRangeElement.value = self.profile.lookAt.atPosition.z
		lightColorShowSpanElement.textContent = lightColorPickElement.value = ven$rgba2Hex(self.profile.light.color)
		lightIlluTypeCheckRadioElements.forEach(itemElement => {
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
		autoTransitionCheckboxElement.checked = self.profile.autoTransition
		fogStartDistShowShowSpanElement.textContent = fogStartDistRangeElement.value = self.profile.fog.dist.distOfStartAndEye
		fogEndDistShowShowSpanElement.textContent = fogEndDistRangeElement.value = self.profile.fog.dist.distOfEndAndEye

		this.toggleLightIlluTypeView()
	}

	static eventHandle() {
		const self = this
		const canvasElement = this.containerElement.querySelector(`canvas`)
		const projectionFovyRangeElement = this.containerElement.querySelector(`[name="projectionFovy"]`)
		const projectionFovyShowSpanElement = this.containerElement.querySelector(`[name="projectionFovyShow"]`)
		const projectionNearRangeElement = this.containerElement.querySelector(`[name="projectionNear"]`)
		const projectionNearShowSpanElement = this.containerElement.querySelector(`[name="projectionNearShow"]`)
		const projectionFarRangeElement = this.containerElement.querySelector(`[name="projectionFar"]`)
		const projectionFarShowSpanElement = this.containerElement.querySelector(`[name="projectionFarShow"]`)
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
		const lightIlluTypeCheckRadioElements = this.containerElement.querySelectorAll(`[name="lightIlluTypeCheck"]`)
		const lightPositionRangeXRangeElement = this.containerElement.querySelector(`[name="lightPositionRangeX"]`)
		const lightPositionRangeXShowElement = this.containerElement.querySelector(`[name="lightPositionRangeXShow"]`)
		const lightPositionRangeYRangeElement = this.containerElement.querySelector(`[name="lightPositionRangeY"]`)
		const lightPositionRangeYShowElement = this.containerElement.querySelector(`[name="lightPositionRangeYShow"]`)
		const lightPositionRangeZRangeElement = this.containerElement.querySelector(`[name="lightPositionRangeZ"]`)
		const lightPositionRangeZShowElement = this.containerElement.querySelector(`[name="lightPositionRangeZShow"]`)
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
		const autoTransitionCheckboxElement = this.containerElement.querySelector(`[name="autoTransition"]`)
		const fogStartDistRangeElement = this.containerElement.querySelector(`[name="fogStartDist"]`)
		const fogStartDistShowShowSpanElement = this.containerElement.querySelector(`[name="fogStartDistShow"]`)
		const fogEndDistRangeElement = this.containerElement.querySelector(`[name="fogEndDist"]`)
		const fogEndDistShowShowSpanElement = this.containerElement.querySelector(`[name="fogEndDistShow"]`)

		canvasElement.addEventListener('contextmenu', function (e) {
			e.preventDefault()
			e.stopPropagation()
		})
		canvasElement.addEventListener('mousedown', function (e) {
			const canvasRect = this.getBoundingClientRect().toJSON()
			self.mouseInfo.isLeftDown = self.mouseInfo.isMiddleDown = self.mouseInfo.isRightDown = false
			self.mouseInfo.nativeLeftDownX = self.mouseInfo.nativeMiddleDownX = self.mouseInfo.nativeRightDownX = -1
			self.mouseInfo.nativeLeftDownY = self.mouseInfo.nativeMiddleDownY = self.mouseInfo.nativeRightDownY = -1
			self.mouseInfo.hasMoved = false
			if (e.button === 0) {
				self.mouseInfo.isLeftDown = true
				self.mouseInfo.nativeLeftDownX = e.clientX - canvasRect.left
				self.mouseInfo.nativeLeftDownY = e.clientY - canvasRect.top
			}
			if (e.button === 1) {
				self.mouseInfo.isMiddleDown = true
				self.mouseInfo.nativeMiddleDownX = e.clientX - canvasRect.left
				self.mouseInfo.nativeMiddleDownY = e.clientY - canvasRect.top
			}
			if (e.button === 2) {
				self.mouseInfo.isRightDown = true
				self.mouseInfo.nativeRightDownX = e.clientX - canvasRect.left
				self.mouseInfo.nativeRightDownY = e.clientY - canvasRect.top
			}
		})
		document.addEventListener('mousemove', function (e) {
			const nowX = e.clientX
			const nowY = e.clientY
			const distNativeX = nowX - self.mouseInfo.moveLastNativeX
			const distNativeY = nowY - self.mouseInfo.moveLastNativeY
			if (self.mouseInfo.isLeftDown) {
				self.mouseInfo.hasLeftDownMove = true
				const ratioDistX = 0.65 * distNativeX
				const ratioDistY = 0.65 * distNativeY
				self.getModelInstances().forEach(modelInstanceItem => {
					modelInstanceItem.modelRatation.y += ratioDistX
					modelInstanceItem.modelRatation.x += ratioDistY
				})
				self.isRender = true
				self.renderModelInfomationView()
			}
			if (self.mouseInfo.isRightDown) {
				self.mouseInfo.hasRightDownMove = true
			}
			if (self.mouseInfo.isMiddleDown) {
				self.mouseInfo.hasMiddleDownMove = true
			}
			self.mouseInfo.moveLastNativeX = nowX
			self.mouseInfo.moveLastNativeY = nowY
		})
		document.addEventListener('mouseup', function (e) {
			if (self.mouseInfo.isLeftDown && !self.mouseInfo.hasLeftDownMove) {
				self.canvasElementClickedAction.call(self, e)
			}
			self.mouseInfo.hasLeftDownMove = self.mouseInfo.hasRightDownMove = self.mouseInfo.hasMiddleDownMove = false
			self.mouseInfo.isLeftDown = self.mouseInfo.isMiddleDown = self.mouseInfo.isRightDown = false
			self.mouseInfo.nativeLeftDownX = self.mouseInfo.nativeMiddleDownX = self.mouseInfo.nativeRightDownX = -1
			self.mouseInfo.nativeLeftDownY = self.mouseInfo.nativeMiddleDownY = self.mouseInfo.nativeRightDownY = -1
		})
		document.addEventListener('keydown', function (e) {
			e.preventDefault()
			e.stopPropagation()
			self.downKeys.add(e.keyCode)
			if (!Number.isNaN(+e.key)) {
				self.downNumberKeys.add(+e.key)
			}
			switch (e.keyCode) {
				// page-up
				case 221: {
					if (e.ctrlKey === false && e.altKey === false && e.shiftKey === false && e.metaKey === false) {
						self.getModelInstances(self.downNumberKeys).forEach(modelInstanceItem => {
							modelInstanceItem.modelOffset.z -= 0.05
						})
						self.isRender = true
						self.renderModelInfomationView()
						break
					}
					if (e.ctrlKey === true && e.altKey === false && e.shiftKey === false && e.metaKey === false) {
						self.getModelInstances(self.downNumberKeys).forEach(modelInstanceItem => {
							modelInstanceItem.modelRatation.z -= 1
						})
						self.isRender = true
						self.renderModelInfomationView()
						break
					}
					break
				}
				// page-down
				case 219: {
					if (e.ctrlKey === false && e.altKey === false && e.shiftKey === false && e.metaKey === false) {
						self.getModelInstances(self.downNumberKeys).forEach(modelInstanceItem => {
							modelInstanceItem.modelOffset.z += 0.05
						})
						self.isRender = true
						self.renderModelInfomationView()
						break
					}
					if (e.ctrlKey === true && e.altKey === false && e.shiftKey === false && e.metaKey === false) {
						self.getModelInstances(self.downNumberKeys).forEach(modelInstanceItem => {
							modelInstanceItem.modelRatation.z += 1
						})
						self.isRender = true
						self.renderModelInfomationView()
						break
					}
					break
				}
				// up
				case 38: {
					if (e.ctrlKey === false && e.altKey === false && e.shiftKey === false && e.metaKey === false) {
						self.getModelInstances(self.downNumberKeys).forEach(modelInstanceItem => {
							modelInstanceItem.modelOffset.y += 0.05
						})
						self.isRender = true
						self.renderModelInfomationView()
						break
					}
					if (e.ctrlKey === true && e.altKey === false && e.shiftKey === false && e.metaKey === false) {
						self.getModelInstances(self.downNumberKeys).forEach(modelInstanceItem => {
							modelInstanceItem.modelRatation.y += 1
						})
						self.isRender = true
						self.renderModelInfomationView()
						break
					}
					break
				}
				// right
				case 39: {
					if (e.ctrlKey === false && e.altKey === false && e.shiftKey === false && e.metaKey === false) {
						self.getModelInstances(self.downNumberKeys).forEach(modelInstanceItem => {
							modelInstanceItem.modelOffset.x += 0.05
						})
						self.isRender = true
						self.renderModelInfomationView()
						break
					}
					if (e.ctrlKey === true && e.altKey === false && e.shiftKey === false && e.metaKey === false) {
						self.getModelInstances(self.downNumberKeys).forEach(modelInstanceItem => {
							modelInstanceItem.modelRatation.x += 1
						})
						self.isRender = true
						self.renderModelInfomationView()
						break
					}
					break
				}
				// down
				case 40: {
					if (e.ctrlKey === false && e.altKey === false && e.shiftKey === false && e.metaKey === false) {
						self.getModelInstances(self.downNumberKeys).forEach(modelInstanceItem => {
							modelInstanceItem.modelOffset.y -= 0.05
						})
						self.isRender = true
						self.renderModelInfomationView()
						break
					}
					if (e.ctrlKey === true && e.altKey === false && e.shiftKey === false && e.metaKey === false) {
						self.getModelInstances(self.downNumberKeys).forEach(modelInstanceItem => {
							modelInstanceItem.modelRatation.y -= 1
						})
						self.isRender = true
						self.renderModelInfomationView()
						break
					}
					break
				}
				// left
				case 37: {
					if (e.ctrlKey === false && e.altKey === false && e.shiftKey === false && e.metaKey === false) {
						self.getModelInstances(self.downNumberKeys).forEach(modelInstanceItem => {
							modelInstanceItem.modelOffset.x -= 0.05
						})
						self.isRender = true
						self.renderModelInfomationView()
						break
					}
					if (e.ctrlKey === true && e.altKey === false && e.shiftKey === false && e.metaKey === false) {
						self.getModelInstances(self.downNumberKeys).forEach(modelInstanceItem => {
							modelInstanceItem.modelRatation.x -= 1
						})
						self.isRender = true
						self.renderModelInfomationView()
						break
					}
					break
				}
			}
		})
		document.addEventListener('keyup', function (e) {
			e.preventDefault()
			e.stopPropagation()
			self.downKeys.delete(e.keyCode)
			if (self.downNumberKeys.has(+e.key)) {
				self.downNumberKeys.delete(+e.key)
			}
		})
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
		lightIlluTypeCheckRadioElements.forEach(itemElement => {
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
		autoTransitionCheckboxElement.addEventListener('change', function (e) {
			self.profile.autoTransition = this.checked
		})
		fogStartDistRangeElement.addEventListener('input', function (e) {
			fogStartDistShowShowSpanElement.textContent = self.profile.fog.dist.distOfStartAndEye = +this.value
			console.log('light.fog.dist:', self.profile.light.intensityGain)
			self.isRender = true
		})
		fogEndDistRangeElement.addEventListener('input', function (e) {
			fogEndDistShowShowSpanElement.textContent = self.profile.fog.dist.distOfEndAndEye = +this.value
			console.log('light.fog.dist:', self.profile.light.intensityGain)
			self.isRender = true
		})
	}

	static getModelInstances(downNumberKeys) {
		if (!downNumberKeys || downNumberKeys.size <= 0) {
			return [...this.modelInstances]
		}
		const modelInstances = []
		downNumberKeys.forEach(number => {
			const idx = number - 1
			if (this.modelInstances[idx]) {
				modelInstances.push(this.modelInstances[idx])
			}
		})
		return modelInstances
	}

	static renderModelInfomationView() {
		const modelInfomationElement = this.containerElement.querySelector(`[data-tagitem="model-infomation"]`)
		let htmlString = ``
		this.modelInstances.forEach((modelInstanceItem, index) => {
			htmlString += `
				<div style="font-size: 14px;">
					<div style="font-weight: 900;">MODEL ${index + 1}:</div> 
					<div style="padding: 2px 2px 2px 10px;">Model Offset: ${JSON.stringify(modelInstanceItem.modelOffset)}</div>
					<div style="padding: 2px 2px 2px 10px;">Model Ratation: ${JSON.stringify(modelInstanceItem.modelRatation)}</div>
				</div>
			`
		})
		modelInfomationElement.innerHTML = htmlString
	}

	static getvertexFeatureize() {
		let len = 0
		this.modelInstances.forEach((modelInstanceItem, index) => {
			len += modelInstanceItem.vertexData.vertexFeature.length
		})
		return len
	}

	static toggleLightIlluTypeView() {
		const lightPositionRangeXRangeElement = this.containerElement.querySelector(`[name="lightPositionRangeX"]`)
		const lightPositionRangeYRangeElement = this.containerElement.querySelector(`[name="lightPositionRangeY"]`)
		const lightPositionRangeZRangeElement = this.containerElement.querySelector(`[name="lightPositionRangeZ"]`)
		const lightDirectionRangeXRangeElement = this.containerElement.querySelector(`[name="lightDirectionRangeX"]`)
		const lightDirectionRangeYRangeElement = this.containerElement.querySelector(`[name="lightDirectionRangeY"]`)
		const lightDirectionRangeZRangeElement = this.containerElement.querySelector(`[name="lightDirectionRangeZ"]`)
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

	static canvasElementClickedAction(e) {
		const isPickedModelObject = this.isPickedModelObject(this.mouseInfo.nativeLeftDownX, this.mouseInfo.nativeLeftDownY)
		if (isPickedModelObject) {
			console.log(`has selected model body.`)
		} else {
			console.log(`click blank section.`)
		}
	}

	static isPickedModelObject(x, y) {
		this.glControl.setWebGLRenderClickedStatus()
		const pixels = new Uint8Array(4)
		let isPicked = false
		this.glControl.gl.readPixels(x, y, 1, 1, this.glControl.gl.RGBA, this.glControl.gl.UNSIGNED_BYTE, pixels)
		if (pixels[0] == 255) {
			isPicked = true
		}
		this.glControl.setWebGLRenderNormalStatus()
		return isPicked
	}

	static syncFogColor2ClearColor() {
		this.profile.clearColor.r = this.profile.fog.color.r
		this.profile.clearColor.g = this.profile.fog.color.g
		this.profile.clearColor.b = this.profile.fog.color.b
	}
}

function drawCanvas1(containerElement) {
	Program1.init(containerElement)

	const VS = `
		precision mediump float;
		varying vec4 v_Color;
		varying vec3 v_Normal;
		varying vec3 v_Position;
		varying float v_Dist;
		// 顶点配置(组)
		attribute vec3 a_Position;
		attribute vec4 a_Color;
		attribute vec3 a_Normal;
		// 变换矩阵(组)
		uniform mat4 u_NormalMatrix;
		uniform mat4 u_ModelMatrix;
		uniform mat4 u_ViewMatrix;
		uniform mat4 u_ProjMatrix;
		// 参数(组)
		uniform vec3 u_Eye;
		void main() {
			gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * vec4(a_Position, 1.0);
			// 计算顶点的世界坐标
			v_Position = vec3(u_ModelMatrix * vec4(a_Position, 1.0));
			// 根据法线变换矩阵重新计算法线坐标并归一化
			v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal, 1.0)));
			v_Color = a_Color;
			// 计算顶点(世界坐标系)到视点的距离
			v_Dist = distance(u_ModelMatrix * vec4(a_Position, 1.0), vec4(u_Eye, 1.0));
		}
	`
	const FS = `
		precision mediump float;
		varying vec4 v_Color;
		varying vec3 v_Normal;
		varying vec3 v_Position;
		varying float v_Dist;
		// 参数(组)
		uniform float u_lightIntensityGain;
		uniform float u_illuType;
		uniform bool u_Clicked;
		uniform vec3 u_FogColor;
		uniform vec2 u_FogDist;
		// 点光配置(组)
		uniform vec3 u_LightPosition;
		uniform vec3 u_LightDirection;
		uniform vec3 u_LightColor;
		uniform vec3 u_AmbientLightColor;
		void main() {
			vec3 normal;
			float nDotL;
			vec3 ambient;
			vec3 diffuse;
			vec3 lightDirection;
			float fogFactor;
			vec3 fragMixinColor;
			if (u_Clicked) {
				gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
			} else {
				fogFactor = clamp((u_FogDist.y - v_Dist) / (u_FogDist.y - u_FogDist.x), 0.0, 1.0);
				if (u_illuType == 1.0) {  // 平行光
					normal = normalize(v_Normal);
					// 计算光线方向与法线的点积
					nDotL = max(dot(u_LightDirection, normal), 0.0);
					// 计算漫反射光和环境光的色值
					diffuse = u_LightColor * v_Color.rgb * nDotL * u_lightIntensityGain;
					ambient = u_AmbientLightColor * v_Color.rgb;
					// gl_FragColor = vec4(diffuse + ambient, v_Color.a);
					fragMixinColor = diffuse + ambient;
					vec3 color = mix(u_FogColor, vec3(fragMixinColor), fogFactor);
					gl_FragColor = vec4(color, v_Color.a);
				} else {  // 点光
					normal = normalize(v_Normal);
					// 计算光线方向并归一化
					lightDirection = normalize(u_LightPosition - v_Position);
					// 计算光线方向与法线的点积
					nDotL = max(dot(lightDirection, normal), 0.0);
					// 计算漫反射光和环境光的色值
					diffuse = u_LightColor * v_Color.rgb * nDotL * u_lightIntensityGain;
					ambient = u_AmbientLightColor * v_Color.rgb;
					// gl_FragColor = vec4(diffuse + ambient, v_Color.a);
					fragMixinColor = diffuse + ambient;
					vec3 color = mix(u_FogColor, vec3(fragMixinColor), fogFactor);
					gl_FragColor = vec4(color, v_Color.a);
				}
			}
		}
	`

	console.time(`CreateModelDatas`)
	const modelHead = new RectangularModel1(0.4, 0.35, 0.35, '#ffffff', 0, 1.2, 0)
	const modelBody = new RectangularModel1(0.8, 1.0, 0.4, '#ffffff', 0, 0.5, 0)
	const modelLeftArm = new RectangularModel1(0.2, 1.35, 0.2, '#ffffff', 0.55, 0.3, 0)
	const modelRightArm = new RectangularModel1(0.2, 1.35, 0.2, '#ffffff', -0.55, 0.3, 0)
	const modelLeftLeg = new RectangularModel1(0.25, 1.45, 0.25, '#ffffff', 0.25, -0.75, 0)
	const modelRightLeg = new RectangularModel1(0.25, 1.45, 0.25, '#ffffff', -0.25, -0.75, 0)
	const modelLeftFoot = new RectangularModel1(0.25, 0.25, 0.35, '#ffffff', 0.25, -1.55, 0.05)
	const modelRightFoot = new RectangularModel1(0.25, 0.25, 0.35, '#ffffff', -0.25, -1.55, 0.05)
	Program1.modelInstances.push(modelHead, modelBody, modelLeftArm, modelRightArm, modelLeftLeg, modelRightLeg, modelLeftFoot, modelRightFoot)
	Program1.glControl.vertexFeatureSize = Program1.getvertexFeatureize()
	console.log(Program1.modelInstances)
	console.timeEnd(`CreateModelDatas`)

	Program1.renderModelInfomationView()

	const canvasElement = containerElement.querySelector('canvas')
	const gl = initWebGLContext(canvasElement)

	Program1.glControl.gl = gl

	const vertexShader = createShader(gl, gl.VERTEX_SHADER, VS)
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FS)
	const program = createProgram(gl, vertexShader, fragmentShader)

	gl.useProgram(program)

	gl.clearColor(Program1.profile.clearColor.r / 255, Program1.profile.clearColor.g / 255, Program1.profile.clearColor.b / 255, 1.0)
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
	gl.enable(gl.CULL_FACE)
	gl.enable(gl.DEPTH_TEST)
	gl.enable(gl.POLYGON_OFFSET_FILL)
	gl.polygonOffset(1.0, 1.0)

	const u_illuType = gl.getUniformLocation(program, 'u_illuType')
	const u_LightColor = gl.getUniformLocation(program, 'u_LightColor')
	const u_LightPosition = gl.getUniformLocation(program, 'u_LightPosition')
	const u_LightDirection = gl.getUniformLocation(program, 'u_LightDirection')
	const u_AmbientLightColor = gl.getUniformLocation(program, 'u_AmbientLightColor')
	const u_lightIntensityGain = gl.getUniformLocation(program, 'u_lightIntensityGain')
	const u_NormalMatrix = gl.getUniformLocation(program, 'u_NormalMatrix')
	const u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix')
	const u_ViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix')
	const u_ProjMatrix = gl.getUniformLocation(program, 'u_ProjMatrix')
	const u_Clicked = gl.getUniformLocation(program, 'u_Clicked')
	const u_Eye = gl.getUniformLocation(program, 'u_Eye')
	const u_FogColor = gl.getUniformLocation(program, 'u_FogColor')
	const u_FogDist = gl.getUniformLocation(program, 'u_FogDist')
	const a_Normal = gl.getAttribLocation(program, 'a_Normal')
	const a_Position = gl.getAttribLocation(program, 'a_Position')
	const a_Color = gl.getAttribLocation(program, 'a_Color')

	gl.enableVertexAttribArray(a_Normal)
	gl.enableVertexAttribArray(a_Position)
	gl.enableVertexAttribArray(a_Color)

	Program1.modelInstances.forEach(modelInstanceItem => {
		modelInstanceItem.bindVertextBuffer(gl.createBuffer())
		modelInstanceItem.bindNormalBuffer(gl.createBuffer())
	})

	Program1.glControl.writeBufferAction = modelInstance => {
		gl.bindBuffer(gl.ARRAY_BUFFER, modelInstance.normalBuffer)
		gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0)
		gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(modelInstance.vertexData.vertexNormals), gl.STATIC_DRAW)
		gl.bindBuffer(gl.ARRAY_BUFFER, modelInstance.vertextBuffer)
		gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 28, 0)
		gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 28, 12)
		gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(modelInstance.vertexData.vertexFeature), gl.STATIC_DRAW)
	}
	Program1.glControl.applyTranslateMatrixAction = modelInstance => {
		/**
		 * 创建旋转矩阵
		 */
		const modelXRotationMatrix4 = Ven$CanvasMatrix4.setRotate(Ven$Angles.degreeToRadian(modelInstance.modelRatation.x), new Ven$Vector3(1, 0, 0))
		const modelRotationYMatrix4 = Ven$CanvasMatrix4.setRotate(Ven$Angles.degreeToRadian(modelInstance.modelRatation.y), new Ven$Vector3(0, 1, 0))
		const modelRotationZMatrix4 = Ven$CanvasMatrix4.setRotate(Ven$Angles.degreeToRadian(modelInstance.modelRatation.z), new Ven$Vector3(0, 0, 1))
		/**
		 * 创建平移矩阵
		 */
		const modelOffsetMatrix4 = Ven$CanvasMatrix4.setTranslate(
			new Ven$Vector3(modelInstance.modelOffset.x, modelInstance.modelOffset.y, modelInstance.modelOffset.z)
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

		gl.uniformMatrix4fv(u_ModelMatrix, false, new Float32Array(modelEffectMatrix4.data))
		gl.uniformMatrix4fv(u_NormalMatrix, false, new Float32Array(normalMatrix4.data))
	}
	Program1.glControl.drawModelAction = (modelInstance, vertexFeatureSize) => {
		Program1.glControl.writeBufferAction(modelInstance)
		Program1.glControl.applyTranslateMatrixAction(modelInstance)
		gl.drawArrays(gl.TRIANGLES, 0, vertexFeatureSize / 7)
	}
	Program1.glControl.setWebGLRenderClickedStatus = () => {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
		gl.clearColor(Program1.profile.clearColor.r / 255, Program1.profile.clearColor.g / 255, Program1.profile.clearColor.b / 255, 1.0)
		gl.uniform1i(u_Clicked, 1)
		Program1.modelInstances.forEach(modelInstanceItem => {
			Program1.glControl.drawModelAction(modelInstanceItem, Program1.glControl.vertexFeatureSize)
		})
	}
	Program1.glControl.setWebGLRenderNormalStatus = () => {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
		gl.clearColor(Program1.profile.clearColor.r / 255, Program1.profile.clearColor.g / 255, Program1.profile.clearColor.b / 255, 1.0)
		gl.uniform1i(u_Clicked, 0)
		Program1.modelInstances.forEach(modelInstanceItem => {
			Program1.glControl.drawModelAction(modelInstanceItem, Program1.glControl.vertexFeatureSize)
		})
	}

	const render = () => {
		if (!Program1.isRender) {
			return
		}
		Program1.isRender = false

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
		gl.clearColor(Program1.profile.clearColor.r / 255, Program1.profile.clearColor.g / 255, Program1.profile.clearColor.b / 255, 1.0)

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

		gl.uniform1f(u_illuType, Program1.profile.light.illuType)
		if (Program1.profile.light.illuType === 1) {
			/**
			 * 平行光方
			 */
			const lightDirection = new Ven$Vector3(
				Program1.profile.light.direction.x,
				Program1.profile.light.direction.y,
				Program1.profile.light.direction.z
			)
			const lightNormalizeDirection = lightDirection.normalize()
			gl.uniform3fv(u_LightDirection, new Float32Array([lightNormalizeDirection.x, lightNormalizeDirection.y, lightNormalizeDirection.z]))
		}
		if (Program1.profile.light.illuType === 2) {
			/**
			 * 点光
			 */
			gl.uniform3fv(
				u_LightPosition,
				new Float32Array([Program1.profile.light.position.x, Program1.profile.light.position.y, Program1.profile.light.position.z])
			)
		}
		gl.uniform3f(u_LightColor, Program1.profile.light.color.r / 255, Program1.profile.light.color.g / 255, Program1.profile.light.color.b / 255)
		gl.uniform1f(u_lightIntensityGain, Program1.profile.light.intensityGain)
		gl.uniform3f(u_AmbientLightColor, Program1.profile.light.ambient.r, Program1.profile.light.ambient.g, Program1.profile.light.ambient.b)
		gl.uniform3fv(
			u_FogColor,
			new Float32Array([Program1.profile.fog.color.r / 255, Program1.profile.fog.color.g / 255, Program1.profile.fog.color.b / 255])
		)
		gl.uniform2fv(u_FogDist, new Float32Array([Program1.profile.fog.dist.distOfStartAndEye, Program1.profile.fog.dist.distOfEndAndEye]))
		gl.uniform3fv(
			u_Eye,
			new Float32Array([Program1.profile.lookAt.eyePosition.x, Program1.profile.lookAt.eyePosition.y, Program1.profile.lookAt.eyePosition.z])
		)
		gl.uniformMatrix4fv(u_ViewMatrix, false, new Float32Array(lookAtMatrix4.data))
		gl.uniformMatrix4fv(u_ProjMatrix, false, new Float32Array(projectionMatrix4.data))

		Program1.modelInstances.forEach(modelInstanceItem => {
			Program1.glControl.drawModelAction(modelInstanceItem, Program1.glControl.vertexFeatureSize)
		})
	}

	const stepControl = new Ven$StepControl(0, 90, 360)
	let angle = 0

	const exec = () => {
		if (Program1.profile.autoTransition) {
			angle = stepControl.getNextValue() % 360
			Program1.getModelInstances().forEach(modelInstanceItem => {
				modelInstanceItem.modelRatation.y = angle
			})
			Program1.isRender = true
			Program1.renderModelInfomationView()
		} else {
			stepControl.updateLastStamp()
		}
		render()
		requestAnimationFrame(exec)
	}

	exec()
}
