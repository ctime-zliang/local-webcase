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
		[{ sx: 250, sy: 250, w: 100, h: 100 }, { id: '001' }],
		[{ sx: 150, sy: 400, w: 100, h: 100 }, { id: '002' }],
		[{ sx: 300, sy: 50, w: 100, h: 100 }, { id: '003' }],
		[{ sx: 400, sy: 350, w: 100, h: 100 }, { id: '004' }],
		[{ sx: 700, sy: 150, w: 100, h: 100 }, { id: '005' }],
		[{ sx: 600, sy: 500, w: 100, h: 100 }, { id: '006' }],
		[{ sx: 550, sy: 650, w: 100, h: 100 }, { id: '007' }],
		[{ sx: 250, sy: 700, w: 100, h: 100 }, { id: '008' }],
	]
	drawRect(TestGetData, document.getElementById('appContainer'))

	TestGetData.forEach((v, i) => {
		rtree.insert(v[0], v[1])
	})
	const result = rtree.search({
		sx: 50,
		sy: 50,
		w: 500,
		h: 500,
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
