/**
 * 矩阵乘法运算
 * 		当矩阵 A 的列数 (colLen) 于矩阵 B 的行数 (rowLen) 时相同时, A 与 B 可以相乘
 * 		矩阵 C 的行数等于矩阵 A 的行数, C 的列数等于 B 的列数
 * 		A =
 * 			1  2  3
 *    		4  5  6
 * 		B =
 * 			8  5
 * 			4  2
 * 			2  6
 * 		相乘得
 * 		C = A*B =
 * 			1 * 8 + 2 * 4 + 3 * 2 = 22    1 * 5 + 2 * 2 + 3 * 6 = 27
 * 			3 * 8 + 5 * 4 + 6 * 2 = 64    4 * 5 + 5 * 2 + 6 * 6 = 66
 */
/**
 * 计算矩阵 A 与矩阵 B 的乘积
 * 		mA - 矩阵 A 的行数
 * 		nA - 矩阵 A 的列数
 * 		mB - 矩阵 B 的行数
 * 		nB - 矩阵 B 的列数
 */
function ven$matrixMul(mA, nA, mB, nB, A, B) {
	if (nA !== mB) {
		throw new Error('does not satisfy the condition of matrix multiplication: nA === mB')
	}
	const result = new Array(mA * nB)
	let ri = 0
	let ai = 0
	/**
	 * 遍历矩阵 A 的行
	 */
	for (let riA = 0; riA < mA; riA++) {
		/**
		 * 遍历矩阵 B 的列
		 */
		for (let ciB = 0; ciB < nB; ciB++) {
			let bi = ciB
			let sum = 0
			/**
			 * 遍历矩阵 A 的列
			 */
			for (let ciA = 0; ciA < nA; ciA++) {
				sum += A[ai + ciA] * B[bi]
				bi += nB
			}
			result[ri++] = sum
		}
		ai += nA
	}
	return result
}

function ven$matrixOn(n, row, column) {
	return n * row + column
}

class Ven$Matrix {
	constructor(m, n, data) {
		/**
		 * 矩阵行数数值
		 */
		this._m = m
		/**
		 * 矩阵列数数值
		 */
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
		if (this.m === B.n) {
			const result = ven$matrixMul(this.m, this.n, B.m, B.n, this.data, B.data)
			return new Ven$Matrix(this.m, B.n, result)
		}
		throw new Error(`matrix mul error: this.m === B.n`)
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

	/**
	 * 以平铺模式生成矩阵字符串值
	 */
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

	/**
	 * 以格式化模式生成矩阵字符串值
	 */
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
