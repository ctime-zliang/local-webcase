const ven$TreeUtils = {
	insertItem(referenceItem, newItem) {
		if (newItem._val > referenceItem._val) {
			if (referenceItem._right === null) {
				referenceItem._right = newItem
				return
			}
			ven$TreeUtils.insertItem(referenceItem._right, newItem)
			return
		}
		if (referenceItem._left === null) {
			referenceItem._left = newItem
			return
		}
		ven$TreeUtils.insertItem(referenceItem._left, newItem)
	},
	getMin(item) {
		if (item._left) {
			return item._left
		}
		return item
	},
	getMax(item) {
		if (item._right) {
			return item._right
		}
		return item
	},
	removeItem(referenceItem, val) {
		if (val > referenceItem._val) {
			referenceItem._right = ven$TreeUtils.removeItem(referenceItem._right, val)
			return referenceItem
		}
		if (val < referenceItem._val) {
			referenceItem._left = ven$TreeUtils.removeItem(referenceItem._left, val)
			return referenceItem
		}
		if (referenceItem._left === null && referenceItem._right === null) {
			/**
			 * 叶子节点
			 */
			return null
		}
		if (referenceItem._left === null && referenceItem._right !== null) {
			/**
			 * 仅存在右子树
			 */
			return referenceItem._right
		}
		if (referenceItem._left !== null && referenceItem._right === null) {
			/**
			 * 仅存在左子树
			 */
			return referenceItem._left
		}
		const minItemByRightChilds = ven$TreeUtils.getMin(referenceItem._right)
		referenceItem._val = minItemByRightChilds._val
		referenceItem._right = ven$TreeUtils.removeItem(referenceItem._right, minItemByRightChilds._val)
		return referenceItem
	},
	preOrderTraverseByRecursion(item) {
		const result = []
		ven$TreeUtils.preOrderTraverseItemByRecursion(item, result)
		return result
	},
	preOrderTraverseItemByRecursion(item, result = []) {
		if (item) {
			result.push(item._val)
			ven$TreeUtils.preOrderTraverseItemByRecursion(item._left, result)
			ven$TreeUtils.preOrderTraverseItemByRecursion(item._right, result)
		}
	},
	preOrderTraverseByStack(item) {
		const result = []
		const stack = [item]
		while (stack.length) {
			const current = stack.pop()
			result.push(current._val)
			if (current._right) {
				stack.push(current._right)
			}
			if (current._left) {
				stack.push(current._left)
			}
		}
		return result
	},
	inOrderTraverseByRecursion(item) {
		const result = []
		ven$TreeUtils.inOrderTraverseItemByRecursion(item, result)
		return result
	},
	inOrderTraverseItemByRecursion(item, result = []) {
		if (item) {
			ven$TreeUtils.inOrderTraverseItemByRecursion(item._left, result)
			result.push(item._val)
			ven$TreeUtils.inOrderTraverseItemByRecursion(item._right, result)
		}
	},
	inOrderTraverseByStack(item) {
		const result = []
		const stack = []
		let current = item
		while (current || stack.length) {
			while (current) {
				stack.push(current)
				current = current._left
			}
			const top = stack.pop()
			result.push(top._val)
			current = top._right
		}
		return result
	},
	postOrderTraverseByRecursion(item) {
		const result = []
		ven$TreeUtils.postOrderTraverseItemByRecursion(item, result)
		return result
	},
	postOrderTraverseItemByRecursion(item, result = []) {
		if (item) {
			ven$TreeUtils.postOrderTraverseItemByRecursion(item._left, result)
			ven$TreeUtils.postOrderTraverseItemByRecursion(item._right, result)
			result.push(item._val)
		}
	},
	postOrderTraverseByStack(item) {
		const result = []
		const stack = [item]
		while (stack.length) {
			const current = stack.pop()
			result.push(current._val)
			if (current._left) {
				stack.push(current._left)
			}
			if (current._right) {
				stack.push(current._right)
			}
		}
		return result.reverse()
	},
}

/**
 * @description Tree 结构基本节点
 * @class Ven$TreeNode
 * @param {any} val 节点值
 */
class Ven$TreeNode {
	constructor(val) {
		this._val = val
	}
}

/**
 * @description BinaryTree 结构基本节点
 * @class Ven$BinaryTreeNode
 * @param {any} val 节点值
 */
class Ven$BinaryTreeNode extends Ven$TreeNode {
	constructor(val) {
		super(val)
		this._left = null
		this._right = null
	}
}
