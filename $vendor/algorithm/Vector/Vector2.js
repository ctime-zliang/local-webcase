const VEN$VECTOR2_ORIGIN_DATA = [0, 0]

class Ven$Vector2 extends Ven$Vector {
	static ORIGIN = new Ven$Vector2()

	constructor(x = VEN$VECTOR2_ORIGIN_DATA[0], y = VEN$VECTOR2_ORIGIN_DATA[1]) {
		super()
		this._x = x
		this._y = y
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

	/**
	 * 向量长度
	 */
	get length() {
		return Math.hypot(this.x, this.y)
	}

	/**
	 * 向量弧度方向
	 */
	get dir() {
		return Math.atan2(this.y, this.x)
	}

	/**
	 * 向量角度方向
	 */
	get dirDeg() {
		return Math.atan2(this.y, this.x) * (180 / Math.PI)
	}

	/**
	 * 生层向量副本
	 */
	copy() {
		return new Ven$Vector2(this.x, this.y)
	}

	/**
	 * 向量相加
	 */
	add(v2) {
		this.x += v2.x
		this.y += v2.y
		return this
	}

	/**
	 * 向量与标量相加
	 */
	addScalar(x, y) {
		this.x += x
		this.y += y
		return this
	}

	/**
	 * 向量与标量相减
	 */
	subScalar(x, y) {
		this.x -= x
		this.y -= y
		return this
	}

	/**
	 * 向量相减
	 */
	sub(v2) {
		this.x -= v2.x
		this.y -= v2.y
		return this
	}

	/**
	 * 向量缩放
	 */
	scale(x = 0, y = 0) {
		const _y = typeof y !== 'undefined' ? y : x
		this.x *= x
		this.y *= _y
		return this
	}

	/**
	 * 向量叉乘乘积 - 数值结果
	 */
	cross(v2) {
		return this.x * v2.y - v2.x * this.y
	}

	/**
	 * 向量点乘乘积 - 数值结果
	 */
	dot(v) {
		return this.x * v.x + v.y * this.y
	}

	/**
	 * 向量与标量的乘积
	 */
	mul(x = 0, y = 0) {
		return this.scale(x, y)
	}

	/**
	 * 向量 sin 值
	 */
	getSin() {
		return this.y / this.length
	}

	/**
	 * 向量 cos 值
	 */
	getCos() {
		return this.x / this.length
	}

	/**
	 * 向量旋转 - 绕起点旋转 rad(弧度) 后的结果向量
	 *
	 * 		将向量 v0(x0, y0) 旋转 θ 角度后
	 * 			x = x0 * cos(θ) - y0 * sin(θ)
	 * 			y = x0 * sin(θ) + x0 * cos(θ)
	 */
	rotate(rad) {
		const c = Math.cos(rad)
		const s = Math.sin(rad)
		const [x, y] = [this.x, this.y]
		this.x = x * c + y * -s
		this.y = x * s + y * c
		return this
	}

	/**
	 * 向量旋转 - 绕定点旋转 rad(弧度) 后的结果向量
	 */
	rotateSurround(c2, rad) {
		const cos = Math.cos(rad)
		const sin = Math.sin(rad)
		const dx = this.x - c2.x
		const dy = this.y - c2.y
		this.x = dx * cos + dy * -sin
		this.y = dx * sin + dy * cos
		return this
	}

	/**
	 * 向量关于 origin 的中心对称向量
	 */
	mirrorSurround(o2 = Vector2.ORIGIN) {
		this.x = 2 * o2.x - this.x
		this.y = 2 * o2.y - this.y
		return this
	}

	toString() {
		return `Vector2 (${this.x}, ${this.y})`
	}

	/**
	 * 向量与向量 v 的距离
	 */
	distance(v2) {
		const deltaX = v2.x - this._x
		const deltaY = v2.y - this._y
		return ven$getVectorHypot(deltaX, deltaY)
	}

	/**
	 * 向量的单位向量
	 */
	normalize() {
		if (this.x === 0 && this.y === 0) {
			return new Ven$Vector2(0, 0)
		}
		const sx = this.x / this.length
		const sy = this.y / this.length
		return new Ven$Vector2(sx, sy)
	}

	equalsVector2ForHighPrecision(vector2, places = 0.5) {
		return Math.abs(vector2.x, this.x) <= 1e-8 && Math.abs(vector2.y, this.y) <= 1e-8
	}
}
