/**
 * @description 生成球体顶点数据
 * @function createShereDatas
 * @param {number} radius 球体半径
 * @param {number} divideCountsMeridian 球体经线半圆分割份数
 * @param {number} divideCountsLatitude 球体纬线圆分割份数
 * @return {object}
 */
function createShereDatas(radius, divideCountsMeridian, divideCountsLatitude) {
	/**
	 * divideLinesMeridian
	 * 		球体经线半圆个数
	 * 		将纬线圈分割成 divideLinesMeridian 份
	 * divideLinesLatitude
	 * 		球体纬线圈个数
	 * 		将经线半圆分割成 divideLinesLatitude + 1 份
	 */
	const divideLinesMeridian = divideCountsLatitude
	const divideLinesLatitude = divideCountsMeridian - 1
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
	for (let i = 0; i < divideLinesLatitude + 2; i++) {
		/**
		 * 计算经线半圆的每个分割点在 Y 轴上的坐标
		 */
		const tmpY = Math.cos(radianEachDivideCountMeridian * i)
		const coordinateY = radius * tmpY
		for (let j = 0; j < divideLinesMeridian; j++) {
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
