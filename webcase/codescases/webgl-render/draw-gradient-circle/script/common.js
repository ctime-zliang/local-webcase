const VS = `
    // 设置浮点数精度为中等精度
    precision mediump float;
    // 接收顶点坐标 (x, y)
    attribute vec2 a_Position;
    // 接收画布尺寸 (width, height)
    attribute vec2 a_CanvasSize;
    // 接收顶点颜色
    attribute vec4 a_Color;
    // 传递给片元着色器的颜色
    varying vec4 v_Color;
    void main() {
        vec2 position = (a_Position / a_CanvasSize) * 2.0 - 1.0; 
        position = position * vec2(1.0, -1.0);
        gl_Position = vec4(position, 0, 1);
        gl_PointSize = 5.0;
        v_Color = a_Color;
    }
`

const FS = `
    // 设置浮点数精度为中等精度
    precision mediump float;
    // 接收顶点着色器传递的颜色值
    varying vec4 v_Color;
    void main() {
        vec4 color = v_Color / vec4(255, 255, 255, 1.0);
        gl_FragColor = color;
    }
`

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
