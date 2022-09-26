/**
 * 直线绘制拼凑方式
 */
class SimpleTextureImageDraw {
    constructor() {
        this.gl = null
        this.program = null
    }

	init(gl) {
        this.gl = gl
        this.program = this._initShader(this.gl)
    }

	render() {
		const a_Position = this.gl.getAttribLocation(this.program, 'a_Position')
        const a_TexturePosition = this.gl.getAttribLocation(this.program, 'a_TexturePosition')
        const u_Sampler = this.gl.getUniformLocation(this.program, 'u_Sampler')
		/**
         * 创建顶点数据
         *      以直角坐标系坐标原点为中心
         */
		const vertexData = new Float32Array([
            /* 左上角 */
            -0.5, 0.5, 0.0, 
            /* 左下角 */
            -0.5, -0.5, 0.0,
            /* 右上角 */
            0.5, 0.5, 0.0,
            /* 右下角 */
            0.5, -0.5, 0.0,
        ])
        /**
         * 创建纹理顶点数据
         *      以第一象限的中点为中心
         */
        const textureVertexData = new Float32Array([
            /* 左上角 */
            0.0, 1.0, 0.0, 
            /* 左下角 */
            0.0, 0.0, 0.0,
            /* 右上角 */
            1.0, 1.0, 0.0,
            /* 右下角 */
            1.0, 0.0, 0.0,
        ])

		/**
		 * 创建顶点缓冲区
		 * 将顶点缓冲区绑定到 gl
		 * 将顶点数据应用到顶点缓冲区
		 * 将顶点缓冲区数据传递给位置变量 a_Position
		 * 并设置允许传递数据
		 */
		const vertextBuffer = this.gl.createBuffer()
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertextBuffer)
		this.gl.bufferData(this.gl.ARRAY_BUFFER, vertexData, this.gl.STATIC_DRAW)
		this.gl.vertexAttribPointer(a_Position, 3, this.gl.FLOAT, false, 0, 0)
		this.gl.enableVertexAttribArray(a_Position)

        /**
		 * 创建纹理顶点缓冲区
		 * 将纹理顶点缓冲区绑定到 gl
		 * 将纹理顶点数据应用到纹理顶点缓冲区
		 * 将纹理顶点缓冲区数据传递给位置变量 a_TexturePostion
		 * 并设置允许传递数据
		 */
        const textureBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, textureBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, textureVertexData, this.gl.STATIC_DRAW)
        this.gl.vertexAttribPointer(a_TexturePosition, 3, this.gl.FLOAT, false, 0, 0)
        this.gl.enableVertexAttribArray(a_TexturePosition)

        const imageInstance = new Image()
        const drawImageTextureHandler = createDrawImageTextureHandler(this.gl, u_Sampler, imageInstance)
        imageInstance.onload = drawImageTextureHandler
        imageInstance.src = window.$image01

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
             * 顶点位置坐标
             */
            attribute vec4 a_Position;
            /**
             * 顶点纹理坐标
             */
            attribute vec2 a_TexturePosition;
            /**
             * 计算差值后的顶点纹理坐标
             */
            varying vec2 v_TexturePosition;
            void main() {
                /**
                 * 逐顶点处理
                 */
                gl_Position = a_Position;
                /**
                 * 纹理坐标插值计算
                 */
                v_TexturePosition = a_TexturePosition;
            }
        `
		return source
	}

	_fragmentShaderSource() {
		const source = `
            precision highp float;
            /**
             * 接收 计算差值后的顶点纹理坐标
             */
            varying vec2 v_TexturePosition;
            /**
             * 纹理图片像素数据
             */
            uniform sampler2D u_Sampler;
            void main() {
                /**
                 * 采集纹素, 逐片元赋值像素值
                 */
                gl_FragColor = texture2D(u_Sampler, v_TexturePosition);
            }
        `
		return source
	}
}

window.SimpleTextureImageDraw = SimpleTextureImageDraw
