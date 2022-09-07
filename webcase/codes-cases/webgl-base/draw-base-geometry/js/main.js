function genVertexShaderSource() {
    const source = `
        void main() {
            gl_PointSize = 50.0;
            gl_Position = vec4(0.5, 0.0, 0.0, 1.0);
        }
    `
    return source
}
function genFragmentShaderSource() {
    const source = `
        void main() {
            gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
        }
    `
    return source
}

function initShader(gl, vertexShaderSource, fragmentShaderSource) {
    /**
     * 创建顶点着色器
     */
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    /**
     * 创建片元着色器
     */
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    /**
     * 为着色器引入源代码
     */
    gl.shaderSource(vertexShader, vertexShaderSource)
    gl.shaderSource(fragmentShader, fragmentShaderSource)
    /**
     * 编译写入了源代码后的着色器
     */
    gl.compileShader(vertexShader)
    gl.compileShader(fragmentShader)

    const program = gl.createProgram()
    /**
     * 将着色器应用到 program, 链接, 使用
     */
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    gl.useProgram(program)

    return program
}

function main() {
    const canvasElement = document.getElementById('webglCanvas')
    gVars.initCanvasHandler(canvasElement)

    const program = initShader(gVars.gl, genVertexShaderSource(), genFragmentShaderSource())
    gVars.gl.drawArrays(gVars.gl.POINTS, 0, 1)
    console.log(gVars)
}

main()
