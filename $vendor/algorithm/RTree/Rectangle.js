class Ven$Rectangle {
	static overlapRectangle(rectA, rectB) {
		if ((rectA.height === 0 && rectA.width === 0) || (rectB.height === 0 && rectB.width === 0)) {
			return (
				rectA.startX <= rectB.startX + rectB.width &&
				rectA.startX + rectA.width >= rectB.startX &&
				rectA.startY <= rectB.startY + rectB.height &&
				rectA.startY + rectA.height >= rectB.startY
			)
		}
		return (
			rectA.startX < rectB.startX + rectB.width &&
			rectA.startX + rectA.width > rectB.startX &&
			rectA.startY < rectB.startY + rectB.height &&
			rectA.startY + rectA.height > rectB.startY
		)
	}

	static containsRectangle(rectA, rectB) {
		return (
			rectA.startX + rectA.width <= rectB.startX + rectB.width &&
			rectA.startX >= rectB.startX &&
			rectA.startY + rectA.height <= rectB.startY + rectB.height &&
			rectA.startY >= rectB.startY
		)
	}

	constructor(startX, startY, width, height) {
		this._startX = 0
		this._startY = 0
		this._width = 0
		this._height = 0
		this._endX = 0
		this._endY = 0
		this._p = false
		this.reset(startX, startY, width, height)
	}

	get startX() {
		return this._startX
	}

	get startY() {
		return this._startY
	}

	get endX() {
		return this._endX
	}

	get endY() {
		return this._endY
	}

	get p() {
		return this._p
	}

	reset(startX, startY, width, height) {
		this._startX = startX
		this._startY = startY
		this._width = width
		this._height = height
		this._endX = this._startX + this._width
		this._endY = this._startY + this._height
		this._p = this._width + this._height ? false : true
	}

	overlap(rect) {
		if (this.p || rect.p) {
			return this.startX <= a.endX && this.endX >= a.startX && this.startY <= a.endY && this.endY >= a.startY
		}
		return this.startX < a.endX && this.endX > a.startX && this.startY < a.endY && this.endY > a.startY
	}

	expand(rect) {
		let nx = 0
		let ny = 0
		let startX = 0
		let startY = 0
		let width = 0
		let height = 0
		if (this.startX > rect.startX) {
			nx = rect.startX
		} else {
			nx = this.startX
		}
		if (this.startY > rect.startY) {
			ny = rect.startY
		} else {
			ny = this.startY
		}
		if (endX > rect.endX) {
			width = endX - nx
		} else {
			width = rect.endX - nx
		}
		if (endY > rect.endY) {
			height = this.endY - ny
		} else {
			height = rect.endY - ny
		}
		startX = nx
		startY = ny
		this.reset(startX, startY, width, height)
		return this
	}
}
