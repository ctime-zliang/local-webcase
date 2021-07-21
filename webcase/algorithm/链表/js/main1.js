const HEADE_VALUE_OF_SGL = '$head'

class NodeOfSL {
    constructor(data) {
        this.data = data
        this.prev = null
        this.next = null
    }
}

class SingleList {
    constructor() {
        this.length = 0
        this.head = new NodeOfSL(HEADE_VALUE_OF_SGL)
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
        let curr = this.head
        while(curr) {
            string += curr.data
            curr = curr.next
            if (curr) {
                string += `->`
            }
        }
        return string
    }

    findLast() {
        let curr = this.head
        while(curr.next) {
            curr = curr.next
        }
        return curr
    }

    findFirstByValue(value) {
        if (typeof value == 'undefined') {
            return null
        }
        let curr = this.head
        while (curr && curr.data !== value) {
            curr = curr.next
        }
        return curr
    }

    append(value) {
        const lastItem = this.findLast()
        const newItem = new NodeOfSL(value)
        lastItem.next = newItem
        this.length++
    }

    forward(step = 0, curr = this.head) {
        while(step-- && curr.next){
            curr = curr.next
        }
        return this.current = curr
    }

    insertAfter(posValue, value) {
        let posItem = this.findFirstByValue(posValue)
        if (!posItem) {
            return
        }
        const newItem = new NodeOfSL(value)
        newItem.next = posItem.next
        posItem.next = newItem
        this.length++
    }

    removeValue(value) {
        let vItem = this.findFirstByValue(value)
        if (!vItem) {
            return
        }
        if (vItem.data === HEADE_VALUE_OF_SGL) {
            throw new Error(`The Head Node cannot be removed`)
        }
        let curr = this.head
        let prev = null
        while(curr && curr.data !== value) {
            prev = curr
            curr = curr.next
        }
        if (!curr) {
            return
        }
        prev.next = curr.next
        this.length--
    }

    clear() {
        this.head.next = null
        this.length = 0
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