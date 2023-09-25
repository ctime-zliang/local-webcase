function ven$matrixMul(m, n, p, A, B) {
	const result = new Array(m * n)
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

	getMatrixRank(matrixArr, rowLen, colLen) {
		const copyMatrixArr = matrixArr.slice(0)
		let rank = Math.min(rowLen, colLen)
		for (let ri = 0; ri < rowLen; ri++) {
			if (copyMatrixArr[ven$matrixOn(colLen, ri, ri)] === 0) {
				let tmp = new Array(colLen)
				let ci = 0
				for (ci = ri; ci < rowLen; ci++) {
					if (copyMatrixArr[ven$matrixOn(colLen, ci, ri)] !== 0) {
						ven$arrayCopy(copyMatrixArr, ven$matrixOn(colLen, ci, 0), tmp, 0, colLen)
						ven$arrayCopy(copyMatrixArr, ven$matrixOn(colLen, ri, 0), copyMatrixArr, ven$matrixOn(colLen, ci, 0), colLen)
						ven$arrayCopy(tmp, 0, copyMatrixArr, ven$matrixOn(colLen, ri, 0), colLen)
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
				let multiplier = copyMatrixArr[ven$matrixOn(colLen, rii, ri)] / copyMatrixArr[ven$matrixOn(colLen, ri, ri)]
				for (let cii = 0; cii < colLen; cii++) {
					copyMatrixArr[ven$matrixOn(colLen, rii, cii)] -= copyMatrixArr[ven$matrixOn(colLen, ri, cii)] * multiplier
				}
			}
		}
		return rank
	}

	getInverseMatrix() {
		const matrix = this.data.slice(0)
		if (this.m !== this.n) {
			throw new Error(`this.m !== this.n`)
		}
		const expandColLen = this.n * 2
		const newMatrixArr = new Array(this.m * this.n).fill(0)
		let expandMatrixArr = this._initExpandMatrix(matrix)
		const rank = this.getMatrixRank(expandMatrixArr, this.m, expandColLen)
		if (rank !== this.m) {
			throw new Error(`rank !== this.m`)
		}
		expandMatrixArr = this._inverseMatrix(expandMatrixArr, this.m, expandColLen)
		for (let ri = 0; ri < this.m; ri++) {
			for (let ci = this.n; ci < expandColLen; ci++) {
				newMatrixArr[ven$matrixOn(this.n, ri, ci - this.n)] = expandMatrixArr[ven$matrixOn(expandColLen, ri, ci)]
			}
		}
		return new Ven$Matrix(this.m, this.n, newMatrixArr.slice(0))
	}

	hashCode() {
		let sum = 0
		for (let num of this.data) {
			sum += num
		}
		return sum
	}

	toString() {
		let b = []
		b.push(`Matrix (`)
		for (let i = 0; i < this.data.length; i++) {
			b.push(String(this.data[i]))
			if (i >= this.data.length - 1) {
				continue
			}
			b.push(', ')
		}
		b.push(`)`)
		return b.join('')
	}

	toStringFormat() {
		let b = []
		b.push(`Matrix (`)
		b.push(String(this.m))
		b.push(` x `)
		b.push(String(this.n))
		b.push(`)`)
		let idx = 0
		for (let i = 0; i < this.m; i++) {
			for (let j = 0; j < this.n; j++) {
				let d = String(this.data[idx++])
				if (j === 0) {
					b.push(`\n`)
					b.push(`\t`)
					b.push(d)
					continue
				}
				b.push(', ')
				b.push(d)
			}
		}
		return b.join('')
	}

	_initExpandMatrix(matrixArr) {
		const rowLen = this.m
		const colLen = this.n
		const expandColLen = this.n * 2
		const expandMatrixArr = new Array(rowLen * expandColLen)
		for (let ri = 0; ri < rowLen; ri++) {
			for (let ci = 0; ci < expandColLen; ci++) {
				if (ci < colLen) {
					expandMatrixArr[ven$matrixOn(expandColLen, ri, ci)] = matrixArr[ven$matrixOn(colLen, ri, ci)]
					continue
				}
				if (ci === rowLen + ri) {
					expandMatrixArr[ven$matrixOn(expandColLen, ri, ci)] = 1
					continue
				}
				expandMatrixArr[ven$matrixOn(expandColLen, ri, ci)] = 0
			}
		}
		return expandMatrixArr
	}

	_inverseMatrix(expandMatrixArr, rowLen, colLen) {
		const copyExpandMatrixArr = expandMatrixArr.slice(0)
		for (let ri = 0; ri < rowLen; ri++) {
			let firstItem = copyExpandMatrixArr[ven$matrixOn(colLen, ri, ri)]
			for (let ci = 0; ci < colLen; ci++) {
				copyExpandMatrixArr[ven$matrixOn(colLen, ri, ci)] /= firstItem
			}
		}
		return copyExpandMatrixArr
	}
}
