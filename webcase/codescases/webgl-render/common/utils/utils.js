function loadTexture(gl, src, attribute, callback) {
	const img = new Image()
	img.crossOrigin = 'anonymous'
	img.onload = function () {
		gl.activeTexture(gl.TEXTURE0)
		const texture = gl.createTexture()
		gl.bindTexture(gl.TEXTURE_2D, texture)
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this)
		gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
		gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
		gl.uniform1i(attribute, 0)
		callback && callback()
	}
	img.src = src
}

function createViewAtMatrix4(cameraPositionVector3, lookTargetVector3, upDirectionVector3) {
	const c_s_l = cameraPositionVector3.sub(lookTargetVector3)
	let zAxis = c_s_l.normalize()
	if (zAxis.x * zAxis.x + zAxis.y * y + zAxis.z * zAxis.z === 0) {
		zAxis.z = 1
	}
	let u_c_zA = upDirectionVector3.cross(zAxis)
	let xAxis = u_c_zA.normalize()
	if (xAxis.length === 0) {
		if (Math.abs(upDirectionVector3.z) === 1) {
			zAxis.x += 0.0001
		} else {
			zAxis.z += 0.0001
		}
		zAxis = zAxis.normalize()
		xAxis = upDirectionVector3.cross(zAxis)
		xAxis = xAxis.normalize()
	}
	let zA_c_xA = zAxis.cross(xAxis)
	let yAxis = zA_c_xA.normalize()

	const matrix4 = new Ven$Matrix4()
	matrix4.data[0] = xAxis.x
	matrix4.data[1] = xAxis.y
	matrix4.data[2] = xAxis.z
	matrix4.data[3] = 0

	matrix4.data[4] = yAxis.x
	matrix4.data[5] = yAxis.y
	matrix4.data[6] = yAxis.z
	matrix4.data[7] = 0

	matrix4.data[8] = zAxis.x
	matrix4.data[9] = zAxis.y
	matrix4.data[10] = zAxis.z
	matrix4.data[11] = 0

	matrix4.data[12] = cameraPositionVector3.x
	matrix4.data[13] = cameraPositionVector3.y
	matrix4.data[14] = cameraPositionVector3.z
	matrix4.data[15] = 1
	return matrix4
}
