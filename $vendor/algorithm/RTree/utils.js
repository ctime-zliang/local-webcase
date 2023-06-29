function Ven$Rtree_flatten(tree) {
	const result = []
	let treeCopy = tree.slice()
	while (treeCopy.length) {
		const current = treeCopy.pop()
		if (current.nodes) {
			treeCopy = treeCopy.concat(current.nodes)
		} else if (current.data) {
			result.push(current)
		}
	}
	return result
}

function Ven$Rtree_removeSubtree(rect, obj, root, minWidth) {
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
						(retObj.target && ltree.data === retObj.target) ||
						(!retObj.target && (ltree.data || Ven$Rtree_Rectangle.containsRectangle(ltree, retObj)))
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

function Ven$Rtree_chooseLeafSubtree(itemData, root) {
	const bestChoiceStack = [root]
	let bestChoiceIndex = -1
	let bestChoiceArea
	/**
	 * 根节点的子节点列表
	 */
	let nodes = root.nodes

	let loopCount = 0
	do {
		if (loopCount >= 1) {
			bestChoiceStack.push(nodes[bestChoiceIndex])
			nodes = nodes[bestChoiceIndex].nodes
			bestChoiceIndex = -1
		}
		loopCount++
		for (let i = nodes.length - 1; i >= 0; i--) {
			const childItem = nodes[i]
			if (childItem.data) {
				bestChoiceIndex = -1
				break
			}
			const oldChildItemRatio = Ven$Rtree_Rectangle.squarifiedRatio(childItem.w, childItem.h, childItem.nodes.length + 1)
			const nw = Math.max(childItem.sx + childItem.w, itemData.sx + itemData.w) - Math.min(childItem.sx, itemData.sx)
			const nh = Math.max(childItem.sy + childItem.h, itemData.sy + itemData.h) - Math.min(childItem.sy, itemData.sy)
			const childItemRatio = Ven$Rtree_Rectangle.squarifiedRatio(nw, nh, childItem.nodes.length + 2)
			if (bestChoiceIndex < 0 || Math.abs(childItemRatio - oldChildItemRatio) < bestChoiceArea) {
				bestChoiceArea = Math.abs(childItemRatio - oldChildItemRatio)
				bestChoiceIndex = i
			}
		}
	} while (bestChoiceIndex !== -1)
	return bestChoiceStack
}

function Ven$Rtree_linearSplit(nodes, minWidth) {
	const n = Ven$Rtree_pickLinear(nodes)
	while (nodes.length > 0) {
		Ven$Rtree_pickNext(nodes, n[0], n[1], minWidth)
	}
	return n
}

function Ven$Rtree_pickNext(nodes, a, b, minWidth) {
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
	/**
	 * 在一个平面上分布着 nodes[i] 元素
	 * 遍历 [0, 倒数第二个] 区间内的元素
	 * 		找到起始 X 坐标(sx)最大的元素对应的索引 indexHighestStartX
	 * 		找到起始 Y 坐标(sy)最大的元素对应的索引 indexHighestStartY
	 * 		找到结束 X 坐标(ex)最小的元素对应的索引 indexLowestEndX
	 * 		找到结束 Y 坐标(ey)最小的元素对应的索引 indexLowestEndY
	 */
	let indexLowestEndX = nodes.length - 1
	let indexHighestStartX = 0
	let indexLowestEndY = nodes.length - 1
	let indexHighestStartY = 0
	for (let i = nodes.length - 2; i >= 0; i--) {
		const childItem = nodes[i]
		if (childItem.sx > nodes[indexHighestStartX].sx) {
			indexHighestStartX = i
		} else if (childItem.sx + childItem.w < nodes[indexLowestEndX].sx + nodes[indexLowestEndX].w) {
			indexLowestEndX = i
		}
		if (childItem.sy > nodes[indexHighestStartY].sy) {
			indexHighestStartY = i
		} else if (childItem.sy + childItem.h < nodes[indexLowestEndY].sy + nodes[indexLowestEndY].h) {
			indexLowestEndY = i
		}
	}
	const lowestEndX = nodes[indexLowestEndX].sx + nodes[indexLowestEndX].w
	const lowestEndY = nodes[indexLowestEndY].sy + nodes[indexLowestEndY].h
	const highestStartX = nodes[indexHighestStartX].sx
	const highestStartY = nodes[indexHighestStartY].sy
	const dx = Math.abs(lowestEndX - highestStartX)
	const dy = Math.abs(lowestEndY - highestStartY)
	let itemLowestEnd
	let itemHighestStart
	/**
	 * 通过 index 数据使用 splice 删除数组元素并获取 index 对应的元素时
	 * 需要从较大的 index 值开始查找并删除, 以防止 splice 修改原数组导致后续的 index 查找元素出错
	 */
	if (dx > dy) {
		if (indexLowestEndX > indexHighestStartX) {
			itemLowestEnd = nodes.splice(indexLowestEndX, 1)[0]
			itemHighestStart = nodes.splice(indexHighestStartX, 1)[0]
		} else {
			itemHighestStart = nodes.splice(indexHighestStartX, 1)[0]
			itemLowestEnd = nodes.splice(indexLowestEndX, 1)[0]
		}
	} else {
		if (indexLowestEndY > indexHighestStartY) {
			itemLowestEnd = nodes.splice(indexLowestEndY, 1)[0]
			itemHighestStart = nodes.splice(indexHighestStartY, 1)[0]
		} else {
			itemHighestStart = nodes.splice(indexHighestStartY, 1)[0]
			itemLowestEnd = nodes.splice(indexLowestEndY, 1)[0]
		}
	}
	return [
		{
			sx: itemLowestEnd.sx,
			sy: itemLowestEnd.sy,
			w: itemLowestEnd.w,
			h: itemLowestEnd.h,
			nodes: [itemLowestEnd],
		},
		{
			sx: itemHighestStart.sx,
			sy: itemHighestStart.sy,
			w: itemHighestStart.w,
			h: itemHighestStart.h,
			nodes: [itemHighestStart],
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
				} else if (ltree.data) {
					if (!returnNode) {
						returnArray.push(ltree.data)
					} else {
						returnArray.push(ltree)
					}
				}
			}
		}
	}
	return returnArray
}

function Ven$Rtree_insertSubtree(itemData, root, maxWidth, minWidth) {
	let bc
	/**
	 * 当根节点不存在数据时, 即该树为空, 执行插入时首先填充根节点
	 */
	if (root.nodes.length === 0) {
		root.sx = itemData.sx
		root.sy = itemData.sy
		root.w = itemData.w
		root.h = itemData.h
		root.nodes.push(itemData)
		return
	}
	let treeStack = Ven$Rtree_chooseLeafSubtree(itemData, root)
	let retObj = itemData
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
		if (retObj.data || retObj.nodes || Array.isArray(retObj)) {
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
				let a = Ven$Rtree_linearSplit(bc.nodes, minWidth)
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

function Ven$Rtree_removeArea(rect, minWidth) {
	let numberDeleted = 1
	let retArray = []
	let deleted
	while (numberDeleted > 0) {
		deleted = Ven$Rtree_removeSubtree(rect, false, rootTree, minWidth)
		numberDeleted = deleted.length
		retArray = retArray.concat(deleted)
	}
	return retArray
}

function Ven$Rtree_removeObj(rect, obj, minWidth) {
	let retArray = Ven$Rtree_removeSubtree(rect, obj, rootTree, minWidth)
	return retArray
}
