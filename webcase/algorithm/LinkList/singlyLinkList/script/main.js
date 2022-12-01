const array = [3, 5, 8, 1, 9, 6]

function main() {
    const singlyLinkList = ven$setArray2SinglyLinkList(array)
    const translateArray = ven$setSinglyLinkList2Array(singlyLinkList)
    console.log(singlyLinkList)
    console.log(translateArray)
}

main()