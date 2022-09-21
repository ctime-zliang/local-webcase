/**
 * 直线绘制拼凑方式
 */
class SimpleLightCubeDraw {
	static render(gl) {
		const program = this.initShader(gl)
		const apos = gl.getAttribLocation(program, 'apos')
		const a_color = gl.getAttribLocation(program, 'a_color')
		const a_normal = gl.getAttribLocation(program, 'a_normal')
		const u_lightColor = gl.getUniformLocation(program, 'u_lightColor')
		const u_lightDirection = gl.getUniformLocation(program, 'u_lightDirection')

		/**
		 * 给平行光传入
		 *      颜色: RGB(1,1,1)
		 *      方向: 单位向量 (x, y, z)
		 **/
		gl.uniform3f(u_lightColor, 1.0, 1.0, 1.0)
		const x = 1 / Math.sqrt(15)
		const y = 2 / Math.sqrt(15)
		const z = 3 / Math.sqrt(15)
		gl.uniform3f(u_lightDirection, x, y, -z)

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
            /* 黄色 面 1 */
            1, 1, 0,     1, 1, 0,     1, 1, 0,     1, 1, 0,     1, 1, 0,     1, 1, 0,
            /* 黑色 面 1 */
            0, 0, 0,     0, 0, 0,     0, 0, 0,     0, 0, 0,     0, 0, 0,     0, 0, 0,
            /* 灰色 面 1 */
            0.5, 0.5, 0.5,     0.5, 0.5, 0.5,     0.5, 0.5, 0.5,     0.5, 0.5, 0.5,     0.5, 0.5, 0.5,     0.5, 0.5, 0.5 
        ])
        /**
         * 创建顶点法向量
         */
         const normalData = new Float32Array([
            /* Z 轴正方向 面 1 */
            0, 0, 1,     0, 0, 1,     0, 0, 1,     0, 0, 1,     0, 0, 1,     0, 0, 1,
            /* X 轴正方向 面 1 */
            1, 0, 0,     1, 0, 0,     1, 0, 0,     1, 0, 0,     1, 0, 0,     1, 0, 0,
            /* Y 轴正方向 面 1 */
            0, 1, 0,     0, 1, 0,     0, 1, 0,     0, 1, 0,     0, 1, 0,     0, 1, 0,
            /* X 轴负方向 面 1 */
            -1, 0, 0,     -1, 0, 0,     -1, 0, 0,     -1, 0, 0,     -1, 0, 0,     -1, 0, 0,
            /* Y 轴负方向 面 1 */
            0, -1, 0,     0, -1, 0,     0, -1, 0,     0, -1, 0,     0, -1, 0,     0, -1, 0,
            /* Z 轴负方向 面 1 */
            0, 0, -1,     0, 0, -1,     0, 0, -1,     0, 0, -1,     0, 0, -1,     0, 0, -1
        ])

		/**
		 * 创建颜色缓冲区
		 * 将颜色缓冲区绑定到 gl
		 * 将颜色数据应用到颜色缓冲区
		 * 将颜色缓冲区数据传递给位置变量 a_color
		 * 并设置允许传递数据
		 */
		const colorBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
		gl.bufferData(gl.ARRAY_BUFFER, colorData, gl.STATIC_DRAW)
		gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, 0, 0)
		gl.enableVertexAttribArray(a_color)

		/**
		 * 创建顶点法向量缓冲区
		 * 将顶点法向量缓冲区绑定到 gl
		 * 将顶点法向量数据应用到顶点法向量缓冲区
		 * 将顶点法向量缓冲区数据传递给位置变量 a_normal
		 * 并设置允许传递数据
		 */
		const normalBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
		gl.bufferData(gl.ARRAY_BUFFER, normalData, gl.STATIC_DRAW)
		gl.vertexAttribPointer(a_normal, 3, gl.FLOAT, false, 0, 0)
		gl.enableVertexAttribArray(a_normal)

		/**
		 * 创建顶点缓冲区
		 * 将顶点缓冲区绑定到 gl
		 * 将顶点数据应用到顶点缓冲区
		 * 将顶点缓冲区数据传递给位置变量 apos
		 * 并设置允许传递数据
		 */
		const buffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
		gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW)
		gl.vertexAttribPointer(apos, 3, gl.FLOAT, false, 0, 0)
		gl.enableVertexAttribArray(apos)

		/**
		 * 开启深度测试
		 */
		gl.enable(gl.DEPTH_TEST)
		/**
		 * 绘制
		 */
		gl.drawArrays(gl.TRIANGLES, 0, 36)
		console.log(program)
	}

	static initShader(gl) {
		return initShader(gl, this.vertexShaderSource(), this.fragmentShaderSource())
	}

	static vertexShaderSource() {
		const source = `
            /**
             * attribute 顶点位置变量
             */
            attribute vec4 apos;
            /**
             * attribute 顶点颜色变量
             */
            attribute vec4 a_color;
            /**
             * attribute 顶点颜色差值
             */
            varying vec4 v_color;
            /**
             * attribute 法向量变量
             */
            attribute vec4 a_normal;
            /**
             * uniform 光照颜色
             */
            uniform vec3 u_lightColor;
            /**
             * uniform 光照方向
             */
            uniform vec3 u_lightDirection;
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
                gl_Position = mx * my * apos;
                /**
                 * 顶点法向量归一化
                 */
                vec3 normal = normalize(a_normal.xyz);
                /**
                 * 计算平行光方向向量与顶点法向量的点积
                 */
                float dot = max(dot(u_lightDirection, normal), 0.0);
                vec3 reflectedLight = u_lightColor * a_color.rgb * dot;
                /**
                 * 颜色差值计算
                 */
                v_color = vec4(reflectedLight, a_color.a);
            }
        `
		return source
	}

	static fragmentShaderSource() {
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

window.SimpleLightCubeDraw = SimpleLightCubeDraw
