/**
 * https://www.cnblogs.com/cmi-sh-love/p/kong-jian-shud-ju-suo-yinRTree-wan-quan-jie-xi-jiJa.html
 * https://www.cnblogs.com/chentianwei/p/11736243.html
 */

class Ven$RTree {
	constructor(width) {
		this.root = null
		/**
		 * 任意节点可包含的最小子节点个数
		 */
		this.minWidth = 2
		/**
		 * 任意节点可包含的最大子节点个数
		 */
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
		/**
		 * 根节点不存储具体的内容数据
		 */
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

	insert(rect, data) {
		let retArray = Ven$Rtree_insertSubtree(
			{
				sx: rect.sx,
				sy: rect.sy,
				w: rect.w,
				h: rect.h,
				data: data,
			},
			this.getTree(),
			this.maxWidth,
			this.minWidth
		)
		return retArray
	}
}
