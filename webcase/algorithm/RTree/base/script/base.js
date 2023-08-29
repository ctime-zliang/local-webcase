const GeoData = window.Ven$RTreeGeoData
const rtree = new Ven$RTree()

function appendRectDraw(rectList, container) {
	let wrapper = document.createDocumentFragment()
	rectList.forEach((item, index) => {
		const pos = item[0]
		const data = item[1]
		let htmlString = `
			<div id="${data.id}" style="position: absolute; font-size: 12px; width: ${pos.w}px; height: ${pos.h}px; left: ${pos.sx}px; top: ${pos.sy}px; background-color: rgba(128, 128, 128, 0.5);">
				<div>${index}. ${data.id}</div>
				<div>sx = ${pos.sx}</div>
				<div>sy = ${pos.sy}</div>
				<div>w = ${pos.w}</div>
				<div>h = ${pos.h}</div>
			</div>
		`
		let itemElement = document.createRange().createContextualFragment(htmlString)
		wrapper.appendChild(itemElement)
	})
	container.appendChild(wrapper)
}

function removeRectDraw(idList) {
	idList.forEach(item => {
		const element = document.getElementById(item)
		if (!element) {
			return
		}
		element.remove()
	})
}

function main() {
	const data00 = { id: '000' }
	const data01 = { id: '001' }
	const data02 = { id: '002' }
	const data03 = { id: '003' }
	const data04 = { id: '004' }
	const data05 = { id: '005' }
	const data16 = { id: '016' }
	const TestGetData = [
		[{ sx: 100, sy: 100, w: 100, h: 100 }, data00],
		[{ sx: 250, sy: 250, w: 100, h: 100 }, data01],
		[{ sx: 150, sy: 400, w: 100, h: 100 }, data02],
		[{ sx: 300, sy: 50, w: 100, h: 100 }, data03],
		[{ sx: 400, sy: 350, w: 100, h: 100 }, data04],
		[{ sx: 450, sy: 150, w: 100, h: 100 }, data05],
		[{ sx: 650, sy: 200, w: 100, h: 100 }, { id: '006' }],
		[{ sx: 800, sy: 100, w: 100, h: 100 }, { id: '007' }],
		[{ sx: 850, sy: 300, w: 100, h: 100 }, { id: '008' }],
		[{ sx: 700, sy: 450, w: 100, h: 100 }, { id: '009' }],
		[{ sx: 550, sy: 500, w: 100, h: 100 }, { id: '010' }],
		[{ sx: 350, sy: 600, w: 100, h: 100 }, { id: '011' }],
		[{ sx: 50, sy: 550, w: 100, h: 100 }, { id: '012' }],
		[{ sx: 800, sy: 650, w: 100, h: 100 }, { id: '013' }],
		[{ sx: 500, sy: 700, w: 100, h: 100 }, { id: '014' }],
		[{ sx: 900, sy: 500, w: 100, h: 100 }, { id: '015' }],
		[{ sx: 100, sy: 100, w: 100, h: 100 }, data16],
	]
	appendRectDraw(TestGetData, document.getElementById('appContainer'))

	TestGetData.forEach((v, i) => {
		rtree.insertItemData(v[0], v[1])
	})

	const targetRect1 = { sx: 50, sy: 50, w: 500, h: 500 }
	Ven$Rtree_debugUpdateRectangleAuxiliary('SEARCH', targetRect1, 'blue')
	const result1 = rtree.search(targetRect1, true)
	console.log('区域搜索仅返回绑定数据', result1)
	const result2 = rtree.search(targetRect1, false)
	console.log('区域搜索返回叶子节点', result2)
	const result3 = rtree.search({ sx: 150, sy: 150, w: 0, h: 0 }, true)
	console.log('点搜索仅返回绑定数据', result3)

	window.setTimeout(() => {
		// const ids = [...Ven$Rtree_storageAuxiliary.ids]
		// ids.forEach((id, idx) => {
		// 	Ven$Rtree_debugRemoveRectangleAuxiliary(id)
		// })
		// const targetRect = { sx: 450, sy: 150, w: 50, h: 550 }
		// Ven$Rtree_debugUpdateRectangleAuxiliary('DELETION1', targetRect, 'blue')
		// const remoteResult = rtree.removeArea(targetRect)
		// removeRectDraw(remoteResult.map((item, index) => {
		// 	return item.leaf.id
		// }))
		// console.log(`移除元素`, remoteResult)
	}, 1500)

	window.setTimeout(() => {
		const ids = [...Ven$Rtree_storageAuxiliary.ids]
		ids.forEach((id, idx) => {
			Ven$Rtree_debugRemoveRectangleAuxiliary(id)
		})
		const targetRect = { sx: 100, sy: 100, w: 100, h: 100 }
		Ven$Rtree_debugUpdateRectangleAuxiliary('DELETION2', targetRect, 'blue')
		const remoteResult = rtree.removeTarget(targetRect, data16)
		removeRectDraw(
			remoteResult.map((item, index) => {
				return item.leaf.id
			})
		)
		console.log(`移除元素`, remoteResult)
	}, 1500)

	window.setTimeout(() => {
		// const ids = [...Ven$Rtree_storageAuxiliary.ids]
		// ids.forEach((id, idx) => {
		// 	Ven$Rtree_debugRemoveRectangleAuxiliary(id)
		// })
		// const targetRect = { sx: 450, sy: 150, w: 0, h: 0 }
		// Ven$Rtree_debugUpdateRectangleAuxiliary('DELETION3', targetRect, 'blue')
		// const remoteResult = rtree.removeTarget(targetRect, data05)
		// removeRectDraw(
		// 	remoteResult.map((item, index) => {
		// 		return item.leaf.id
		// 	})
		// )
		// console.log(`移除元素`, remoteResult)
	}, 1500)

	console.log(rtree)
}

main()
