const array = [3, 5, 8, 1, 9, 6]

function main() {
	const singlyLinkList = ven$setArray2SinglyLinkList(array)
	const cyclicLinkList = ven$setArray2CyclicLinkList(array)
	console.log(`Singly Link List`, singlyLinkList)
	console.log(`Cyclic Link List`, cyclicLinkList)

	const translateArray = ven$setSinglyLinkList2Array(singlyLinkList)
	console.log(`Translate Array`, translateArray)
}

main()
