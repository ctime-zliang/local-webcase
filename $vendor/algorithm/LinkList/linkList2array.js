/**
 * @description 将链表转换成数组
 * @function ven$setSinglyLinkList2Array
 * @param {Ven$LinkListNode} list 链表
 * @return {array}
 */
function ven$setSinglyLinkList2Array(list) {
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
 * @function ven$setArray2SinglyLinkList
 * @param {array} arr 数组
 * @return {Ven$LinkListNode}
 */
function ven$setArray2SinglyLinkList(arr) {
	const head = new Ven$SinglyLinkListNode(arr[0], null)
	let p = head
	for (let i = 1; i < arr.length; i++) {
		const node = new Ven$SinglyLinkListNode(arr[i], null)
		p.next = node
		p = node
	}
	return head
}

