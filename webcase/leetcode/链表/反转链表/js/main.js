/*
    给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。
 */

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

function isEmptyObject(obj) {
    for (let attr in obj) {
        return false
    }
    return true
}

function reverseList(head) {
    if (isEmptyObject(head)) {
        return null
    }
    let pre = null
    let next = null
    while (head != null) {
        next = head.next
        head.next = pre
        pre = head
        head = next
    }
    return pre
}

const arr = [1, 2, 3, 4, 5]
const list = setArray2List(arr)

console.log(reverseList(list))