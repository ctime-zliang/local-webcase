const ven$TreeUtils = {
	insertTreeNode(referenceTreeNode, newTreeNode) {},
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
 *      left.val < parent.val < right.val
 * @class Ven$BinarySearchTree
 */
class Ven$BinarySearchTree {
	constructor() {
		this.root = null
	}

	insert(val) {
		const newTreeNode = new Ven$BinaryTreeNode(val)
		if (this.root === null) {
			this.root = newTreeNode
			return
		}
	}

	remove(val) {}

	search(val) {}

	inOrderTraverse() {}

	preOrderTraverse() {}

	postOrderTraverse() {}

	min() {}

	max() {}
}
