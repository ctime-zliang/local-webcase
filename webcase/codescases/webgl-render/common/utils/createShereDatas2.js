/**
 * @description 生成球体顶点数据
 * @function createShereDatas
 * @param {number} radius 球体半径
 * @param {number} divideCountsMeridian 球体经线半圆分割份数
 * @param {number} divideCountsLatitude 球体纬线圆分割份数
 * @return {object}
 */
function createShereDatas2(radius, divideCountsMeridian, divideCountsLatitude) {
	const transformIndicesToUnIndices = vertexDatas => {
		const indices = vertexDatas.indices
		const destVertex = {}
		const getElementsCountPerVertex = attribute => {
			let result = 3
			switch (attribute) {
				case 'colors': {
					result = 4
					break
				}
				case 'indices': {
					result = 1
					break
				}
				case 'texcoords': {
					result = 2
					break
				}
			}
			return result
		}
		const getArrayTypeByAttribName = attribute => {
			let type = Float32Array
			switch (attribute) {
				case 'colors': {
					type = Uint8Array
					break
				}
				case 'indices': {
					type = Uint16Array
					break
				}
			}
			return type
		}
		const vertexKeys = Object.keys(vertexDatas)
		for (let i = 0; i < vertexKeys.length; i++) {
			const attribute = vertexKeys[i]
			if (attribute == 'indices') {
				continue
			}
			const src = vertexDatas[attribute]
			const elementsPerVertex = getElementsCountPerVertex(attribute)
			const dest = []
			let index = 0
			for (let i = 0; i < indices.length; i++) {
				for (let j = 0; j < elementsPerVertex; j++) {
					dest[index] = src[indices[i] * elementsPerVertex + j]
					index++
				}
			}
			const type = getArrayTypeByAttribName(attribute)
			destVertex[attribute] = new type(dest)
		}
		return destVertex
	}
	/**
	 * 将经线半圆分割后, 每份对应的弧度
	 */
	const radianEachDivideCountMeridian = Math.PI / divideCountsMeridian
	/**
	 * 将纬线圆分割后, 每份对应的弧度
	 */
	const radianEachDivideCountLatitude = (Math.PI * 2) / divideCountsLatitude
	const positions = []
	const normals = []
	/**
	 * 计算用于分割经纬线的所有分割点的 X/Y/Z 坐标
	 */
	for (let i = 0; i <= divideCountsMeridian; i++) {
		/**
		 * 计算经线半圆的每个分割点在 Y 轴上的坐标
		 */
		const tmpY = Math.cos(radianEachDivideCountMeridian * i)
		const coordinateY = radius * tmpY
		for (let j = 0; j <= divideCountsLatitude; j++) {
			/**
			 * 计算纬线圆的每个分割点在 X 轴和 Z 轴上的坐标
			 */
			const tmpX = Math.sin(radianEachDivideCountMeridian * i) * Math.cos(radianEachDivideCountLatitude * j)
			const tmpZ = Math.sin(radianEachDivideCountMeridian * i) * Math.sin(radianEachDivideCountLatitude * j)
			const coordinateX = radius * tmpX
			const coordinateZ = radius * tmpZ
			positions.push(coordinateX, coordinateY, coordinateZ)
			normals.push(tmpX, tmpY, tmpZ)
		}
	}
	/**
	 * 记录用于分割经纬线的所有分割点的索引
	 */
	const indices = []
	const divideCountsLatitude2 = divideCountsLatitude + 1
	for (let j = 0; j < divideCountsLatitude; j++) {
		for (let i = 0; i < divideCountsMeridian; i++) {
			indices.push(i * divideCountsLatitude2 + j)
			indices.push(i * divideCountsLatitude2 + j + 1)
			indices.push((i + 1) * divideCountsLatitude2 + j)
			indices.push((i + 1) * divideCountsLatitude2 + j)
			indices.push(i * divideCountsLatitude2 + j + 1)
			indices.push((i + 1) * divideCountsLatitude2 + j + 1)
		}
	}
	const result = transformIndicesToUnIndices({
		positions: new Float32Array(positions),
		indices: new Uint16Array(indices),
		normals: new Float32Array(normals),
	})
	const result0 = {
		positions: new Float32Array(positions),
		indices: new Uint16Array(indices),
		normals: new Float32Array(normals),
	}
	const colors = []
	for (let i = 0; i < result.positions.length; i++) {
		const color = ven$randomColor()
		colors.push(color.r, color.g, color.b, 255)
	}
	return {
		...result,
		// indices: new Uint16Array(indices),
		colors: new Uint8Array(colors),
	}
}
