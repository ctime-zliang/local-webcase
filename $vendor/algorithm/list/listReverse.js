/**
 * @description 链表反转
 * @function ven$reverseList
 * @param {ListNode} head 单项链表的起始节点(头节点)
 * @return {ListNode} 单项链表
 */
function ven$reverseList(head) {
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
