const HEADE_VALUE_OF_CSGL = '$head'

class NodeOfCSL {
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

class CircleSingleList {
	constructor() {
		this._length = 0
		this._head = new NodeOfCSL(HEADE_VALUE_OF_CSGL)
		this._head.next = this._head
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
		let curr = this._head
		let count = 0
		while (count <= this._length) {
			string += curr.data + '->'
			curr = curr.next
			count++
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

	append(value) {
		const newItem = new NodeOfCSL(value)
		const lastItem = this.findLast()
		lastItem.next = newItem
		newItem.next = this._head
		this._length++
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

	insertAfter(posValue, value) {
		let posItem = this.findFirstByValue(posValue)
		if (!posItem) {
			return
		}
		const newItem = new NodeOfCSL(value)
		newItem.next = posItem.next
		posItem.next = newItem
		this._length++
	}

	removeValue(value) {
		const vItem = this.findFirstByValue(value)
		if (!vItem) {
			return
		}
		if (vItem.data === HEADE_VALUE_OF_CSGL) {
			throw new Error(`The Head Node cannot be removed`)
		}
		let curr = this._head
		let prev = null
		let count = 0
		while (count <= this._length && curr.data !== value) {
			prev = curr
			curr = curr.next
			count++
		}
		prev.next = curr.next
		this._length--
	}

	forward(step = 0, curr = this._head) {
		while (step-- && curr.next) {
			curr = curr.next
		}
		return (this._current = curr)
	}
}

/* ... */
const list2_1 = [1, 2, 3, 4, 5, 6, 4, 10]
const circleSingleList = new CircleSingleList()

list2_1.forEach((item, index) => {
	circleSingleList.append(item)
})

circleSingleList.insertAfter(4, 100)
circleSingleList.removeValue(5)
console.log('circleSingleList.display() ==> \n', circleSingleList.display())
console.log('circleSingleList.findLast() ==> ', circleSingleList.findLast())
console.log('circleSingleList.now() ==> ', circleSingleList.now())
circleSingleList.forward(list2_1.length + 3)
console.log('circleSingleList.now() ==> ', circleSingleList.now())
console.log('circleSingleList.size() ==> ', circleSingleList.size())
console.log('circleSingleList ==> ', circleSingleList)

console.log(`======================================`)
console.log(`\n`)
