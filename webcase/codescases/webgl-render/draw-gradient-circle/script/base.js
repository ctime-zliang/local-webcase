function main() {
	const appContainer1Element = document.getElementById('appContainer1')
	drawCanvas1(appContainer1Element, VS, FS)

	const appContainer2Element = document.getElementById('appContainer2')
	drawCanvas2(appContainer2Element, VS, FS)
}

window.document.addEventListener('DOMContentLoaded', main)
