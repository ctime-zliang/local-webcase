const VS = `
    // 设置浮点数精度为中等精度
    precision mediump float;
    // 接收顶点坐标 (x, y)
    attribute vec2 a_Position;
    // 接收画布尺寸 (width, height)
    attribute vec2 a_CanvasSize;
    // 接收顶点颜色
    attribute vec4 a_Color;
    // 传递给片元着色器的颜色
    varying vec4 v_Color;
    void main() {
        vec2 position = (a_Position / a_CanvasSize) * 2.0 - 1.0; 
        position = position * vec2(1.0, -1.0);
        gl_Position = vec4(position, 0, 1);
        gl_PointSize = 5.0;
        v_Color = a_Color;
    }
`

const FS = `
    // 设置浮点数精度为中等精度
    precision mediump float;
    // 接收顶点着色器传递的颜色值
    varying vec4 v_Color;
    void main() {
        vec4 color = v_Color / vec4(255, 255, 255, 1.0);
        gl_FragColor = color;
    }
`
