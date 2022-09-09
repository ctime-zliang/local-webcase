class SimpleCubeDraw {
    static render(gl) {
        const program = this.initShader(gl)
        /**
         * 获取位置变量 apos
         * 该变量定义在着色器源代码中
         */
        const aposLocation = gl.getAttribLocation(program, 'apos')
        /**
         * 创建顶点数据
         */
        const vertexData = new Float32Array([
            0.5, 0.5, 0.5,
            -0.5, 0.5, 0.5,
            -0.5, -0.5, 0.5,
            0.5, -0.5, 0.5,
            0.5, 0.5, -0.5,
            -0.5, 0.5, -0.5,
            -0.5, -0.5, -0.5,
            0.5, -0.5, -0.5,
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
         * 创建缓冲区
         */
        const buffer = gl.createBuffer()
        /**
         * 将缓冲区绑定到 gl
         * 将顶点数据应用到缓冲区
         */
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW)
        /**
         * 将缓冲区数据传递给位置变量 apos
         * 并设置允许传递数据
         */
        gl.vertexAttribPointer(aposLocation, 3, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(aposLocation)

        /**
         * 绘制
         * LINE_LOOP 模式绘制前 4 个点
         * LINE_LOOP 模式从第 5 个点开始绘制 4 个点
         * LINES 模式绘制后 8 个点
         */
        gl.drawArrays(gl.LINE_LOOP, 0, 4)
        gl.drawArrays(gl.LINE_LOOP, 4, 4)
        gl.drawArrays(gl.LINES, 8, 8)
        console.log(program) 
    }

    static initShader(gl) {
        return initShader(gl, this.vertexShaderSource(), this.fragmentShaderSource())
    }

    static vertexShaderSource() {
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
                 * 创建绕 x, y 轴旋转矩阵
                 */
                mat4 mx = mat4(1, 0, 0, 0,  0, cosValue, sinValue, 0,  0, -sinValue, cosValue, 0,  0, 0, 0, 1);
                mat4 my = mat4(cosValue, 0, -sinValue, 0,  0, 1, 0, 0,  sinValue, 0, cosValue, 0,  0, 0, 0, 1);
                gl_Position = mx * my * apos;
            }
        `
        return source
    }

    static fragmentShaderSource() {
        const source = `
            void main() {
                gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
            }
        `
        return source
    }
}