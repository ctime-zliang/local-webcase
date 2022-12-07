/**
 * @description 链表节点
 * @class ListNode
 * @param {any} val 链表节点值
 * @param {ListNode} next 下一个链表节点
 * @return {undefined}
 */
class Ven$LinkListNodeBase {
	constructor(val, next, prev) {
		this.val = val === undefined ? 0 : val
		this.next = next === undefined ? null : next
		this.prev = prev === undefined ? null : prev
	}
}

class Ven$SinglyLinkListNode extends Ven$LinkListNodeBase {
	constructor(val, next) {
		super(val, next)
	}
}
