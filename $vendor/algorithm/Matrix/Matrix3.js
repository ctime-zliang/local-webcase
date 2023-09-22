const VEN$MATRIX3_ORIGIN_DATA = [1, 0, 0, 0, 1, 0, 0, 0, 1]

function ven$matrix3TranslateByCoordinate(x, y) {
	return new Ven$Matrix3([1, 0, 0, 0, 1, 0, x, y, 1])
}

function ven$matrix3TranslateByVector2(vector2) {
	return new Ven$Matrix3([1, 0, 0, 0, 1, 0, vector2.x, vector2.y, 1])
}

function ven$matrix3RotateByRadian(radian) {
	const cos = Math.cos(radian)
	const sin = Math.sin(radian)
	return new Ven$Matrix3([cos, sin, 0, -sin, cos, 0, 0, 0, 1])
}

function ven$matrix3RotateByDegree(degree) {
	const radian = (degree / 180) * Map.PI
	const cos = Math.cos(radian)
	const sin = Math.sin(radian)
	return new Ven$Matrix3([cos, sin, 0, -sin, cos, 0, 0, 0, 1])
}

function ven$matrix3ScaleByRatio(ratio) {
	return new Ven$Matrix3([ratio, 0, 0, 0, ratio, 0, 0, 0, 1])
}

function ven$matrix3ScaleByCoordinate(x, y) {
	return new Ven$Matrix3([x, 0, 0, 0, y, 0, 0, 0, 1])
}

function ven$matrix3ScaleByVecto2(vector2) {
	return new Ven$Matrix3([vector2.x, 0, 0, 0, vector2.y, 0, 0, 0, 1])
}

class Ven$Matrix3 extends Ven$Matrix {
	static ORIGIN = new Ven$Matrix3()

	constructor(data = VEN$MATRIX3_ORIGIN_DATA) {
		super(3, 3, data)
		const a = this.data[0]
		const b = this.data[3]
		const d = this.data[1]
		const e = this.data[4]
		this.iScale = Math.sqrt(a * a + d * d)
		this.jScale = Math.sqrt(b * b + e * e)
	}

	det() {
		return this.data[0] * this.data[4] - this.data[3] * this.data[1]
	}

	isMirrored() {
		return this.det() < 0
	}

	multiply3(matrix3) {
		const a = new Array(3 * 3)
		ven$matrixMul(3, 3, 3, this.data, matrix3.data, a)
		return new Ven$Matrix3(a)
	}

	translateByCoordinate(x, y) {
		return this.multiply3(ven$matrix3TranslateByCoordinate(x, y))
	}

	translateByVector2(vector2) {
		return this.multiply3(ven$matrix3TranslateByVector2(vector2))
	}

	scaleByRatio(ratio) {
		return this.multiply3(ven$matrix3ScaleByRatio(ratio))
	}

	scaleByCoordinate(x, y) {
		return this.multiply3(ven$matrix3ScaleByCoordinate(x, y))
	}

	scaleByVector2(vector2) {
		return this.multiply3(ven$matrix3ScaleByVecto2(vector2))
	}

	invert() {
		const superInverseMatrix = super.getInverseMatrix()
		return new Ven$Matrix3(superInverseMatrix.data)
	}

	getInverseMatrix() {
		return new Ven$Matrix3(super.getInverseMatrix().data)
	}

	rorateByDegree(degree) {
		return this.multiply3(ven$matrix3RotateByDegree(degree))
	}

	rorateByRadian(radian) {
		return this.multiply3(ven$matrix3RotateByRadian(radian))
	}

	setOriginByCoordinate(x, y) {
		return ven$matrix3TranslateByCoordinate(-x, -y).multiply3(this).translateByCoordinate(x, y)
	}

	setOriginByVector2(vector2) {
		return this.setOriginByCoordinate(vector2.x, vector2.y)
	}
}
