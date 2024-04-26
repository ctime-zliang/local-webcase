/**
 * 绘制图片纹理填充
 */
function drawCanvas1(containerElement) {
	const VS = `
		// 设置浮点数精度为中等精度
		precision mediump float;
		// 接收顶点坐标 (x, y)
		attribute vec2 a_Position;
		// 接收画布尺寸 (width, height)
		attribute vec2 a_CanvasSize;
		// 纹理坐标
		attribute vec2 a_Uv;
		varying vec2 v_Uv;
		void main() {
			vec2 position = (a_Position / a_CanvasSize) * 2.0 - 1.0; 
			position = position * vec2(1.0, -1.0);
			gl_Position = vec4(position, 0, 1);
			v_Uv = a_Uv;
		}
	`
	const FS = `
		// 设置浮点数精度为中等精度
		precision mediump float;
		// 接收纹理坐标
		varying vec2 v_Uv;
		// 接收纹理数据(内容)
		uniform sampler2D u_Sampler;
		void main() {
			gl_FragColor = texture2D(u_Sampler, v_Uv);
		}
	`

	const datas = [
		/* ... */
		30, 30, 0, 0 /* ... */, 30, 300, 0, 1 /* ... */, 300, 300, 1, 1 /* ... */, 30, 30, 0, 0 /* ... */, 300, 300, 1, 1 /* ... */, 300, 30, 1, 0,
		/* ... */
	]

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
	const a_Uv = gl.getAttribLocation(program, 'a_Uv')
	const u_Sampler = gl.getUniformLocation(program, 'u_Sampler')

	gl.enableVertexAttribArray(a_Position)
	gl.enableVertexAttribArray(a_Uv)

	/**
	 * 向顶点着色器变量 attribute vec2 a_CanvasSize 传递匹配数据
	 */
	gl.vertexAttrib2f(a_CanvasSize, canvasElement.width, canvasElement.height)

	const datasBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, datasBuffer)
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 16, 0)
	gl.vertexAttribPointer(a_Uv, 2, gl.FLOAT, false, 16, 8)

	gl.bindBuffer(gl.ARRAY_BUFFER, datasBuffer)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(datas), gl.STATIC_DRAW)

	loadTexture(gl, '../common/images/demo-1024x1024.jpg', u_Sampler, () => {
		gl.drawArrays(gl.TRIANGLES, 0, datas.length / 4)
	})
}
