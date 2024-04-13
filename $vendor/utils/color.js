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
