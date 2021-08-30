/**
 * 同步进程阻塞
 * @param {number} delay 阻塞时长
 * @return {undefined}
 */
function ven$choke(delay = 1000) {
    console.log('%c start choke while...', 'color: green; font-size: 18px;') 
    const start = performance.now()
    while(performance.now() - start <= delay) {
        /* ... */    
    }
    console.log('%c end choke while...', 'color: green; font-size: 18px;') 
}

/**
 * 异步等待阻塞
 * @param {number} delay 阻塞时长
 * @return {undefined}
 */
async function ven$sleep(delay = 1000) {
    return Promise((_, reject) => {
        window.setTimeout(_, delay)
    })
}

/**
 * 数组分组
 *      获取由各项子数组构成的输出数组
 * @param {array} array 被切割的数组
 * @param {number} size 每组尺寸长度
 * @return {array} 
 */ 
function ven$chunk(array, size) {
    const res = []
	Array.from({ length: Math.ceil(array.length / size) }, (value, index) => {
		res.push(array.slice(+value * size, (index + 1) * size))
	})
	return res 
}
