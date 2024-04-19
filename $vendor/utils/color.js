/**
 * @description 创建随机颜色
 * @function ven$randomColor
 * @return {object}
 */
function ven$randomColor() {
	return {
		r: Math.random() * 255,
		g: Math.random() * 255,
		b: Math.random() * 255,
		a: Math.random() * 1,
	}
}

/**
 * @description 创建指定范围内的随机颜色
 * @function ven$randomRangeColor
 * @return {object}
 */
function ven$randomRangeColor(r = [0, 255], g = [0, 255], b = [0, 255], a = [0, 1]) {
	r[0] = Math.max(0, r[0])
	r[1] = Math.min(255, r[1])
	g[0] = Math.max(0, g[0])
	g[1] = Math.min(255, g[1])
	b[0] = Math.max(0, b[0])
	b[1] = Math.min(255, b[1])
	a[0] = Math.max(0, a[0])
	a[1] = Math.min(1, a[1])
	const ri = Math.floor(Math.random() * (r[1] - r[0] + 1)) + r[0]
	const gi = Math.floor(Math.random() * (g[1] - g[0] + 1)) + g[0]
	const bi = Math.floor(Math.random() * (b[1] - b[0] + 1)) + b[0]
	const ai = Math.floor(Math.random() * (a[1] - a[0] + 1)) + a[0]
	return {
		r: ri,
		g: gi,
		b: bi,
		a: ai,
	}
}
