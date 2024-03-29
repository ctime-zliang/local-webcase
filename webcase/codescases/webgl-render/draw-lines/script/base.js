function main() {
	const appContainer1Element = document.getElementById('appContainer1')
	drawCanvas1(appContainer1Element, 'LINES')

	const appContainer2Element = document.getElementById('appContainer2')
	drawCanvas1(appContainer2Element, 'LINE_STRIP')

	const appContainer3Element = document.getElementById('appContainer3')
	drawCanvas1(appContainer3Element, 'LINE_LOOP')
}

window.document.addEventListener('DOMContentLoaded', main)
