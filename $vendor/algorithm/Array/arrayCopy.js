/**
 * @description 数组部分拷贝
 * @function ven$arrayCopy
 * @param {array} array 被切割的数组
 * @param {number} size 每组尺寸长度
 * @return {array<any>}
 */
function ven$arrayCopy(sourceArray, sourceIndex, result, resultIndex, copyLength) {
	if (sourceArray.length >= sourceIndex + copyLength && result.length >= resultIndex + copyLength) {
		while (copyLength-- > 0) {
			result[resultIndex++] = sourceArray[sourceIndex++]
		}
		return
	}
	throw new Error('cannot read array out of range.')
}
