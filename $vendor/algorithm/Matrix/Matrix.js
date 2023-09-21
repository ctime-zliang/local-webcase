function ven$matrixMul(m, n, p, A, B) {
	const result = []
	let ri = 0
	let ai = 0
	for (let am = 0; am < m; am++) {
		for (let bp = 0; bp < p; bp++) {
			let bi = bp
			let sum = 0
			for (let k = 0; k < n; k++) {
				sum += A[ai + k] * B[bi]
				bi += p
			}
			result[ri++] = sum
		}
		ai += n
	}
	return result
}

function ven$matrixOn(n, row, column) {
	return n * row + column
}

class Ven$Matrix {
	constructor(m, n, data) {
		this._m = m
		this._n = n
		const cnt = this._m * this._n
		this._data = data
	}

	get m() {
		return this._m
	}

	get n() {
		return this._n
	}

	get data() {
		return this._data
	}

	mul(B) {
		if (this.n === B.m) {
			const result = ven$matrixMul(this.m, this.n, B.n, this.data, B.data)
			return new Ven$Matrix(this.m, B.n, result)
		}
		throw new Error(`matrix mul error: m !== p`)
	}
}
