/*
    给你两个单链表的头节点 headA 和 headB ，请你找出并返回两个单链表相交的起始节点。如果两个链表没有交点，返回 null 。
 */

function findLast(head) {
    let node = head
    while (node && node.next) {
        node = node.next
    }
    return node
}

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * 链表节点
 * @param {any} val 链表节点值
 * @param {ListNode} next 下一个链表节点
 * @return {undefined} 
 */
function ListNode(val, next) {
    this.val = (val === undefined ? 0 : val)
    this.next = (next === undefined ? null : next)
}

function getIntersectionNode(head1, head2) {
    let pA = head1
    let pB = head2
    while (pA !== pB) {
        pA = !pA ? head2 : pA.next
        pB = !pB ? head1 : pB.next
    }
    return pA
}

const coms = [8, 4, 5]
const arr1 = [4, 1]
const arr2 = [5, 0, 1]

const head = ven$setArray2List(coms)
const head1 = ven$setArray2List(arr1)
const head2 = ven$setArray2List(arr2)
const last1 = findLast(head1)
const last2 = findLast(head2)

last1.next = head
last2.next = head

console.log(getIntersectionNode(head1, head2))