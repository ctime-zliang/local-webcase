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
