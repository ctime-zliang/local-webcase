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

/**
 * @description 将链表转换成数组
 * @function ven$setList2Array
 * @param {ListNode} list 链表
 * @return {array}
 */
function ven$setList2Array(list) {
	const arr = []
	arr.push(list.val)
	while (list.next) {
		list = list.next
		arr.push(list.val)
	}
	return arr
}

/**
 * @description 将数组转换成链表
 * @function ven$setArray2List
 * @param {array} arr 数组
 * @return {ListNode}
 */
function ven$setArray2List(arr) {
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
