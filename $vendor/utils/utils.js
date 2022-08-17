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
    console.log('%c Synchronous Blocking Start...' + delay +  'ms.', 'color: green; font-size: 18px;') 
    const start = performance.now()
    while (performance.now() - start <= delay) {
        /* ... */
    }
    console.log('%c Synchronous Blocking End...', 'color: green; font-size: 18px;') 
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
function ven$insertArray2Array(
    operaArr, 
    targetArr, 
    insertIndex
) {
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
 * @description 使用 setTimeout 模拟 setInterval
 * @function ven$interval
 * @param {Function} fn 执行函数
 * @param {number} interval 间隔时间
 * @param {object} scope 指定 fn 的作用域
 * @return {{ timer: null }} 
 */
function ven$interval(
    fn, 
    interval, 
    scope = undefined
) {
    let handler = { timer: null }
    let intv = function() {
        fn.call(scope)
        handler.timer = setTimeout(intv, interval)
    }
    handler.timer = setTimeout(intv, interval)
    return handler.timer
}


/**
 * @description 奇偶判断
 * @function ven$isOddEven
 * @param {number} number 被检测数
 * @return {boolean} 
 */
function ven$isOddEven(number) {
    return !!(number & 1)
}


/**
 * @description 缩放图片以适应容器
 * @function ven$zoomImageByContainer
 * @param {number} naturalWidth 图片本身宽度
 * @param {number} naturalHeight 图片本身高度
 * @param {number} containerWidth 容器宽度
 * @param {number} containerHeight 容器高度
 * @return {
 *      { 
 *          width, 
 *          height, 
 *          naturalScale, 
 *          containerScale,
 *          naturalWidth,
 *          naturalHeight,
 *          containerWidth,
 *          containerHeight,
 *          benchmark,
 *      }
 * } 
 */
function ven$zoomImageByContainer(
    naturalWidth,
    naturalHeight,
    containerWidth,
    containerHeight
) {
    const imageRatio = naturalWidth / naturalHeight
    const containerRatio = containerWidth / containerHeight
    let width = 0
    let height = 0
    let benchmark = 'width'
    if (imageRatio >= containerRatio) {
        if (naturalWidth > containerWidth) {
            width = containerWidth
            height = (containerWidth / naturalWidth) * naturalHeight
            benchmark = 'width'
        } else {
            width = naturalWidth
            height = naturalHeight
        }
    } else {
        if (naturalHeight > containerHeight) {
            width = (containerHeight / naturalHeight) * naturalWidth
            height = containerHeight
            benchmark = 'height'
        } else {
            width = naturalWidth
            height = naturalHeight
        }
    }
    return { 
        width, 
        height, 
        naturalScale: width / naturalWidth,
        containerScale: benchmark === 'width' ? height / containerHeight : width / containerWidth,
        naturalWidth,
        naturalHeight,
        containerWidth,
        containerHeight,
        benchmark,
    }
}

/**
 * @description 递归向上查找指定 className 的元素节点
 * @function ven$findTargetByClassName
 * @param {HTMLElement} element HTML 元素
 * @param {string} className class-name
 * @param {array<DOM>} eventPath HTMLEvent Path
 * @param {number} index 索引
 * @return {HTMLElement|null} 
 */
 function ven$findTargetByClassName(element, className, eventPath, index) {
    const nowElement = eventPath[index]
    if ((nowElement.nodeType !== 1 && nowElement.nodeType !== 3) || !nowElement) {
        return null
    }
    if (element.classList.contains(className)) {
        return element
    }
    return ven$findTargetByClassName(element.parentElement, className, eventPath, ++index)
}
