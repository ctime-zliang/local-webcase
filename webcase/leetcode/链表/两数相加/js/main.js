/*
    给你两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照 逆序 的方式存储的，并且每个节点只能存储 一位 数字。

    请你将两个数相加，并以相同形式返回一个表示和的链表。

    你可以假设除了数字 0 之外，这两个数都不会以 0 开头
 */

class Node {
    constructor(data) {
        this.data = data
        this.prev = null
        this.next = null
    }
}

class NodeList {
    constructor() {
        this.size = 0
        this.head = new Node('head')
        this.currNode = ''
    }
    
    isEmpty() {
        return this.size === 0
    }

    findLast() {
        let currNode = this.head
        while (currNode.next) {
            currNode = currNode.next
        }
        return currNode
    }
    
    display() {
        let result = ''
        let currNode = this.head
        while (currNode) {
            result += currNode.data
            currNode = currNode.next
            if(currNode) {
                result += '->'
            }
        }
        return result
    }

    find(item) {
        let currNode = this.head
        while (currNode && (currNode.data !== item)) {
            currNode = currNode.next
        }
        return currNode
    }

    getLength() {
        return this.size
    }

    insert(item, element) {
        let itemNode = this.find(item)
        if(!itemNode) {
            return
        }
        let newNode = new Node(element)

        newNode.next = itemNode.next
        itemNode.next = newNode        
        this.size++
    }

    remove(item) {
        if(!this.find(item)) {
            return;
        }
        let currNode = this.head
        while (currNode.next.data !== item) {
            if (!currNode.next) {
                return
            }
            currNode = currNode.next
        }
        currNode.next = currNode.next.next
        this.size--
    }

    append(element) {
        let currNode = this.findLast()
        let newNode = new Node(element)
        currNode.next = newNode
        this.size++
    }
}

function addTwoNumbers (list1, list2) {
    
}

const list1 = [2, 4, 3]
const list2 = [5, 6, 4]

console.log(addTwoNumbers(list1, list2))