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


/**
 * 判断对象是否为空
 * @param {object} obj 被检测对象
 * @return {boolean}
 */
function ven$isEmptyObject(obj) {
    for (let attr in obj) {
        return false
    }
    return true
}


/**
 * 原生 sort 实现对数字数组升序安排序
 * @param {array} arr 目标数组
 * @return {array}
 */
function ven$nativeSortSeq(arr) {
    return arr.sort((a, b) => {
        return +a - +b
    })
}


/**
 * 移除数组前面所有的 0 项
 * @param {array} arr 目标数组
 * @return {array}
 */
function ven$removeAllFrontZero(arr) {
    let res = []
    let flag = false
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === 0 && !flag) {
            continue
        } else {
            flag = true
        }
        res.push(arr[i])
    }
    return res
}


/**
 * 将数组依据指定的 keys 排序
 * @param {array} keys 参考字段数组
 * @param {boolean} seq 升序 or 降序
 * @return {number}
 */
function ven$sortBy(keys, seq = true) {
    const rev = !!seq ? 1 : -1
    return (a, b) => {
        for (let i = 0; i < keys[i]; i++) {
            let key = keys[i]
            if (a[key] !== b[key]) {
                if (a[key] > b[key]) {
                    return rev * 1
                }
                return rev * -1
            }
        }
    }
}
