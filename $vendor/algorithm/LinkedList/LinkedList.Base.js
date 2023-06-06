/**
 * @description 单向链表节点
 * @class Ven$SinglyLinkedListNode
 * @param {any} val 节点值
 * @param {Ven$SinglyLinkedListNode} next 下一个链表节点
 */
class Ven$SinglyLinkedListNode {
	constructor(val, next = undefined) {
		this.val = val === undefined ? undefined : val
		this.next = next === undefined ? null : next
	}
}

/**
 * @description 双向链表节点
 * @class Ven$DoublyLinkedListNode
 * @param {any} val 节点值
 * @param {Ven$DoublyLinkedListNode} next 下一个链表节点
 * @param {Ven$DoublyLinkedListNode} prev 上一个链表节点
 */
class Ven$DoublyLinkedListNode {
	constructor(val, next = undefined, prev = undefined) {
		this.val = val === undefined ? undefined : val
		this.next = next === undefined ? null : next
		this.prev = prev === undefined ? null : prev
	}
}

class Ven$BaseLinkedList {
	constructor() {
		this._length = 0
		this._head = null
		this._tail = undefined
	}

	getItemAt(index) {
		if (index < 0 || index > this._length - 1) {
			console.warn(`query index out of bounds.`)
			return null
		}
		let current = this._head
		for (let i = 0; i < index; i++) {
			current = current.next
		}
		return current
	}

	indexOf(val) {
		let current = this._head
		for (let i = 0; i < this._length; i++) {
			if (current.val === val) {
				return i
			}
			current = current.val
		}
		return -1
	}

	size() {
		return this._length
	}

	head() {
		return this._head
	}

	tail() {
		return this._tail
	}

	clear() {
		this._length = 0
		this._head = null
		this._tail = undefined
	}

	toString() {
		let str = `linkedlist (`
		let current = this._head
		for (let i = 0; i < this._length; i++) {
			str += `${current.val}, `
			current = current.next
		}
		return str.substring(-1)
	}
}

/**
 * @description 单向链表
 * @class Ven$SinglyLinkedList
 */
class Ven$SinglyLinkedList extends Ven$BaseLinkedList {
	constructor() {
		super()
	}

	appendItem(val) {
		const newItem = new Ven$SinglyLinkedListNode(val)
		if (this._head === null) {
			this._head = newItem
			this._length++
			return newItem
		}
		let lastNode = this.getItemAt(this._length - 1)
		lastNode.next = newItem
		this._length++
		return newItem
	}

	insertItem(val, index) {
		if (index < 0 || index > this._length - 1) {
			console.warn(`insert index out of bounds.`)
			return null
		}
		const newItem = new Ven$SinglyLinkedListNode(val)
		if (index === 0) {
			newItem.next = this._head
			this._head = newItem
			this._length++
			return newItem
		}
		const prevItem = this.getItemAt(index - 1)
		newItem.next = prevItem.next
		prevItem.next = newItem
		this._length++
		return newItem
	}

	removeAt(index) {
		if (index < 0 || index > this._length - 1) {
			console.warn(`remove index out of bounds.`)
			return false
		}
		if (index === 0) {
			this._head = this._head.next
			this._length--
			return true
		}
		const prevItem = this.getItemAt(index - 1)
		prevItem.next = prevItem.next
		this._length--
		return true
	}
}

/**
 * @description 双向链表
 * @class Ven$DoublyLinkedList
 */
class Ven$DoublyLinkedList extends Ven$BaseLinkedList {
	constructor() {
		super()
		this._tail = null
	}

	getItemAt(index) {
		if (index >= Math.floor(this._length / 2)) {
			let current = this._tail
			for (let i = this._length - 1; i > index; i--) {
				current = current.prev
			}
			return current
		}
		return super.getItemAt(index)
	}

	appendItem(val) {
		const newItem = new Ven$DoublyLinkedListNode(val)
		if (this._head === null) {
			this._head = newItem
			this._tail = newItem
			this._length++
			return newItem
		}
		this._tail.next = newItem
		newItem.prev = this._tail
		this._tail = newItem
		this._length++
		return newItem
	}

	insertItem(val, index) {
		if (index < 0 || index > this._length - 1) {
			console.warn(`insert index out of bounds.`)
			return null
		}
		const newItem = new Ven$DoublyLinkedListNode(val)
		if (index === 0) {
			this._head.prev = newItem
			newItem.next = this._head
			this._head = newItem
			this._length++
			return newItem
		}
		if (index === this._length - 1) {
			this._tail.next = newItem
			newItem.prev = this._tail
			this._tail = newItem
			this._length++
			return
		}
		const prevItem = this.getItemAt(index - 1)
		newItem.next = prevItem.next
		prevItem.next.prev = newItem
		prevItem.next = newItem
		newItem.prev = prevItem
		this._length++
		return newItem
	}

	removeAt(index) {
		if (index < 0 || index > this._length - 1) {
			console.warn(`remove index out of bounds.`)
			return null
		}
		if (index === 0) {
			this._head = this._head.next
			if (this._head.next) {
				this._head.next.prev = this._head
			}
			this._length--
			return true
		}
		if (index === this._length - 1) {
			this._tail = this._tail.prev
			if (this._tail.prev) {
				this._tail.prev.next = this._tail
			}
			this._length--
			return true
		}
		const prevItem = this.getItemAt(index - 1)
		prevItem.next = prevItem.next.next
		prevItem.next.next.prev = prevItem
		this._length--
		return true
	}

	clear() {
		super.clear()
		this._tail = null
	}
}
