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
		let item = nodes[i]
		const tempAreaA = { sx: 0, sy: 0, ex: 0, ey: 0, w: 0, h: 0 }
		tempAreaA.sx = Math.min(a.sx, item.sx)
		tempAreaA.sy = Math.min(a.sy, item.sy)
		tempAreaA.ex = Math.max(a.sx + a.w, item.sx + item.w)
		tempAreaA.ey = Math.max(a.sy + a.h, item.sy + item.h)
		tempAreaA.w = tempAreaA.ex - tempAreaA.sx
		tempAreaA.h = tempAreaA.ey - tempAreaA.sy
		let changeTempAreaA = Math.abs(Ven$Rtree_Rectangle.squarifiedRatio(tempAreaA.w, tempAreaA.h, a.nodes.length + 2) - areaA)
		/* ... */
		const tempAreaB = { sx: 0, sy: 0, ex: 0, ey: 0, w: 0, h: 0 }
		tempAreaB.sx = Math.min(b.sx, item.sx)
		tempAreaB.sy = Math.min(b.sy, item.sy)
		tempAreaB.ex = Math.max(b.sx + b.w, item.sx + item.w)
		tempAreaB.ey = Math.max(b.sy + b.h, item.sy + item.h)
		tempAreaB.w = tempAreaB.ex - tempAreaB.sx
		tempAreaB.h = tempAreaB.ey - tempAreaB.sy
		let changeTempAreaB = Math.abs(Ven$Rtree_Rectangle.squarifiedRatio(newAreaB.w, newAreaB.h, b.nodes.length + 2) - areaB)
		/**
		 * old if: !highAreaNode || !highAreaDelta || Math.abs(changeTempAreaB - changeTempAreaA) < highAreaDelta
		 */
		if (i === nodes.length - 1 || Math.abs(changeTempAreaB - changeTempAreaA) <= highAreaDelta) {
			highAreaNode = i
			highAreaDelta = Math.abs(changeTempAreaB - changeTempAreaA)
			lowestGrowthGroup = changeTempAreaA >= changeTempAreaB ? a : b
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
	 * 存在一个由
	 * 		x1 = lowestEndX
	 * 		x2 = highestStartX
	 * 		y1 = lowestEndY
	 * 		y2 = highestStartY
	 * 4 条直线构成的矩形 R
	 * 该矩形 R 即为能够包裹住当前所有 nodes 元素的最小外接矩形
	 *
	 * 获取该矩形 R 的长轴 L
	 * 获取该矩形 R 的长轴 L 垂直的两条短边 L1 与 L2
	 * 删除与 L1 和 L2 相切(接触)的两个元素
	 *
	 * 通过 index 使用 splice 方法删除数组元素并获取 index 对应的元素
	 * 需要从较大的 index 开始查找并删除, 以防止 splice 方法修改原数组导致后续的 index 查找元素出错
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
	let bc
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
