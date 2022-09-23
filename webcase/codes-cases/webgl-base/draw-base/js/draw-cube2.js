/**
 * 索引绘制方式
 */

class SimpleCube2Draw {
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
            0.5, 0.5, 0.5,
            -0.5, 0.5, 0.5,
            -0.5, -0.5, 0.5,
            0.5, -0.5, 0.5,
            /* ... */
            0.5, 0.5, -0.5,
            -0.5, 0.5, -0.5,
            -0.5, -0.5, -0.5,
            0.5, -0.5, -0.5
        ])
        /**
         * 创建顶点索引数据
         */
        const vertexIndexes = new Uint8Array([
            0, 1, 2, 3,
            4, 5, 6, 7,
            0, 4,
            1, 5,
            2, 6,
            3, 7
        ])

		/**
		 * 创建索引缓冲区
		 * 将索引缓冲区绑定到 gl
		 * 将索引数据应用到顶点索引缓冲区
		 */
		const indexesBuffer = this.gl.createBuffer()
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexesBuffer)
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, vertexIndexes, gl.STATIC_DRAW)

		/**
		 * 创建顶点缓冲区
		 * 将顶点数据缓冲区绑定到 gl
		 * 将顶点数据应用到顶点缓冲区
		 * 将顶点数据缓冲区数据传递给位置变量 apos
		 * 并设置允许传递数据
		 */
		const buffer = this.gl.createBuffer()
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer)
		this.gl.bufferData(this.gl.ARRAY_BUFFER, vertexData, this.gl.STATIC_DRAW)
		this.gl.vertexAttribPointer(apos, 3, this.gl.FLOAT, false, 0, 0)
		this.gl.enableVertexAttribArray(apos)

		/**
		 * 绘制
		 */
        this.gl.drawElements(this.gl.LINE_LOOP, 4, this.gl.UNSIGNED_BYTE, 0)
        this.gl.drawElements(this.gl.LINE_LOOP, 4, this.gl.UNSIGNED_BYTE, 4)
        this.gl.drawElements(this.gl.LINES, 8, this.gl.UNSIGNED_BYTE, 8)
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
                /**
                 * 设置几何体轴旋转角度为30度
                 * 把角度值转化为浮点值
                 */
                float rotate = radians(30.0);
                /**
                 * 求解三角函数对应值
                 */
                float cosValue = cos(rotate);
                float sinValue = sin(rotate);
                /**
                 * 创建绕 x, y 轴旋转的旋转矩阵
                 */
                mat4 rx = mat4(
                    1, 0,         0,        0, 
                    0, cosValue,  sinValue, 0, 
                    0, -sinValue, cosValue, 0, 
                    0, 0,         0,        1
                );
                mat4 ry = mat4(
                    cosValue, 0, sinValue, 0, 
                    0,        1, 0,         0, 
                    -sinValue, 0, cosValue,  0,
                    0,        0, 0,         1
                );
                /**
                 * 创建绕 x, y 旋转 0 度的旋转矩阵
                 */
                mat4 rx0 = mat4(
                    1, 0, 0, 0, 
                    0, 1, 0, 0, 
                    0, 0, 1, 0, 
                    0, 0, 0, 1 
                );
                mat4 ry0 = mat4(
                    1, 0, 0, 0, 
                    0, 1, 0, 0, 
                    0, 0, 1, 0, 
                    0, 0, 0, 1 
                );
                gl_Position = rx * ry * apos;
            }
        `
		return source
	}

    _fragmentShaderSource() {
		const source = `
            void main() {
                gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
            }
        `
		return source
	}
}

window.SimpleCube2Draw = SimpleCube2Draw
