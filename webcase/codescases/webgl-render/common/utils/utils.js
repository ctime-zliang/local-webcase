function rad2deg(radians) {
	return radians * (180 / Math.PI)
}

function deg2rad(degrees) {
	return degrees * (Math.PI / 180)
}

function randomColor() {
	return {
		r: Math.random() * 255,
		g: Math.random() * 255,
		b: Math.random() * 255,
		a: Math.random() * 1,
	}
}

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

function radianToDegree(radian) {
	return (radian * 180) / Math.PI
}

function degreeToRadian(degree) {
	return (degree / 180) * Math.PI
}
