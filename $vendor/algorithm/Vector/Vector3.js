const VEN$VECTOR3_ORIGIN_DATA = [0, 0, 0]

class Ven$Vector3 extends Ven$Vector {
	static ORIGIN = new Ven$Vector3()

	constructor(x = VEN$VECTOR3_ORIGIN_DATA[0], y = VEN$VECTOR3_ORIGIN_DATA[1], z = VEN$VECTOR3_ORIGIN_DATA[2]) {
		super()
		this._x = x
		this._y = y
		this._z = z
	}

	get x() {
		return this._x
	}
	set x(value) {
		this._x = value
	}

	get y() {
		return this._y
	}
	set y(value) {
		this._y = value
	}

	get z() {
		return this._z
	}
	set z(value) {
		this._z = value
	}

	/**
	 * 向量长度
	 */
	get length() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
	}

	/**
	 * 生层向量副本
	 */
	copy() {
		return new Ven$Vector3(this.x, this.y, this.z)
	}

	/**
	 * 向量相加
	 */
	add(v3) {
		this.x += v3.x
		this.y += v3.y
		this.z += v3.z
		return this
	}

	/**
	 * 向量与标量相加
	 */
	addScalar(x, y, z) {
		this.x += x
		this.y += y
		this.z += z
		return this
	}

	/**
	 * 向量与标量相减
	 */
	subScalar(x, y, z) {
		this.x -= x
		this.y -= y
		this.z -= z
		return this
	}

	/**
	 * 向量相减
	 */
	sub(v3) {
		this.x -= v3.x
		this.y -= v3.y
		this.z -= v3.z
		return this
	}

	/**
	 * 向量缩放
	 */
	scale(x = 0, y = 0, z = 0) {
		const _y = typeof y !== 'undefined' ? y : x
		const _z = typeof z !== 'undefined' ? z : y
		this.x *= x
		this.y *= _y
		this.z *= _z
		return this
	}

	toString() {
		return `Vector3 (${this.x}, ${this.y}, ${this.z})`
	}
}
