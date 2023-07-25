const GeoData = window.Ven$RTreeGeoData

function drawRect(rectList, container) {
	let wrapper = document.createDocumentFragment()
	rectList.forEach((item, index) => {
		const pos = item[0]
		const data = item[1]
		let htmlString = `
			<div style="position: absolute; font-size: 12px; width: ${pos.w}px; height: ${pos.h}px; left: ${pos.sx}px; top: ${pos.sy}px; background-color: rgba(128, 128, 128, 0.5);">
				<div>${index}. ${data.id}</div>
				<div>sx = ${pos.sx}</div>
				<div>sy = ${pos.sy}</div>
				<div>w = ${pos.w}</div>
				<div>h = ${pos.h}</div>
			</div>`
		let itemElement = document.createRange().createContextualFragment(htmlString)
		wrapper.appendChild(itemElement)
	})
	container.appendChild(wrapper)
}

function main() {
	const rtree = new Ven$RTree()

	const TestGetData = [
		[{ sx: 100, sy: 100, w: 100, h: 100 }, { id: '000' }],
		[{ sx: 250, sy: 250, w: 100, h: 100 }, { id: '001' }],
		[{ sx: 150, sy: 400, w: 100, h: 100 }, { id: '002' }],
		[{ sx: 300, sy: 50, w: 100, h: 100 }, { id: '003' }],
		[{ sx: 400, sy: 350, w: 100, h: 100 }, { id: '004' }],
		[{ sx: 450, sy: 150, w: 100, h: 100 }, { id: '005' }],
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
	]
	drawRect(TestGetData, document.getElementById('appContainer'))

	TestGetData.forEach((v, i) => {
		rtree.insertItemData(v[0], v[1])
	})

	const targetRect1 = { sx: 50, sy: 50, w: 500, h: 500 }
	Ven$Rtree_debugUpdateRectangleAuxiliary('SEARCH', targetRect1, 'blue')
	const result1 = rtree.search(targetRect1, true)
	console.log(result1)
	// const result2 = rtree.search(targetRect1, false)
	// console.log(result2)
	const result3 = rtree.search({ sx: 150, sy: 150, w: 0, h: 0 }, true)
	console.log(result3)

	const targetRect2 = { sx: 50, sy: 50, w: 750, h: 750 }
	Ven$Rtree_debugUpdateRectangleAuxiliary('DELETION', targetRect2, 'green')
	const remoteResult = rtree.remove(targetRect2)
	console.log(remoteResult)

	// GeoData[0].forEach((v) => {
	// 	rtree.insert(v[0], v[1])
	// })
	// const result = rtree.search({
	// 	sx: 2000,
	// 	sy: 2000,
	// 	w: 1000,
	// 	h: 1000
	// })
	// console.log(result)

	console.log(rtree)
}

main()
