/* 二叉树结点 */
class BinaryTreeNode {
	constructor(key, value) {
		this._parent = null
		this._left = null
		this._right = null
		this._key = key
		this._value = value
	}

	set parent(value) {
		this._parent = value
	}

	get parent() {
		return this._parent
	}

	set value(value) {
		this._value = value
	}

	get value() {
		return this._value
	}

	set key(value) {
		this._key = value
	}

	get key() {
		return this._key
	}

	set _right(value) {
		this.__right = value
	}

	get _right() {
		return this.__right
	}

	set left(value) {
		this._left = value
	}

	get left() {
		return this._left
	}
}
