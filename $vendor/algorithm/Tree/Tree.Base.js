/**
 * @description Tree 结构基本节点
 * @class Ven$TreeNode
 * @param {any} val 节点值
 * @return {undefined}
 */
class Ven$TreeNode {
	constructor(val) {
		this.val = val
	}
}

/**
 * @description Binary Tree 结构基本节点
 * @class Ven$BinaryTreeNode
 * @param {any} val 节点值
 * @return {undefined}
 */
class Ven$BinaryTreeNode extends Ven$TreeNode {
	constructor(val) {
		super(val)
		this.left = null
		this.right = null
	}
}

/**
 * @description BinarySearchTree
 * @class Ven$BinarySearchTree
 * @param {any} val 节点值
 * @return {undefined}
 */
class Ven$BinarySearchTree extends Ven$BinaryTreeNode {
	constructor(val) {
		super(val)
		this.root = null
	}

	insert(val) {}

	remove(val) {}

	search(val) {}

	inOrderTraverse() {}

	preOrderTraverse() {}

	postOrderTraverse() {}

	min() {}

	max() {}
}
