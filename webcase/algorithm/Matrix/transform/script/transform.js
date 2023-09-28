function main1() {
	console.log(`%c=> 对单个坐标点使用矩阵变换`, 'color: #ff0000;')
	const pointMatrix = new Ven$Matrix(1, 3, [5, 6, 1])
	console.log(`初始坐标矩阵 A: `, pointMatrix.toStringFormat())

	const tranlateCoordinateMatrix = ven$createTranslateMatrix3ByCoordinate(5, 5)
	console.log(`平移矩阵(转置) T: `, tranlateCoordinateMatrix.toStringFormat())
	console.log(`平移矩阵 T^-1: `, tranlateCoordinateMatrix.transpose().toStringFormat())
	console.log(`平移坐标矩阵 T*A: `, pointMatrix.multiply(tranlateCoordinateMatrix).toStringFormat())

	console.log(`\n\n`)
}

function main2() {
	console.log(`%c=> 对坐标点组(矩阵)使用矩阵变换`, 'color: #ff0000;')
	const pointsMatrix = new Ven$Matrix3([1, 1, 1, 3, 1, 1, 1, 3, 1])
	console.log(`初始坐标矩阵 B: `, pointsMatrix.toStringFormat())

	const tranlateCoordinateMatrix = ven$createTranslateMatrix3ByCoordinate(5, 5)
	console.log(`平移矩阵(转置) T: `, tranlateCoordinateMatrix.toStringFormat())
	console.log(`平移坐标矩阵 T*B: `, pointsMatrix.multiply3(tranlateCoordinateMatrix).toStringFormat())

	console.log(`\n\n`)
}

main1()
main2()
