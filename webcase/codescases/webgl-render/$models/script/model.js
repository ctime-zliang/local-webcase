class BaseModel1 {
	constructor() {
		this._vertexDatas = null
		this._modelParam = null
		this._modeControl = {}
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
		this._vertexBuffer = null
		this._normalBuffer = null
		this._colorBuffer = null
		this._indexBuffer = null
		this._texCoordBuffer = null
		this._modelMatrix = null
	}

	get modelParam() {
		return this._modelParam
	}

	get modeControl() {
		return this._modeControl
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

	get vertexBuffer() {
		return this._vertexBuffer
	}
	set vertexBuffer(value) {
		this._vertexBuffer = value
	}

	get normalBuffer() {
		return this._normalBuffer
	}
	set normalBuffer(value) {
		this._normalBuffer = value
	}

	get colorBuffer() {
		return this._colorBuffer
	}
	set colorBuffer(value) {
		this._colorBuffer = value
	}

	get indexBuffer() {
		return this._indexBuffer
	}
	set indexBuffer(value) {
		this._indexBuffer = value
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

class RectangularModel1 extends BaseModel1 {
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

class ShereModel1 extends BaseModel1 {
	constructor(radius, meridianCount, latitudeCount, color = '#ffffff', offsetX = 0, offsetY = 0, offsetZ = 0) {
		super()
		this._modelParam = {
			radius,
			meridianCount,
			latitudeCount,
			rgba: ven$hex2Rgba(color),
			offsetX,
			offsetY,
			offsetZ,
		}
		this.vertexDatas = this._createVertexData()
	}

	_createVertexData() {
		return createShereDatas(
			this._modelParam.radius,
			this._modelParam.meridianCount,
			this._modelParam.latitudeCount,
			{
				redRange: [this._modelParam.rgba.r, this._modelParam.rgba.r],
				greenRange: [this._modelParam.rgba.g, this._modelParam.rgba.g],
				blueRange: [this._modelParam.rgba.b, this._modelParam.rgba.b],
				alphaRange: [1, 1],
			},
			this._modelParam.offsetX,
			this._modelParam.offsetY,
			this._modelParam.offsetZ
		)
	}
}

class ObjModel1 extends BaseModel1 {
	constructor() {
		super()
	}
}
