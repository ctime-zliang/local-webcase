const HEADE_VALUE = '$head'

class Node {
    constructor(data) {
        this.data = data
        this.prev = null
        this.next = null
    }
}

class SingleList {
    constructor() {
        this.length = 0
        this.head = new Node(HEADE_VALUE)
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

    queryFirst(value) {
        if (!value) {
            return null
        }
        let curr = this.head
        while (curr && curr.data !== value) {
            curr = curr.next
        }
        return curr
    }

    findLast() {
        let curr = this.head
        while(curr.next) {
            curr = curr.next
        }
        return curr
    }

    advance(step = 0, curr = this.head) {
        let tmp = curr
        while(step-- && tmp.next){
            tmp = tmp.next
        }
        return this.current = tmp
    }

    insertAfter(posValue, value) {
        let posItem = this.queryFirst(posValue)
        if (!posItem) {
            return
        }
        const newItem = new Node(value)
        newItem.next = posItem.next
        posItem.next = newItem
        this.length++
    }

    removeValue(value) {
        let posItem = this.queryFirst(value)
        if (!posItem) {
            return
        }
        if (value === HEADE_VALUE) {
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

    append(value) {
        const lastItem = this.findLast()
        const newItem = new Node(value)
        lastItem.next = newItem
        this.length++
    }

    clear() {
        this.head.next = null
        this.length = 0
    }
}

/* ... */
const list = [1, 2, 3, 4, 5]
const singleList = new SingleList()

list.forEach((item, index) => {
    singleList.append(item)
})
singleList.insertAfter(4, 100)
console.log(singleList.display())