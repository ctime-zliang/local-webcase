function ven$getVectorHypot(deltaX, deltaY) {
	let xs = Math.abs(deltaX)
	let ys = Math.abs(deltaY)
	if (ys > xs) {
		const swap = ys
		ys = xs
		xs = swap
	}
	if (xs === 0) {
		return ys
	}
	const t = ys / xs
	return xs * Math.sqrt(1 + t * t)
}

class Ven$Vector {
	constructor() {
		/* ... */
	}
}
