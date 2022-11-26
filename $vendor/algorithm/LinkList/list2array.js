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

