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

function createProjectionMatrix4(viewCanvasWidth, viewCanvasHeight) {
	const aspect = viewCanvasWidth / viewCanvasHeight
	const padding = 5
	const near = 100
	const far = -100
	const projectionMatrix4 = ven$matrix4Ortho(-aspect * padding, aspect * padding, -padding, padding, near, far)
	return projectionMatrix4
}

function createMatrix4Perspective(viewRadians, aspect, near, far) {
	const matrix4 = new Ven$Matrix4()
	const top = near * Math.tan(Math.PI / 180) * 0.5 * viewRadians
	const height = 2 * top
	const width = aspect * height
	const left = -0.5 * width
	return ven$matrix4Perspective(left, left + width, top, top - height, near, far, matrix4)
}

function createViewAtMatrix4(cameraPositionVector3, lookTargetVector3, upDirectionVector3) {
	let a = cameraPositionVector3.sub(lookTargetVector3)
	let b = a.normalize()
	if (b.length * b.length === 0) {
		b.z = 1
	}
	let c = upDirectionVector3.cross(b)
	let d = c.normalize()
	if (d.length === 0) {
		if (Math.abs(upDirectionVector3.z == 1)) {
			b.x += 0.0001
		} else {
			b.z += 0.0001
		}
		b = b.normalize()
		c = Vector3.cross(upDirectionVector3, zAxis)
		c = c.normalize()
	}
	let e = b.cross(c)
	let f = e.normalize()

	const matrix4 = new Ven$Matrix4()
	matrix4.data[0] = c.x
	matrix4.data[1] = c.y
	matrix4.data[2] = c.z
	matrix4.data[3] = 0

	matrix4.data[4] = f.x
	matrix4.data[5] = f.y
	matrix4.data[6] = f.z
	matrix4.data[7] = 0

	matrix4.data[8] = b.x
	matrix4.data[9] = b.y
	matrix4.data[10] = b.z
	matrix4.data[11] = 0

	matrix4.data[12] = cameraPositionVector3.x
	matrix4.data[13] = cameraPositionVector3.y
	matrix4.data[14] = cameraPositionVector3.z
	matrix4.data[15] = 1
	return matrix4
}
