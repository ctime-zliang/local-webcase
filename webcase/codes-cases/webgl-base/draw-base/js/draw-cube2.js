/**
 * 索引绘制方式
 */

class SimpleCube2Draw {
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
        const indexesBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexesBuffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, vertexIndexes, gl.STATIC_DRAW)

        /**
         * 创建顶点缓冲区
         * 将顶点数据缓冲区绑定到 gl
         * 将顶点数据应用到顶点缓冲区
         * 将顶点数据缓冲区数据传递给位置变量 apos
         * 并设置允许传递数据
         */
        const buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW)
        gl.vertexAttribPointer(apos, 3, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(apos)

        /**
         * 绘制
         */
        gl.drawElements(gl.LINE_LOOP, 4, gl.UNSIGNED_BYTE, 0)
        gl.drawElements(gl.LINE_LOOP, 4, gl.UNSIGNED_BYTE, 4)
        gl.drawElements(gl.LINES, 8, gl.UNSIGNED_BYTE, 8)
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

    static fragmentShaderSource() {
        const source = `
            void main() {
                gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
            }
        `
        return source
    }
}

window.SimpleCube2Draw = SimpleCube2Draw
