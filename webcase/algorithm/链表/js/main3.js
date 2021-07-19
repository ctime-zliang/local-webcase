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
        let string = ``
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

    findLast() {
        let curr = this.head
        let count = 0
        while (count < this.length) {
            curr = curr.next
            count++
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
        this.length++
    }
}

/* ... */
const list3_1 = [1, 2, 3, 4, 5, 6, 4, 10]
const circleDoubleList = new CircleDoubleList()

list3_1.forEach((item, index) => {
    circleDoubleList.append(item)
})

console.log('circleDoubleList.display() ==> ', circleDoubleList.display())
console.log('circleDoubleList.size() ==> ', circleDoubleList.size())
console.log('circleDoubleList ==> ', circleDoubleList)
