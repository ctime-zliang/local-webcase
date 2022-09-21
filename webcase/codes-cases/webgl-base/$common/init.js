const gVars = {}

gVars.initCanvasHandler = canvasElement => {
	gVars.canvasElement = canvasElement
	gVars.gl = gVars.canvasElement.getContext('webgl')
}

const handlerDrawGraphicTypeSelector = (selectorElement, dataList, selectedValue, changeCallback) => {
	selectorElement.innerHTML = ven$createSelectOptionsHtmlString(dataList, undefined, selectedValue)
	selectorElement.addEventListener('input', function (e) {
		changeCallback && changeCallback(e.currentTarget.value)
	})
	window.setTimeout(() => {
		changeCallback && changeCallback(selectedValue)
	})
}

const initShader = (gl, vertexShaderSource, fragmentShaderSource) => {
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
