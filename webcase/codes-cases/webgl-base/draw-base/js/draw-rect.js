class SimpleRectDraw {
	constructor() {
        this.gl = null
        this.program = null
    }

	init(gl) {
        this.gl = gl
        this.program = this._initShader(this.gl)
    }

	render() {
		/**
		 * 获取位置变量 apos
		 * 该变量定义在着色器源代码中
		 */
		const apos = this.gl.getAttribLocation(this.program, 'apos')
		
		/**
         * 创建顶点数据
         */
		const vertexData = new Float32Array([
            0.5, 0.5, 0.0, 
            -0.5, 0.5, 0.0, 
            -0.5, -0.5, 0.0, 
            0.5, -0.5, 0.0
        ])

		/**
		 * 创建缓冲区
		 * 将缓冲区绑定到 gl
		 * 将顶点数据应用到缓冲区
		 * 将缓冲区数据传递给位置变量 apos
		 * 并设置允许传递数据
		 */
		const vertextBuffer = this.gl.createBuffer()
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertextBuffer)
		this.gl.bufferData(this.gl.ARRAY_BUFFER, vertexData, this.gl.STATIC_DRAW)
		this.gl.vertexAttribPointer(apos, 3, this.gl.FLOAT, false, 0, 0)
		this.gl.enableVertexAttribArray(apos)

		/**
		 * 绘制
		 * gl.LINE_LOOP
		 */
		this.gl.drawArrays(this.gl.LINE_LOOP, 0, 4)
		console.log(this.program)
	}

	destory() {
		console.log(this.constructor.name)
    }

	_initShader(gl) {
		return initShader(gl, this._vertexShaderSource(), this._fragmentShaderSource())
	}

	_vertexShaderSource() {
		const source = `
            attribute vec4 apos;
            void main() {
                gl_Position = apos;
            }
        `
		return source
	}

	_fragmentShaderSource() {
		const source = `
            void main() {
                gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
            }
        `
		return source
	}
}

window.SimpleRectDraw = SimpleRectDraw
