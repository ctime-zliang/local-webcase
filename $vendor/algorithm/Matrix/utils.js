/**
 * @description 创建相机透视矩阵
 * @function ven$matrix4Ortho
 * @param {number} left 左侧边界
 * @param {number} right 右侧边界
 * @param {number} bottom 底部边界
 * @param {number} top 顶部边界
 * @param {number} near 可视范围纵深范围近端位置
 * @param {number} far 可视范围纵深范围远端位置
 * @return {Ven$Matrix4}
 */
function ven$matrix4Ortho(left, right, bottom, top, near, far) {
	const matrix4 = new Ven$Matrix4()
	matrix4.data[0] = 2 / (right - left)
	matrix4.data[1] = 0
	matrix4.data[2] = 0
	matrix4.data[3] = 0

	matrix4.data[4] = 0
	matrix4.data[5] = 2 / (top - bottom)
	matrix4.data[6] = 0
	matrix4.data[7] = 0

	matrix4.data[8] = 0
	matrix4.data[9] = 0
	matrix4.data[10] = 2 / (near - far)
	matrix4.data[11] = 0

	matrix4.data[12] = (left + right) / (left - right)
	matrix4.data[13] = (bottom + top) / (bottom - top)
	matrix4.data[14] = (near + far) / (near - far)
	matrix4.data[15] = 1
	return matrix4
}

/**
 * @description 创建相机透视矩阵
 * @function ven$matrix4Ortho
 * @param {number} left 左侧边界
 * @param {number} right 右侧边界
 * @param {number} bottom 底部边界
 * @param {number} top 顶部边界
 * @param {number} near 可视范围纵深范围近端位置
 * @param {number} far 可视范围纵深范围远端位置
 * @return {Ven$Matrix4}
 */
function ven$matrix4Perspective(left, right, top, bottom, near, far) {
	const matrix4 = new Ven$Matrix4()
	matrix4.data[0] = (2 * near) / (right - left)
	matrix4.data[1] = 0
	matrix4.data[2] = 0
	matrix4.data[3] = 0

	matrix4.data[4] = 0
	matrix4.data[5] = (2 * near) / (top - bottom)
	matrix4.data[6] = 0
	matrix4.data[7] = 0

	matrix4.data[8] = (right + left) / (right - left)
	matrix4.data[9] = (top + bottom) / (top - bottom)
	matrix4.data[10] = -(far + near) / (far - near)
	matrix4.data[11] = -1

	matrix4.data[12] = 0
	matrix4.data[13] = 0
	matrix4.data[14] = (-2 * far * near) / (far - near)
	matrix4.data[15] = 0
	return matrix4
}

/**
 * @description 创建绕轴旋转矩阵
 * @function ven$matrix4Rotate(*)
 * @param {Ven$Matrix4} ref 参考矩阵
 * @param {number} angle 旋转角度
 * @return {Ven$Matrix4}
 */
function ven$matrix4RotateX(ref, angle) {
	const matrix4 = new Ven$Matrix4()
	const m10 = ref.data[4]
	const m11 = ref.data[5]
	const m12 = ref.data[6]
	const m13 = ref.data[7]
	const m20 = ref.data[8]
	const m21 = ref.data[9]
	const m22 = ref.data[10]
	const m23 = ref.data[11]
	const cos = Math.cos(angle)
	const sin = Math.sin(angle)

	matrix4.data[4] = cos * m10 + sin * m20
	matrix4.data[5] = cos * m11 + sin * m21
	matrix4.data[6] = cos * m12 + sin * m22
	matrix4.data[7] = cos * m13 + sin * m23
	matrix4.data[8] = cos * m20 - sin * m10
	matrix4.data[9] = cos * m21 - sin * m11
	matrix4.data[10] = cos * m22 - sin * m12
	matrix4.data[11] = cos * m23 - sin * m13

	matrix4.data[0] = ref.data[0]
	matrix4.data[1] = ref.data[1]
	matrix4.data[2] = ref.data[2]
	matrix4.data[3] = ref.data[3]
	matrix4.data[12] = ref.data[12]
	matrix4.data[13] = ref.data[13]
	matrix4.data[14] = ref.data[14]
	matrix4.data[15] = ref.data[15]
	return matrix4
}
/**
 * @description 创建绕轴旋转矩阵
 * @function ven$matrix4Rotate(*)
 * @param {Ven$Matrix4} ref 参考矩阵
 * @param {number} angle 旋转角度
 * @return {Ven$Matrix4}
 */
function ven$matrix4RotateY(ref, angle) {
	const matrix4 = new Ven$Matrix4()
	const m00 = ref.data[0]
	const m01 = ref.data[1]
	const m02 = ref.data[2]
	const m03 = ref.data[3]
	const m20 = ref.data[8]
	const m21 = ref.data[9]
	const m22 = ref.data[10]
	const m23 = ref.data[11]
	const cos = Math.cos(angle)
	const sin = Math.sin(angle)

	matrix4.data[0] = cos * m00 - sin * m20
	matrix4.data[1] = cos * m01 - sin * m21
	matrix4.data[2] = cos * m02 - sin * m22
	matrix4.data[3] = cos * m03 - sin * m23
	matrix4.data[8] = cos * m20 + sin * m00
	matrix4.data[9] = cos * m21 + sin * m01
	matrix4.data[10] = cos * m22 + sin * m02
	matrix4.data[11] = cos * m23 + sin * m03

	matrix4.data[4] = ref.data[4]
	matrix4.data[5] = ref.data[5]
	matrix4.data[6] = ref.data[6]
	matrix4.data[7] = ref.data[7]
	matrix4.data[12] = ref.data[12]
	matrix4.data[13] = ref.data[13]
	matrix4.data[14] = ref.data[14]
	matrix4.data[15] = ref.data[15]
	return matrix4
}
/**
 * @description 创建绕轴旋转矩阵
 * @function ven$matrix4Rotate(*)
 * @param {Ven$Matrix4} ref 参考矩阵
 * @param {number} angle 旋转角度
 * @return {Ven$Matrix4}
 */
function ven$matrix4RotateZ(ref, angle) {
	const matrix4 = new Ven$Matrix4()
	const m00 = ref.data[0]
	const m01 = ref.data[1]
	const m02 = ref.data[2]
	const m03 = ref.data[3]
	const m10 = ref.data[4]
	const m11 = ref.data[5]
	const m12 = ref.data[6]
	const m13 = ref.data[7]
	const cos = Math.cos(angle)
	const sin = Math.sin(angle)

	matrix4.data[0] = cos * m00 + sin * m10
	matrix4.data[1] = cos * m01 + sin * m11
	matrix4.data[2] = cos * m02 + sin * m12
	matrix4.data[3] = cos * m03 + sin * m13
	matrix4.data[4] = cos * m10 - sin * m00
	matrix4.data[5] = cos * m11 - sin * m01
	matrix4.data[6] = cos * m12 - sin * m02
	matrix4.data[7] = cos * m13 - sin * m03

	matrix4.data[8] = ref.data[8]
	matrix4.data[9] = ref.data[9]
	matrix4.data[10] = ref.data[10]
	matrix4.data[11] = ref.data[11]
	matrix4.data[12] = ref.data[12]
	matrix4.data[13] = ref.data[13]
	matrix4.data[14] = ref.data[14]
	matrix4.data[15] = ref.data[15]
	return matrix4
}
