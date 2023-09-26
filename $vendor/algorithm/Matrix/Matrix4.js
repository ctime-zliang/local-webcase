const VEN$MATRIX4_ORIGIN_DATA = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]

function ven$matrix4TranslateByCoordinate(x, y, z) {
	return new Ven$Matrix4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1])
}

function ven$matrix4TranslateByVector3(vector3) {
	return new Ven$Matrix4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, vector3.x, vector3.y, vector3.z, 1])
}

function ven$matrix4RotateXByRadian(radian) {
	const cos = Math.cos(radian)
	const sin = Math.sin(radian)
	return new Ven$Matrix4([1, 0, 0, 0, 0, cos, sin, 0, 0, -sin, cos, 0, 0, 0, 0, 1])
}

function ven$matrix4RotateYByRadian(radian) {
	const cos = Math.cos(radian)
	const sin = Math.sin(radian)
	return new Ven$Matrix4([cos, 0, -sin, 0, 0, 1, 0, 0, sin, 0, cos, 0, 0, 0, 0, 1])
}

function ven$matrix4RotateZByRadian(radian) {
	const cos = Math.cos(radian)
	const sin = Math.sin(radian)
	return new Ven$Matrix4([cos, sin, 0, 0, -sin, cos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
}

function ven$matrix4ScaleByCoordinate(x, y, z) {
	return new Ven$Matrix4(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1)
}

function ven$matrix4ScaleByVector3(vector3) {
	return new Ven$Matrix4(vector3.x, 0, 0, 0, 0, vector3.y, 0, 0, 0, 0, vector3.z, 0, 0, 0, 0, 1)
}

function ven$matrix4FlipX() {
	return new Ven$Matrix4([1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
}

function ven$matrix4FlipY() {
	return new Ven$Matrix4([-1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
}

function ven$matrix4RotateZByRadianForPoint(radian, centerPoint) {
	if (centerPoint.equalsVector2ForHighPrecision(Ven$Vector2.ORIGIN)) {
		return ven$matrix4RotateZByRadian(radian)
	}
	return ven$matrix4TranslateByCoordinate(-centerPoint.x, -centerPoint.y, 0)
		.rotateZByRadian(radian)
		.translateByVector3(centerPoint.x, centerPoint.y, 0)
}

function ven$getMatrix3(startTranslate, endTranslate, radian, scaleX) {
	const cos = Math.cos(radian)
	const sin = Math.sin(radian)
	const x = scaleX * (startTranslate.x * cos - startTranslate.y * sin) + endTranslate.x
	const y = startTranslate.x * sin + startTranslate.y * cos + endTranslate.y
	const data = [scaleX * cos, sin, 0, 0, -sin * scaleX, cos, 0, 0, 0, 0, 1, 0, x, y, 0, 1]
	return new Ven$Matrix4(data)
}

class Ven$Matrix4 extends Ven$Matrix {
	static ORIGIN = new Ven$Matrix4()

	constructor(data = VEN$MATRIX4_ORIGIN_DATA) {
		super(4, 4, data)
	}

	multiply4(matrix4) {
		return new Ven$Matrix4(ven$matrixMul(4, 4, 4, 4, this.data, matrix4.data))
	}

	translateByCoordinate(x, y, z) {
		return this.multiply3(ven$matrix4TranslateByCoordinate(x, y, z))
	}

	translateByVector3(vector3) {
		return this.multiply4(ven$matrix4TranslateByVector3(vector3))
	}

	rotateXByRadian(radian) {
		return this.multiply4(ven$matrix4RotateXByRadian(radian))
	}

	rotateYByRadian(radian) {
		return this.multiply4(ven$matrix4RotateYByRadian(radian))
	}

	rotateZByRadian(radian) {
		return this.multiply4(ven$matrix4RotateZByRadian(radian))
	}

	scaleByCoordinate(x, y, z) {
		return this.multiply4(ven$matrix4ScaleByCoordinate(x, y, z))
	}

	scaleByVector3(vector3) {
		return this.multiply4(ven$matrix4ScaleByVector3(vector3))
	}

	setOriginByCoordinate(x, y, z) {
		return ven$matrix4TranslateByCoordinate(-x, -y, -z).multiply4(this).translateByCoordinate(x, y, z)
	}

	setOriginByVector3(vector3) {
		return this.setOriginByCoordinate(vector3.x, vector3.y, vector3.z)
	}

	invert() {
		const superInverseMatrix = super.getInverseMatrix()
		return new Ven$Matrix4(superInverseMatrix.data)
	}

	toMatrix3() {
		return new Ven$Matrix3(this.data[0], this.data[1], 0, this.data[4], this.data[5], 0, this.data[12], this.data[13], 1)
	}
}
