/**
 * 直线绘制拼凑方式
 */
class SimpleCubeDraw {
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
            0.5, -0.5, -0.5,
            /* ... */
            0.5, 0.5, 0.5,
            0.5, 0.5, -0.5,
            -0.5, 0.5, 0.5,
            -0.5, 0.5, -0.5,
            -0.5, -0.5, 0.5,
            -0.5, -0.5, -0.5,
            0.5, -0.5, 0.5,
            0.5, -0.5, -0.5,
        ])

		/**
		 * 创建顶点缓冲区
		 * 将顶点缓冲区绑定到 gl
		 * 将顶点数据应用到顶点缓冲区
		 * 将顶点缓冲区数据传递给位置变量 apos
		 * 并设置允许传递数据
		 */
		const buffer = this.gl.createBuffer()
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer)
		this.gl.bufferData(this.gl.ARRAY_BUFFER, vertexData, this.gl.STATIC_DRAW)
		this.gl.vertexAttribPointer(apos, 3, this.gl.FLOAT, false, 0, 0)
		this.gl.enableVertexAttribArray(apos)

		/**
		 * 绘制
		 * LINE_LOOP 模式绘制前 4 个点
		 *      绘制出立方体的某一个面
		 * LINE_LOOP 模式从第 5 个点开始绘制 4 个点
		 *      绘制出立方体的与上述步骤绘制出的面所对立的面
		 * LINES 模式绘制后 8 个点
		 *      用直线将两个面的四个顶点分别一一连接
		 */
        this.gl.drawArrays(this.gl.LINE_LOOP, 0, 4)
		this.gl.drawArrays(this.gl.LINE_LOOP, 4, 4)
		this.gl.drawArrays(this.gl.LINES, 8, 8)
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
                float rotate = radians(20.0);
                /**
                 * 求解三角函数对应值
                 */
                float cosValue = cos(rotate);
                float sinValue = sin(rotate);
                /**
                 * 创建绕 x, y 轴旋转的旋转矩阵
                 */
                mat4 mx = mat4(
                    1, 0,         0,        0, 
                    0, cosValue,  sinValue, 0, 
                    0, -sinValue, cosValue, 0, 
                    0, 0,         0,        1
                );
                mat4 my = mat4(
                    cosValue, 0, sinValue, 0, 
                    0,        1, 0,         0, 
                    -sinValue, 0, cosValue,  0,
                    0,        0, 0,         1
                );
                /**
                 * 创建绕 x, y 旋转 0 度的旋转矩阵
                 */
                mat4 mx0 = mat4(
                    1, 0, 0, 0, 
                    0, 1, 0, 0, 
                    0, 0, 1, 0, 
                    0, 0, 0, 1 
                );
                mat4 my0 = mat4(
                    1, 0, 0, 0, 
                    0, 1, 0, 0, 
                    0, 0, 1, 0, 
                    0, 0, 0, 1 
                );
                gl_Position = mx * my * apos;
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

window.SimpleCubeDraw = SimpleCubeDraw
