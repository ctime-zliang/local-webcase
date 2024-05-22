/**
 * 绘制矩形
 * 		由两个三角形构成
 * 		三角形为实心纯色填充
 */
function drawCanvas1(containerElement) {
	const VS = `
		precision mediump float;
		varying vec4 v_Color;
		attribute vec2 a_CanvasSize;
		// 顶点配置(组)
		attribute vec2 a_Position;
		attribute vec4 a_Color;
		void main() {
			vec2 position = (a_Position / a_CanvasSize) * 2.0 - 1.0; 
			position = position * vec2(1.0, -1.0);
			gl_Position = vec4(position, 0, 1);
			gl_PointSize = 5.0;
			v_Color = a_Color;
		}
	`
	const FS = `
		precision mediump float;
		varying vec4 v_Color;
		void main() {
			vec4 color = v_Color / vec4(255, 255, 255, 1.0);
			gl_FragColor = color;
		}
	`

	const p00 = [30, 30, 255, 0, 0, 1]
	const p01 = [30, 300, 255, 0, 0, 1]
	const p02 = [300, 300, 255, 0, 0, 1]
	const p03 = [30, 30, 0, 255, 0, 1]
	const p04 = [300, 300, 0, 255, 0, 1]
	const p05 = [300, 30, 0, 255, 0, 1]
	const datas = [...p00, ...p01, ...p02, ...p03, ...p04, ...p05]

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

	gl.enableVertexAttribArray(a_Position)
	gl.enableVertexAttribArray(a_Color)

	/**
	 * 向顶点着色器变量 attribute vec2 a_CanvasSize 传递匹配数据
	 */
	gl.vertexAttrib2f(a_CanvasSize, canvasElement.width, canvasElement.height)

	const datasBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, datasBuffer)
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 24, 0)
	gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 24, 8)

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(datas), gl.DYNAMIC_DRAW)

	console.time(`draw-webgl`)
	gl.drawArrays(gl.TRIANGLES, 0, datas.length / 6)
	console.timeEnd(`draw-webgl`)
}
