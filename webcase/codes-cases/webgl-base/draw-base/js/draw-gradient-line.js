class SimpleGradientLineDraw {
    static render(gl) {
        const program = this.initShader(gl)
        const apos = gl.getAttribLocation(program, 'apos')
        const a_color = gl.getAttribLocation(program, 'a_color')
        
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
         * 将颜色缓冲区数据传递给位置变量 apos
         * 并设置允许传递数据
         */
        const colorBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, colorData, gl.STATIC_DRAW)
        gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(a_color)

        /**
         * 创建顶点缓冲区
         * 将顶点缓冲区绑定到 gl
         * 将顶点数据应用到顶点缓冲区
         * 将顶点缓冲区数据传递给位置变量 apos
         * 并设置允许传递数据
         */
        const vertexBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW)
        gl.vertexAttribPointer(apos, 3, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(apos)
        
        gl.drawArrays(gl.LINES, 0, 2)
        console.log(program) 
    }

    static initShader(gl) {
        return initShader(gl, this.vertexShaderSource(), this.fragmentShaderSource())
    }

    static vertexShaderSource() {
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

    static fragmentShaderSource() {
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