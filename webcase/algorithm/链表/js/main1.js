const HEADE_VALUE_OF_SGL = '$head'

class NodeOfSL {
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

class SingleList {
    constructor() {
        this._length = 0
        this._head = new NodeOfSL(HEADE_VALUE_OF_SGL)
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
        let string = ``
        let curr = this._head
        while (curr) {
            string += curr.data
            curr = curr.next
            if (curr) {
                string += `->`
            }
        }
        return string
    }

    findLast() {
        let curr = this._head
        while (curr.next) {
            curr = curr.next
        }
        return curr
    }

    findFirstByValue(value) {
        if (typeof value == 'undefined') {
            return null
        }
        let curr = this._head
        while (curr && curr.data !== value) {
            curr = curr.next
        }
        return curr
    }

    append(value) {
        const lastItem = this.findLast()
        const newItem = new NodeOfSL(value)
        lastItem.next = newItem
        this._length++
    }

    forward(step = 0, curr = this._head) {
        while (step-- && curr.next) {
            curr = curr.next
        }
        return this._current = curr
    }

    insertAfter(posValue, value) {
        let posItem = this.findFirstByValue(posValue)
        if (!posItem) {
            return
        }
        const newItem = new NodeOfSL(value)
        newItem.next = posItem.next
        posItem.next = newItem
        this._length++
    }

    removeValue(value) {
        let vItem = this.findFirstByValue(value)
        if (!vItem) {
            return
        }
        if (vItem.data === HEADE_VALUE_OF_SGL) {
            throw new Error(`The Head Node cannot be removed`)
        }
        let curr = this._head
        let prev = null
        while (curr && curr.data !== value) {
            prev = curr
            curr = curr.next
        }
        if (!curr) {
            return
        }
        prev.next = curr.next
        this._length--
    }

    clear() {
        this._head.next = null
        this._length = 0
    }
}

/* ... */
const list1_1 = [1, 2, 3, 4, 5, 6, 4, 10]
const singleList = new SingleList()

list1_1.forEach((item, index) => {
    singleList.append(item)
})

singleList.insertAfter(4, 100)
console.log('singleList.display() ==> \n', singleList.display())
console.log('singleList.findFirstByValue(5) ==> ', singleList.findFirstByValue(5))
console.log('singleList.now() ==> ', singleList.now())
singleList.forward(3)
console.log('singleList.now() ==> ', singleList.now())
console.log('singleList.size() ==> ', singleList.size())
console.log('singleList ==> ', singleList)

console.log(`======================================`)
console.log(`\n`)