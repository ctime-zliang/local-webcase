function loadTexture(gl, src, uniform, callback) {
	const initTexture = (gl, imageInstance) => {
		// gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
		/**
		 * 激活纹理单元
		 * 		0 号纹理单元
		 */
		gl.activeTexture(gl.TEXTURE0)
		/**
		 * 创建并绑定纹理对象
		 */
		const texture = gl.createTexture()
		gl.bindTexture(gl.TEXTURE_2D, texture)
		/**
		 * 纹理参数设置
		 */
		gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
		/**
		 * 使用 Image 对象实例填充纹理内容
		 */
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, imageInstance)
	}
	const img = new Image()
	img.crossOrigin = 'anonymous'
	img.onload = function (e) {
		initTexture(gl, this)
		/**
		 * 由于被激活且已绑定了纹理对象的纹理单元为 0 号纹理单元, 因此此处将对应纹理单元的编号(即 0)传递给着色器中的采样器变量
		 */
		gl.uniform1i(uniform, 0)
		callback && callback()
	}
	img.src = src
}
