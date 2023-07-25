class Ven$RTree {
	constructor(width) {
		this.root = null
		/**
		 * 任意节点的字节点个数限值
		 */
		this.minWidth = 2
		this.maxWidth = 4
		this.inital(width)
	}

	inital(width) {
		let minWidth = this.minWidth
		let maxWidth = this.maxWidth
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
		this.root = rootTree
		this.minWidth = minWidth
		this.maxWidth = maxWidth
	}

	insertSubtree(node, targetRoot) {
		targetRoot = targetRoot || this.getTree()
		Ven$Rtree_insertSubtree(node, targetRoot, this.maxWidth, this.minWidth)
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
			this.maxWidth,
			this.minWidth
		)
	}

	search(rect, isGetNodeDataOnly) {
		return Ven$Rtree_searchSubtree(rect, this.getTree(), isGetNodeDataOnly)
	}

	remove(rect, obj) {
		if (!obj || typeof obj === 'function') {
			return Ven$Rtree_removeArea(rect, this.getTree(), this.minWidth)
		} else {
			return Ven$Rtree_removeObj(rect, obj, this.getTree(), this.minWidth)
		}
	}

	getTree() {
		return this.root
	}

	setTree(newTree, targetRoot) {
		if (!targetRoot) {
			targetRoot = this.root
		}
		return Ven$Rtree_attachData(newTree, targetRoot)
	}
}
