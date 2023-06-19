function Ven$Rtree_flatten(tree) {
	const result = []
	let treeCopy = tree.slice()
	while (treeCopy.length) {
		const current = treeCopy.pop()
		if (current.nodes) {
			treeCopy = treeCopy.concat(current.nodes)
		} else if (current.leaf) {
			result.push(current)
		}
	}
	return result
}

function Ven$Rtree_removeSubtree(rect, obj, root) {
	let hitStack = []
	let countStack = []
	let retArray = []
	let currentDepth = 1
	let tree
	let i
	let ltree
	if (!rect || !Ven$Rtree_Rectangle.overlapRectangle(rect, root)) {
		return retArray
	}
	let retObj = {
		sx: rect.sx,
		sy: rect.sy,
		w: rect.w,
		h: rect.h,
		target: obj,
	}
	countStack.push(root.nodes.length)
	hitStack.push(root)

	while (hitStack.length > 0) {
		tree = hitStack.pop()
		i = countStack.pop() - 1
		if (retObj.target) {
			while (i >= 0) {
				ltree = tree.nodes[i]
				if (Ven$Rtree_Rectangle.overlapRectangle(retObj, ltree)) {
					if (
						(retObj.target && ltree.leaf === retObj.target) ||
						(!retObj.target && (ltree.leaf || Ven$Rtree_Rectangle.containsRectangle(ltree, retObj)))
					) {
						if (ltree.nodes) {
							retArray = Ven$Rtree_flatten(tree.nodes.splice(i, 1))
						} else {
							retArray = tree.nodes.splice(i, 1)
						}
						Ven$Rtree_Rectangle.makeMBR(tree.nodes, tree)
						delete retObj.target
						break
					} else if (ltree.nodes) {
						currentDepth++
						countStack.push(i)
						hitStack.push(tree)
						tree = ltree
						i = ltree.nodes.length
					}
				}
				i--
			}
		} else if (retObj.nodes) {
			tree.nodes.splice(i + 1, 1)
			if (tree.nodes.length > 0) {
				Ven$Rtree_Rectangle.makeMBR(tree.nodes, tree)
			}
			for (var t = 0; t < retObj.nodes.length; t++) {
				insertSubtree(retObj.nodes[t], tree)
			}
			retObj.nodes = []
			if (hitStack.length === 0 && tree.nodes.length <= 1) {
				retObj.nodes = Ven$Rtree_searchSubtree(tree, true, retObj.nodes, tree)
				tree.nodes = []
				hitStack.push(tree)
				countStack.push(1)
			} else if (hitStack.length > 0 && tree.nodes.length < minWidth) {
				retObj.nodes = Ven$Rtree_searchSubtree(tree, true, retObj.nodes, tree)
				tree.nodes = []
			} else {
				delete retObj.nodes
			}
		} else {
			Ven$Rtree_Rectangle.makeMBR(tree.nodes, tree)
		}
		currentDepth -= 1
	}
	return retArray
}

function Ven$Rtree_chooseLeafSubtree(rect, root) {
	let bestChoiceIndex = -1
	let bestChoiceStack = []
	let bestChoiceArea
	let first = true
	bestChoiceStack.push(root)
	let nodes = root.nodes

	while (first || bestChoiceIndex !== -1) {
		if (first) {
			first = false
		} else {
			bestChoiceStack.push(nodes[bestChoiceIndex])
			nodes = nodes[bestChoiceIndex].nodes
			bestChoiceIndex = -1
		}
		for (let i = nodes.length - 1; i >= 0; i--) {
			let ltree = nodes[i]
			if (ltree.leaf) {
				bestChoiceIndex = -1
				break
			}
			let oldLRatio = Ven$Rtree_Rectangle.squarifiedRatio(ltree.w, ltree.h, ltree.nodes.length + 1)
			let nw = Math.max(ltree.sx + ltree.w, rect.sx + rect.w) - Math.min(ltree.sx, rect.sx)
			let nh = Math.max(ltree.sy + ltree.h, rect.sy + rect.h) - Math.min(ltree.sy, rect.sy)
			let lratio = Ven$Rtree_Rectangle.squarifiedRatio(nw, nh, ltree.nodes.length + 2)
			if (bestChoiceIndex < 0 || Math.abs(lratio - oldLRatio) < bestChoiceArea) {
				bestChoiceArea = Math.abs(lratio - oldLRatio)
				bestChoiceIndex = i
			}
		}
	}
	return bestChoiceStack
}

function Ven$Rtree_linearSplit(nodes) {
	const n = Ven$Rtree_pickLinear(nodes)
	while (nodes.length > 0) {
		Ven$Rtree_pickNext(nodes, n[0], n[1])
	}
	return n
}

function Ven$Rtree_pickNext(nodes, a, b) {
	const areaA = Ven$Rtree_Rectangle.squarifiedRatio(a.w, a.h, a.nodes.length + 1)
	const areaB = Ven$Rtree_Rectangle.squarifiedRatio(b.w, b.h, b.nodes.length + 1)
	let highAreaDelta
	let highAreaNode
	let lowestGrowthGroup

	for (let i = nodes.length - 1; i >= 0; i--) {
		let l = nodes[i]
		let newAreaA = {}
		newAreaA.sx = Math.min(a.sx, l.sx)
		newAreaA.sy = Math.min(a.sy, l.sy)
		newAreaA.w = Math.max(a.sx + a.w, l.sx + l.w) - newAreaA.sx
		newAreaA.h = Math.max(a.sy + a.h, l.sy + l.h) - newAreaA.sy
		let changeNewAreaA = Math.abs(Ven$Rtree_Rectangle.squarifiedRatio(newAreaA.w, newAreaA.h, a.nodes.length + 2) - areaA)
		/* ... */
		let newAreaB = {}
		newAreaB.sx = Math.min(b.sx, l.sx)
		newAreaB.sy = Math.min(b.sy, l.sy)
		newAreaB.w = Math.max(b.sx + b.w, l.sx + l.w) - newAreaB.sx
		newAreaB.h = Math.max(b.sy + b.h, l.sy + l.h) - newAreaB.sy
		let changeNewAreaB = Math.abs(Ven$Rtree_Rectangle.squarifiedRatio(newAreaB.w, newAreaB.h, b.nodes.length + 2) - areaB)
		/* ... */
		if (!highAreaNode || !highAreaDelta || Math.abs(changeNewAreaB - changeNewAreaA) < highAreaDelta) {
			highAreaNode = i
			highAreaDelta = Math.abs(changeNewAreaB - changeNewAreaA)
			lowestGrowthGroup = changeNewAreaB < changeNewAreaA ? b : a
		}
	}
	const tempNode = nodes.splice(highAreaNode, 1)[0]
	if (a.nodes.length + nodes.length + 1 <= minWidth) {
		a.nodes.push(tempNode)
		Ven$Rtree_Rectangle.expandRectangle(a, tempNode)
	} else if (b.nodes.length + nodes.length + 1 <= minWidth) {
		b.nodes.push(tempNode)
		Ven$Rtree_Rectangle.expandRectangle(b, tempNode)
	} else {
		lowestGrowthGroup.nodes.push(tempNode)
		Ven$Rtree_Rectangle.expandRectangle(lowestGrowthGroup, tempNode)
	}
}

function Ven$Rtree_pickLinear(nodes) {
	let lowestHighX = nodes.length - 1
	let highestLowX = 0
	let lowestHighY = nodes.length - 1
	let highestLowY = 0
	let t1
	let t2

	for (let i = nodes.length - 2; i >= 0; i--) {
		let l = nodes[i]
		if (l.sx > nodes[highestLowX].sx) {
			highestLowX = i
		} else if (l.sx + l.w < nodes[lowestHighX].sx + nodes[lowestHighX].w) {
			lowestHighX = i
		}
		if (l.sy > nodes[highestLowY].sy) {
			highestLowY = i
		} else if (l.sy + l.h < nodes[lowestHighY].sy + nodes[lowestHighY].h) {
			lowestHighY = i
		}
	}
	let dx = Math.abs(nodes[lowestHighX].sx + nodes[lowestHighX].w - nodes[highestLowX].sx)
	let dy = Math.abs(nodes[lowestHighY].sy + nodes[lowestHighY].h - nodes[highestLowY].sy)
	if (dx > dy) {
		if (lowestHighX > highestLowX) {
			t1 = nodes.splice(lowestHighX, 1)[0]
			t2 = nodes.splice(highestLowX, 1)[0]
		} else {
			t2 = nodes.splice(highestLowX, 1)[0]
			t1 = nodes.splice(lowestHighX, 1)[0]
		}
	} else {
		if (lowestHighY > highestLowY) {
			t1 = nodes.splice(lowestHighY, 1)[0]
			t2 = nodes.splice(highestLowY, 1)[0]
		} else {
			t2 = nodes.splice(highestLowY, 1)[0]
			t1 = nodes.splice(lowestHighY, 1)[0]
		}
	}
	return [
		{
			sx: t1.sx,
			sy: t1.sy,
			w: t1.w,
			h: t1.h,
			nodes: [t1],
		},
		{
			sx: t2.sx,
			sy: t2.sy,
			w: t2.w,
			h: t2.h,
			nodes: [t2],
		},
	]
}

function Ven$Rtree_attachData(node, moreTree) {
	node.nodes = moreTree.nodes
	node.sx = moreTree.sx
	node.sy = moreTree.sy
	node.w = moreTree.w
	node.h = moreTree.h
	return node
}

function Ven$Rtree_searchSubtree(rect, returnNode, returnArray, root) {
	let hitStack = []
	if (!Ven$Rtree_Rectangle.overlapRectangle(rect, root)) {
		return returnArray
	}
	hitStack.push(root.nodes)
	while (hitStack.length > 0) {
		let nodes = hitStack.pop()
		for (let i = nodes.length - 1; i >= 0; i--) {
			let ltree = nodes[i]
			if (Ven$Rtree_Rectangle.overlapRectangle(rect, ltree)) {
				if (ltree.nodes) {
					hitStack.push(ltree.nodes)
				} else if (ltree.leaf) {
					if (!returnNode) {
						returnArray.push(ltree.leaf)
					} else {
						returnArray.push(ltree)
					}
				}
			}
		}
	}
	return returnArray
}

function Ven$Rtree_insertSubtree(node, root) {
	let bc
	if (root.nodes.length === 0) {
		root.sx = node.sx
		root.sy = node.sy
		root.w = node.w
		root.h = node.h
		root.nodes.push(node)
		return
	}
	let treeStack = Ven$Rtree_chooseLeafSubtree(node, root)
	let retObj = node
	let pbc
	while (treeStack.length > 0) {
		if (bc && bc.nodes && bc.nodes.length === 0) {
			pbc = bc // Past bc
			bc = treeStack.pop()
			for (let t = 0; t < bc.nodes.length; t++) {
				if (bc.nodes[t] === pbc || bc.nodes[t].nodes.length === 0) {
					bc.nodes.splice(t, 1)
					break
				}
			}
		} else {
			bc = treeStack.pop()
		}
		if (retObj.leaf || retObj.nodes || Array.isArray(retObj)) {
			if (Array.isArray(retObj)) {
				for (let ai = 0; ai < retObj.length; ai++) {
					Ven$Rtree_Rectangle.expandRectangle(bc, retObj[ai])
				}
				bc.nodes = bc.nodes.concat(retObj)
			} else {
				Ven$Rtree_Rectangle.expandRectangle(bc, retObj)
				bc.nodes.push(retObj)
			}
			if (bc.nodes.length <= maxWidth) {
				retObj = {
					sx: bc.sx,
					sy: bc.sy,
					w: bc.w,
					h: bc.h,
				}
			} else {
				let a = linearSplit(bc.nodes)
				retObj = a
				if (treeStack.length < 1) {
					bc.nodes.push(a[0])
					treeStack.push(bc)
					retObj = a[1]
				}
				/*else {
                    delete bc;
                }*/
			}
		} else {
			Ven$Rtree_Rectangle.expandRectangle(bc, retObj)
			retObj = {
				sx: bc.sx,
				sy: bc.sy,
				w: bc.w,
				h: bc.h,
			}
		}
	}
}

function Ven$Rtree_removeArea(rect) {
	let numberDeleted = 1
	let retArray = []
	let deleted
	while (numberDeleted > 0) {
		deleted = Ven$Rtree_removeSubtree(rect, false, rootTree)
		numberDeleted = deleted.length
		retArray = retArray.concat(deleted)
	}
	return retArray
}

function Ven$Rtree_removeObj(rect, obj) {
	let retArray = Ven$Rtree_removeSubtree(rect, obj, rootTree)
	return retArray
}
