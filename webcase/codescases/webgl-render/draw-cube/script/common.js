function createCubeDatas(
	width,
	height,
	depth,
	colorInput = [
		[255, 0, 0, 1],
		[0, 255, 0, 1],
		[0, 0, 255, 1],
		[255, 255, 0, 1],
		[0, 255, 255, 1],
		[255, 0, 255, 1],
	]
) {
	/**
	 * 面 索引
	 */
	const CUBE_FACE_INDICES = [
		[0, 1, 2, 3], // 前面
		[4, 5, 6, 7], // 后面
		[0, 3, 5, 4], // 左面
		[1, 7, 6, 2], // 右面
		[3, 2, 6, 5], // 上面
		[0, 4, 7, 1], // 下面
	]
	const zeroX = width / 2
	const zeroY = height / 2
	const zeroZ = depth / 2
	/**
	 * 顶点坐标
	 */
	const cornerPositions = [
		[-zeroX, -zeroY, -zeroZ],
		[zeroX, -zeroY, -zeroZ],
		[zeroX, zeroY, -zeroZ],
		[-zeroX, zeroY, -zeroZ],
		[-zeroX, -zeroY, zeroZ],
		[-zeroX, zeroY, zeroZ],
		[zeroX, zeroY, zeroZ],
		[zeroX, -zeroY, zeroZ],
	]
	let colors = []
	let positions = []
	let indices = []
	for (let f = 0; f < 6; ++f) {
		const faceIndices = CUBE_FACE_INDICES[f]
		const color = colorInput[f]
		for (let v = 0; v < 4; ++v) {
			let position = cornerPositions[faceIndices[v]]
			positions = positions.concat(position, color)
			colors = colors.concat(color)
		}
		const offset = 4 * f
		indices.push(offset + 0, offset + 1, offset + 2)
		indices.push(offset + 0, offset + 2, offset + 3)
	}
	const indicesUintArray = new Uint16Array(indices)
	const positionUintsArray = new Float32Array(positions)
	const colorsUintArray = new Float32Array(colors)
	return {
		positions: positionUintsArray,
		indices: indicesUintArray,
		colors: colorsUintArray,
	}
}
