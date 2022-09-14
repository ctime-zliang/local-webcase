class SimpleRectDotDraw {
    static render(gl) {
        const program = this.initShader(gl)
        gl.drawArrays(gl.POINTS, 0, 1)
        console.log(program) 
    }

    static initShader(gl) {
        return initShader(gl, this.vertexShaderSource(), this.fragmentShaderSource())
    }

    static vertexShaderSource() {
        const source = `
            void main() {
                gl_PointSize = 10.0;
                gl_Position = vec4(0.5, 0.5, 0.0, 1.0);
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