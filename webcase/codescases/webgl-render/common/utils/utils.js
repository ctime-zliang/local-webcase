function loadTexture(gl, src, u_Sampler, textureUnitIndex, callback) {
	const initTexture = (gl, imageInstance) => {
		// gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
		/**
		 * 激活纹理单元
		 */
		const s = `TEXTURE${textureUnitIndex}`
		gl.activeTexture(gl[s])
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
		 * 通过唯一的 gl.uniform1i 采样器编号赋值方法给着色器采样器赋值纹理编号
		 */
		gl.uniform1i(u_Sampler, textureUnitIndex)
		callback && callback(gl, textureUnitIndex)
	}
	img.src = src
}
