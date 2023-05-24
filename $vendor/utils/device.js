/**
 * @description 获取设备 DPR
 * @function ven$getDPR
 * @return {number}
 */
function ven$getDPR() {
	return window.devicePixelRatio || 1
}

/**
 * @description 获取设备 DPI
 * @function ven$getDPI
 * @return {number}
 */
function ven$getDPI(absolute = false) {
	const arrDPI = new Array(2)
	const dpr = ven$getDPR()
	const tmpNode = document.createElement('div')
	tmpNode.style.cssText = `height: 1in; left: -100%; position: absolute; top: -100%; width: 1in;`
	document.body.appendChild(tmpNode)
	arrDPI[0] = parseInt(tmpNode.offsetWidth)
	arrDPI[1] = parseInt(tmpNode.offsetHeight)
	tmpNode.parentNode.removeChild(tmpNode)
	if (absolute === true) {
		return arrDPI
	}
	arrDPI[0] *= dpr
	arrDPI[1] *= dpr
	return arrDPI
}
