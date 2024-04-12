/**
 * - 生成方体原始顶点坐标数据 originalPositions
 * 		- 类比球体, 将方体水平方向的棱看做球体纬线圈, 将方体垂直方向的棱看做经线半圆
 * 		- 建立第 1 层循环, 遍历纬线圈个数, 计算顶点原始坐标 Y 轴分量的值 coordinateY
 * 		- 建立第 2 层循环, 遍历经线半圆个数, 计算顶点原始坐标 X 轴分量的值 coordinateX 和 Z 轴分量的值 coordinateZ
 * 		- 生成原始顶点坐标数据 originalPositions
 * 		- 此时, originalPositions 将包含 8 份顶点坐标数据
 * - 对方体顶点进行编号
 * 		- 将方体水平放置于某个水平平面 Z, 贴近平面 Z 的方体面记作 A0(底面)
 * 			4 --------- 5
 * 			  |       |
 * 			  |       |
 *            |       |
 * 			0 --------- 1
 * 		- 记底面左外顶点为 0, 底面右外顶点为 1, 底面右内顶点为 2, 底面左内顶点为 3
 * 		- 记顶面左外顶点为 4, 顶面右外顶点为 5, 顶面右内顶点为 6, 顶面左内顶点为 7
 * - 定义方体六面的三角形顶点索引 CUBE_FACE_INDICES
 * 		- 由于采用 gl.drawArrays: gl.TRIANGLES 方式绘制, 需要将方体每个面拆分成三角形
 * 		- 以面 A0(底面) 为例, 可将其拆分成 [0, 1, 2] 和 [0, 2, 3] 两组顶点索引
 * 		- 求外面的顶点索引组成
 * 				- 将 A0(底面) 围绕 X 轴旋转到该面所在的方位, 按照 A0(底面) 的构建规则构建定点索引 [4, 5, 1] 和 [4, 1, 0]
 * 		- 依次构建其他面的三角形顶点索引
 * 		- 即生成: 定义构成每个方体面的两个三角形的 2 * 3 = 6 份顶点坐标在原始顶点坐标数据 originalPositions 中的索引 CUBE_FACE_INDICES
 * 		- 此时, 每个方体面将包含 2 * 3 = 6 份顶点数据, 方体总体将由 6 * 6 = 36 份顶点坐标
 * - 建立绘制三角形顶点坐标数据 vertexPositions
 * 		- 遍历方体六面的三角形顶点索引 CUBE_FACE_INDICES, 依据顶点索引, 读取 originalPositions
 * 		- 为顶点填充颜色数据
 * 		- 生成顶点坐标数据 vertexPositions
 *
 * @description 生成方体顶点数据
 * @function createCubeDatas
 * @param {number} width 方体长度
 * @param {number} height 方体高度
 * @param {number} depth 方体纵深
 * @param {number} centerX 方体中心点坐标 X 轴分量
 * @param {number} centerY 方体中心点坐标 Y 轴分量
 * @param {number} centerZ 方体中心点坐标 Z 轴分量
 * @return {object}
 */
function createCubeDatas(width, height, depth, centerX = 0, centerY = 0, centerZ = 0) {
	const CUBE_FACE_COLOR = [
		[255, 0, 0, 1], // 红色
		[0, 255, 0, 1], // 绿色
		[0, 0, 255, 1], // 蓝色
		[255, 255, 0, 1], // 黄色
		[0, 255, 255, 1], // 青色
		[255, 0, 255, 1], // 粉色
	]
	/**
	 * 定义构成每个方体面的两个三角形的 2 * 3 = 6 份顶点坐标在原始顶点坐标数据 originalPositions 中的索引
	 */
	const CUBE_FACE_INDICES = [
		[0, 1, 2, 0, 2, 3], // 底面
		[7, 6, 5, 7, 5, 4], // 顶面
		// [5, 4, 7, 5, 7, 6],  // 顶面
		/* ... */
		[4, 5, 1, 4, 1, 0], // 前面
		[3, 2, 6, 3, 6, 7], // 后面
		/* ... */
		[1, 5, 6, 1, 6, 2], // 右面
		[4, 0, 3, 4, 3, 7], // 左面
	]
	const halfX = width / 2
	const halfY = height / 2
	const halfZ = depth / 2
	const originalPositions = []
	for (let i = 0; i < 2; i++) {
		const coordinateY = (i <= 0 ? -halfY : halfY) + centerY
		for (let j = 0; j < 4; j++) {
			const coordinateX = (j === 0 || j === 3 ? -halfX : halfX) + centerX
			const coordinateZ = (j >= 2 ? -halfZ : halfZ) + centerZ
			originalPositions.push(coordinateX, coordinateY, coordinateZ)
		}
	}
	/**
	 * 遍历 6 个面: 遍历构成每个面的 2 * 3 = 6 份顶点索引
	 * 逐一生成 6 * 6 = 36 份顶点数据, 写入 vertexPositions
	 */
	const positionsSequence = {}
	const vertexPositions = []
	for (let i = 0; i < CUBE_FACE_INDICES.length; i++) {
		const faceIndices = CUBE_FACE_INDICES[i]
		// const color = randomColor()
		const color = { r: CUBE_FACE_COLOR[i][0], g: CUBE_FACE_COLOR[i][1], b: CUBE_FACE_COLOR[i][2], a: CUBE_FACE_COLOR[i][3] }
		for (let j = 0; j < faceIndices.length; j++) {
			const pointIndex = faceIndices[j]
			/**
			 * 单个顶点的完整描述数据
			 */
			vertexPositions.push(originalPositions[pointIndex * 3], originalPositions[pointIndex * 3 + 1], originalPositions[pointIndex * 3 + 2])
			vertexPositions.push(color.r / 255, color.g / 255, color.b / 255, color.a)
			/* ... */
			/**
			 * key 规则:
			 * 		面序号 - 三角形序号 - 三角形顶点序号
			 */
			positionsSequence[`${i}-${parseInt((j + 0) / 3)}-${parseInt((j + 0) % 3)}`] = {
				x: originalPositions[pointIndex * 3],
				y: originalPositions[pointIndex * 3 + 1],
				z: originalPositions[pointIndex * 3 + 2],
				r: color.r / 255,
				g: color.g / 255,
				b: color.b / 255,
				a: 1,
			}
		}
	}
	return {
		positions: new Float32Array(vertexPositions),
		origin: {
			x: centerX,
			y: centerY,
			z: centerZ,
		},
		positionsSequence,
		positionsSequenceKeys: Object.keys(positionsSequence),
		originalPositions,
	}
}
