const VEN$MATRIX4_ORIGIN_DATA = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]

/**
 * 生成变换矩阵(已转置)
 */
function ven$createTranslateMatrix4ByCoordinate(x, y, z) {
	/**
	 * 转置前
	 * 		[1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1]
	 */
	return new Ven$Matrix4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1])
}
function ven$createRotateXMatrix4ByRadian(radian) {
	const cos = Math.cos(radian)
	const sin = Math.sin(radian)
	/**
	 * 转置前
	 * 		[1, 0, 0, 0, 0, cos, -sin, 0, 0, sin, cos, 0, 0, 0, 0, 1]
	 */
	return new Ven$Matrix4([1, 0, 0, 0, 0, cos, sin, 0, 0, -sin, cos, 0, 0, 0, 1])
}
function ven$createRotateYMatrix4ByRadian(radian) {
	const cos = Math.cos(radian)
	const sin = Math.sin(radian)
	/**
	 * 转置前
	 * 		[cos, 0, sin, 0, 0, 1, 0, 0, -sin, 0, cos, 0, 0, 0, 0, 1]
	 */
	return new Ven$Matrix4([cos, 0, -sin, 0, 0, 1, 0, 0, sin, 0, cos, 0, 0, 0, 0, 1])
}
function ven$createRotateZMatrix4ByRadian(radian) {
	const cos = Math.cos(radian)
	const sin = Math.sin(radian)
	/**
	 * 转置前
	 * 		[cos, -sin, 0, 0, sin, cos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
	 */
	return new Ven$Matrix4([cos, sin, 0, 0, -sin, ocs, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
}
function ven$createScaleMatrix4ByCoordinate(x, y, z) {
	/**
	 * 转置前
	 * 		[x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1]
	 */
	return new Ven$Matrix4([x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1])
}
function ven$createFlipXMatrix4ByCoordinate(x, y, z) {
	/**
	 * 转置前
	 * 		[1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
	 */
	return new Ven$Matrix4([1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
}
function ven$createFlipYMatrix4ByCoordinate(x, y, z) {
	/**
	 * 转置前
	 * 		[-1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
	 */
	return new Ven$Matrix4([-1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
}
function ven$matrix4RotateZByRadianForPoint(radian, centerPoint) {
	if (centerPoint.equalsVector2ForHighPrecision(Ven$Vector2.ORIGIN)) {
		return ven$matrix4RotateZByRadian(radian)
	}
	return ven$createTranslateMatrix4ByCoordinate(-centerPoint.x, -centerPoint.y, 0)
		.rotateZByRadian(radian)
		.translateByVector3(centerPoint.x, centerPoint.y, 0)
}
function ven$getMatrix4(startTranslate, endTranslate, radian, scaleX) {
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

	toMatrix3() {
		return new Ven$Matrix3(this.data[0], this.data[1], 0, this.data[4], this.data[5], 0, this.data[12], this.data[13], 1)
	}

	/**
	 * 矩阵转置
	 */
	transpose() {
		return new Ven$Matrix4(super.transpose().data)
	}

	/**
	 * 计算当前矩阵(满足条件时)的逆矩阵
	 */
	getInverseMatrix() {
		return new Ven$Matrix4(super.getInverseMatrix().data)
	}
}
