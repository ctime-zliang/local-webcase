/**
 * @description 类型检测
 * @function ven$classOf
 * @param {any} target 被检测数据
 * @return {string}
 */
async function ven$classOf(target) {
    return Object.prototype.toString.call(target).slice(8, -1).toLowerCase()
}


/**
 * @description 同步阻塞
 * @function ven$choke
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
 * @description 异步等待阻塞
 * @function ven$sleep
 * @param {number} delay 阻塞时长
 * @return {promise<undefined>}
 */
async function ven$sleep(delay = 1000) {
    return Promise((_, reject) => {
        window.setTimeout(_, delay)
    })
}


/**
 * @description 数组分组
 *      获取由各项子数组构成的输出数组
 * @function ven$chunk
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
 * @description 判断对象是否为空
 * @function ven$isEmptyObject
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
 * @description 原生 sort 实现对数字数组升序安排序
 * @function ven$nativeSortSeq
 * @param {array} arr 目标数组
 * @return {array<any>}
 */
function ven$nativeSortSeq(arr) {
    return arr.sort((a, b) => {
        return +a - +b
    })
}


/**
 * @description 移除数组前面所有的 0 项
 * @function ven$removeAllFrontZero
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
 * @description 将 json 依据指定的 keys 排序
 * @function ven$sortJsonByKeys
 * @param {array} keys 参考字段数组
 * @param {boolean} seq 升序 or 降序
 * @return {number}
 */
function ven$sortJsonByKeys(keys, seq = true) {
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
 * @description 在指定上下限范围内生成随机数
 * @function ven$getRandomInArea
 * @param {number} min 指定下限
 * @param {number} max 指定上限
 * @return {number} 
 */
function ven$getRandomInArea(min = 0, max = Number.MAX_SAFE_INTEGER) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}


/**
 * @description 生成指定长度的数组并以固定值填充各位
 * @function ven$createArray
 * @param {any} value 默认填充值
 * @return {array<any>} 
 */
function ven$createArray(length, value = undefined) {
    return new Array(length + 1).join(value).split('')
}


/**
 * @description 以 0 补全数值位数
 * @function ven$padNumber
 * @param {number} number 数值
 * @param {number} allLength 位数
 * @return {number} 
 */
function ven$padNumber(number, allLength) {
    let len = String(number).length
    return Array(allLength > len ? allLength - len + 1 || 0 : 0).join('') + number
}


/**
 * @description 在数组插入另一数组的指定位置
 * @function ven$insertArray2Array
 * @param {array<any>} operaArr 需要插入的数组
 * @param {array<any>} targetArr 被插入的数组
 * @param {number} insertIndex 索引位置
 * @return {undefined} 
 */
function ven$insertArray2Array(operaArr, targetArr, insertIndex) {
    /* 将 operaArr 插入到 targetArr 的 insertIndex 处 */
    targetArr.splice.apply(targetArr, Array.concat(insertIndex, 0, operaArr))
}

/**
 * @description 依据 HTML 字符串生成 DOM 片段
 * @function ven$createElementFragment
 * @param {string} htmlString HTML 字符串
 * @param {boolean} useDOMParser 是否使用 DOMParser API
 * @return {Element} 
 */
function ven$createElementFragment(htmlString, useDOMParser = false) {
    if (useDOMParser) {
        return new DOMParser().parseFromString(htmlString, 'text/html')
    }
    return document.createRange().createContextualFragment(htmlString)
}


/**
 * @description 按照自然排序规律重排数组(简单数组或 json)元素
 * @function ven$naturalSort
 * @param {array<string|number|object>} array 被排序数组
 * @param {string} key 当 array 是 json 时, 指定一个排序依据键
 * @return {array<string|number|object>} 
 */
function ven$naturalSort(array, key = '') {
    const indexArray = []
    const itemArray = []
    const typeArray = []
    const digit = 1
    const letter = 2
    for (let i =0; i< array.length; i++) {
        indexArray[i] = i
        const string = key ? (array[i][key] || '') : array[i]
        itemArray[i] = string.toUpperCase().match(/\D+|\d+(?:\.\d+)?/g)
        typeArray[i] = []
        if (itemArray[i]) {
            for (let j = 0; j < itemArray[i].length; j++) {
                typeArray[i][j] = itemArray[i][j].match(/\d+/) ? digit : letter
            }
        }
    }
    indexArray.sort(__ven$naturalSort__naturalCompare(itemArray, typeArray, digit, letter))
    const result = []
    for (let i = 0; i < array.length; i++) {
        result[i] = array[indexArray[i]]
    }
    return result
}
function __ven$naturalSort__naturalCompare(itemArray, typeArray, digit, lettter) {
    return (a, b) => {
        const itemA = itemArray[a]
        const itemB = itemArray[b]
        const typeA = typeArray[a]
        const typeB = typeArray[b]
        if (!itemA || !itemB) {
            return itemA === itemB ? 0 : (itemA ? 1 : -1)
        }
        const len = Math.max(itemA.length, itemB.length)
        for (let i = 0; i < len; i++) {
            if (!itemA[i]) {
                return -1
            }
            if (!itemB[i]) {
                return 1
            }
            if (itemA[i] === itemB[i]) {
                continue
            }
            if (typeA[i] !== typeB[i]) {
                return typeA[i] === digit ? -1 : 1
            }
            if (typeA[i] === digit) {
                return itemA[i] -  itemB[i]
            }
            return itemA[i] < itemB[i] ? -1 : 1
        }
        return 0
    }
}
