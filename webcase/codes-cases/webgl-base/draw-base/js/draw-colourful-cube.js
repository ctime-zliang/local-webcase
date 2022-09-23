/**
 * 直线绘制拼凑方式
 */
class SimpleColourfulCubeDraw {
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
		/**
         * 创建顶点数据
         */
		const vertexData = new Float32Array([
            /* 面 1 */
            0.5, 0.5, 0.5, 
            -0.5, 0.5, 0.5, 
            -0.5, -0.5, 0.5, 
            0.5, 0.5, 0.5,
            -0.5, -0.5, 0.5,
            0.5, -0.5, 0.5,
            /* 面 2 */
            0.5, 0.5, 0.5,
            0.5, -0.5, 0.5,
            0.5, -0.5, -0.5,
            0.5, 0.5, 0.5,
            0.5, -0.5, -0.5,
            0.5, 0.5, -0.5,
            /* 面 3 */
            0.5, 0.5, 0.5,
            0.5, 0.5, -0.5,
            -0.5, 0.5, -0.5,
            0.5, 0.5, 0.5,
            -0.5, 0.5, -0.5,
            -0.5, 0.5, 0.5,
            /* 面 4 */
            -0.5, 0.5, 0.5,
            -0.5, 0.5, -0.5,
            -0.5, -0.5, -0.5,
            -0.5, 0.5, 0.5,
            -0.5, -0.5, -0.5,
            -0.5, -0.5, 0.5,
            /* 面 5 */
            -0.5, -0.5, -0.5,
            0.5, -0.5, -0.5,
            0.5, -0.5, 0.5,
            -0.5, -0.5, -0.5,
            0.5, -0.5, 0.5,
            -0.5, -0.5, 0.5,
            /* 面 6 */
            0.5, -0.5, -0.5,
            -0.5, -0.5, -0.5,
            -0.5, 0.5, -0.5,
            0.5, -0.5, -0.5,
            -0.5, 0.5, -0.5,
            0.5, 0.5, -0.5 
        ])
        /**
         * 创建颜色数据
         */
        const colorData = new Float32Array([
            /* 红色 面 1 */
            1, 0, 0,     1, 0, 0,     1, 0, 0,     1, 0, 0,     1, 0, 0,     1, 0, 0,
            /* 绿色 面 1 */
            0, 1, 0,     0, 1, 0,     0, 1, 0,     0, 1, 0,     0, 1, 0,     0, 1, 0,
            /* 蓝色 面 1 */
            0, 0, 1,     0, 0, 1,     0, 0, 1,     0, 0, 1,     0, 0, 1,     0, 0, 1,
            /* 红色 面 1 */
            1, 1, 0,     1, 1, 0,     1, 1, 0,     1, 1, 0,     1, 1, 0,     1, 1, 0,
            /* 黄色 面 1 */
            0, 0, 0,     0, 0, 0,     0, 0, 0,     0, 0, 0,     0, 0, 0,     0, 0, 0,
            /* 灰色 面 1 */
            0.5, 0.5, 0.5,     0.5, 0.5, 0.5,     0.5, 0.5, 0.5,     0.5, 0.5, 0.5,     0.5, 0.5, 0.5,     0.5, 0.5, 0.5 
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
		const buffer = this.gl.createBuffer()
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer)
		this.gl.bufferData(this.gl.ARRAY_BUFFER, vertexData, this.gl.STATIC_DRAW)
		this.gl.vertexAttribPointer(apos, 3, this.gl.FLOAT, false, 0, 0)
		this.gl.enableVertexAttribArray(apos)

		/**
		 * 开启深度测试
		 */
        this.gl.enable(this.gl.DEPTH_TEST)
		/**
		 * 绘制
		 */
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 36)
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
            attribute vec4 a_color;
            varying vec4 v_color;
            void main() {
                /**
                 * 设置几何体轴旋转角度为30度
                 * 把角度值转化为浮点值
                 */
                float rotate = radians(-30.0);
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
                gl_Position = rx * ry * apos;
                v_color = a_color;
            }
        `
		return source
	}

	_fragmentShaderSource() {
		const source = `
            precision lowp float;
            varying vec4 v_color;
            void main() {
                gl_FragColor = v_color;
            }
        `
		return source
	}
}

window.SimpleColourfulCubeDraw = SimpleColourfulCubeDraw
