function main1() {
	const matrix = new Ven$Matrix(4, 4, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
	console.log(matrix)

	showMatrix(APP_CONTAINER, matrix.data, matrix.m, matrix.n)
	console.log(matrix.toStringFormat())
	console.log(matrix.toString())
}

function main2() {
	const matrix_1 = new Ven$Matrix(2, 3, [1, 2, 3, 4, 5, 6])
	const matrix_2 = new Ven$Matrix(3, 2, [8, 5, 4, 2, 2, 6])
	showMatrix(APP_CONTAINER, matrix_1.data, matrix_1.m, matrix_1.n)
	showMatrix(APP_CONTAINER, matrix_2.data, matrix_2.m, matrix_2.n)
	const matrix_3 = matrix_1.mul(matrix_2)
	showMatrix(APP_CONTAINER, matrix_3.data, matrix_3.m, matrix_3.n)
}

// main1()
main2()
