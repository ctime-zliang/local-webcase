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
				retObj.nodes = searchSubtree(tree, true, retObj.nodes, tree)
				tree.nodes = []
				hitStack.push(tree)
				countStack.push(1)
			} else if (hitStack.length > 0 && tree.nodes.length < minWidth) {
				retObj.nodes = searchSubtree(tree, true, retObj.nodes, tree)
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
			let nw = Math.max(ltree.x + ltree.w, rect.sx + rect.w) - Math.min(ltree.x, rect.sx)
			let nh = Math.max(ltree.y + ltree.h, rect.sy + rect.h) - Math.min(ltree.y, rect.sy)
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
	let n = pickLinear(nodes)
	while (nodes.length > 0) {
		pickNext(nodes, n[0], n[1])
	}
	return n
}
