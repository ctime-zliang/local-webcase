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

function Ven$Rtree_chooseLeafSubtree(itemData, root) {
	const bestChoiceStack = [root]
	let bestChoiceIndex = -1
	let bestChoiceArea = 0
	/**
	 * 根节点的直接子节点列表
	 */
	let nodes = root.nodes
	const debugId0 = Ven$Rtree_getHashIden()
	const debugId1 = Ven$Rtree_getHashIden()
	/**
	 * 从当前的 root 逐层往下遍历, 直到遍历到叶子节点即终止循环
	 *
	 * 遍历树的某一层的所有节点 nodes
	 * 取 nodes[i] 的"正方化"面积值 SQ(i)
	 * 取 nodes[i] 和 itemData 构建的矩形 R[i] 的"正方化"面积值 SQ(di)
	 * 找到 SQ(di) 和 SQ(i) 的差的最小值并记录索引 bestChoiceIndex = i
	 *
	 * 在下一轮外循环中获取 nodes[bestChoiceIndex] 的所有子节点 nodes
	 * 并再次执行同样的遍历操作
	 *
	 * 当 nodes[i] 为叶子节点时, 即退出整个查找循环(do-while)
	 * 遍历过程使用 bestChoiceStack 记录从 root 到 nodes[i] 的父节点的路径(节点集合)
	 */
	do {
		if (bestChoiceIndex !== -1) {
			bestChoiceStack.push(nodes[bestChoiceIndex])
			nodes = nodes[bestChoiceIndex].nodes
			bestChoiceIndex = -1
		}
		for (let i = nodes.length - 1; i >= 0; i--) {
			const childItem = nodes[i]
			if (childItem.leaf) {
				bestChoiceIndex = -1
				break
			}
			Ven$Rtree_debugUpdateRectangleAuxiliary(debugId0, childItem, '#440000')
			const sx = Math.min(childItem.sx, itemData.sx)
			const sy = Math.min(childItem.sy, itemData.sy)
			const ex = Math.max(childItem.sx + childItem.w, itemData.sx + itemData.w)
			const ey = Math.max(childItem.sy + childItem.h, itemData.sy + itemData.h)
			const newW = ex - sx
			const newH = ey - sy
			Ven$Rtree_debugUpdateRectangleAuxiliary(debugId1, { sx, sy, w: newW, h: newH }, '#440000')
			const oldChildItemRatio = Ven$Rtree_Rectangle.squarifiedRatio(childItem.w, childItem.h, childItem.nodes.length + 1)
			const newChildItemRatio = Ven$Rtree_Rectangle.squarifiedRatio(newW, newH, childItem.nodes.length + 2)
			if (bestChoiceIndex < 0 || Math.abs(newChildItemRatio - oldChildItemRatio) < bestChoiceArea) {
				bestChoiceArea = Math.abs(newChildItemRatio - oldChildItemRatio)
				bestChoiceIndex = i
			}
		}
	} while (bestChoiceIndex !== -1)
	Ven$Rtree_debugRemoveRectangleAuxiliary(debugId0)
	Ven$Rtree_debugRemoveRectangleAuxiliary(debugId1)
	return bestChoiceStack
}

function Ven$Rtree_linearSplit(nodes, minWidth) {
	/**
	 * 将 nodes 分割成两棵树
	 * 首先通过构建矩形策略从 nodes 中选择两个节点生成两棵树的根节点
	 * 将剩下的节点分配到两棵树
	 */
	const n = Ven$Rtree_pickLinear(nodes)
	const debugId0 = Ven$Rtree_getHashIden()
	const debugId1 = Ven$Rtree_getHashIden()
	Ven$Rtree_debugUpdateRectangleAuxiliary(debugId0, n[0], '#440000')
	Ven$Rtree_debugUpdateRectangleAuxiliary(debugId1, n[1], '#880000')
	while (nodes.length > 0) {
		Ven$Rtree_pickNext(nodes, n[0], n[1], minWidth)
		Ven$Rtree_debugUpdateRectangleAuxiliary(debugId0, n[0], '#440000')
		Ven$Rtree_debugUpdateRectangleAuxiliary(debugId1, n[1], '#880000')
	}
	Ven$Rtree_debugRemoveRectangleAuxiliary(debugId0)
	Ven$Rtree_debugRemoveRectangleAuxiliary(debugId1)
	return n
}

function Ven$Rtree_pickNext(nodes, a, b, minWidth) {
	const areaA = Ven$Rtree_Rectangle.squarifiedRatio(a.w, a.h, a.nodes.length + 1)
	const areaB = Ven$Rtree_Rectangle.squarifiedRatio(b.w, b.h, b.nodes.length + 1)
	/**
	 * "正方化"起始节点 a, 记作 SQ(A)
	 * "正方化"起始节点 b, 记作 SQ(B)
	 *
	 * 逐一遍历 nodes
	 * 取任意的 nodes[i] 并"正方化"后取值记作 SQ(nodes[i])
	 * 计算 SQ(nodes[i]) 和 SQ(A) 的差的绝对值, 记作 DA
	 * 计算 SQ(nodes[i]) 和 SQ(B) 的差的绝对值, 记作 DB
	 * 取整个遍历周期内 DA 和 DB 的差的最小值 m, 并记录对应的索引 highAreaNodeIndex = i
	 *
	 * 从 nodes 中删除 highAreaNodeIndex 位置处的元素, 并将该元素插入到 a 或 b 的子节点列表中
	 */
	let highAreaDelta
	let lowestGrowthGroup
	let highAreaNodeIndex = -1
	const debugIdA = Ven$Rtree_getHashIden()
	const debugIdB = Ven$Rtree_getHashIden()
	for (let i = nodes.length - 1; i >= 0; i--) {
		const item = nodes[i]
		const tempItemA = { sx: 0, sy: 0, ex: 0, ey: 0, w: 0, h: 0 }
		tempItemA.sx = Math.min(a.sx, item.sx)
		tempItemA.sy = Math.min(a.sy, item.sy)
		tempItemA.ex = Math.max(a.sx + a.w, item.sx + item.w)
		tempItemA.ey = Math.max(a.sy + a.h, item.sy + item.h)
		tempItemA.w = tempItemA.ex - tempItemA.sx
		tempItemA.h = tempItemA.ey - tempItemA.sy
		Ven$Rtree_debugUpdateRectangleAuxiliary(debugIdA, tempItemA, '#444400')
		const tempItemAreaA = Ven$Rtree_Rectangle.squarifiedRatio(tempItemA.w, tempItemA.h, a.nodes.length + 2)
		const changeTempAreaA = Math.abs(tempItemAreaA - areaA)
		/* ... */
		const tempItemB = { sx: 0, sy: 0, ex: 0, ey: 0, w: 0, h: 0 }
		tempItemB.sx = Math.min(b.sx, item.sx)
		tempItemB.sy = Math.min(b.sy, item.sy)
		tempItemB.ex = Math.max(b.sx + b.w, item.sx + item.w)
		tempItemB.ey = Math.max(b.sy + b.h, item.sy + item.h)
		tempItemB.w = tempItemB.ex - tempItemB.sx
		tempItemB.h = tempItemB.ey - tempItemB.sy
		Ven$Rtree_debugUpdateRectangleAuxiliary(debugIdB, tempItemB, '#448800')
		const tempItemAreaB = Ven$Rtree_Rectangle.squarifiedRatio(tempItemB.w, tempItemB.h, b.nodes.length + 2)
		const changeTempAreaB = Math.abs(tempItemAreaB - areaB)
		/**
		 * old if: !highAreaNodeIndex || !highAreaDelta || Math.abs(changeTempAreaB - changeTempAreaA) < highAreaDelta
		 */
		if (i === nodes.length - 1 || Math.abs(changeTempAreaB - changeTempAreaA) <= highAreaDelta) {
			highAreaNodeIndex = i
			highAreaDelta = Math.abs(changeTempAreaB - changeTempAreaA)
			lowestGrowthGroup = changeTempAreaA >= changeTempAreaB ? a : b
		}
	}
	Ven$Rtree_debugRemoveRectangleAuxiliary(debugIdA)
	Ven$Rtree_debugRemoveRectangleAuxiliary(debugIdB)
	const nodesInitLength = nodes.length
	const dist = minWidth - nodesInitLength
	const tempNode = nodes.splice(highAreaNodeIndex, 1)[0]
	if (a.nodes.length <= dist) {
		a.nodes.push(tempNode)
		Ven$Rtree_Rectangle.expandRectangle(a, tempNode)
		return
	}
	if (b.nodes.length <= dist) {
		b.nodes.push(tempNode)
		Ven$Rtree_Rectangle.expandRectangle(b, tempNode)
		return
	}
	lowestGrowthGroup.nodes.push(tempNode)
	Ven$Rtree_Rectangle.expandRectangle(lowestGrowthGroup, tempNode)
}

function Ven$Rtree_pickLinear(nodes) {
	/**
	 * 在一个平面上分布着 nodes[i] 元素
	 * nodes 的长度即为其父节点当前的子节点个数, 且父节点存在一个最大子节点个数限制 M
	 * 当 nodes.length 值在某一个处理过程中已经大于了 M, 则会立即开始分裂
	 * 因此 [0, nodes.length - 2] 区间内的元素个数即等于 M
	 * 遍历 [0, nodes.length - 2] 区间内的元素
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
	/**
	 * 存在一个由
	 * 		x1 = lowestEndX
	 * 		x2 = highestStartX
	 * 		y1 = lowestEndY
	 * 		y2 = highestStartY
	 * 4 条直线构成的矩形 R
	 *
	 * 获取该矩形 R 的两条短边 L1 与 L2
	 * 找到 L1 和 L2 所在的直线 x1 和 x2(或 y1 和 y2)
	 * 继续在 nodes 依据索引定位到决定 x1 和 x2(或 y1 和 y2) 直线坐标的元素 nodes[idx1] 和 nodes[idx2], 记作 A 和 B
	 * 分别由 A 和 B 的尺寸数据生成 MBR 节点 MA 和 MB, 并将 A 和 B 作为其子节点
	 * 返回 MA 和 MB
	 *
	 * 通过 index 使用 splice 方法删除数组元素并获取 index 对应的元素
	 * 需要从较大的 index 开始查找并删除, 以防止 splice 方法修改原数组导致后续的 index 查找元素出错
	 */
	const lowestEndX = nodes[indexLowestEndX].sx + nodes[indexLowestEndX].w
	const lowestEndY = nodes[indexLowestEndY].sy + nodes[indexLowestEndY].h
	const highestStartX = nodes[indexHighestStartX].sx
	const highestStartY = nodes[indexHighestStartY].sy
	const dx = Math.abs(lowestEndX - highestStartX)
	const dy = Math.abs(lowestEndY - highestStartY)
	let itemLowestEnd
	let itemHighestStart
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

function Ven$Rtree_insertSubtree(itemData, root, maxWidth, minWidth) {
	/**
	 * 当根节点不存在数据时, 即该树为空, 执行插入时首先填充根节点
	 * 即该节点(root)的 MBR 即为当前被插入的节点的尺寸的数据值
	 */
	if (root.nodes.length === 0) {
		root.sx = itemData.sx
		root.sy = itemData.sy
		root.w = itemData.w
		root.h = itemData.h
		root.nodes.push(itemData)
		Ven$Rtree_debugUpdateRectangleAuxiliary(root.id, root)
		return
	}
	/**
	 * 将目标节点插入到当前树中
	 * 获取从根节点到最终插入位置的路径上的节点集合
	 */
	let treeStack = Ven$Rtree_chooseLeafSubtree(itemData, root)
	let retObj = itemData
	let bc
	let pbc
	let level = treeStack.length
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
				Ven$Rtree_debugUpdateRectangleAuxiliary(bc.id, bc)
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
				a[0].id = 'node-' + level + '-l'
				a[1].id = 'node-' + level + '-r'
				a.forEach(item => {
					Ven$Rtree_debugUpdateRectangleAuxiliary(item.id, item)
				})
				retObj = a
				/**
				 * 当当前分裂的节点为 root 节点的直接子节点时, treeStack 已经为空
				 * 将分裂后的子树重新挂在到 root 节点
				 */
				if (treeStack.length <= 0) {
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
			Ven$Rtree_debugUpdateRectangleAuxiliary(bc.id, bc)
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
