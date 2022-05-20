/**
 * @description 冒泡排序(基础版)
 * @function ven$bubbleSort
 * @param {array} arr 被排序数组
 * @return {array} 
 */ 
function ven$bubbleSort(arr = []) {
    let res = arr.slice(0)
    let len = res.length
    let swap = 0
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - 1 - i; j++) {
            if (res[j] > res[j + 1]) {
                swap = res[j + 1]
                res[j + 1] = res[j]
                res[j] = swap
            }
        }
    }
    return res
}


/** 
 * @description 冒泡排序(优化版)
 * @function ven$bubbleSortOptimi
 * @param {array} arr 被排序数组
 * @return {array} 
 */
function ven$bubbleSortOptimi(arr = []) {
    let arrCopy = arr.slice(0)
    let len = arrCopy.length
    let swap = 0
    let isChange = false
    for (let i = 0; i < len; i++) {
        isChange = 0
        for (let j = len - 1; j > i; j--) {
            if (arrCopy[j - 1] > arrCopy[j]) {
                swap = arrCopy[j - 1]
                arrCopy[j - 1] = arrCopy[j]
                arrCopy[j] = swap
                isChange = true
            }
        }
        /* 如果某一轮遍历未发生值对换, 则表示该数组已排序完成 */
        if (!isChange) {
            break
        }
    }
    return arrCopy
}


/**
 * @description 选择排序
 * @function ven$selectionSort
 * @param {array} arr 被排序数组
 * @return {array} 
 */
function ven$selectionSort(arr = []) {
    let arrCopy = arr.slice(0)
    let len = arrCopy.length
    let minIndexPos = 0
    let swap = 0
    for (let i = 0; i < len - 1; i++) {
        /* 重置下标值为 i */
        minIndexPos = i
        /* 内层遍历, 查找最小值 */
        for (let j = i + 1; j < len; j++) {
            if (arrCopy[j] < arrCopy[minIndexPos]) {
                /* 记录在当前查找段内的最小值的索引 */
                minIndexPos = j
            }
        }
        /* 交换当前遍历段第一个元素与最小值元素的位置 */
        swap = arrCopy[minIndexPos]
        arrCopy[minIndexPos] = arrCopy[i]
        arrCopy[i] = swap
    } 
    return arrCopy
}


/**
 * @description 快速顺排序
 * @function ven$quickSeqSort
 * @param {array} arr 被排序数组
 * @return {array} 
 */
function ven$quickSeqSort(arr = []) {
    let arrCopy = arr.slice(0)
    return recursion(arrCopy)

    function recursion(arr = []) {          
        if (arr.length <= 1) {
            return arr
        }
        let middleIndex = Math.floor(arr.length / 2)
        let middleValue = arr.splice(middleIndex, 1)[0]
        let leftArr = []
        let rightArr = []
        /* 
            遍历数组
            按照大小归类
            左侧数组存储大于等于中间值的元素项
            右侧数组存储小雨中间值的元素项
         */
        for (let i = 0; i < arr.length; i++) {
            arr[i] < middleValue ? leftArr.push(arr[i]) : rightArr.push(arr[i])
        }  
        return recursion(leftArr).concat([middleValue], recursion(rightArr))
    }
}


/**
 * @description 快速逆排序
 * @function ven$quickInvSort
 * @param {array} arr 被排序数组
 * @return {array} 
 */
function ven$quickInvSort(arr = []) {
    let arrCopy = arr.slice(0)
    return recursion(arrCopy)

    function recursion(arr = []){
        if (arr.length <= 1) {
            return arr
        }
        let middleIndex = Math.floor(arr.length / 2)
        let middleValue = arr.splice(middleIndex, 1)[0]
        let leftArr = []
        let rightArr = []            
        /* 
            遍历数组
            按照大小归类
            左侧数组存储大于等于中间值的元素项
            右侧数组存储小雨中间值的元素项
         */
        for (let i = 0; i < arr.length; i++) {
            arr[i] >= middleValue ? leftArr.push(arr[i]) : rightArr.push(arr[i])
        }
        return recursion(leftArr).concat([middleValue], recursion(rightArr))
    }
}


/**
 * @description 插入排序
 * @function ven$insertSort
 * @param {array} arr 被排序数组
 * @return {array} 
 */
function ven$insertSort(arr = []){
    let arrCopy = arr.slice(0)
    let len = arrCopy.length
    /* 标记索引 & 标记值 */
    let tagValue = 0
    let tagIndex = 0
    for (let i = 1; i < len; i++) {
        /* 缓存 标记值 & 标记索引 */
        tagValue = arrCopy[tagIndex = i, tagIndex]        
        /* 
            依次判断内层遍历各项与标记值得大小
            从标记索引开始 向前遍历 
        */
        while (tagIndex > 0) {
            /* 
                如果
                    遍历中某项的值大于标记值, 则将其后移一位, 依次进行
                否则
                    退出内层遍历 
            */
            if (tagValue < arrCopy[tagIndex - 1]) {
                arrCopy[tagIndex] = arrCopy[tagIndex - 1]
                tagIndex--
            } else {
                break
            }
        }        
        /* 内层遍历结束后, 将标记值写入到新的索引位置(tagIndex的值可能没有变化) */
        arrCopy[tagIndex] = tagValue
    }
    return arrCopy
}


/**
 * @description 归并排序
 * @function ven$mergeSort
 * @param {array} arr 被排序数组
 * @return {array} 
 */
function ven$mergeSort(arr = []){
    return groupRecursion(arr)
     
    function groupRecursion(arr = []){
        /* 递归终止条件 */
        if (arr.length <= 1) {
            return arr
        }
        /* 获取数组中间项索引 */
        /* 并按照索引分割数组 */
        let middleIndex = Math.floor(arr.length / 2)
        let leftArr = arr.slice(0, middleIndex)
        let rightArr = arr.slice(middleIndex)
        return merge(
            groupRecursion(leftArr),
            groupRecursion(rightArr)
        )
    }

    function merge(leftArr, rightArr) {
        /* 输出结果集 */
        let array = []       
        /* 遍历并对比左数组和右数组 */
        while (leftArr.length && rightArr.length) {
            if (leftArr[0] <= rightArr[0]) {
                array.push(leftArr.shift())
            } else {
                array.push(rightArr.shift())
            }
        }  
        /* 将左数组剩余项压入结果集 */
        while (leftArr.length) {
            array.push(leftArr.shift())
        }
        /* 将右数组剩余项压入结果集 */
        while (rightArr.length) {
            array.push(rightArr.shift())
        }
        return array
    }
}


window.ArraySort = {
    ven$bubbleSort,
    ven$bubbleSortOptimi,
    ven$selectionSort,
    ven$quickSeqSort,
    ven$quickInvSort,
    ven$insertSort,
    ven$mergeSort
}