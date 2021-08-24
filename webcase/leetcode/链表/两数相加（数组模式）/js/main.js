/*
    给你两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照 逆序 的方式存储的，并且每个节点只能存储 一位 数字。

    请你将两个数相加，并以相同形式返回一个表示和的链表。

    你可以假设除了数字 0 之外，这两个数都不会以 0 开头
 */

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
function ListNode(val, next) {
    this.val = (val === undefined ? 0 : val)
    this.next = (next === undefined ? null : next)
}

function setList2Array(list) {
    const arr = []
    arr.push(list.val)
    while (list.next) {        
        list = list.next
        arr.push(list.val)
    }
    return arr
}

function setArray2List(arr) {
    const head = new ListNode(arr[0], null)
    let p = head
    for (let i = 1; i < arr.length; i++) {
        const node = new ListNode(arr[i], null)
        p.next = node
        p = node
    }
    return head
}

function addTwoNumbers (list1, list2) {
    const arr1 = setList2Array(list1).reverse()
    const arr2 = setList2Array(list2).reverse()
    /* 
        获取两个数组的最大长度
     */
    const maxLength = Math.max(arr1.length, arr2.length)
    /* 
        数组前导补位
     */
    const temp = []
    if (arr1.length < maxLength) {
        const len = arr1.length
        for (let i = 0; i < maxLength - len; i++) {
            arr1.unshift(0)
        }
    }
    if (arr2.length < maxLength) {
        const len = arr2.length
        for (let i = 0; i < maxLength - len; i++) {
            arr2.unshift(0)
        }
    }
    /*
        初始化临时数组, 以 0 填充
     */
    for (let i = 0; i < maxLength + 1; i++) {
        temp[i] = 0
    }
    /*
        l1:    [0, 2, 4, 9]
        l2:    [5, 6, 4, 9]
        tp: [0, 0, 0, 0, 0] 
        maxLength = 4

        从 arr1/arr2 的最末尾开始倒叙遍历
     */
    for (let i = maxLength - 1, j = i + 1; i >= 0; i--) {
        const sum = arr1[i] + arr2[i] + temp[j]
        if (sum >= 10) {
            temp[j] = sum - 10
            temp[j - 1] = 1
        } else {
            temp[j] = sum
        }        
        j--
    }
    console.log(temp)
    /* 
        移除数组开头的所有 0 位并反向该数组
     */
    let res = []
    let flag = false
    for (let i = 0; i < temp.length; i++) {
        if (temp[i] <= 0 && !flag) {
            continue
        } else {
            flag = true
        }
        res.unshift(temp[i])
    }
    console.log(res)
    /*
        将数组转换成链表 
     */
    const head = new ListNode(res[0], null)
    let p = head
    for (let i = 1; i < res.length; i++) {
        const node = new ListNode(res[i], null)
        p.next = node
        p = node
    }
    return head
}

const arr1 = [2, 4, 9]
const arr2 = [5, 6, 4, 9]

const list1 = setArray2List(arr1)
const list2 = setArray2List(arr2)

console.log(addTwoNumbers(list1, list2))