function createShereDatas(radius, divideByYAxis, divideByCircle) {
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

		Object.keys(vertexDatas).forEach(attribute => {
			if (attribute == 'indices') {
				return
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
			let type = getArrayTypeByAttribName(attribute)
			destVertex[attribute] = new type(dest)
		})
		return destVertex
	}
	const yUnitAngle = Math.PI / divideByYAxis
	const circleUnitAngle = (Math.PI * 2) / divideByCircle
	const positions = []
	const normals = []
	const colors = []
	for (let i = 0; i <= divideByYAxis; i++) {
		const unitY = Math.cos(yUnitAngle * i)
		const yValue = radius * unitY
		for (let j = 0; j <= divideByCircle; j++) {
			const unitX = Math.sin(yUnitAngle * i) * Math.cos(circleUnitAngle * j)
			const unitZ = Math.sin(yUnitAngle * i) * Math.sin(circleUnitAngle * j)
			const xValue = radius * unitX
			const zValue = radius * unitZ
			positions.push(xValue, yValue, zValue)
			normals.push(unitX, unitY, unitZ)
		}
	}
	const indices = []
	const circleCount = divideByCircle + 1
	for (let j = 0; j < divideByCircle; j++) {
		for (let i = 0; i < divideByYAxis; i++) {
			indices.push(i * circleCount + j)
			indices.push(i * circleCount + j + 1)
			indices.push((i + 1) * circleCount + j)
			indices.push((i + 1) * circleCount + j)
			indices.push(i * circleCount + j + 1)
			indices.push((i + 1) * circleCount + j + 1)
		}
	}
	const result = transformIndicesToUnIndices({
		positions: new Float32Array(positions),
		indices: new Uint16Array(indices),
		normals: new Float32Array(normals),
	})
	for (let i = 0; i < result.positions.length; i++) {
		const color = randomColor()
		colors.push(color.r, color.g, color.b, 255)
	}
	return {
		...result,
		colors: new Uint8Array(colors),
	}
}
