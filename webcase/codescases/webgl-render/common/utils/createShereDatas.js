/**
 * @description 生成球体顶点数据
 * @function createShereDatas
 * @param {number} radius 球体半径
 * @param {number} divideLinesMeridian 球体经线半圆个数
 * @param {number} divideLinesLatitude 球体纬线圆个数(包含两个极点)
 * @return {object}
 */
function createShereDatas(radius, divideLinesMeridian = 4, divideLinesLatitude = 4, centerX = 0, centerY = 0, centerZ = 0) {
	const calcStartIndex = (i, j, jLen) => {
		return i * jLen * 3 + j * 3
	}
	const setDivideLinesMeridian = Math.max(2, divideLinesMeridian)
	const setDivideLinesLatitude = Math.max(3, divideLinesLatitude)
	/**
	 * divideCountsMeridian
	 * 		球体经线半圆被分割出的份数: divideLinesLatitude - 1
	 * divideCountsLatitude
	 * 		球体纬线圈被分割出的份数: divideLinesMeridian
	 */
	const divideCountsMeridian = setDivideLinesLatitude - 1
	const divideCountsLatitude = setDivideLinesMeridian
	/**
	 * 生成球体原始顶点坐标数据 originalPositions
	 * 		遍历纬线圈个数: 遍历经线半圆个数
	 */
	/**
	 * 将经线半圆分割后, 每份对应的弧度
	 */
	const radianEachDivideCountMeridian = Math.PI / divideCountsMeridian
	const a = Ven$Angles.radianToDegree(radianEachDivideCountMeridian)
	/**
	 * 将纬线圈分割后, 每份对应的弧度
	 */
	const radianEachDivideCountLatitude = (Math.PI * 2) / divideCountsLatitude
	const b = Ven$Angles.radianToDegree(radianEachDivideCountLatitude)
	const originalPositionsSequence = {}
	const originalPositions = []
	const normals = []
	for (let i = 0; i < setDivideLinesLatitude; i++) {
		/**
		 * 计算经线半圆的每个分割点在 Y 轴上的坐标
		 */
		const tmpY = Math.cos(radianEachDivideCountMeridian * i)
		const coordinateY = ven$calcAbsoluteValue(radius * tmpY)
		for (let j = 0; j < setDivideLinesMeridian; j++) {
			/**
			 * 计算纬线圈的每个分割点在 X 轴和 Z 轴上的坐标
			 */
			const tmpX = Math.sin(radianEachDivideCountMeridian * i) * Math.sin(radianEachDivideCountLatitude * j)
			const tmpZ = Math.sin(radianEachDivideCountMeridian * i) * Math.cos(radianEachDivideCountLatitude * j)
			const coordinateX = ven$calcAbsoluteValue(radius * tmpX)
			const coordinateZ = ven$calcAbsoluteValue(-1 * radius * tmpZ)
			originalPositions.push(coordinateX, coordinateY, coordinateZ)
			normals.push(tmpX, tmpY, tmpZ)
			originalPositionsSequence[`${i}-${j}`] = {
				x: coordinateX,
				y: coordinateY,
				z: coordinateZ,
				_arrIndexStart: originalPositions.length - 3,
			}
		}
	}
	const vertexPositionsSequence = {}
	const vertexPositions = []
	for (let i = 0; i < setDivideLinesLatitude; i++) {
		for (let j = 0; j < setDivideLinesMeridian; j++) {
			if (i === 0) {
				const color = ven$randomColor()
				const xi = i
				const xj = j
				const yi = i + 1
				const yj = j
				const zi = i + 1
				const zj = j + 1 >= setDivideLinesMeridian ? 0 : j + 1
				const startX = calcStartIndex(xi, xj, setDivideLinesMeridian)
				vertexPositions.push(originalPositions[startX], originalPositions[startX + 1], originalPositions[startX + 2])
				vertexPositions.push(color.r / 255, color.g / 255, color.b / 255, color.a)
				const startY = calcStartIndex(yi, yj, setDivideLinesMeridian)
				vertexPositions.push(originalPositions[startY], originalPositions[startY + 1], originalPositions[startY + 2])
				vertexPositions.push(color.r / 255, color.g / 255, color.b / 255, color.a)
				const startZ = calcStartIndex(zi, zj, setDivideLinesMeridian)
				vertexPositions.push(originalPositions[startZ], originalPositions[startZ + 1], originalPositions[startZ + 2])
				vertexPositions.push(color.r / 255, color.g / 255, color.b / 255, color.a)
				continue
			}
			if (i === setDivideLinesLatitude - 1) {
				const color = ven$randomColor()
				const xi = i - 1
				const xj = j
				const yi = i
				const yj = j
				const zi = i - 1
				const zj = j + 1 >= setDivideLinesMeridian ? 0 : j + 1
				const startX = calcStartIndex(xi, xj, setDivideLinesMeridian)
				vertexPositions.push(originalPositions[startX], originalPositions[startX + 1], originalPositions[startX + 2])
				vertexPositions.push(color.r / 255, color.g / 255, color.b / 255, color.a)
				const startY = calcStartIndex(yi, yj, setDivideLinesMeridian)
				vertexPositions.push(originalPositions[startY], originalPositions[startY + 1], originalPositions[startY + 2])
				vertexPositions.push(color.r / 255, color.g / 255, color.b / 255, color.a)
				const startZ = calcStartIndex(zi, zj, setDivideLinesMeridian)
				vertexPositions.push(originalPositions[startZ], originalPositions[startZ + 1], originalPositions[startZ + 2])
				vertexPositions.push(color.r / 255, color.g / 255, color.b / 255, color.a)
				continue
			}
			const colorA = ven$randomColor()
			const axi = i
			const axj = j
			const ayi = i + 1
			const ayj = j
			const azi = i + 1
			const azj = j + 1 >= setDivideLinesMeridian ? 0 : j + 1
			const aStartX = calcStartIndex(axi, axj, setDivideLinesMeridian)
			vertexPositions.push(originalPositions[aStartX], originalPositions[aStartX + 1], originalPositions[aStartX + 2])
			vertexPositions.push(colorA.r / 255, colorA.g / 255, colorA.b / 255, colorA.a)
			const aStartY = calcStartIndex(ayi, ayj, setDivideLinesMeridian)
			vertexPositions.push(originalPositions[aStartY], originalPositions[aStartY + 1], originalPositions[aStartY + 2])
			vertexPositions.push(colorA.r / 255, colorA.g / 255, colorA.b / 255, colorA.a)
			const aStartZ = calcStartIndex(azi, azj, setDivideLinesMeridian)
			vertexPositions.push(originalPositions[aStartZ], originalPositions[aStartZ + 1], originalPositions[aStartZ + 2])
			vertexPositions.push(colorA.r / 255, colorA.g / 255, colorA.b / 255, colorA.a)
			const colorB = ven$randomColor()
			const bxi = i
			const bxj = j
			const byi = i + 1
			const byj = j + 1 >= setDivideLinesMeridian ? 0 : j + 1
			const bzi = i
			const bzj = j + 1 >= setDivideLinesMeridian ? 0 : j + 1
			const bStartX = calcStartIndex(bxi, bxj, setDivideLinesMeridian)
			vertexPositions.push(originalPositions[bStartX], originalPositions[bStartX + 1], originalPositions[bStartX + 2])
			vertexPositions.push(colorB.r / 255, colorB.g / 255, colorB.b / 255, colorB.a)
			const bStartY = calcStartIndex(byi, byj, setDivideLinesMeridian)
			vertexPositions.push(originalPositions[bStartY], originalPositions[bStartY + 1], originalPositions[bStartY + 2])
			vertexPositions.push(colorB.r / 255, colorB.g / 255, colorB.b / 255, colorB.a)
			const bStartZ = calcStartIndex(bzi, bzj, setDivideLinesMeridian)
			vertexPositions.push(originalPositions[bStartZ], originalPositions[bStartZ + 1], originalPositions[bStartZ + 2])
			vertexPositions.push(colorB.r / 255, colorB.g / 255, colorB.b / 255, colorB.a)
		}
	}
	return {
		vertexPositions: new Float32Array(vertexPositions),
		vertexPositionsSequence,
		origin: {
			x: centerX,
			y: centerY,
			z: centerZ,
		},
		originalPositions,
		originalPositionsSequence,
	}
}
