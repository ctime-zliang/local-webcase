/**
 * @description 数组分组
 *      获取由各项子数组构成的输出数组
 * @function ven$chunkArray
 * @param {array} array 被切割的数组
 * @param {number} size 每组尺寸长度
 * @return {array<any>}
 */
function ven$chunkArray(array, size) {
	const res = []
	Array.from({ length: Math.ceil(array.length / size) }, (value, index) => {
		res.push(array.slice(+value * size, (index + 1) * size))
	})
	return res
}
