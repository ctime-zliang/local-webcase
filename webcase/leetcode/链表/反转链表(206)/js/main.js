/*
    给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。
 */

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
	this.val = val === undefined ? 0 : val
	this.next = next === undefined ? null : next
}

/**
 * 链表反转
 * @param {ListNode} head 单向链表的起始节点(头节点)
 * @return {ListNode} 单向链表
 */
function reverseList(head) {
	if (ven$isEmptyObject(head)) {
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
const list = ven$setArray2List(arr)

console.log(reverseList(list))
