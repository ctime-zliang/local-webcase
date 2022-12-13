/**
 * @description 单向链表节点
 * @class Ven$SinglyLinkListNode
 * @param {any} val 链表节点值
 * @param {Ven$SinglyLinkListNode} next 下一个链表节点
 * @return {undefined}
 */
class Ven$SinglyLinkListNode {
	constructor(val, next) {
		this.val = val === undefined ? undefined : val
		this.next = next === undefined ? null : next
	}
}

/**
 * @description 双向链表节点
 * @class Ven$DoublyLinkListNode
 * @param {any} val 链表节点值
 * @param {Ven$DoublyLinkListNode} next 下一个链表节点
 * @param {Ven$DoublyLinkListNode} prev 上一个链表节点
 * @return {undefined}
 */
 class Ven$DoublyLinkListNode {
	constructor(val, next, prev) {
		this.val = val === undefined ? undefined : val
		this.next = next === undefined ? null : next
		this.prev = prev === undefined ? null : prev
	}
}
