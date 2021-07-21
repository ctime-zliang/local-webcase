const HEADE_VALUE_OF_CSGL = '$head'

class NodeOfCSL {
    constructor(data) {
        this.data = data
        this.prev = null
        this.next = null
    }
}

class CircleSingleList {
    constructor() {
        this.length = 0
        this.head = new NodeOfCSL(HEADE_VALUE_OF_CSGL)
        this.head.next = this.head
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
        let curr = this.head
        let count = 0
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
        const newItem = new NodeOfCSL(value)
        const lastItem = this.findLast()
        lastItem.next = newItem
        newItem.next = this.head
        this.length++
    }

    findFirstByValue(value) {
        if (typeof value == 'undefined') {
            return null
        }
        let curr = this.head
        let count = 0
        while (count <= this.length && curr.data !== value) {
            curr = curr.next
            count++
        }
        if (count > this.length) {
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
        this.length++
    }

    removeValue(value) {
        const vItem = this.findFirstByValue(value)
        if (!vItem) {
            return
        }
        if (vItem.data === HEADE_VALUE_OF_CSGL) {
            throw new Error(`The Head Node cannot be removed`)
        }
        let curr = this.head
        let prev = null
        let count = 0
        while (count <= this.length && curr.data !== value) {
            prev = curr
            curr = curr.next
            count++
        }
        prev.next = curr.next
        this.length--
    }

    forward(step = 0, curr = this.head) {
        while(step-- && curr.next){
            curr = curr.next
        }
        return this.current = curr
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