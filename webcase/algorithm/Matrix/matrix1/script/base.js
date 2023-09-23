function main() {
	const matrix = new Ven$Matrix(4, 4, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
	console.log(matrix)

	showMatrix(document.getElementById('appContainer'), matrix.data, matrix.m, matrix.n)
	console.log(matrix.getInverseMatrix())
}

main()
