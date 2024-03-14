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
