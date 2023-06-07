const ven$TreeUtils = {
	insertItem(referenceItem, newItem) {
		if (newItem.val > referenceItem.val) {
			if (referenceItem.right === null) {
				referenceItem.right = newItem
				return
			}
			ven$TreeUtils.insertItem(referenceItem.right, newItem)
			return
		}
		if (referenceItem.left === null) {
			referenceItem.left = newItem
			return
		}
		ven$TreeUtils.insertItem(referenceItem.left, newItem)
	},
}

/**
 * @description Tree 结构基本节点
 * @class Ven$TreeNode
 * @param {any} val 节点值
 */
class Ven$TreeNode {
	constructor(val) {
		this.val = val
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
		this.left = null
		this.right = null
	}
}

/**
 * @description BinarySearchTree 二叉搜索树
 *      val(left.val) < val(parent.val) < val(right.val)
 * @class Ven$BinarySearchTree
 */
class Ven$BinarySearchTree {
	constructor() {
		this.root = null
	}

	insertItem(val) {
		const newItem = new Ven$BinaryTreeNode(val)
		if (this.root === null) {
			this.root = newItem
			return
		}
		ven$TreeUtils.insertItem(this.root, newItem)
	}
}
