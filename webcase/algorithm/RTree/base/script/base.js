const GeoData = window.Ven$RTreeGeoData

function drawRect(rectList, container) {
	let htmlString = ``
	rectList.forEach((item, index) => {
		const pos = item[0]
		const data = item[1]
		htmlString += `
			<div style="position: absolute; font-size: 12px; width: ${pos.w}px; height: ${pos.h}px; left: ${pos.sx}px; top: ${pos.sy}px; background-color: rgba(128, 128, 128, 0.5);">
				<div>${index}. ${data.id}</div>
				<div>sx = ${pos.sx}</div>
				<div>sy = ${pos.sy}</div>
				<div>w = ${pos.w}</div>
				<div>h = ${pos.h}</div>
			</div>`
	})
	container.innerHTML = htmlString
}

function main() {
	const rtree = new Ven$RTree()

	const TestGetData = [
		[{ sx: 100, sy: 100, w: 100, h: 100 }, { id: '000' }],
		[{ sx: 250, sy: 100, w: 100, h: 100 }, { id: '001' }],
		[{ sx: 400, sy: 100, w: 100, h: 100 }, { id: '002' }],
		[{ sx: 550, sy: 100, w: 100, h: 100 }, { id: '003' }],
		[{ sx: 700, sy: 100, w: 100, h: 100 }, { id: '004' }],
		/* ... */
		[{ sx: 100, sy: 250, w: 100, h: 100 }, { id: '005' }],
		[{ sx: 250, sy: 250, w: 100, h: 100 }, { id: '006' }],
		[{ sx: 400, sy: 250, w: 100, h: 100 }, { id: '007' }],
		[{ sx: 550, sy: 250, w: 100, h: 100 }, { id: '008' }],
		[{ sx: 700, sy: 250, w: 100, h: 100 }, { id: '009' }],
		/* ... */
		[{ sx: 100, sy: 400, w: 100, h: 100 }, { id: '010' }],
		[{ sx: 250, sy: 400, w: 100, h: 100 }, { id: '011' }],
		[{ sx: 400, sy: 400, w: 100, h: 100 }, { id: '012' }],
		[{ sx: 550, sy: 400, w: 100, h: 100 }, { id: '013' }],
		[{ sx: 700, sy: 400, w: 100, h: 100 }, { id: '014' }],
		/* ... */
		[{ sx: 100, sy: 550, w: 100, h: 100 }, { id: '015' }],
		[{ sx: 250, sy: 550, w: 100, h: 100 }, { id: '016' }],
		[{ sx: 400, sy: 550, w: 100, h: 100 }, { id: '017' }],
		[{ sx: 550, sy: 550, w: 100, h: 100 }, { id: '018' }],
		[{ sx: 700, sy: 550, w: 100, h: 100 }, { id: '019' }],
	]
	drawRect(TestGetData, document.getElementById('appContainer'))

	TestGetData.forEach(v => {
		rtree.insert(v[0], v[1])
	})
	const result = rtree.search({
		sx: 100,
		sy: 100,
		w: 275,
		h: 275,
	})
	console.log(result)

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
