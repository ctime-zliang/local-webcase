class SimpleGradientLineDraw {
	constructor() {
        this.gl = null
        this.program = null
    }

	init(gl) {
        this.gl = gl
        this.program = this._initShader(this.gl)
    }

	render() {
		const apos = this.gl.getAttribLocation(this.program, 'apos')
		const a_color = this.gl.getAttribLocation(this.program, 'a_color')

		const vertexData = new Float32Array([
            -0.5, 0.5, 0,
            0.5, 0.5, 0
        ])
        const colorData = new Float32Array([
            1, 0, 0,
            0, 1, 0
        ])

		/**
		 * 创建颜色缓冲区
		 * 将颜色缓冲区绑定到 gl
		 * 将颜色数据应用到颜色缓冲区
		 * 将颜色缓冲区数据传递给位置变量 a_color
		 * 并设置允许传递数据
		 */
		const colorBuffer = this.gl.createBuffer()
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer)
		this.gl.bufferData(this.gl.ARRAY_BUFFER, colorData, this.gl.STATIC_DRAW)
		this.gl.vertexAttribPointer(a_color, 3, this.gl.FLOAT, false, 0, 0)
		this.gl.enableVertexAttribArray(a_color)

		/**
		 * 创建顶点缓冲区
		 * 将顶点缓冲区绑定到 gl
		 * 将顶点数据应用到顶点缓冲区
		 * 将顶点缓冲区数据传递给位置变量 apos
		 * 并设置允许传递数据
		 */
		const vertexBuffer = this.gl.createBuffer()
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer)
		this.gl.bufferData(this.gl.ARRAY_BUFFER, vertexData, this.gl.STATIC_DRAW)
		this.gl.vertexAttribPointer(apos, 3, this.gl.FLOAT, false, 0, 0)
		this.gl.enableVertexAttribArray(apos)

		this.gl.drawArrays(this.gl.LINES, 0, 2)
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
            /**
             * 顶点坐标
             */
            attribute vec4 apos;
            /**
             * 顶点颜色
             */
            attribute vec4 a_color;
            /**
             * 实时计算出的差值颜色
             */
            varying vec4 v_color;
            void main() {
                gl_Position = apos;
                v_color = a_color;
            }
        `
		return source
	}

	_fragmentShaderSource() {
		const source = `
            /**
             * 设置 所有float类型数据的精度是lowp
             */
            precision lowp float;
            varying vec4 v_color;
            void main() {
                gl_FragColor = v_color;
            }
        `
		return source
	}
}

window.SimpleGradientLineDraw = SimpleGradientLineDraw
