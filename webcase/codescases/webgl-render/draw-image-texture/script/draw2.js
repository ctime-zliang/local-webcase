/**
 * 绘制图片纹理填充
 */

class Program2 {
	static async loadAllTexture(gl, srcs, u_Samplers) {
		let hasDones = []
		return new Promise((_, reject) => {
			const len = srcs.length
			for (let i = 0; i < len; i++) {
				loadTexture(gl, srcs[i], u_Samplers[i], i, textureUnitIndex => {
					hasDones.push(textureUnitIndex)
					if (hasDones.length >= len) {
						_()
					}
				})
			}
		})
	}
}

function drawCanvas2(containerElement) {
	const VS = `
		precision mediump float;
		varying vec2 v_Uv;
		attribute vec2 a_CanvasSize;
		// 顶点配置(组)
		attribute vec2 a_Position;		
		// 纹理配置(组)
		attribute vec2 a_Uv;
		void main() {
			vec2 position = (a_Position / a_CanvasSize) * 2.0 - 1.0; 
			position = position * vec2(1.0, -1.0);
			gl_Position = vec4(position, 0, 1);
			v_Uv = a_Uv;
		}
	`
	const FS = `
		#ifdef GL_ES
		precision mediump float;
		#endif
		varying vec2 v_Uv;
		// 纹理数据(内容)(组)
		uniform sampler2D u_Sampler0;
		uniform sampler2D u_Sampler1;
		void main() {
			vec4 color0 = texture2D(u_Sampler0, v_Uv);
			vec4 color1 = texture2D(u_Sampler1, v_Uv);
			gl_FragColor = color0 * color1;
		}
	`

	/**
	 * 顶点定义格式
	 * 		绘制区域的顶点坐标: (30, 30), (30, 300), (300, 300), ...
	 * 			即需要绘制的像素空间
	 * 		纹理采样坐标: (0, 0), (0, 1), (1, 1), ...
	 */
	// prettier-ignore
	const datas = [
		30, 30, 0, 0,
		30, 300, 0, 1,
		300, 300, 1, 1 
		/* ... */, 
		30, 30, 0, 0,
		300, 300, 1, 1,
		300, 30, 1, 0,
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
	const u_Sampler0 = gl.getUniformLocation(program, 'u_Sampler0')
	const u_Sampler1 = gl.getUniformLocation(program, 'u_Sampler1')

	gl.enableVertexAttribArray(a_Position)
	gl.enableVertexAttribArray(a_Uv)

	gl.vertexAttrib2f(a_CanvasSize, canvasElement.width, canvasElement.height)

	const datasBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, datasBuffer)
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 16, 0)
	gl.vertexAttribPointer(a_Uv, 2, gl.FLOAT, false, 16, 8)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(datas), gl.STATIC_DRAW)

	Program2.loadAllTexture(gl, [`../common/images/circle.gif`, `../common/images/demo-1024x1024.jpg`], [u_Sampler0, u_Sampler1]).then(() => {
		gl.drawArrays(gl.TRIANGLES, 0, datas.length / 4)
	})
}
