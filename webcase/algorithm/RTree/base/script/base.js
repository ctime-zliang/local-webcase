const GeoData = window.Ven$RTreeGeoData

function main() {
	const rtree = new Ven$RTree()

	const TestGetData = [
		[{ sx: 100, sy: 100, w: 100, h: 100 }, { id: '001' }],
		[{ sx: 150, sy: 150, w: 50, h: 50 }, { id: '002' }],
		[{ sx: 200, sy: 200, w: 100, h: 100 }, { id: '003' }],
		[{ sx: 250, sy: 250, w: 50, h: 50 }, { id: '004' }],
		[{ sx: 300, sy: 300, w: 100, h: 100 }, { id: '005' }],
		[{ sx: 350, sy: 350, w: 50, h: 50 }, { id: '006' }],
		[{ sx: 400, sy: 400, w: 100, h: 100 }, { id: '007' }],
		[{ sx: 450, sy: 450, w: 50, h: 50 }, { id: '008' }],
		[{ sx: 500, sy: 500, w: 100, h: 100 }, { id: '009' }],
		[{ sx: 550, sy: 550, w: 50, h: 50 }, { id: '010' }],
		[{ sx: 600, sy: 600, w: 100, h: 100 }, { id: '011' }],
		[{ sx: 650, sy: 650, w: 50, h: 50 }, { id: '012' }],
		[{ sx: 700, sy: 700, w: 100, h: 100 }, { id: '013' }],
		[{ sx: 750, sy: 750, w: 50, h: 50 }, { id: '014' }],
		[{ sx: 800, sy: 800, w: 100, h: 100 }, { id: '015' }],
		[{ sx: 850, sy: 850, w: 50, h: 50 }, { id: '016' }],
		[{ sx: 900, sy: 900, w: 100, h: 100 }, { id: '017' }],
		[{ sx: 950, sy: 950, w: 50, h: 50 }, { id: '018' }],
		[{ sx: 1000, sy: 1000, w: 100, h: 100 }, { id: '019' }],
		[{ sx: 1050, sy: 1050, w: 50, h: 50 }, { id: '020' }],
	]
	TestGetData.forEach((v) => {
		rtree.insert(v[0], v[1])
	})
	const result = rtree.search({
		sx: 100,
		sy: 100,
		w: 100,
		h: 100
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
