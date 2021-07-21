const HEADE_VALUE_OF_CSDL = '$head'

class NodeOfCDL {
    constructor(data) {
        this.data = data
        this.prev = null
        this.next = null
    }
}

class CircleDoubleList {
    constructor() {
        this.length = 0
        this.head = new NodeOfCDL(HEADE_VALUE_OF_CSDL)
        this.head.next = this.head
        this.head.prev = this.head
        this.current = this.head
    }

    isEmpty() {
        return this.length === 0
    }

    size() {
        return this.length
    }

    now() {
        return this.current
    }

    display() {
        let string = `...->`
        let count = 0
        let curr = this.head
        while (count <= this.length) {
            string += curr.data + '->'
            curr = curr.next
            count++
        }
        string += curr.data + '->...'
        return string
    }

    reverseDisplay() {
        let string = `...->`
        let count = this.length
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
        let curr = this.head
        let count = 0
        while (count < this.length) {
            curr = curr.next
            count++
        }
        return curr
    }

    findFirstByValue(value) {
        if (typeof value == 'undefined') {
            return null
        }
        let curr = this.head
        let count = 0
        while(count <= this.length && curr.data !== value) {
            curr = curr.next
            count++
        }
        if (count > this.length) {
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
        this.head.prev = newItem
        this.length++
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
        this.length++
    }

    forward(step, curr = this.head) {
        while (step--) {
            curr = curr.next
        }
        return this.current = curr
    }

    backoff(step, curr = this.head) {
        while (step--) {
            curr = curr.prev
        }
        return this.current = curr
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
        this.length--
    }
}

/* ... */
const list3_1 = [1, 2, 3, 4, 5, 6, 4, 10]
const circleDoubleList = new CircleDoubleList()

list3_1.forEach((item, index) => {
    circleDoubleList.append(item)
})

circleDoubleList.insertAfter(5, 100)
circleDoubleList.removeValue(5)
console.log('circleDoubleList.display() ==> \n', circleDoubleList.display())
console.log('circleDoubleList.reverseDisplay() ==> \n', circleDoubleList.reverseDisplay())
console.log('circleDoubleList.findLast() ==> ', circleDoubleList.findLast())
console.log('circleDoubleList.size() ==> ', circleDoubleList.size())
console.log('circleDoubleList ==> ', circleDoubleList)
