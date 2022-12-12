/**
 * @description 将单向链表转换成数组
 * @function ven$setSinglyLinkList2Array
 * @param {Ven$SinglyLinkListNode} list 单向链表
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
 * @description 将数组转换成单向链表
 * @function ven$setArray2SinglyLinkList
 * @param {array} arr 数组
 * @return {Ven$SinglyLinkListNode}
 */
function ven$setArray2SinglyLinkList(arr) {
	const head = new Ven$SinglyLinkListNode(arr[0], undefined)
	let p = head
	for (let i = 1; i < arr.length; i++) {
		const node = new Ven$SinglyLinkListNode(arr[i], undefined)
		p.next = node
		p = node
	}
	return head
}

/**
 * @description 将数组转换成循环链表
 * @function ven$setArray2CyclicLinkList
 * @param {array} arr 数组
 * @return {Ven$SinglyLinkListNode}
 */
 function ven$setArray2CyclicLinkList(arr) {
	const head = new Ven$SinglyLinkListNode(arr[0], undefined)
	let p = head
	for (let i = 1; i < arr.length; i++) {
		const node = new Ven$SinglyLinkListNode(arr[i], undefined)
		p.next = node
		p = node
	}
	p.next = head
	return head
}

/**
 * @description 将数组转换成双向链表
 * @function ven$setArray2DoublyLinkList
 * @param {array} arr 数组
 * @return {Ven$SinglyLinkListNode}
 */
 function ven$setArray2DoublyLinkList(arr) {
	const head = new Ven$DoublyLinkListNode(arr[0], undefined, undefined)
	let p = head
	let t = null
	for (let i = 1; i < arr.length; i++) {
		const node = new Ven$DoublyLinkListNode(arr[i], undefined, undefined)
		p.next = node
		t = p
		p = node
		p.prev = t
	}
	return head
}

