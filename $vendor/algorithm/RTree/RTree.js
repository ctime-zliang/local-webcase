class Ven$RTree {
	constructor(width) {
		this.root = null
		this.minWidth = 0
		this.maxWidth = 0
		this.inital(width)
	}

	inital(width) {
		let minWidth = 3
		let maxWidth = 6
		if (!isNaN(width)) {
			minWidth = Math.floor(width / 2.0)
			maxWidth = width
		}
		let rootTree = {
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

	insertSubtree(node, root) {
		Ven$Rtree_insertSubtree(node, root, this, this.maxWidth, this.minWidth)
	}

	getTree() {
		return this.root
	}

	setTree(newTree, where) {
		if (!where) {
			where = rootTree
		}
		return Ven$Rtree_attachData(where, newTree)
	}

	search(rect, returnNode, returnArray) {
		returnArray = returnArray || []
		return Ven$Rtree_searchSubtree(rect, returnNode, returnArray, this.getTree())
	}

	remove(rect, obj) {
		if (!obj || typeof obj === 'function') {
			return Ven$Rtree_removeArea(rect, obj, this.minWidth)
		} else {
			return Ven$Rtree_removeObj(rect, obj, this.minWidth)
		}
	}

	insert(rect, obj) {
		let retArray = Ven$Rtree_insertSubtree(
			{
				sx: rect.sx,
				sy: rect.sy,
				w: rect.w,
				h: rect.h,
				leaf: obj,
			},
			this.getTree(),
			this.maxWidth,
			this.minWidth
		)
		return retArray
	}
}
