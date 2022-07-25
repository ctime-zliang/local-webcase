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
    indexArray.sort(__ven$naturalSort__naturalCompare(
        itemArray, 
        typeArray, 
        digit, 
        letter
    ))
    const result = []
    for (let i = 0; i < array.length; i++) {
        result[i] = array[indexArray[i]]
    }
    return result
}
function __ven$naturalSort__naturalCompare(
    itemArray, 
    typeArray, 
    digit, 
    lettter
) {
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


/**
 * @description 获取一组形如 {a: [], b: [], c: [], ...} 的数据中的所有的数组中相同的数据(假设数组元素均为原始类型)
 * @function ven$findIntersectionInArrays
 * @param {object} data 被检索数据
 * @return {array<string|number|unknown>} 
 */
function ven$findIntersectionInArrays(data) {
    let keys = Object.keys(data)
    if (!keys.length) {
        return []
    }
    let f = data[keys[0]]
    keys.reduce((pre, cur, idx, arr) => {
        f = f.filter((item) => {
            return data[cur].indexOf(item) !== -1
        })
        return f
    }, dara[keys[0]])
    return f
}
