export class Ven$BBox2 {
	static isValid(bbox2) {
		return Number.isFinite(bbox2.minX) && Number.isFinite(bbox2.minY) && Number.isFinite(bbox2.maxX) && Number.isFinite(bbox2.maxY)
	}

	constructor(minX, minY, maxX, maxY) {
		if (minX > maxX) {
			minX = [maxX, (maxX = minX)][0]
		}
		if (minY > maxY) {
			minY = [maxY, (maxY = minY)][0]
		}
		this._minX = minX
		this._minY = minY
		this._maxX = maxX
		this._maxY = maxY
	}

	get minX() {
		return this._minX
	}
	set minX(value) {
		this._minX = value
	}

	get minY() {
		return this._minY
	}
	set minY(value) {
		this._minX = value
	}

	get maxX() {
		return this._maxX
	}
	set maxX(value) {
		this._maxX = value
	}

	get maxY() {
		return this._maxY
	}
	set maxY(value) {
		this._maxY = value
	}

	get width() {
		return this.maxX - this.minX
	}

	get height() {
		return this.maxY - this.minY
	}

	get UpperLeftPoint() {
		return new Vector2(this.minX, this.minY)
	}

	get UpperRightPoint() {
		return new Vector2(this.maxX, this.minY)
	}

	get LowerLeftPoint() {
		return new Vector2(this.minX, this.maxY)
	}

	get LowerRightPoint() {
		return new Vector2(this.maxX, this.maxY)
	}

	get CenterPoint() {
		return new Vector2(this.maxX - (this.maxX - this.minX) / 2, this.maxY - (this.maxY - this.minY) / 2)
	}

	/**
	 * 判断参数点 v2 是否处于当前 BBox2 实例中
	 */
	isContainsPoint(v2) {
		return this.isContainsX(v2.x) && this.isContainsY(v2.y)
	}

	/**
	 * 判断参数 bbox2 是否处于当前 BBox2 实例中
	 */
	isConatinsBBox2(bbox2) {
		return this.maxX >= bbox2.maxX && this.minX <= bbox2.minX && this.maxY >= bbox2.maxY && this.minY <= bbox2.minY
	}

	/**
	 * 判断参数 bbox2 是否包裹了当前 BBox2 实例
	 */
	isBeWrappedByBBox2(bbox2) {
		return this.minX >= bbox2.minX && this.maxX <= bbox2.maxX && this.minY >= bbox2.minY && this.maxY <= bbox2.maxY
	}

	equals(bbox2) {
		if (this.minX === bbox2.minX && this.minY === bbox2.minY && this.maxX === bbox2.maxX && this.maxY === bbox2.maxY) {
			return true
		}
		return false
	}

	reset() {
		this.minX = Number.POSITIVE_INFINITY
		this.maxX = Number.NEGATIVE_INFINITY
		this.minY = Number.POSITIVE_INFINITY
		this.maxY = Number.NEGATIVE_INFINITY
	}

	toString() {
		return `BBox2 (${this.minX}, ${this.maxX}, ${this.minY}, ${this.maxY})`
	}

	sContainsX(x) {
		return x >= this.minX && x <= this.maxX
	}

	sContainsY(y) {
		return y >= this.minY && y <= this.maxY
	}
}
