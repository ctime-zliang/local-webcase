/**
 * @description 链表反转
 * @function ven$reverseSinglyList
 * @param {Ven$LinkListNode} head 单向链表的起始节点(头节点)
 * @return {Ven$LinkListNode} 单向链表
 */
function ven$reverseSinglyList(head) {
	if (!head || !head.next) {
		return head
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
