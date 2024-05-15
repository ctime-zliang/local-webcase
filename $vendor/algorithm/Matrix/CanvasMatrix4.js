class Ven$CanvasMatrix4 {
	static setMatrix4() {
		return new Ven$Matrix4()
	}

	/**
	 * @description 创建(相机)视图矩阵
	 * @function createViewAtMatrix4
	 * @param {Ven$Vector3} cameraPosition 相机坐标
	 * @param {Ven$Vector3} lookTargetPosition 观察点坐标
	 * @param {Ven$Vector3} upDirection 初始 Y 轴基向量
	 * @return {Ven$Matrix4}
	 */
	static createViewAtMatrix4(cameraPosition, lookTargetPosition, upDirection = new Ven$Vector3(0, 1, 0)) {
		const c_s_l = cameraPosition.sub(lookTargetPosition)
		let zAxis = c_s_l.normalize()
		if (zAxis.x * zAxis.x + zAxis.y * zAxis.y + zAxis.z * zAxis.z === 0) {
			zAxis.z = 1
		}
		let u_c_zA = upDirection.cross(zAxis)
		let xAxis = u_c_zA.normalize()
		if (xAxis.length === 0) {
			if (Math.abs(upDirection.z) === 1) {
				zAxis.x += 0.0001
			} else {
				zAxis.z += 0.0001
			}
			zAxis = zAxis.normalize()
			xAxis = upDirection.cross(zAxis)
			xAxis = xAxis.normalize()
		}
		let zA_c_xA = zAxis.cross(xAxis)
		let yAxis = zA_c_xA.normalize()

		const matrix4 = new Ven$Matrix4()
		matrix4.data[0] = xAxis.x
		matrix4.data[1] = xAxis.y
		matrix4.data[2] = xAxis.z
		matrix4.data[3] = 0

		matrix4.data[4] = yAxis.x
		matrix4.data[5] = yAxis.y
		matrix4.data[6] = yAxis.z
		matrix4.data[7] = 0

		matrix4.data[8] = zAxis.x
		matrix4.data[9] = zAxis.y
		matrix4.data[10] = zAxis.z
		matrix4.data[11] = 0

		matrix4.data[12] = cameraPosition.x
		matrix4.data[13] = cameraPosition.y
		matrix4.data[14] = cameraPosition.z
		matrix4.data[15] = 1
		return matrix4
	}

	/**
	 * @description 创建正交投影矩阵
	 * @function createOrthoProjectionMatrix4
	 * @param {number} left 可视范围左侧裁剪位置(左侧边界)
	 * @param {number} right 可视范围右侧裁剪位置(右侧边界)
	 * @param {number} bottom 可视范围底部裁剪位置(底部边界)
	 * @param {number} top 可视范围顶部裁剪位置(顶部边界)
	 * @param {number} near 可视范围纵深方向近端裁剪位置(近端边界)
	 * @param {number} far 可视范围纵深方向远端裁剪位置(远端边界)
	 * @return {Ven$Matrix4}
	 */
	static createOrthoProjectionMatrix4(left, right, bottom, top, near, far) {
		const matrix4 = new Ven$Matrix4()
		matrix4.data[0] = 2 / (right - left)
		matrix4.data[1] = 0
		matrix4.data[2] = 0
		matrix4.data[3] = 0

		matrix4.data[4] = 0
		matrix4.data[5] = 2 / (top - bottom)
		matrix4.data[6] = 0
		matrix4.data[7] = 0

		matrix4.data[8] = 0
		matrix4.data[9] = 0
		matrix4.data[10] = 2 / (near - far)
		matrix4.data[11] = 0

		matrix4.data[12] = (left + right) / (left - right)
		matrix4.data[13] = (bottom + top) / (bottom - top)
		matrix4.data[14] = (near + far) / (near - far)
		matrix4.data[15] = 1
		return matrix4
	}
	static createOrthoProjectionMatrix4OfRectView(aspect, near = 100, far = -100, padding = 1) {
		return this.createOrthoProjectionMatrix4(-aspect * padding, aspect * padding, -padding, padding, near, far)
	}

	/**
	 * @description 创建透视投影矩阵
	 * @function createPerspectiveProjectionMatrix4
	 * @param {number} left 可视范围左侧裁剪位置(左侧边界)
	 * @param {number} right 可视范围右侧裁剪位置(右侧边界)
	 * @param {number} bottom 可视范围底部裁剪位置(底部边界)
	 * @param {number} top 可视范围顶部裁剪位置(顶部边界)
	 * @param {number} near 可视范围纵深方向近端裁剪位置(近端边界)
	 * @param {number} far 可视范围纵深方向远端裁剪位置(远端边界)
	 * @return {Ven$Matrix4}
	 */
	static createPerspectiveProjectionMatrix4(left, right, top, bottom, near, far) {
		const matrix4 = new Ven$Matrix4()
		matrix4.data[0] = (2 * near) / (right - left)
		matrix4.data[1] = 0
		matrix4.data[2] = 0
		matrix4.data[3] = 0

		matrix4.data[4] = 0
		matrix4.data[5] = (2 * near) / (top - bottom)
		matrix4.data[6] = 0
		matrix4.data[7] = 0

		matrix4.data[8] = (right + left) / (right - left)
		matrix4.data[9] = (top + bottom) / (top - bottom)
		matrix4.data[10] = -(far + near) / (far - near)
		matrix4.data[11] = -1

		matrix4.data[12] = 0
		matrix4.data[13] = 0
		matrix4.data[14] = (-2 * far * near) / (far - near)
		matrix4.data[15] = 0
		return matrix4
	}
	static createPerspectiveProjectionMatrix4OfRectView(viewRadians, aspect, near = 100, far = -100) {
		const top = near * Math.tan(Math.PI / 180) * 0.5 * viewRadians
		const height = 2 * top
		const width = aspect * height
		const left = -0.5 * width
		return this.createPerspectiveProjectionMatrix4(left, left + width, top, top - height, near, far)
	}

	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/

	/**
	 * @description 创建变换矩阵: 旋转矩阵
	 * @function setRotateMatrxi4
	 * @param {number} radian 旋转弧度
	 * @param {Ven$Vector3} axisVector3 旋转轴(向量)
	 * @return {Ven$Matrix4}
	 */
	static setRotateMatrxi4(radian, axisVector3) {
		const matrix4 = new Ven$Matrix4()
		const { x, y, z } = axisVector3
		let vx = x
		let vy = y
		let vz = z
		let s = Math.sin(radian)
		let c = Math.cos(radian)
		if (0 !== vx && 0 === vy && 0 === vz) {
			// Rotation around X axis
			if (vx < 0) {
				s = -s
			}
			matrix4.data[0] = 1
			matrix4.data[4] = 0
			matrix4.data[8] = 0
			matrix4.data[12] = 0
			matrix4.data[1] = 0
			matrix4.data[5] = c
			matrix4.data[9] = -s
			matrix4.data[13] = 0
			matrix4.data[2] = 0
			matrix4.data[6] = s
			matrix4.data[10] = c
			matrix4.data[14] = 0
			matrix4.data[3] = 0
			matrix4.data[7] = 0
			matrix4.data[11] = 0
			matrix4.data[15] = 1
		} else if (0 === vx && 0 !== vy && 0 === vz) {
			// Rotation around Y axis
			if (vy < 0) {
				s = -s
			}
			matrix4.data[0] = c
			matrix4.data[4] = 0
			matrix4.data[8] = s
			matrix4.data[12] = 0
			matrix4.data[1] = 0
			matrix4.data[5] = 1
			matrix4.data[9] = 0
			matrix4.data[13] = 0
			matrix4.data[2] = -s
			matrix4.data[6] = 0
			matrix4.data[10] = c
			matrix4.data[14] = 0
			matrix4.data[3] = 0
			matrix4.data[7] = 0
			matrix4.data[11] = 0
			matrix4.data[15] = 1
		} else if (0 === vx && 0 === vy && 0 !== vz) {
			// Rotation around Z axis
			if (vz < 0) {
				s = -s
			}
			matrix4.data[0] = c
			matrix4.data[4] = -s
			matrix4.data[8] = 0
			matrix4.data[12] = 0
			matrix4.data[1] = s
			matrix4.data[5] = c
			matrix4.data[9] = 0
			matrix4.data[13] = 0
			matrix4.data[2] = 0
			matrix4.data[6] = 0
			matrix4.data[10] = 1
			matrix4.data[14] = 0
			matrix4.data[3] = 0
			matrix4.data[7] = 0
			matrix4.data[11] = 0
			matrix4.data[15] = 1
		} else {
			// Rotation around another axis
			const len = Math.sqrt(vx * vx + vy * vy + vz * vz)
			if (len !== 1) {
				const rlen = 1 / len
				vx *= rlen
				vy *= rlen
				vz *= rlen
			}
			let nc = 1 - c
			let xy = vx * vy
			let yz = vy * vz
			let zx = vz * vx
			let xs = vx * s
			let ys = vy * s
			let zs = vz * s
			matrix4.data[0] = vx * vx * nc + c
			matrix4.data[1] = xy * nc + zs
			matrix4.data[2] = zx * nc - ys
			matrix4.data[3] = 0
			matrix4.data[4] = xy * nc - zs
			matrix4.data[5] = vy * vy * nc + c
			matrix4.data[6] = yz * nc + xs
			matrix4.data[7] = 0
			matrix4.data[8] = zx * nc + ys
			matrix4.data[9] = yz * nc - xs
			matrix4.data[10] = vz * vz * nc + c
			matrix4.data[11] = 0
			matrix4.data[12] = 0
			matrix4.data[13] = 0
			matrix4.data[14] = 0
			matrix4.data[15] = 1
		}
		return matrix4
	}

	/**
	 * @description 创建变换矩阵: 平移矩阵
	 * @function setTranslate
	 * @param {Ven$Vector3} directionVector3 位移(向量)
	 * @return {Ven$Matrix4}
	 */
	static setTranslate(directionVector3) {
		const matrix4 = new Ven$Matrix4()
		const { x, y, z } = directionVector3
		matrix4.data[0] = 1
		matrix4.data[4] = 0
		matrix4.data[8] = 0
		matrix4.data[12] = x
		matrix4.data[1] = 0
		matrix4.data[5] = 1
		matrix4.data[9] = 0
		matrix4.data[13] = y
		matrix4.data[2] = 0
		matrix4.data[6] = 0
		matrix4.data[10] = 1
		matrix4.data[14] = z
		matrix4.data[3] = 0
		matrix4.data[7] = 0
		matrix4.data[11] = 0
		matrix4.data[15] = 1
		return matrix4
	}

	/**
	 * @description 创建变换矩阵: 缩放矩阵
	 * @function setScale
	 * @param {Ven$Vector3} directionVector3 位移(向量)
	 * @return {Ven$Matrix4}
	 */
	static setScale(directionVector3) {
		const matrix4 = new Ven$Matrix4()
		const { x, y, z } = directionVector3
		matrix4.data[0] = x
		matrix4.data[4] = 0
		matrix4.data[8] = 0
		matrix4.data[12] = 0
		matrix4.data[1] = 0
		matrix4.data[5] = y
		matrix4.data[9] = 0
		matrix4.data[13] = 0
		matrix4.data[2] = 0
		matrix4.data[6] = 0
		matrix4.data[10] = z
		matrix4.data[14] = 0
		matrix4.data[3] = 0
		matrix4.data[7] = 0
		matrix4.data[11] = 0
		matrix4.data[15] = 1
		return matrix4
	}

	/**
	 * @description 创建正交投影矩阵
	 * @function setOrtho
	 * @param {number} left 可视范围左侧裁剪位置(左侧边界)
	 * @param {number} right 可视范围右侧裁剪位置(右侧边界)
	 * @param {number} bottom 可视范围底部裁剪位置(底部边界)
	 * @param {number} top 可视范围顶部裁剪位置(顶部边界)
	 * @param {number} near 可视范围纵深方向近端裁剪位置(近端边界)
	 * @param {number} far 可视范围纵深方向远端裁剪位置(远端边界)
	 * @return {Ven$Matrix4}
	 */
	static setOrtho(left, right, bottom, top, near, far) {
		const matrix4 = new Ven$Matrix4()
		let rw = 0
		let rh = 0
		let rd = 0
		if (left === right || bottom === top || near === far) {
			throw 'null frustum'
		}
		rw = 1 / (right - left)
		rh = 1 / (top - bottom)
		rd = 1 / (far - near)
		matrix4.data[0] = 2 * rw
		matrix4.data[1] = 0
		matrix4.data[2] = 0
		matrix4.data[3] = 0
		matrix4.data[4] = 0
		matrix4.data[5] = 2 * rh
		matrix4.data[6] = 0
		matrix4.data[7] = 0
		matrix4.data[8] = 0
		matrix4.data[9] = 0
		matrix4.data[10] = -2 * rd
		matrix4.data[11] = 0
		matrix4.data[12] = -(right + left) * rw
		matrix4.data[13] = -(top + bottom) * rh
		matrix4.data[14] = -(far + near) * rd
		matrix4.data[15] = 1
		return matrix4
	}
	static setOrthoRectView(aspect, near = 100, far = -100, padding = 1) {
		return this.setOrtho(-aspect * padding, aspect * padding, -padding, padding, near, far)
	}

	static setPerspective(fovy, aspect, near, far) {
		const matrix4 = new Ven$Matrix4()
		if (near === far || aspect === 0) {
			throw 'null frustum'
		}
		if (near <= 0) {
			throw 'near <= 0'
		}
		if (far <= 0) {
			throw 'far <= 0'
		}

		let _fovy = (Math.PI * fovy) / 180 / 2
		let s = Math.sin(_fovy)
		if (s === 0) {
			throw 'null frustum'
		}
		let rd = 1 / (far - near)
		let ct = Math.cos(_fovy) / s

		matrix4.data[0] = ct / aspect
		matrix4.data[1] = 0
		matrix4.data[2] = 0
		matrix4.data[3] = 0

		matrix4.data[4] = 0
		matrix4.data[5] = ct
		matrix4.data[6] = 0
		matrix4.data[7] = 0

		matrix4.data[8] = 0
		matrix4.data[9] = 0
		matrix4.data[10] = -(far + near) * rd
		matrix4.data[11] = -1

		matrix4.data[12] = 0
		matrix4.data[13] = 0
		matrix4.data[14] = -2 * near * far * rd
		matrix4.data[15] = 0
		return matrix4
	}

	/**
	 * @description 创建视图矩阵
	 * @function setLookAt
	 * @param {Ven$Vector3} eyeVector3 观察者视点位置
	 * @param {Ven$Vector3} atVector3 观察目标点位置
	 * @param {Ven$Vector3} upVector3 观察者上方向
	 * @return {Ven$Matrix4}
	 */
	static setLookAt(eyeVector3, atVector3, upVector3 = new Ven$Vector3(0, 1, 0)) {
		const matrix4 = new Ven$Matrix4()
		const { x: eyeX, y: eyeY, z: eyeZ } = eyeVector3
		const { x: atX, y: atY, z: atZ } = atVector3
		const { x: upX, y: upY, z: upZ } = upVector3

		let fx = atX - eyeX
		let fy = atY - eyeY
		let fz = atZ - eyeZ

		const rlf = 1 / Math.sqrt(fx * fx + fy * fy + fz * fz)
		fx *= rlf
		fy *= rlf
		fz *= rlf

		let sx = fy * upZ - fz * upY
		let sy = fz * upX - fx * upZ
		let sz = fx * upY - fy * upX

		const rls = 1 / Math.sqrt(sx * sx + sy * sy + sz * sz)
		sx *= rls
		sy *= rls
		sz *= rls

		let ux = sy * fz - sz * fy
		let uy = sz * fx - sx * fz
		let uz = sx * fy - sy * fx

		matrix4.data[0] = sx
		matrix4.data[1] = ux
		matrix4.data[2] = -fx
		matrix4.data[3] = 0
		matrix4.data[4] = sy
		matrix4.data[5] = uy
		matrix4.data[6] = -fy
		matrix4.data[7] = 0
		matrix4.data[8] = sz
		matrix4.data[9] = uz
		matrix4.data[10] = -fz
		matrix4.data[11] = 0
		matrix4.data[12] = 0
		matrix4.data[13] = 0
		matrix4.data[14] = 0
		matrix4.data[15] = 1

		// return matrix4.multiply4(Ven$CanvasMatrix4.setTranslate(new Ven$Vector3(-eyeX, -eyeY, -eyeZ)))
		return Ven$CanvasMatrix4.setTranslate(new Ven$Vector3(-eyeX, -eyeY, -eyeZ)).multiply4(matrix4)
	}
}

/****************************************************************************************************/
/****************************************************************************************************/
/****************************************************************************************************/
/****************************************************************************************************/
/****************************************************************************************************/

/**
 * @description 创建绕轴旋转矩阵
 * @function ven$matrix4RotateX
 * @param {Ven$Matrix4} ref 参考矩阵
 * @param {number} angle 旋转角度
 * @return {Ven$Matrix4}
 */
function ven$matrix4RotateX(ref, angle) {
	const matrix4 = new Ven$Matrix4()
	const m10 = ref.data[4]
	const m11 = ref.data[5]
	const m12 = ref.data[6]
	const m13 = ref.data[7]
	const m20 = ref.data[8]
	const m21 = ref.data[9]
	const m22 = ref.data[10]
	const m23 = ref.data[11]
	const cos = Math.cos(angle)
	const sin = Math.sin(angle)

	matrix4.data[4] = cos * m10 + sin * m20
	matrix4.data[5] = cos * m11 + sin * m21
	matrix4.data[6] = cos * m12 + sin * m22
	matrix4.data[7] = cos * m13 + sin * m23
	matrix4.data[8] = cos * m20 - sin * m10
	matrix4.data[9] = cos * m21 - sin * m11
	matrix4.data[10] = cos * m22 - sin * m12
	matrix4.data[11] = cos * m23 - sin * m13

	matrix4.data[0] = ref.data[0]
	matrix4.data[1] = ref.data[1]
	matrix4.data[2] = ref.data[2]
	matrix4.data[3] = ref.data[3]
	matrix4.data[12] = ref.data[12]
	matrix4.data[13] = ref.data[13]
	matrix4.data[14] = ref.data[14]
	matrix4.data[15] = ref.data[15]
	return matrix4
}
/**
 * @description 创建绕轴旋转矩阵
 * @function ven$matrix4RotateY
 * @param {Ven$Matrix4} ref 参考矩阵
 * @param {number} angle 旋转角度
 * @return {Ven$Matrix4}
 */
function ven$matrix4RotateY(ref, angle) {
	const matrix4 = new Ven$Matrix4()
	const m00 = ref.data[0]
	const m01 = ref.data[1]
	const m02 = ref.data[2]
	const m03 = ref.data[3]
	const m20 = ref.data[8]
	const m21 = ref.data[9]
	const m22 = ref.data[10]
	const m23 = ref.data[11]
	const cos = Math.cos(angle)
	const sin = Math.sin(angle)

	matrix4.data[0] = cos * m00 - sin * m20
	matrix4.data[1] = cos * m01 - sin * m21
	matrix4.data[2] = cos * m02 - sin * m22
	matrix4.data[3] = cos * m03 - sin * m23
	matrix4.data[8] = cos * m20 + sin * m00
	matrix4.data[9] = cos * m21 + sin * m01
	matrix4.data[10] = cos * m22 + sin * m02
	matrix4.data[11] = cos * m23 + sin * m03

	matrix4.data[4] = ref.data[4]
	matrix4.data[5] = ref.data[5]
	matrix4.data[6] = ref.data[6]
	matrix4.data[7] = ref.data[7]
	matrix4.data[12] = ref.data[12]
	matrix4.data[13] = ref.data[13]
	matrix4.data[14] = ref.data[14]
	matrix4.data[15] = ref.data[15]
	return matrix4
}
/**
 * @description 创建绕轴旋转矩阵
 * @function ven$matrix4RotateZ
 * @param {Ven$Matrix4} ref 参考矩阵
 * @param {number} angle 旋转角度
 * @return {Ven$Matrix4}
 */
function ven$matrix4RotateZ(ref, angle) {
	const matrix4 = new Ven$Matrix4()
	const m00 = ref.data[0]
	const m01 = ref.data[1]
	const m02 = ref.data[2]
	const m03 = ref.data[3]
	const m10 = ref.data[4]
	const m11 = ref.data[5]
	const m12 = ref.data[6]
	const m13 = ref.data[7]
	const cos = Math.cos(angle)
	const sin = Math.sin(angle)

	matrix4.data[0] = cos * m00 + sin * m10
	matrix4.data[1] = cos * m01 + sin * m11
	matrix4.data[2] = cos * m02 + sin * m12
	matrix4.data[3] = cos * m03 + sin * m13
	matrix4.data[4] = cos * m10 - sin * m00
	matrix4.data[5] = cos * m11 - sin * m01
	matrix4.data[6] = cos * m12 - sin * m02
	matrix4.data[7] = cos * m13 - sin * m03

	matrix4.data[8] = ref.data[8]
	matrix4.data[9] = ref.data[9]
	matrix4.data[10] = ref.data[10]
	matrix4.data[11] = ref.data[11]
	matrix4.data[12] = ref.data[12]
	matrix4.data[13] = ref.data[13]
	matrix4.data[14] = ref.data[14]
	matrix4.data[15] = ref.data[15]
	return matrix4
}
