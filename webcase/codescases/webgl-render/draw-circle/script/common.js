const createCircleVertexDatas = (
	x,
	y,
	radius,
	n,
	color = {
		r: 255,
		g: 0,
		b: 0,
		a: 1,
	}
) => {
	const positions = [x, y, color.r, color.g, color.b, color.a]
	for (let i = 0; i <= n; i++) {
		const angle = (i * Math.PI * 2) / n
		positions.push(x + radius * Math.sin(angle), y + radius * Math.cos(angle), 255, 0, 0, 1)
	}
	return positions
}

const createRingVertexDatas = (
	x,
	y,
	innerRadius,
	outerRadius,
	n,
	color = {
		r: 255,
		g: 0,
		b: 0,
		a: 1,
	}
) => {
	const positions = []
	for (let i = 0; i <= n; i++) {
		const angle = (i * Math.PI * 2) / n
		positions.push(x + innerRadius * Math.sin(angle), y + innerRadius * Math.cos(angle), color.r, color.g, color.b, color.a)
		positions.push(x + outerRadius * Math.sin(angle), y + outerRadius * Math.cos(angle), color.r, color.g, color.b, color.a)
	}
	const indices = []
	for (let i = 0; i < n; i++) {
		let p0 = i * 2
		let p1 = i * 2 + 1
		let p2 = (i + 1) * 2 + 1
		let p3 = (i + 1) * 2
		if (i == n - 1) {
			p2 = 1
			p3 = 0
		}
		indices.push(p0, p1, p2, p2, p3, p0)
	}
	return { positions: positions, indices: indices }
}
