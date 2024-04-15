/**
 * @description 生成球体顶点数据
 * @function createShereDatas
 * @param {number} radius 球体半径
 * @param {number} divideLinesMeridian 球体经线半圆个数
 * @param {number} divideLinesLatitude 球体纬线圆个数(包含两个极点)
 * @return {object}
 */
function createShereDatas(radius, divideLinesMeridian = 4, divideLinesLatitude = 4) {
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
	/**
	 * 将纬线圆分割后, 每份对应的弧度
	 */
	const radianEachDivideCountLatitude = (Math.PI * 2) / divideCountsLatitude
	const originalPositions = []
	const normals = []
	for (let i = 0; i < setDivideLinesLatitude; i++) {
		/**
		 * 计算经线半圆的每个分割点在 Y 轴上的坐标
		 */
		const tmpY = Math.cos(radianEachDivideCountMeridian * i)
		const coordinateY = radius * tmpY
		for (let j = 0; j < setDivideLinesMeridian; j++) {
			/**
			 * 计算纬线圆的每个分割点在 X 轴和 Z 轴上的坐标
			 */
			const tmpX = Math.sin(radianEachDivideCountMeridian * i) * Math.cos(radianEachDivideCountLatitude * j)
			const tmpZ = Math.sin(radianEachDivideCountMeridian * i) * Math.sin(radianEachDivideCountLatitude * j)
			const coordinateX = radius * tmpX
			const coordinateZ = radius * tmpZ
			originalPositions.push(coordinateX, coordinateY, coordinateZ)
			normals.push(tmpX, tmpY, tmpZ)
		}
	}
	return {
		originalPositions,
	}
}
