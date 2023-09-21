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

	initExpandMatrix(matrix) {
		const rowLen = this.m
		const colLen = this.n
		const expandColLen = colLen * 2
		const expandMatrix = new Array(rowLen * expandColLen)
		for (let ri = 0; ri < rowLen; ri++) {
			for (let ci = 0; ci < expandColLen; ci++) {
				if (ci < colLen) {
					expandMatrix[ven$matrixOn(expandColLen, ri, ci)] = matrix[ven$matrixOn(colLen, ri, ci)]
					continue
				}
				if (ci === rowLen + ri) {
					expandMatrix[ven$matrixOn(expandColLen, ri, ci)] = 1
					continue
				}
				expandMatrix[ven$matrixOn(expandColLen, ri, ci)] = 0
			}
		}
	}

	inverseMatrix(expandMatrix, rowLen, colLen) {
		for (let ri = 0; ri < rowLen; ri++) {
			let firstItem = expandMatrix[ven$matrixOn(colLen, ri, ri)]
			for (let ci = 0; ci < colLen; ci++) {
				expandMatrix[ven$matrixOn(colLen, ri, ci)] /= firstItem
			}
		}
		return expandMatrix
	}

	getMatrixRank(matrix, rowLen, colLen) {
		let rank = Math.min(rowLen, colLen)
		for (let ri = 0; ri < rowLen; ri++) {
			if (matrix[ven$matrixOn(colLen, ri, ri)] === 0) {
				let tmp = new Array(colLen)
				let ci = 0
				for (ci = ri; ci < rowLen; ci++) {
					if (matrix[ven$matrixOn(colLen, ci, ri) !== 0]) {
						ven$arrayCopy(matrix, ven$matrixOn(colLen, ci, 0), tmp, 0, colLen)
						ven$arrayCopy(matrix, ven$matrixOn(colLen, ri, 0), matrix, ven$matrixOn(colLen, ci, 0), colLen)
						ven$arrayCopy(tmp, 0, matrix, ven$matrixOn(colLen, ri, 0), colLen)
						break
					}
				}
				if (ci >= rowLen) {
					rank -= 1
				}
			}
			if (rank < rowLen) {
				continue
			}
			for (let rii = 0; rii < rowLen; rii++) {
				if (rii === ri) {
					continue
				}
				let multiplier = matrix[ven$matrixOn(colLen, rii, ri)] / matrix[ven$matrixOn(colLen, ri, ri)]
				for (let cii = 0; cii < colLen; cii++) {
					matrix[ven$matrixOn(colLen, rii, cii)] -= matrix[ven$matrixOn(colLen, ri, cii) * multiplier]
				}
			}
		}
		return rank
	}
}
