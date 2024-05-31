function ven$initWebGLContext(canvasElement) {
	gVars.canvasElement = canvasElement
	return canvasElement.getContext('webgl')
}

function ven$createShader(gl, type, source) {
	const shader = gl.createShader(type)
	if (shader === null) {
		console.error('unable to create shader.')
		return null
	}
	gl.shaderSource(shader, source)
	gl.compileShader(shader)
	const result = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
	if (result) {
		return shader
	}
	const info = gl.getShaderInfoLog(shader)
	console.error('failed to compile shader: ' + info)
	gl.deleteShader(shader)
	return null
}

function ven$createProgram(gl, vertexShaderSource, fragmentShaderSource) {
	const vertexShader = ven$createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
	const fragmentShader = ven$createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
	const program = gl.createProgram()
	if (!vertexShader || !fragmentShader || !program) {
		return null
	}
	gl.attachShader(program, vertexShader)
	gl.attachShader(program, fragmentShader)
	gl.linkProgram(program)
	const result = gl.getProgramParameter(program, gl.LINK_STATUS)
	if (result) {
		return program
	}
	const info = gl.getProgramInfoLog(program)
	console.error('failed to link program: ' + info)
	gl.deleteProgram(program)
	return null
}

function ven$initAttributeVariable(gl, a_attribute, buffer, optional) {
	const { size, type = gl.FLOAT, normalize = false, stride = 0, offset = 0 } = optional
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
	gl.vertexAttribPointer(a_attribute, size, type, normalize, stride, offset)
	gl.enableVertexAttribArray(a_attribute)
}

function ven$initArrayBufferForLaterUse(gl, data = new Float32Array([])) {
	const buffer = gl.createBuffer()
	if (!buffer) {
		console.error('failed to create the buffer object.')
		return null
	}
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
	return buffer
}

function ven$initElementArrayBufferForLaterUse(gl, data) {
	const buffer = gl.createBuffer()
	if (!buffer) {
		console.error('failed to create the buffer object.')
		return null
	}
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer)
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW)
	return buffer
}

function ven$getWebGLVariableLocation(
	gl,
	program,
	cfg = {
		glAttributes: [],
		glUniforms: [],
	}
) {
	const { glAttributes = [], glUniforms = [] } = cfg
	const result = { glUniforms: {}, glAttributes: {} }
	for (let i = 0; i < glAttributes.length; i++) {
		const item = glAttributes[i]
		result.glAttributes[item] = gl.getAttribLocation(program, item)
	}
	for (let i = 0; i < glUniforms.length; i++) {
		const item = glUniforms[i]
		result.glUniforms[item] = gl.getUniformLocation(program, item)
	}
	return result
}

function ven$initFramebufferObject(gl, offScreenWidth, offScreenHeight) {
	let framebuffer
	let texture
	let depthBuffer
	const error = () => {
		if (framebuffer) {
			gl.deleteFramebuffer(framebuffer)
		}
		if (texture) {
			gl.deleteTexture(texture)
		}
		if (depthBuffer) {
			gl.deleteRenderbuffer(depthBuffer)
		}
		return null
	}

	framebuffer = gl.createFramebuffer()
	if (!framebuffer) {
		console.error('failed to create frame buffer object.')
		return error()
	}

	texture = gl.createTexture()
	if (!texture) {
		console.log('failed to create texture object')
		return error()
	}
	gl.bindTexture(gl.TEXTURE_2D, texture)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, offScreenWidth, offScreenHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

	/**
	 * 初始化渲染缓冲区
	 */
	depthBuffer = gl.createRenderbuffer()
	if (!depthBuffer) {
		console.error('failed to create renderbuffer object')
		return error()
	}
	gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer)
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, offScreenWidth, offScreenHeight)

	/**
	 * 将纹理对象和渲染缓冲区关联到帧缓冲区
	 */
	gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer)

	const code = gl.checkFramebufferStatus(gl.FRAMEBUFFER)
	if (gl.FRAMEBUFFER_COMPLETE !== code) {
		console.error('frame buffer object is incomplete: ' + code.toString())
		return error()
	}

	gl.bindFramebuffer(gl.FRAMEBUFFER, null)
	gl.bindTexture(gl.TEXTURE_2D, null)
	gl.bindRenderbuffer(gl.RENDERBUFFER, null)

	return {
		framebuffer,
		texture,
	}
}
