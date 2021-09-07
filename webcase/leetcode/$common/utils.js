/**
 * 将链表转换成数组
 * @param {ListNode} list 链表
 * @return {array} 
 */
function $setList2Array(list) {
    const arr = []
    arr.push(list.val)
    while (list.next) {        
        list = list.next
        arr.push(list.val)
    }
    return arr
}

/**
 * 将数组转换成链表
 * @param {array} arr 数组
 * @return {ListNode} 
 */
function $setArray2List(arr) {
    const head = new ListNode(arr[0], null)
    let p = head
    for (let i = 1; i < arr.length; i++) {
        const node = new ListNode(arr[i], null)
        p.next = node
        p = node
    }
    return head
}  

/**
 * 判断对象是否为空
 * @param {object} obj 被检测对象
 * @return {boolean}
 */
function $isEmptyObject(obj) {
    for (let attr in obj) {
        return false
    }
    return true
}

/**
 * 快速顺排序
 * @param {array} arr 被排序数组
 * @return {array}
 */
function $quickSortSeq(arr) {
    return __$quickSortSeqRecusion(arr)
}
function __$quickSortSeqRecusion(arr) {
    if (arr.length <= 1) {
        return arr
    }
    const middleIndex = Math.floor(arr.length / 2)
    const middlevalue = arr.splice(middleIndex, 1)[0]
    const leftArr = []
    const rightArr = []
    for (let i = 0; i < arr.length; i++) {
        arr[i] < middlevalue ? leftArr.push(arr[i]) : rightArr.push(arr[i])
    }
    return __$quickSortSeqRecusion(leftArr).concat([middlevalue], __$quickSortSeqRecusion(rightArr))
}

/**
 * 原生 sort 实现对数字数组升序安排序
 * @param {array} arr 被排序数组
 * @return {array}
 */
function $nativeSortSeq(arr) {
    return arr.sort((a, b) => {
        return +a - +b
    })
}

/**
 * 链表反转
 * @param {ListNode} head 单项链表的起始节点(头节点)
 * @return {ListNode} 单项链表
 */
 function $reverseList(head) {
    if ($isEmptyObject(head)) {
        return null
    }
    let target = head
    let pre = null
    let next = null
    while (target != null) {
        next = target.next
        target.next = pre
        pre = target
        target = next
    }
    return pre
}