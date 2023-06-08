/**
 * @description BinarySearchTree 二叉搜索树
 *      val(left._val) < val(parent._val) < val(right._val)
 * @class Ven$BinarySearchTree
 */
class Ven$BinarySearchTree {
	constructor() {
		this._root = null
	}

	insertItem(val) {
		const newItem = new Ven$BinaryTreeNode(val)
		if (this._root === null) {
			this._root = newItem
			return
		}
		ven$TreeUtils.insertItem(this._root, newItem)
	}

	max() {
		let item = this._root
		let val = undefined
		while (item) {
			val = item._val
			item = item._right
		}
		return val
	}

	min() {
		let item = this._root
		let val = undefined
		while (item) {
			val = item._val
			item = item._left
		}
		return val
	}

	hasItem(val) {
		let item = this._root
		while (item) {
			if (val < item._val) {
				item = item._left
				continue
			}
			if (val > item._val) {
				item = item._right
				continue
			}
			return true
		}
		return false
	}

	removeItem(val) {
		if (this._root === null) {
			return false
		}
		ven$TreeUtils.removeItem(this._root, val)
		return true
	}

	preOrderTraverseByRecursion() {
		return ven$TreeUtils.preOrderTraverseByRecursion(this._root)
	}

	preOrderTraverseByStack() {
		return ven$TreeUtils.preOrderTraverseByStack(this._root)
	}

	inOrderTraverseByRecursion() {
		return ven$TreeUtils.inOrderTraverseByRecursion(this._root)
	}

	inOrderTraverseByStack() {
		return ven$TreeUtils.inOrderTraverseByStack(this._root)
	}

	postOrderTraverseByRecursion() {
		return ven$TreeUtils.postOrderTraverseByRecursion(this._root)
	}

	postOrderTraverseByStack() {
		return ven$TreeUtils.postOrderTraverseByStack(this._root)
	}
}
