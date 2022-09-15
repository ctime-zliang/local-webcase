class SimpleTriangleDraw {
    static render(gl) {
        const program = this.initShader(gl)
        /**
         * 获取位置变量 apos
         * 该变量定义在着色器源代码中
         */
        const apos = gl.getAttribLocation(program, 'apos')
        /**
         * 创建顶点数据
         */
        const vertexData = new Float32Array([
            0, 0, 1, 
            0, 1, 0,
            1, 0, 0
        ])

       /**
         * 创建缓冲区
         * 将缓冲区绑定到 gl
         * 将顶点数据应用到缓冲区
         * 将缓冲区数据传递给位置变量 apos
         * 并设置允许传递数据
         */
        const buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW)
        gl.vertexAttribPointer(apos, 3, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(apos)

        /**
         * 绘制
         * gl.TRIANGLES
         */
        gl.drawArrays(gl.TRIANGLES, 0, 3)
        console.log(program) 
    }

    static initShader(gl) {
        return initShader(gl, this.vertexShaderSource(), this.fragmentShaderSource())
    }

    static vertexShaderSource() {
        const source = `
            attribute vec4 apos;
            void main() {
                gl_Position = apos;
            }
        `
        return source
    }

    static fragmentShaderSource() {
        const source = `
            void main() {
                gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
            }
        `
        return source
    }
}