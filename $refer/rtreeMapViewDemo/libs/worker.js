var m = L.map('map').setView([42.34100473739444, -71.09639167785643], 14)
var mq = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.jpeg', {
	attribution:
		'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: '1234',
}).addTo(m)
var bikes = L.geoJson(undefined, { style: style, onEachFeature: onEachFeature }).addTo(m)

var rt = cw(function (data, cb) {
	var self = this
	var request, _resp
	importScripts('../dist/rtree.js')
	if (!self.rt) {
		self.rt = RTree()
		request = new XMLHttpRequest()
		request.open('GET', data)
		request.onreadystatechange = function () {
			if (request.readyState === 4 && request.status === 200) {
				_resp = JSON.parse(request.responseText)
				self.rt.geoJSON(_resp)
				cb(true)
			}
		}
		request.send()
	} else {
		return self.rt.bbox(data)
	}
})
var bd

rt.data(cw.makeUrl('libs/bikes.json')).then(function (d) {
	showAll()
})

var popupTemplate = Mustache.compile('<ul>{{#items}}<li><strong>{{key}}</strong>: {{value}}</li>{{/items}}</ul>')
function onEachFeature(ft, layer) {
	if (ft.properties) {
		var out = { items: [] },
			val
		for (var key in ft.properties) {
			if (['geometry', 'id', '_id', 'type', 'Shape_Length', '_cwm'].indexOf(key) === -1) {
				val = ft.properties[key].replace(/\+.+\+/g, '')
				if (val && val !== '') {
					out.items.push({ key: key.replace(/([a-z])([A-Z])/g, '$1 $2'), value: val })
				}
			}
		}
		layer.bindPopup(popupTemplate(out))
	}
}
function style(doc) {
	var status = doc.properties.FacilityStatus.slice(0, doc.properties.FacilityStatus.indexOf(':'))
	out = { opacity: 0.9 }
	switch (status) {
		case 'Existing':
			break
		case 'Under construction':
			out.dashArray = '4, 10'

			break
		case 'In design':
			out.dashArray = '4,15'

			break
		case 'Planned':
			out.dashArray = '3, 20'
			break
	}
	var facT = doc.properties.FacilityType
	var pn = facT.indexOf('(')
	if (pn > 0) {
		facT = facT.slice(0, pn)
	}
	switch (facT.trim()) {
		case 'Bike lane':
			out.color = '#E41A1C'
			break
		case 'Bicycle/Pedestrian priority roadway':
			out.color = '#377EB8'
			break
		case 'Cycle track':
			out.color = '#4DAF4A'
			break
		case 'Marked shared lane':
			out.color = '#984EA3'
			break
		case 'Shared use path':
			out.color = '#FF7F00'
			break
		case 'Sign-posted on-road bike route':
			out.color = '#FFFF33'
			break
		case 'On-Road - To Be Determined':
			out.color = '#A65628'
			break
		case 'Paved bike shoulder':
			out.color = '#F781BF'
			break
		case 'Hybrid':
			out.color = '#999999'
			break
	}
	return out
}

var BoxSelect = L.Map.BoxZoom.extend({
	_onMouseUp: function (e) {
		this._pane.removeChild(this._box)
		this._container.style.cursor = ''

		L.DomUtil.enableTextSelection()

		L.DomEvent.off(document, 'mousemove', this._onMouseMove).off(document, 'mouseup', this._onMouseUp)

		var map = this._map,
			layerPoint = map.mouseEventToLayerPoint(e)

		if (this._startLayerPoint.equals(layerPoint)) {
			return
		}

		var bounds = new L.LatLngBounds(map.layerPointToLatLng(this._startLayerPoint), map.layerPointToLatLng(layerPoint))

		map.fire('boxselectend', {
			boxSelectBounds: [
				[bounds.getSouthWest().lng, bounds.getSouthWest().lat],
				[bounds.getNorthEast().lng, bounds.getNorthEast().lat],
			],
		})
	},
})
m.boxZoom.disable() //turn off  the defult behavior
var boxSelect = new BoxSelect(m) //new box select
boxSelect.enable() //add it
m.on('boxselectend', function (e) {
	rt.data(e.boxSelectBounds).then(function (d) {
		bikes.clearLayers()
		bikes.addData(d)
	})
})
function showAll() {
	var bounds = m.getBounds()
	var thing = [
		[bounds.getSouthWest().lng, bounds.getSouthWest().lat],
		[bounds.getNorthEast().lng, bounds.getNorthEast().lat],
	]
	rt.data(thing).then(function (d) {
		bikes.clearLayers()
		bikes.addData(d)
	})
}
m.on('contextmenu moveend', showAll)
