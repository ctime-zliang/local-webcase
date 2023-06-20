const GeoData = window.Ven$RTreeGeoData

function main() {
	const rtree = new Ven$RTree()

	GeoData[0].forEach(v => {
		rtree.insert(v[0], v[1])
	})

	console.log(rtree)
}

main()
