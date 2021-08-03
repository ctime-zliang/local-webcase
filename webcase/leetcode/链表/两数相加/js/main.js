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

function addTwoNumbers (list1, list2) {
    const maxLength = Math.max(list1.length, list2.length)
    const temp = []
    if (list1.length < maxLength) {
        const len = list1.length
        for (let i = 0; i < maxLength - len; i++) {
            list1.unshift(0)
        }
    }
    if (list2.length < maxLength) {
        const len = list2.length
        for (let i = 0; i < maxLength - len; i++) {
            list2.unshift(0)
        }
    }
    for (let i = 0; i < maxLength + 1; i++) {
        temp[i] = 0
    }
    for (let i = maxLength - 1, j = i + 1; i >= 0; i--) {
        const sum = list1[i] + list2[i] + temp[j]
        if (sum >= 10) {
            temp[j] = sum - 10
            temp[j - 1] = 1
        } else {
            temp[j] = sum
        }        
        j--
    }
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
    const head = new ListNode(res[0], null)
    let p = head
    for (let i = 1; i < res.length; i++) {
        const node = new ListNode(res[i], null)
        p.next = node
        p = node
    }
    return head
}

const list1 = [2, 4, 3]
const list2 = [5, 6, 4]

console.log(addTwoNumbers(list1, list2))