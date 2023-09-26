function main1() {
	const matrix_1 = new Ven$Matrix3()
	const matrix_2 = new Ven$Matrix4()
	showMatrix(APP_CONTAINER_1, matrix_1.data, matrix_1.m, matrix_1.n)
	showMatrix(APP_CONTAINER_1, matrix_2.data, matrix_2.m, matrix_2.n)

	const matrix3_1 = new Ven$Matrix3([3, 5, 4, 2, 7, 6, 1, 9, 8])
	showMatrix(APP_CONTAINER_1, matrix3_1.data, matrix3_1.m, matrix3_1.n)
	console.log(`矩阵 \n${matrix3_1.toStringFormat()} \n旋转 45 角度: `, matrix3_1.rorateByDegree(45).toStringFormat())
	console.log(`矩阵 \n${matrix3_1.toStringFormat()} \n旋转 90 角度: `, matrix3_1.rorateByDegree(90).toStringFormat())
}

function main2() {
	console.log(`\n\n`)
	const matrix_1 = new Ven$Matrix(2, 3, [1, 2, 3, 4, 5, 6])
	const matrix_2 = new Ven$Matrix(3, 2, [8, 5, 4, 2, 2, 6])
	const matrix_2_1 = matrix_1.multiply(matrix_2)
	showMatrix(APP_CONTAINER_2, matrix_1.data, matrix_1.m, matrix_1.n)
	showMatrix(APP_CONTAINER_2, matrix_2.data, matrix_2.m, matrix_2.n)
	showMatrix(APP_CONTAINER_2, matrix_2_1.data, matrix_2_1.m, matrix_2_1.n)
	console.log(`矩阵 \n${matrix_2.toStringFormat()} \n的秩: `, matrix_2.getMatrixRank())

	const matrix_3 = new Ven$Matrix(2, 2, [8, 5, 4, 2])
	console.log(`矩阵 \n${matrix_3.toStringFormat()} \n的逆矩阵: `, matrix_3.getInverseMatrix().toStringFormat())
}

main1()
main2()
