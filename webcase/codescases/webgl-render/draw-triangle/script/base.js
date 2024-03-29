function drawCanvas1(containerElement) {
	const VS = `
		precision mediump float;
		attribute vec2 a_Position;
		void main() {
			gl_Position = vec4(a_Position, 0, 1);
			gl_PointSize = 10.0;
		}
	`

	const FS = `
		precision mediump float;
		uniform vec4 u_Color;
		void main() {
			vec4 color = u_Color / vec4(255, 255, 255, 1.0);
			gl_FragColor = color;
		}
	`

	const positions = [1, 0, 0, 1, 0, 0]

	const canvasElement = containerElement.querySelector('canvas')
	const gl = initWebGLContext(canvasElement)

	const vertexShader = createShader(gl, gl.VERTEX_SHADER, VS)
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FS)
	const program = createProgram(gl, vertexShader, fragmentShader)

	const typeArray = new Float32Array(positions)
	const buffer = createBuffer(gl, typeArray)

	gl.useProgram(program)

	gl.clearColor(0.0, 0.0, 0.0, 1.0)
	gl.clear(gl.COLOR_BUFFER_BIT)

	const a_Position = gl.getAttribLocation(program, 'a_Position')

	gl.enableVertexAttribArray(a_Position)
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)

	gl.drawArrays(gl.TRIANGLES, 0, 3)
}

/****************************************************************************************************/
/****************************************************************************************************/
/****************************************************************************************************/

function drawCanvas2(containerElement) {
	const VS = `
		precision mediump float;
		attribute vec2 a_Position;
		attribute vec2 a_CanvasSize;
		void main() {
			vec2 position = (a_Position / a_CanvasSize) * 2.0 - 1.0; 
			position = position * vec2(1.0, -1.0);
			gl_Position = vec4(position, 0, 1);
			gl_PointSize = 10.0;
		}
	`

	const FS = `
		precision mediump float;
		uniform vec4 u_Color;
		void main() {
			vec4 color = u_Color / vec4(255, 255, 255, 1.0);
			gl_FragColor = color;
		}
	`

	const positions = []

	const canvasElement = containerElement.querySelector('canvas')
	const gl = initWebGLContext(canvasElement)

	const vertexShader = createShader(gl, gl.VERTEX_SHADER, VS)
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FS)
	const program = createProgram(gl, vertexShader, fragmentShader)
	const buffer = createBuffer(gl)

	gl.useProgram(program)

	gl.clearColor(0.0, 0.0, 0.0, 1.0)
	gl.clear(gl.COLOR_BUFFER_BIT)

	const a_Position = gl.getAttribLocation(program, 'a_Position')
	const a_CanvasSize = gl.getAttribLocation(program, 'a_CanvasSize')
	const u_Color = gl.getUniformLocation(program, 'u_Color')

	/**
	 * 向顶点着色器变量 attribute vec2 a_CanvasSize 传递匹配数据
	 */
	gl.vertexAttrib2f(a_CanvasSize, canvasElement.width, canvasElement.height)
	gl.enableVertexAttribArray(a_Position)
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)

	canvasElement.addEventListener('click', function (e) {
		const canvasRect = canvasElement.getBoundingClientRect().toJSON()
		positions.push(e.clientX - canvasRect.left, e.clientY - canvasRect.top)
		if (positions.length % 6 === 0) {
			console.time(`draw-webgl`)
			const color = randomColor()
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW)
			gl.clearColor(0, 0, 0, 1.0)
			gl.clear(gl.COLOR_BUFFER_BIT)
			gl.uniform4f(u_Color, color.r, color.g, color.b, color.a)
			gl.drawArrays(gl.TRIANGLES, 0, positions.length / 2)
			console.timeEnd(`draw-webgl`)
		}
	})
}

/****************************************************************************************************/
/****************************************************************************************************/
/****************************************************************************************************/

function main() {
	const appContainer1Element = document.getElementById('appContainer1')
	drawCanvas1(appContainer1Element)

	const appContainer2Element = document.getElementById('appContainer2')
	drawCanvas2(appContainer2Element)
}

window.document.addEventListener('DOMContentLoaded', main)
