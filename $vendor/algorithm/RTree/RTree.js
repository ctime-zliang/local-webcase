class Ven$RTree {
	constructor(width) {
		this._root = null
		/**
		 * 任意节点的字节点个数限值
		 */
		this._minWidth = 2
		this._maxWidth = 4
		this.inital(width)
	}

	inital(width) {
		let minWidth = this._minWidth
		let maxWidth = this._maxWidth
		if (!isNaN(width)) {
			minWidth = Math.floor(width / 2.0)
			maxWidth = width
		}
		const rootTree = {
			sx: 0,
			sy: 0,
			w: 0,
			h: 0,
			id: 'root',
			nodes: [],
		}
		this._root = rootTree
		this._minWidth = minWidth
		this._maxWidth = maxWidth
	}

	insertSubtree(handleNode, targetRoot) {
		targetRoot = targetRoot || this.getTree()
		Ven$Rtree_insertSubtree(handleNode, targetRoot, this._minWidth, this._maxWidth)
	}

	insertItemData(rect, data) {
		Ven$Rtree_insertSubtree(
			{
				sx: rect.sx,
				sy: rect.sy,
				w: rect.w,
				h: rect.h,
				leaf: data,
			},
			this.getTree(),
			this._minWidth,
			this._maxWidth
		)
	}

	search(rect, isGetNodeDataOnly) {
		return Ven$Rtree_searchSubtree(rect, this.getTree(), isGetNodeDataOnly)
	}

	removeArea(rect) {
		return Ven$Rtree_removeArea(rect, this.getTree(), this._minWidth, this._maxWidth)
	}

	removeTarget(rect, targetOnLeaf) {
		if (targetOnLeaf === false) {
			return Ven$Rtree_removeArea(rect, this.getTree(), this._minWidth, this._maxWidth)
		}
		return Ven$Rtree_removeObj(rect, targetOnLeaf, this.getTree(), this._minWidth, this._maxWidth)
	}

	getTree() {
		return this._root
	}

	setTree(newTree, targetRoot) {
		if (!targetRoot) {
			targetRoot = this._root
		}
		return Ven$Rtree_attachData(newTree, targetRoot)
	}
}
