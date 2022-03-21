/**
 * 类型检测
 * @param {any} target 被检测数据
 * @return {string}
 */
 async function ven$classOf(target) {
    return Object.prototype.toString.call(target).slice(8, -1).toLowerCase()
}


/**
 * 同步进程阻塞
 * @param {number} delay 阻塞时长
 * @return {undefined}
 */
function ven$choke(delay = 1000) {
    console.log('%c start choke while...', 'color: green; font-size: 18px;') 
    const start = performance.now()
    while (performance.now() - start <= delay) {
        /* ... */    
    }
    console.log('%c end choke while...', 'color: green; font-size: 18px;') 
}


/**
 * 异步等待阻塞
 * @param {number} delay 阻塞时长
 * @return {promise<undefined>}
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
 * @return {array<any>} 
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
 * @return {array<any>}
 */
function ven$nativeSortSeq(arr) {
    return arr.sort((a, b) => {
        return +a - +b
    })
}


/**
 * 移除数组前面所有的 0 项
 * @param {array} arr 目标数组
 * @return {array<any>}
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
        for (let i = 0; i < keys.length; i++) {
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


/**
 * 在指定上下限范围内生成随机数
 * @param {number} min 指定下限
 * @param {number} max 指定上限
 * @return {number} 
 */
function ven$getRandomInArea(min = 0, max = Number.MAX_SAFE_INTEGER) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}


/**
 * 生成指定长度的数组并以固定值填充各位
 * @param {any} value 默认填充值
 * @return {array<any>} 
 */
function ven$createArray(length, value = undefined) {
    return new Array(length + 1).join(value).split('')
}


/**
 * 以 0 补全数值位数
 * @param {number} number 数值
 * @param {number} allLength 位数
 * @return {number} 
 */
function ven$padNumber(number, allLength) {
    let len = String( number ).length
    return Array(allLength > len ? allLength - len + 1 || 0 : 0).join(0) + number
}


/**
 * 在数组插入另一数组的指定位置
 * @param {array<any>} operaArr 需要插入的数组
 * @param {array<any>} targetArr 被插入的数组
 * @param {number} insertIndex 索引位置
 * @return {undefined} 
 */
function ven$padNumber(operaArr, targetArr, insertIndex) {
    /* 将 operaArr 插入到 targetArr 的 insertIndex 处 */
    targetArr.splice.apply(targetArr, Array.concat(insertIndex, 0, operaArr))
}

/**
 * 依据 HTML 字符串生成 DOM 片段
 * @param {string} htmlString HTML 字符串
 * @return {Element} 
 */
 function ven$createElementFragment(htmlString, useDOMParser = false) {
    if (useDOMParser) {
        return new DOMParser().parseFromString(htmlString, 'text/html')
    }
    return document.createRange().createContextualFragment(htmlString)
}



/**
 * 求最长公共子串
 * @param {string} stringA 字符串 A
 * @param {string} stringB 字符串 B
 * @return {string} 
 */
function ven$getLCS(stringA, stringB) {
    const res = { count: -1, string: `` }
    if (!stringA || !stringA.length || !stringB || !stringB.length) {
        return res
    }
    const matrix = []
    let maxSubstringLength = 0
    let maxRightEndIndex = 0
    const [longString, shortString] = __ven$getLCS__swap(stringA, stringB)
    for (let i = 0; i < longString.length; i++) {
        if (!matrix[i]) {
            matrix[i] = []
        }
        for (let j = 0; j < shortString.length; j++) {
            if (longString[i] === shortString[j]) {
                if (i === 0 || j === 0) {
                    matrix[i][j] = 1
                } else {
                    matrix[i][j] = matrix[i - 1][j - 1] + 1                    
                }
                res.count = matrix[i][j]
            } else {
                matrix[i][j] = 0
            }
            if (matrix[i][j] > maxSubstringLength) {
                maxSubstringLength = matrix[i][j]
                maxRightEndIndex = i
            }
        }
    }
    res.string = longString.substring(maxRightEndIndex - maxSubstringLength + 1, maxRightEndIndex + 1)
    console.log(matrix)
    return res
}
function __ven$getLCS__swap(stringA, stringB) {
    if (stringA.length >= stringB.length) {
        return [stringA, stringB]
    }
    return [stringB, stringA]
}
