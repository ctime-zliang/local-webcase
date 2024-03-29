function drawCanvas2(containerElement) {
	const VS = `
        // 设置浮点数精度为中等精度
        precision mediump float;
        // 接收顶点坐标 (x, y)
        attribute vec2 a_Position;
        // 接收画布尺寸 (width, height)
        attribute vec2 a_CanvasSize;
        // 接收顶点颜色
        attribute vec4 a_Color;
        // 传递给片元着色器的颜色值
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

	const datas = []

	const canvasElement = containerElement.querySelector('canvas')
	const gl = initWebGLContext(canvasElement)

	const vertexShader = createShader(gl, gl.VERTEX_SHADER, VS)
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FS)
	const program = createProgram(gl, vertexShader, fragmentShader)

	gl.useProgram(program)

	gl.clearColor(0.0, 0.0, 0.0, 1.0)
	gl.clear(gl.COLOR_BUFFER_BIT)

	const a_Position = gl.getAttribLocation(program, 'a_Position')
	const a_CanvasSize = gl.getAttribLocation(program, 'a_CanvasSize')
	const a_Color = gl.getAttribLocation(program, 'a_Color')

	/**
	 * 向顶点着色器变量 attribute vec2 a_CanvasSize 传递匹配数据
	 */
	gl.vertexAttrib2f(a_CanvasSize, canvasElement.width, canvasElement.height)

	const datasBuffer = createBuffer(gl)
	gl.enableVertexAttribArray(a_Position)
	gl.enableVertexAttribArray(a_Color)
	gl.bindBuffer(gl.ARRAY_BUFFER, datasBuffer)
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 24, 0)
	gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 24, 8)

	canvasElement.addEventListener('click', function (e) {
		const canvasRect = canvasElement.getBoundingClientRect().toJSON()
		datas.push(e.clientX - canvasRect.left, e.clientY - canvasRect.top)
		const color = randomColor()
		datas.push(color.r, color.g, color.b, color.a)
		if (datas.length % 18 === 0) {
			console.time(`draw-webgl`)
			gl.bindBuffer(gl.ARRAY_BUFFER, datasBuffer)
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(datas), gl.DYNAMIC_DRAW)
			/* ... */
			gl.clearColor(0.0, 0.0, 0.0, 1.0)
			gl.clear(gl.COLOR_BUFFER_BIT)
			gl.drawArrays(gl.TRIANGLES, 0, datas.length / 2)
			console.timeEnd(`draw-webgl`)
		}
	})
}
