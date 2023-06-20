class Ven$Rtree_Rectangle {
	static overlapRectangle(rectA, rectB) {
		if ((rectA.h === 0 && rectA.w === 0) || (rectB.h === 0 && rectB.w === 0)) {
			return (
				rectA.sx <= rectB.sx + rectB.w && rectA.sx + rectA.w >= rectB.sx && rectA.sy <= rectB.sy + rectB.h && rectA.sy + rectA.h >= rectB.sy
			)
		}
		return rectA.sx < rectB.sx + rectB.w && rectA.sx + rectA.w > rectB.sx && rectA.sy < rectB.sy + rectB.h && rectA.sy + rectA.h > rectB.sy
	}

	static containsRectangle(rectA, rectB) {
		return rectA.sx + rectA.w <= rectB.sx + rectB.w && rectA.sx >= rectB.sx && rectA.sy + rectA.h <= rectB.sy + rectB.h && rectA.sy >= rectB.sy
	}

	static expandRectangle(expandRect, referenceRect) {
		let nx = 0
		let ny = 0
		let expandRectEX = expandRect.sx + expandRect.w
		let expandRectEY = expandRect.sy + expandRect.h
		let referenceRectEX = referenceRect.sx + referenceRect.w
		let referenceRectEY = referenceRect.sy + referenceRect.h
		if (expandRect.sx > referenceRect.sx) {
			nx = referenceRect.sx
		} else {
			nx = expandRect.sx
		}
		if (expandRect.sy > referenceRect.sy) {
			ny = referenceRect.sy
		} else {
			ny = expandRect.sy
		}
		if (expandRectEX > referenceRectEX) {
			expandRect.w = expandRectEX - nx
		} else {
			expandRect.w = referenceRectEX - nx
		}
		if (expandRectEY > referenceRectEY) {
			expandRect.h = expandRectEY - ny
		} else {
			expandRect.h = referenceRectEY - ny
		}
		expandRect.sx = nx
		expandRect.sy = ny
		return expandRect
	}

	static makeMBR(nodes, expandRect) {
		if (!nodes.length || !expandRect) {
			return
		}
		expandRect.reset(nodes[0].x, nodes[0].y, nodes[0].w, nodes[0].h)
		for (let i = 1; i < nodes.length; i++) {
			Ven$Rtree_Rectangle.expandRectangle(expandRect, nodes[i])
		}
	}

	static squarifiedRatio(l, w, fill) {
		const lperi = (l + w) / 2
		const larea = l * w
		const lgeo = larea / (lperi * lperi)
		return (larea * fill) / lgeo
	}

	constructor(sx, sy, w, h) {
		this._sx = 0
		this._sy = 0
		this._w = 0
		this._h = 0
		this._ex = 0
		this._ey = 0
		this._p = false
		this.reset(sx, sy, w, h)
	}

	get sx() {
		return this._sx
	}
	set sx(value) {
		this._sx = value
	}

	get sy() {
		return this._sy
	}
	set sy(value) {
		this._sy = value
	}

	get ex() {
		return this._ex
	}
	set ex(value) {
		this._ex = value
	}

	get ey() {
		return this._ey
	}
	set ey(value) {
		this._ey = value
	}

	get p() {
		return this._p
	}
	set p(value) {
		this._p = value
	}

	get w() {
		return this._w
	}
	set w(value) {
		this._w = value
	}

	get h() {
		return this._h
	}
	set h(value) {
		this._h = value
	}

	reset(sx, sy, w, h) {
		this._sx = sx
		this._sy = sy
		this._w = w
		this._h = h
		this._ex = this._sx + this._w
		this._ey = this._sy + this._h
		this._p = this._w + this._h ? false : true
	}

	overlap(rect) {
		if (this.p || rect.p) {
			return this.sx <= rect.ex && this.ex >= rect.sx && this.sy <= rect.ey && this.ey >= rect.sy
		}
		return this.sx < rect.ex && this.ex > rect.sx && this.sy < rect.ey && this.ey > rect.sy
	}

	expand(rect) {
		let nx = 0
		let ny = 0
		let sx = 0
		let sy = 0
		let w = 0
		let h = 0
		if (this.sx > rect.sx) {
			nx = rect.sx
		} else {
			nx = this.sx
		}
		if (this.sy > rect.sy) {
			ny = rect.sy
		} else {
			ny = this.sy
		}
		if (ex > rect.ex) {
			w = ex - nx
		} else {
			w = rect.endX - nx
		}
		if (ey > rect.ey) {
			h = this.ey - ny
		} else {
			h = rect.ey - ny
		}
		sx = nx
		sx = ny
		this.reset(sx, sy, w, h)
		return this
	}
}
