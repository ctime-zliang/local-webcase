const HEADE_VALUE_OF_CSDL = '$head'

class NodeOfCDL {
	constructor(data) {
		this._data = data
		this._prev = null
		this._next = null
	}

	set data(value) {
		this._data = value
	}

	get data() {
		return this._parent
	}

	set prev(value) {
		this._prev = value
	}

	get prev() {
		return this._prev
	}

	set next(value) {
		this._next = value
	}

	get next() {
		return this._next
	}
}

class CircleDoubleList {
	constructor() {
		this._length = 0
		this._head = new NodeOfCDL(HEADE_VALUE_OF_CSDL)
		this._head.next = this._head
		this._head.prev = this._head
		this._current = this._head
	}

	set length(value) {
		this._length = value
	}

	get length() {
		return this._length
	}

	set head(value) {
		this._head = value
	}

	get head() {
		return this._head
	}

	set current(value) {
		this._current = value
	}

	get current() {
		return this._current
	}

	isEmpty() {
		return this._length === 0
	}

	size() {
		return this._length
	}

	now() {
		return this._current
	}

	display() {
		let string = `...->`
		let count = 0
		let curr = this._head
		while (count <= this._length) {
			string += curr.data + '->'
			curr = curr.next
			count++
		}
		string += curr.data + '->...'
		return string
	}

	reverseDisplay() {
		let string = `...->`
		let count = this._length
		let curr = this.findLast()
		while (count >= -1) {
			string += curr.data + '->'
			curr = curr.prev
			count--
		}
		string += curr.data + '->...'
		return string
	}

	findLast() {
		let curr = this._head
		let count = 0
		while (count < this._length) {
			curr = curr.next
			count++
		}
		return curr
	}

	findFirstByValue(value) {
		if (typeof value == 'undefined') {
			return null
		}
		let curr = this._head
		let count = 0
		while (count <= this._length && curr.data !== value) {
			curr = curr.next
			count++
		}
		if (count > this._length) {
			return null
		}
		return curr
	}

	append(value) {
		if (typeof value == 'undefined') {
			return
		}
		const newItem = new NodeOfCDL(value)
		const lastItem = this.findLast()
		newItem.next = lastItem.next
		newItem.prev = lastItem
		lastItem.next = newItem
		this._head.prev = newItem
		this._length++
	}

	insertAfter(posValue, value) {
		const posItem = this.findFirstByValue(posValue)
		if (!posItem) {
			return
		}
		const newItem = new NodeOfCDL(value)
		newItem.next = posItem.next
		posItem.next.prev = newItem
		posItem.next = newItem
		newItem.prev = posItem
		this._length++
	}

	forward(step, curr = this._head) {
		while (step--) {
			curr = curr.next
		}
		return (this._current = curr)
	}

	backoff(step, curr = this._head) {
		while (step--) {
			curr = curr.prev
		}
		return (this._current = curr)
	}

	removeValue(value) {
		const vItem = this.findFirstByValue(value)
		if (!vItem) {
			return
		}
		if (vItem.data === HEADE_VALUE_OF_CSGL) {
			throw new Error(`The Head Node cannot be removed`)
		}
		vItem.prev.next = vItem.next
		this._length--
	}
}

/* ... */
const list3_1 = [1, 2, 3, 4, 5, 6, 4, 10]
const circleDoubleList = new CircleDoubleList()

list3_1.forEach(item => {
	circleDoubleList.append(item)
})

circleDoubleList.insertAfter(5, 100)
circleDoubleList.removeValue(5)
console.log('circleDoubleList.display() ==> \n', circleDoubleList.display())
console.log('circleDoubleList.reverseDisplay() ==> \n', circleDoubleList.reverseDisplay())
console.log('circleDoubleList.findLast() ==> ', circleDoubleList.findLast())
console.log('circleDoubleList.size() ==> ', circleDoubleList.size())
console.log('circleDoubleList ==> ', circleDoubleList)
