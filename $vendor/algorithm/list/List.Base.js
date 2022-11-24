/**
 * @description 链表节点
 * @class ListNode
 * @param {any} val 链表节点值
 * @param {ListNode} next 下一个链表节点
 * @return {undefined}
 */
function ListNode(val, next) {
	this.val = val === undefined ? 0 : val
	this.next = next === undefined ? null : next
}